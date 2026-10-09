import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Read .env manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      let val = vals.join("=").trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key.trim()] = val;
    }
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not set in environment");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log("Connecting to database via Neon HTTP/WebSocket...");
  
  const columns = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'User';
  `;
  
  const colNames = columns.map((c: any) => c.column_name);
  console.log("Current User columns:", colNames);

  if (!colNames.includes("orcid")) {
    console.log("Adding column orcid...");
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "orcid" TEXT;`;
  }
  if (!colNames.includes("privacyConsent")) {
    console.log("Adding column privacyConsent...");
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "privacyConsent" BOOLEAN NOT NULL DEFAULT false;`;
  }
  if (!colNames.includes("isPublic")) {
    console.log("Adding column isPublic...");
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false;`;
  }
  if (!colNames.includes("slug")) {
    console.log("Adding column slug...");
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "slug" TEXT;`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "User_slug_key" ON "User"("slug");`;
    await sql`CREATE INDEX IF NOT EXISTS "User_slug_idx" ON "User"("slug");`;
  }

  // Check Category subtopics
  const catColumns = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'Category';
  `;
  const catColNames = catColumns.map((c: any) => c.column_name);
  console.log("Current Category columns:", catColNames);
  if (!catColNames.includes("subtopics")) {
    console.log("Adding column subtopics to Category...");
    await sql`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "subtopics" TEXT[] DEFAULT ARRAY[]::TEXT[];`;
  }

  // Check Question Phase 2 columns
  const qColumns = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'Question';
  `;
  const qColNames = qColumns.map((c: any) => c.column_name);
  console.log("Current Question columns:", qColNames);
  if (!qColNames.includes("subtopic")) {
    console.log("Adding column subtopic to Question...");
    await sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "subtopic" TEXT;`;
  }
  if (!qColNames.includes("moderationStatus")) {
    console.log("Adding column moderationStatus to Question...");
    await sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "moderationStatus" TEXT NOT NULL DEFAULT 'APPROVED';`;
  }
  if (!qColNames.includes("moderationReason")) {
    console.log("Adding column moderationReason to Question...");
    await sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "moderationReason" TEXT;`;
  }
  if (!qColNames.includes("curiousCount")) {
    console.log("Adding column curiousCount to Question...");
    await sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "curiousCount" INTEGER NOT NULL DEFAULT 0;`;
  }
  if (!qColNames.includes("linkedPaperId")) {
    console.log("Adding column linkedPaperId to Question...");
    await sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "linkedPaperId" TEXT;`;
  }

  console.log("SUCCESS: Database schema columns are now synchronized!");
}

main().catch((err) => {
  console.error("Error syncing DB:", err);
  process.exit(1);
});
