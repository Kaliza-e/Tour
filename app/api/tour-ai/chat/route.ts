import { NextResponse } from "next/server";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { buildSystemPrompt } from "@/server/tour-ai/system-prompt";
import {
  isWritingRequest,
  isSystemPromptRequest,
  isUnsafeOutput,
  parseResponseButtons,
  getInstantAnswer,
  CANNED_REFUSAL_TEXT,
  CANNED_SYSTEM_PROMPT_REFUSAL_TEXT,
  CANNED_UNSURE_TEXT,
  CONTACT_BUTTON,
  TourAiButton,
} from "@/lib/tour-ai-config";
import { retrieveRelevantKnowledge } from "@/lib/tour-ai-embeddings";

// In-memory aggregate usage tracker (no message content, session-only)
let approximateTokenUsage = 0;
let monthlyUsageMonth = new Date().toISOString().slice(0, 7);

function checkMonthlyCap(): boolean {
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (currentMonth !== monthlyUsageMonth) {
    monthlyUsageMonth = currentMonth;
    approximateTokenUsage = 0;
  }

  // TOUR_AI_MONTHLY_CAP_USD = 0 signifies zero-paid-budget.
  // We track aggregate tokens to ensure free tier stays within safe thresholds.
  const capUsdStr = process.env.TOUR_AI_MONTHLY_CAP_USD;
  const capUsd = capUsdStr ? parseFloat(capUsdStr) : 0;
  if (capUsd > 0 && approximateTokenUsage > capUsd * 2000000) {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  try {
    // 1. IP / Session Rate Limit Check (25 requests per 10 minutes)
    const ip = getClientIdentifier(req);
    const limitResult = rateLimit(`tour-ai-rate-${ip}`, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 25,
    });

    if (!limitResult.success) {
      return NextResponse.json(
        {
          role: "assistant",
          text: "You are sending messages a bit too quickly! Please wait a moment before sending another message.",
          buttons: [],
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Request Body
    const body = await req.json().catch(() => ({}));
    const { messages, page } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' must be a non-empty array." },
        { status: 400 }
      );
    }

    // Retain only the last ~10 conversation turns
    const trimmedMessages = messages.slice(-10);
    const latestUserMsg = trimmedMessages[trimmedMessages.length - 1];

    if (!latestUserMsg || typeof latestUserMsg.content !== "string") {
      return NextResponse.json(
        { error: "Invalid message format." },
        { status: 400 }
      );
    }

    const userText = latestUserMsg.content.trim();

    // 3. Message Length Check (>1000 chars) -> Friendly message without crash or model call
    if (userText.length > 1000) {
      return NextResponse.json(
        {
          role: "assistant",
          text: "Your message is a bit too long! Please keep questions under 1000 characters so I can give you the best guidance.",
          buttons: [],
        },
        { status: 400 }
      );
    }

    // Check if client expects streaming SSE
    const isStreamRequested =
      req.headers.get("accept")?.includes("text/event-stream") ||
      body?.stream === true;

    // 4. Input Safety Screening (Pre-check for writing / rewriting / prompt leakage)
    if (isWritingRequest(userText)) {
      return createJsonResponseOrStream(
        CANNED_REFUSAL_TEXT,
        [],
        "Publishing Guidelines",
        isStreamRequested
      );
    }

    if (isSystemPromptRequest(userText)) {
      return createJsonResponseOrStream(
        CANNED_SYSTEM_PROMPT_REFUSAL_TEXT,
        [],
        undefined,
        isStreamRequested
      );
    }

    // 5. Instant Canned FAQ Answers (Pre-written answers for top questions, saves tokens & 100% reliable)
    const instantAnswer = getInstantAnswer(userText);
    if (instantAnswer) {
      return createJsonResponseOrStream(
        instantAnswer.text,
        instantAnswer.buttons || [],
        instantAnswer.source,
        isStreamRequested
      );
    }

    // 6. Monthly Cap & Availability Check
    if (!checkMonthlyCap()) {
      return createJsonResponseOrStream(
        "Tour AI has reached its usage cap for this period. I can still guide you to our main pages and answer common questions, or you can contact our team directly!",
        [CONTACT_BUTTON],
        undefined,
        isStreamRequested
      );
    }

    // 7. Check Environment Configuration for OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model =
      process.env.TOUR_AI_MODEL || "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";
    const fallbackModel = process.env.TOUR_AI_MODEL_FALLBACK;

    if (!apiKey) {
      // Safe fallback when API key is not configured
      return createJsonResponseOrStream(
        "Tour AI is currently in offline mode. I can still guide you through our main pages, guidelines, and FAQs!",
        [CONTACT_BUTTON],
        undefined,
        isStreamRequested
      );
    }

    // 8. Semantic Search: Retrieve relevant passages using NVIDIA Nemotron Embeddings
    let retrievedChunks: any[] = [];
    try {
      retrievedChunks = await retrieveRelevantKnowledge(userText, 2, apiKey);
    } catch (embedErr) {
      // Non-blocking: continue without semantic chunks if embedding fails
      console.warn("Embedding retrieval error:", embedErr);
    }

    // Build system prompt with grounding and retrieved knowledge
    const systemPrompt = buildSystemPrompt({
      currentPageKey: page,
      retrievedChunks,
    });

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...trimmedMessages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    // 9. Call OpenRouter Free Model with Graceful Fallback
    let rawOutput = "";
    let callSucceeded = false;

    // Try primary model
    try {
      rawOutput = await callOpenRouterChat(apiKey, model, formattedMessages);
      callSucceeded = !!rawOutput;
    } catch (err) {
      console.warn(`Primary chat model ${model} failed, checking fallback:`, err);
    }

    // Try fallback model if primary failed and free fallback is set
    if (!callSucceeded && fallbackModel && fallbackModel.endsWith(":free")) {
      try {
        rawOutput = await callOpenRouterChat(apiKey, fallbackModel, formattedMessages);
        callSucceeded = !!rawOutput;
      } catch (fbErr) {
        console.warn(`Fallback chat model ${fallbackModel} failed:`, fbErr);
      }
    }

    // If both failed or returned empty: Safe canned fallback (never expose stack trace)
    if (!callSucceeded || !rawOutput) {
      return createJsonResponseOrStream(
        CANNED_UNSURE_TEXT,
        [CONTACT_BUTTON],
        undefined,
        isStreamRequested
      );
    }

    // Approximate token usage tracking
    approximateTokenUsage += userText.length / 4 + rawOutput.length / 4;

    // 10. Output Safety Screening (Never output student-ready essays or leaked instructions)
    if (isUnsafeOutput(rawOutput)) {
      return createJsonResponseOrStream(
        CANNED_REFUSAL_TEXT,
        [],
        "Publishing Guidelines",
        isStreamRequested
      );
    }

    // 11. Parse Buttons & Source from Output
    const { cleanText, buttons, source } = parseResponseButtons(rawOutput);

    return createJsonResponseOrStream(
      cleanText,
      buttons,
      source,
      isStreamRequested
    );
  } catch (error) {
    console.error("Tour AI API Route error:", error);
    return NextResponse.json({
      role: "assistant",
      text: CANNED_UNSURE_TEXT,
      buttons: [CONTACT_BUTTON],
    });
  }
}

// OpenRouter Chat Completion Caller
async function callOpenRouterChat(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tour.org",
        "X-Title": "Tour AI",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 300,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`OpenRouter Chat API (${model}) returned status ${res.status}:`, errText);
      return "";
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

// Helper to return either standard JSON or Server-Sent Events (SSE) Stream
function createJsonResponseOrStream(
  text: string,
  buttons: TourAiButton[],
  source?: string,
  streamRequested = false
): Response {
  if (!streamRequested) {
    return NextResponse.json({
      role: "assistant",
      text,
      buttons,
      source,
    });
  }

  // SSE Stream
  const encoder = new TextEncoder();
  const customStream = new ReadableStream({
    start(controller) {
      // Send text delta
      const deltaEvent = `data: ${JSON.stringify({ type: "delta", text })}\n\n`;
      controller.enqueue(encoder.encode(deltaEvent));

      // Send structured completion event with buttons and source
      const doneEvent = `data: ${JSON.stringify({
        type: "done",
        text,
        buttons,
        source,
      })}\n\n`;
      controller.enqueue(encoder.encode(doneEvent));
      controller.close();
    },
  });

  return new Response(customStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
