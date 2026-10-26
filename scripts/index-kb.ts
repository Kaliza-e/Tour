import fs from "fs";
import path from "path";
import { syncKnowledgeBaseIndex, NEMOTRON_EMBED_MODEL } from "../lib/tour-ai-embeddings";

// Read .env if not already loaded
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn("Could not read .env:", e);
}

async function runIndexer() {
  console.log("=== Tour AI Knowledge Base Indexer ===");
  console.log("Embedding Model:", NEMOTRON_EMBED_MODEL);

  const kbPath = path.join(process.cwd(), "content", "tour-knowledge-base.md");
  if (!fs.existsSync(kbPath)) {
    console.error("Knowledge base not found at:", kbPath);
    process.exit(1);
  }

  const content = fs.readFileSync(kbPath, "utf-8");
  console.log(`Loaded knowledge base (${content.length} characters).`);

  const result = await syncKnowledgeBaseIndex(content);
  console.log("Indexing results:");
  console.log(" - Newly Indexed:", result.indexed);
  console.log(" - Reused from Cache:", result.reused);
  console.log(" - Failed:", result.failed);
  console.log("Index cache saved to content/tour-kb-embeddings.json");
}

runIndexer().catch((err) => {
  console.error("Indexing failed:", err);
  process.exit(1);
});
