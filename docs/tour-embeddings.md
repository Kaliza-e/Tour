# NVIDIA Nemotron 3.5 Embed 1B Integration Guide

This document describes the semantic vector embedding and retrieval architecture powering Tour AI.

---

## 1. Model & API Specifications

| Property | Value |
|----------|-------|
| **Model ID** | `nvidia/nemotron-3.5-embed-1b:free` |
| **Provider** | OpenRouter Free Tier |
| **Endpoint** | `POST https://openrouter.ai/api/v1/embeddings` |
| **Authorization** | `Bearer ${OPENROUTER_API_KEY}` |
| **Encoding Format** | `float` |
| **Embedding Dimension** | **2,048** floats |
| **Billing / Cost** | **$0.00 (Zero billing, Free tier)** |

### Request Format
```json
{
  "model": "nvidia/nemotron-3.5-embed-1b:free",
  "input": ["Text chunk or user query here"],
  "encoding_format": "float"
}
```

### Response Format
```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [-0.0152, 0.0489, 0.0021, ... 2048 floats]
    }
  ],
  "model": "nvidia/nemotron-3.5-embed-1b:free",
  "usage": { "prompt_tokens": 12, "total_tokens": 12 }
}
```

---

## 2. Runtime Vector Validation

Every embedding vector returned by the API is verified at runtime before being accepted:
1. **Array Check**: Must be a JavaScript array.
2. **Dimension Check**: Must have length exactly equal to `2,048`.
3. **Numeric Validity**: Every element must be a finite number (`typeof n === "number" && !isNaN(n)`).

If a response fails any check, the service logs a warning and gracefully falls back to keyword/grounding retrieval without throwing unhandled exceptions.

---

## 3. Document Indexing & Storage Strategy

### Markdown Chunking
`content/tour-knowledge-base.md` is split into logical semantic units by Level-2 (`##`) markdown headings:
- **About Tour**
- **Site Navigation & Page Directory**
- **Publishing Guidelines & Originality Rules**
- **Submission Types**
- **Research Categories**
- **Volunteering, Hours, Certificates & Chapters**
- **Unconfirmed Topics / Not in Knowledge Base**

Each chunk captures:
- `id`: unique chunk identifier (e.g., `chunk-0`)
- `heading`: Section heading
- `content`: Complete section text
- `source`: Attribution label
- `hash`: SHA-256 digest of content

### Caching in `content/tour-kb-embeddings.json`
To avoid redundant network calls and conserve free API quota, indexed vectors are stored in a local JSON file (`content/tour-kb-embeddings.json`).

On startup or re-indexing:
1. Existing cached vectors are read into memory.
2. For each chunk in the knowledge base, its SHA-256 hash is compared against the cache.
3. If the hash and model match, the existing 2,048-dim vector is reused immediately.
4. Only modified or new sections trigger an API request.

---

## 4. Semantic Similarity & Retrieval

### Cosine Similarity
Similarity between query vector $Q$ and document vector $D$ is computed as:
$$\text{similarity} = \frac{Q \cdot D}{\|Q\| \|D\|} = \frac{\sum_{i=1}^{2048} Q_i D_i}{\sqrt{\sum_{i=1}^{2048} Q_i^2} \sqrt{\sum_{i=1}^{2048} D_i^2}}$$

### Query Workflow
1. When a student enters a question (e.g. *"I want to write about school anxiety"*), the query is embedded via `generateEmbedding(query)`.
2. Cosine similarity is computed against all 8 knowledge base vectors.
3. Chunks with similarity score $\ge 0.25$ are ranked descending.
4. The top 2 most relevant passages are injected into the system prompt within `<retrieved_context>` tags as untrusted reference data.

---

## 5. Error Handling & Provider Outage Resilience

- **Rate Limits (429) & Quota Exceeded**:
  When OpenRouter's free tier is busy, the retrieval gracefully yields empty context. The assistant relies on the verbatim `<knowledge_base>` embedded in the prompt and pre-compiled canned answers.
- **Timeouts & Network Errors**:
  All embedding requests feature an abort timeout. The user chat never hangs.
- **Missing API Key**:
  If `OPENROUTER_API_KEY` is unset, vector generation returns `null` safely and the app operates in offline canned FAQ mode.

---

## 6. Privacy & Security Safeguards

1. **No Sensitive Data**: Only approved public platform documentation is indexed.
2. **Student Privacy**: Student queries containing personal information are never sent to external embedding endpoints.
3. **Untrusted Data Isolation**: Retrieved passages are strictly treated as reference data and cannot override safety policies or refusal boundaries.
