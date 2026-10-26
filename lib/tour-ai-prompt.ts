import { buildSystemPrompt, loadKnowledgeBase } from "../server/tour-ai/system-prompt";
import type { RetrievalResult } from "./tour-ai-embeddings";

export function getTourAiSystemPrompt(
  currentPageKey?: string,
  retrievedChunks?: RetrievalResult[]
): string {
  return buildSystemPrompt({ currentPageKey, retrievedChunks });
}

export { buildSystemPrompt, loadKnowledgeBase };
export const tourAiPrompt = buildSystemPrompt();
