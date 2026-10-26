// Tour AI NVIDIA Nemotron Embeddings & Semantic Search Service
// Model: nvidia/nemotron-3.5-embed-1b:free (Dimension: 2,048)
// Zero billing, Free OpenRouter API

import fs from "fs";
import path from "path";
import crypto from "crypto";

export const NEMOTRON_EMBED_MODEL =
  process.env.TOUR_EMBEDDING_MODEL || "nvidia/nemotron-3.5-embed-1b:free";
export const EXPECTED_EMBEDDING_DIM = 2048;

export interface KnowledgeChunk {
  id: string;
  heading: string;
  content: string;
  source: string;
  hash: string;
}

export interface IndexedChunk extends KnowledgeChunk {
  embedding: number[];
  model: string;
  indexedAt: string;
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

const EMBEDDINGS_CACHE_FILE = path.join(
  process.cwd(),
  "content",
  "tour-kb-embeddings.json"
);

// Hash utility to track changes
function computeHash(text: string): string {
  return crypto.createHash("sha256").update(text.trim()).digest("hex");
}

// 1. Chunk the Knowledge Base markdown cleanly by H2 sections
export function chunkKnowledgeBase(markdownText: string): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const lines = markdownText.split("\n");

  let currentHeading = "Overview";
  let currentSource = "General Tour Information";
  let currentLines: string[] = [];
  let chunkIndex = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentLines.length > 0) {
        const text = currentLines.join("\n").trim();
        if (text.length > 30) {
          chunks.push({
            id: `chunk-${chunkIndex++}`,
            heading: currentHeading,
            content: text,
            source: currentSource,
            hash: computeHash(text),
          });
        }
      }
      currentHeading = line.replace("## ", "").trim();
      currentSource = currentHeading;
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  // Push final chunk
  if (currentLines.length > 0) {
    const text = currentLines.join("\n").trim();
    if (text.length > 30) {
      chunks.push({
        id: `chunk-${chunkIndex++}`,
        heading: currentHeading,
        content: text,
        source: currentSource,
        hash: computeHash(text),
      });
    }
  }

  return chunks;
}

// 2. Load cached embeddings from disk
export function loadCachedIndex(): IndexedChunk[] {
  try {
    if (fs.existsSync(EMBEDDINGS_CACHE_FILE)) {
      const data = fs.readFileSync(EMBEDDINGS_CACHE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read tour-kb-embeddings.json, will use in-memory index:", err);
  }
  return [];
}

// 3. Save index to disk safely
export function saveCachedIndex(index: IndexedChunk[]): void {
  try {
    const dir = path.dirname(EMBEDDINGS_CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(EMBEDDINGS_CACHE_FILE, JSON.stringify(index, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save cached embeddings:", err);
  }
}

// 4. Request embeddings from OpenRouter with strict validation
export async function generateEmbedding(
  text: string,
  apiKey?: string
): Promise<number[] | null> {
  const key = apiKey || process.env.OPENROUTER_API_KEY;
  if (!key) {
    return null;
  }

  const cleanInput = text.trim();
  if (!cleanInput) {
    return null;
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tour.org",
        "X-Title": "Tour AI",
      },
      body: JSON.stringify({
        model: NEMOTRON_EMBED_MODEL,
        input: [cleanInput],
        encoding_format: "float",
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`OpenRouter Embeddings API returned status ${res.status}:`, errText);
      return null;
    }

    const data = await res.json();
    const vec = data?.data?.[0]?.embedding;

    if (!Array.isArray(vec)) {
      console.warn("Embeddings API response missing valid vector array");
      return null;
    }

    // Runtime validation of vector length and numerical values
    if (vec.length !== EXPECTED_EMBEDDING_DIM) {
      console.warn(
        `Unexpected embedding dimension: expected ${EXPECTED_EMBEDDING_DIM}, received ${vec.length}`
      );
      return null;
    }

    const allNumbers = vec.every((n) => typeof n === "number" && !isNaN(n));
    if (!allNumbers) {
      console.warn("Embedding vector contains non-numerical or NaN values");
      return null;
    }

    return vec;
  } catch (err) {
    console.error("Error calling OpenRouter embeddings:", err);
    return null;
  }
}

// 5. Cosine Similarity Calculation
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

// 6. In-memory and cached index management
let inMemoryIndex: IndexedChunk[] = [];

export function getOrLoadIndex(): IndexedChunk[] {
  if (inMemoryIndex.length === 0) {
    inMemoryIndex = loadCachedIndex();
  }
  return inMemoryIndex;
}

// 7. Full indexing pipeline with change detection & cache reuse
export async function syncKnowledgeBaseIndex(
  markdownContent: string,
  apiKey?: string
): Promise<{ indexed: number; reused: number; failed: number }> {
  const existing = loadCachedIndex();
  const existingMap = new Map<string, IndexedChunk>();
  for (const item of existing) {
    existingMap.set(item.hash, item);
  }

  const currentChunks = chunkKnowledgeBase(markdownContent);
  const updatedIndex: IndexedChunk[] = [];

  let reused = 0;
  let indexed = 0;
  let failed = 0;

  for (const chunk of currentChunks) {
    const cached = existingMap.get(chunk.hash);
    if (
      cached &&
      cached.model === NEMOTRON_EMBED_MODEL &&
      Array.isArray(cached.embedding) &&
      cached.embedding.length === EXPECTED_EMBEDDING_DIM
    ) {
      updatedIndex.push({
        ...chunk,
        embedding: cached.embedding,
        model: cached.model,
        indexedAt: cached.indexedAt,
      });
      reused++;
    } else {
      // Need new embedding
      const vector = await generateEmbedding(chunk.content, apiKey);
      if (vector && vector.length === EXPECTED_EMBEDDING_DIM) {
        updatedIndex.push({
          ...chunk,
          embedding: vector,
          model: NEMOTRON_EMBED_MODEL,
          indexedAt: new Date().toISOString(),
        });
        indexed++;
      } else {
        failed++;
        // If previously had cached item even if hash changed slightly, keep as fallback
        if (cached) {
          updatedIndex.push(cached);
        }
      }
    }
  }

  if (updatedIndex.length > 0) {
    inMemoryIndex = updatedIndex;
    saveCachedIndex(updatedIndex);
  }

  return { indexed, reused, failed };
}

// 8. Semantic Search: Retrieve top-k most relevant chunks for a user question
export async function retrieveRelevantKnowledge(
  query: string,
  topK = 2,
  apiKey?: string
): Promise<RetrievalResult[]> {
  const cleanQuery = query?.trim();
  if (!cleanQuery) return [];

  const index = getOrLoadIndex();
  if (index.length === 0) {
    return [];
  }

  // Generate query embedding
  const queryVec = await generateEmbedding(cleanQuery, apiKey);
  if (!queryVec || queryVec.length !== EXPECTED_EMBEDDING_DIM) {
    return [];
  }

  // Calculate similarity against all indexed chunks
  const scored: RetrievalResult[] = index.map((item) => ({
    chunk: {
      id: item.id,
      heading: item.heading,
      content: item.content,
      source: item.source,
      hash: item.hash,
    },
    score: cosineSimilarity(queryVec, item.embedding),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return top K with minimum relevance threshold (e.g. 0.25)
  return scored.filter((r) => r.score >= 0.25).slice(0, topK);
}
