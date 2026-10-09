import { NextResponse } from "next/server";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { getTourAiSystemPrompt } from "@/lib/tour-ai-prompt";
import {
  isWritingRequest,
  isSystemPromptRequest,
  parseResponseButtons,
  CANNED_REFUSAL_TEXT,
  CANNED_REFUSAL_BUTTONS,
  CANNED_SYSTEM_PROMPT_REFUSAL_TEXT,
  CANNED_SYSTEM_PROMPT_REFUSAL_BUTTONS,
  CANNED_UNSURE_TEXT,
  CANNED_UNSURE_BUTTONS,
} from "@/lib/tour-ai-config";

// In-memory daily counter
let dailyCount = 0;
let dailyDate = new Date().toISOString().slice(0, 10);

function checkAndIncrementDailyCap(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dailyDate) {
    dailyDate = today;
    dailyCount = 0;
  }

  const rawCap = process.env.TOUR_AI_DAILY_CAP;
  const cap = rawCap ? parseInt(rawCap, 10) : 500;

  if (dailyCount >= cap) {
    return false;
  }

  dailyCount++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Feature Flag Check
    if (process.env.FEATURE_TOUR_AI === "false") {
      return NextResponse.json({
        role: "assistant",
        text: "Tour AI is currently undergoing scheduled maintenance. Please check back soon or visit our Contact page!",
        buttons: CANNED_UNSURE_BUTTONS,
      });
    }

    // 1. IP Rate limit check (20 requests per 10 minutes)
    const ip = getClientIdentifier(req);
    const limitResult = rateLimit(`tour-ai-${ip}`, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 20,
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

    // 2. Parse & Validate request body
    const body = await req.json().catch(() => ({}));
    const { messages, page } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' must be a non-empty array." },
        { status: 400 }
      );
    }

    // Keep only last 10 messages
    const trimmedMessages = messages.slice(-10);
    const latestUserMsg = trimmedMessages[trimmedMessages.length - 1];

    if (!latestUserMsg || typeof latestUserMsg.content !== "string") {
      return NextResponse.json(
        { error: "Invalid message format." },
        { status: 400 }
      );
    }

    // Check message length limit (1000 characters) - Row 47
    if (latestUserMsg.content.length > 1000) {
      return NextResponse.json(
        {
          role: "assistant",
          text: "Your message is a bit too long! Please keep questions under 1000 characters.",
          buttons: [],
        },
        { status: 400 }
      );
    }

    // 3. Pre-check for forbidden writing requests - Rows 27-32
    if (isWritingRequest(latestUserMsg.content)) {
      return NextResponse.json({
        role: "assistant",
        text: CANNED_REFUSAL_TEXT,
        buttons: CANNED_REFUSAL_BUTTONS,
      });
    }

    // Pre-check for system prompt injection attempts - Row 33
    if (isSystemPromptRequest(latestUserMsg.content)) {
      return NextResponse.json({
        role: "assistant",
        text: CANNED_SYSTEM_PROMPT_REFUSAL_TEXT,
        buttons: CANNED_SYSTEM_PROMPT_REFUSAL_BUTTONS,
      });
    }

    // 4. Daily Cap Check
    if (!checkAndIncrementDailyCap()) {
      return NextResponse.json({
        role: "assistant",
        text: "Tour AI is experiencing high traffic today and has reached its daily response limit. Please try again tomorrow or contact our team directly!",
        buttons: CANNED_UNSURE_BUTTONS,
      });
    }

    // 5. Environment variables check - Row 46 Graceful Fallback
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || "claude-haiku-4-5-20251001";

    if (!apiKey) {
      // Graceful fallback when API key is not configured or offline
      return NextResponse.json({
        role: "assistant",
        text: "Tour AI is currently in offline mode. I can still guide you through our main pages, guidelines, and FAQs!",
        buttons: CANNED_UNSURE_BUTTONS,
      });
    }

    // Format messages for Anthropic / OpenAI API
    const formattedMessages = trimmedMessages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    const systemPrompt = getTourAiSystemPrompt(page);

    // 6. Call AI API
    let rawText = "";

    try {
      const isAnthropic = !apiKey.startsWith("sk-proj-") && !apiKey.startsWith("sk-");

      if (isAnthropic) {
        const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            max_tokens: 400,
            system: systemPrompt,
            messages: formattedMessages,
          }),
        });

        if (!aiResponse.ok) {
          const errBody = await aiResponse.text();
          console.error("AI Provider Error:", aiResponse.status, errBody);
          throw new Error(`AI API returned status ${aiResponse.status}`);
        }

        const data = await aiResponse.json();
        rawText = data?.content?.[0]?.text || "";
      } else {
        // OpenAI compatibility fallback
        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model === "claude-haiku-4-5-20251001" ? "gpt-4o-mini" : model,
            max_tokens: 400,
            messages: [
              { role: "system", content: systemPrompt },
              ...formattedMessages,
            ],
          }),
        });

        if (!aiResponse.ok) {
          const errBody = await aiResponse.text();
          console.error("OpenAI Provider Error:", aiResponse.status, errBody);
          throw new Error(`AI API returned status ${aiResponse.status}`);
        }

        const data = await aiResponse.json();
        rawText = data?.choices?.[0]?.message?.content || "";
      }
    } catch (apiError) {
      console.error("Tour AI fetch error:", apiError);
      return NextResponse.json({
        role: "assistant",
        text: CANNED_UNSURE_TEXT,
        buttons: CANNED_UNSURE_BUTTONS,
      });
    }

    if (!rawText) {
      return NextResponse.json({
        role: "assistant",
        text: CANNED_UNSURE_TEXT,
        buttons: CANNED_UNSURE_BUTTONS,
      });
    }

    // 7. Parse buttons from response text
    const { cleanText, buttons } = parseResponseButtons(rawText);

    return NextResponse.json({
      role: "assistant",
      text: cleanText,
      buttons,
    });
  } catch (error) {
    console.error("Tour AI API Route error:", error);
    return NextResponse.json({
      role: "assistant",
      text: CANNED_UNSURE_TEXT,
      buttons: CANNED_UNSURE_BUTTONS,
    });
  }
}
