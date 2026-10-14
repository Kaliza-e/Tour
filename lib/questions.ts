import { prisma } from "@/lib/prisma";

/**
 * Format a full name into First Name + Last Initial (e.g. "Amara O.")
 */
export function formatAskerName(fullName?: string | null): string {
  if (!fullName || !fullName.trim()) return "Student Thinker";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0].toUpperCase();
  return `${first} ${lastInitial}.`;
}

/**
 * Clean and normalize question text for comparison
 */
export function normalizeQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Simple word-level Jaccard similarity score (0 to 1)
 */
export function getSimilarityScore(textA: string, textB: string): number {
  const normA = normalizeQuestion(textA);
  const normB = normalizeQuestion(textB);
  if (normA === normB) return 1.0;

  const wordsA = new Set(normA.split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) intersection++;
  });

  const union = new Set([...Array.from(wordsA), ...Array.from(wordsB)]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Check if a new question is a duplicate or near-duplicate of existing questions.
 * Returns the existing match if similarity >= 0.70 or identical text.
 */
export async function findDuplicateQuestion(newTitle: string) {
  const allQuestions = await prisma.question.findMany({
    select: { id: true, title: true, category: { select: { name: true } } },
  });

  const normalizedNew = normalizeQuestion(newTitle);

  for (const q of allQuestions) {
    const normalizedExisting = normalizeQuestion(q.title);
    if (normalizedExisting === normalizedNew) {
      return q;
    }
    const score = getSimilarityScore(newTitle, q.title);
    if (score >= 0.7) {
      return q;
    }
  }

  return null;
}

/**
 * Lazy release check: automatically release claims with no activity for 30 days
 */
export async function runLazyReleaseCheck(questionId?: string) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const whereClause: any = {
      status: "ACTIVE",
      updatedAt: { lt: thirtyDaysAgo },
    };
    if (questionId) {
      whereClause.questionId = questionId;
    }

    const expiredClaims = await prisma.questionClaim.findMany({
      where: whereClause,
      include: { question: true },
    });

    for (const claim of expiredClaims) {
      await prisma.questionClaim.update({
        where: { id: claim.id },
        data: {
          status: "RELEASED",
          releasedAt: new Date(),
        },
      });

      // Recalculate question status
      const remainingActive = await prisma.questionClaim.count({
        where: { questionId: claim.questionId, status: "ACTIVE" },
      });

      if (remainingActive === 0 && claim.question.status === "BEING_RESEARCHED") {
        await prisma.question.update({
          where: { id: claim.questionId },
          data: { status: "OPEN" },
        });
      }
    }
  } catch (err) {
    console.error("runLazyReleaseCheck error:", err);
  }
}
