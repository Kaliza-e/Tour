# Tour AI System Documentation

Tour AI is a lightweight, zero-cost, privacy-first conversational assistant and semantic retrieval system built specifically for the **Tour** research platform. It acts as an encouraging, knowledgeable older student guide that helps young researchers navigate publishing rules, submission types, research categories, and volunteer opportunities.

---

## 1. Core Architecture

The Tour AI architecture separates conversational generation from semantic vector retrieval:

```
[Student in Browser]
         │  (SSE Streaming / JSON)
         ▼
[TourAiWidget (Next.js Client Component)]
         │
         │  POST /api/tour-ai/chat (page: string, messages: [...])
         ▼
[Server-Side Safety & Rule Engine]
 ├── Rate Limiter (25 requests / 10 min window in-memory)
 ├── Length Check (Max 1000 characters)
 ├── Input Safety Screen (Regex / intent filter for writing/editing requests)
 ├── Instant FAQ Matcher (~15 pre-computed approved answers, 100% offline-ready)
 └── Monthly Token Usage Tracker (Zero-cost cap enforcement)
         │
         ▼
[NVIDIA Nemotron Semantic Retrieval (OpenRouter)]
 ├── Model: nvidia/nemotron-3.5-embed-1b:free (2,048 dimensions)
 ├── Chunked Knowledge Base + Cosine Similarity
 └── Injects top-k matching passages into <retrieved_context>
         │
         ▼
[OpenRouter Free Chat Model Completion]
 ├── Primary Model: TOUR_AI_MODEL (e.g., nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free)
 ├── Fallback Model: TOUR_AI_MODEL_FALLBACK (must be explicitly free)
 ├── Strict System Prompt + Approved Knowledge Base Grounding
 └── Zero-billing policy: strictly no paid fallbacks
         │
         ▼
[Output Safety Screening & Formatting]
 ├── Screening: Blocks leaked prompts or generated essay text
 ├── Button & Source Parser: Enforces verified page routes
 └── Streams SSE events -> [TourAiWidget]
```

---

## 2. Environment Variables & Secret Management

All keys and model configurations are read exclusively from server-side environment variables. Secrets are **never** exposed to the browser or client-side bundles.

| Environment Variable | Required | Default Value | Description |
|----------------------|----------|---------------|-------------|
| `OPENROUTER_API_KEY` | Yes (for AI) | None | Server-side API key from OpenRouter. |
| `TOUR_AI_MODEL` | No | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | Primary free conversational model identifier. |
| `TOUR_EMBEDDING_MODEL` | No | `nvidia/nemotron-3.5-embed-1b:free` | Verified NVIDIA Nemotron 3.5 Embed 1B free model. |
| `TOUR_AI_MODEL_FALLBACK` | No | `""` | Optional secondary free chat model. Must end in `:free`. |
| `TOUR_AI_MONTHLY_CAP_USD`| No | `0` | Budget cap indicator. Enforces strict zero-cost operation. |

### How to Obtain an OpenRouter Key
1. Go to [https://openrouter.ai/](https://openrouter.ai/) and create a free account.
2. Navigate to **Keys** and create a new API key.
3. Paste it in your local `.env` as `OPENROUTER_API_KEY="..."`.
4. Ensure `.env` is listed in `.gitignore` so keys are never committed to version control.

---

## 3. Selecting & Changing Models Safely

### Chat Models (Free Tier Only)
To inspect which models are currently available on OpenRouter's free tier, run:
```bash
npm run test:unit
```
or inspect OpenRouter's model catalog at `https://openrouter.ai/models?max_price=0`.

Recommended verified free chat models:
- `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` (Fast, highly grounded)
- `poolside/laguna-s-2.1:free`
- `meta-llama/llama-3.3-70b-instruct:free` (When quota available)

**Strict No-Billing Rule**: Never use a paid model or set a paid fallback. If OpenRouter returns 429 or quota limits on free models, the system automatically falls back to approved canned FAQ answers and the Contact button.

### Embedding Model
The embedding model is fixed to:
`nvidia/nemotron-3.5-embed-1b:free`
- Vector length: 2,048 dimensions.
- Verified endpoint: `POST https://openrouter.ai/api/v1/embeddings`
- Request schema: `{ model: "nvidia/nemotron-3.5-embed-1b:free", input: [...], encoding_format: "float" }`

---

## 4. Knowledge Base Management & Re-Indexing

### Updating Content
1. The approved content lives at `content/tour-knowledge-base.md`.
2. When modifying policies or routes, update this markdown file.
3. Increment the version comment at the top:
   ```markdown
   <!-- Version: 1.1.0 | Updated: 2026-11-01 | Status: Approved Source of Truth -->
   ```
4. Re-run the indexer:
   ```bash
   npm run index:kb
   ```
5. The indexer computes SHA-256 hashes of each section chunk. Unmodified sections reuse their existing cached 2,048-dim vectors, while updated sections are re-embedded automatically.
6. The vector index is cached at `content/tour-kb-embeddings.json`.

---

## 5. Local Setup & Testing

### Running Locally
```bash
# Install dependencies
npm install

# Run database generation
npx prisma generate

# Pre-cache Knowledge Base embeddings
npm run index:kb

# Run development server
npm run dev
```

### Running Unit Tests
```bash
npm run test:unit
```
Verifies route mappings, input safety screening, output safety screening, server tools, in-memory rate limiting, and vector dimensionality.

### Running Acceptance Evaluation (49 Test Cases)
```bash
npm run test:ai
```
Runs all 49 test cases from `Tour_AI_Test_Sheet.xlsx` against the live endpoint. Generates a pass/fail table by group and checks the Launch Gate ("Must refuse" and "Safety & off-topic" must be 100% Pass).

---

## 6. Rate Limiting, Safety & Privacy

### In-Memory Rate Limiting
- Limit: **25 requests per 10-minute window** per client IP.
- Privacy: Counters are held strictly in server memory. No long-lived IP databases or request histories are created.
- Friendly message on 429: *"You are sending messages a bit too quickly! Please wait a moment before sending another message."*

### Message Length Limit
- Maximum **1,000 characters**.
- Messages exceeding 1,000 characters are rejected with a 400 Bad Request and friendly feedback without making external model calls.

### Privacy Stance & NVIDIA Endpoint Notice
- **Student Privacy**: No conversations are stored against student accounts. There are no cookies for identification and no analytics logging message text.
- **Provider Policy Notice**: NVIDIA's free API terms state that request data sent to free endpoints may be processed to improve models. Consequently:
  - **Tour AI NEVER sends personal, student-identifying, medical, or confidential data to embedding or chat endpoints.**
  - Only approved public knowledge-base markdown is indexed.

---

## 7. Deployment Considerations

- **Server-Side Only**: All calls to OpenRouter occur inside Next.js API route handlers (`app/api/tour-ai/chat/route.ts`).
- **Serverless Compatibility**: Vector cache is loaded from `content/tour-kb-embeddings.json` as a lightweight static asset. It requires no separate vector database or heavy daemon.
- **Why Not Local Ollama?**: Hosted deployments (e.g. Vercel) run in cloud containers and cannot reach `localhost:11434` on a developer's local workstation. Using OpenRouter ensures uniform availability across production and development environments.

---

## 8. Public-Facing Guide: "How Tour AI Works and Its Limits"

*(Copy for site documentation or FAQ)*

> **About Tour AI**
> Tour AI is a friendly, student-focused guide built to help you navigate Tour's research community, understand our publishing rules, choose the right submission type, and explore volunteer opportunities.
>
> **What Tour AI Does:**
> - Helps you brainstorm questions and explore ideas by asking guiding questions.
> - Explains our originality rules, citation policies, and author recognition.
> - Suggests relevant research categories (STEM, Health & Society, Education, Humanities).
> - Points you to the right platform pages with direct action buttons.
>
> **What Tour AI Will Never Do:**
> - **Tour AI will never write, draft, rewrite, or edit your paper, essay, abstract, or conclusion.** All research published on Tour must be 100% your own original student work.
> - Tour AI does not provide medical, legal, or psychological advice.
> - Tour AI never asks for or stores personal details.
>
> **Important Note:**
> Tour AI is powered by AI and can make mistakes. Always confirm important decisions, deadlines, or submissions directly with the Tour team via our [Contact page](/contact).
