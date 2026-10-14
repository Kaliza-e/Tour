import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildSubmissionCode } from "@/lib/submission";
import { runLazyReleaseCheck } from "@/lib/questions";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to claim a question." },
        { status: 401 }
      );
    }

    const questionId = params.id;

    // Run lazy check on this question to clean up 30-day inactive claims first
    await runLazyReleaseCheck(questionId);

    // Concurrency-safe atomic transaction for claim creation and limits enforcement
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Fetch Question
        const question = await tx.question.findUnique({
          where: { id: questionId },
          include: {
            category: true,
            claims: {
              where: { status: "ACTIVE" },
            },
          },
        });

        if (!question) {
          return { error: "Question not found", status: 404 };
        }

        // Check if question is completed
        if (question.status === "RESEARCH_COMPLETED") {
          return {
            error: "This research question has already been completed.",
            status: 400,
          };
        }

        // 2. Check if this user already has an active claim on this question
        const existingClaimForUser = question.claims.find(
          (c) => c.userId === userId
        );
        if (existingClaimForUser) {
          return {
            error: "You have already claimed this question.",
            status: 400,
            claim: existingClaimForUser,
          };
        }

        // 3. Per-user limit: a researcher may hold at most 2 active claims simultaneously
        const userActiveClaimsCount = await tx.questionClaim.count({
          where: {
            userId,
            status: "ACTIVE",
          },
        });

        if (userActiveClaimsCount >= 2) {
          return {
            error:
              "You can hold at most 2 active research claims at the same time. Please complete or release an existing claim before adopting a new question.",
            status: 400,
          };
        }

        // 4. Hard limit of 3 ACTIVE claims per question
        const activeClaimsCount = question.claims.length;
        if (activeClaimsCount >= 3) {
          // Suggest 3 other open questions in the same category
          const suggestedQuestions = await tx.question.findMany({
            where: {
              categoryId: question.categoryId,
              id: { not: questionId },
              status: "OPEN",
              moderationStatus: { in: ["APPROVED", "approved"] },
            },
            take: 3,
            select: {
              id: true,
              title: true,
              category: { select: { name: true } },
            },
          });

          return {
            error: "This question already has 3 researchers. Explore another question!",
            status: 400,
            isFull: true,
            suggestedQuestions,
          };
        }

        // 5. Fetch user profile info to link with notebook draft
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true, school: true, location: true },
        });

        // 6. Create Research Notebook draft (Submission) for this question
        const notebookDraft = await tx.submission.create({
          data: {
            submissionId: buildSubmissionCode(),
            userId,
            title: question.title,
            abstract: question.description || `Research notebook exploration for: ${question.title}`,
            category: question.category.name,
            questionId: question.id,
            questionTitle: question.title,
            status: "DRAFT",
            isTermsAccepted: true,
            email: user?.email || "",
            institution: user?.school || null,
            country: user?.location || null,
            authors: {
              create: {
                fullName: user?.name || "Student Researcher",
                email: user?.email || "",
                institution: user?.school || null,
                userId,
              },
            },
          },
        });

        // 7. Create or reactivate the QuestionClaim record
        const claim = await tx.questionClaim.upsert({
          where: {
            questionId_userId: {
              questionId: question.id,
              userId,
            },
          },
          update: {
            status: "ACTIVE",
            notebookId: notebookDraft.id,
            releasedAt: null,
            updatedAt: new Date(),
          },
          create: {
            questionId: question.id,
            userId,
            status: "ACTIVE",
            notebookId: notebookDraft.id,
          },
        });

        // 8. Update question status to BEING_RESEARCHED if not already
        const newActiveCount = activeClaimsCount + 1;
        await tx.question.update({
          where: { id: question.id },
          data: {
            status: "BEING_RESEARCHED",
          },
        });

        return {
          success: true,
          status: 200,
          claim,
          notebookId: notebookDraft.id,
          spotsLeft: Math.max(0, 3 - newActiveCount),
          message: "Question successfully claimed! Your Research Notebook has been prepared.",
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: "Serializable",
      }
    );

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          suggestedQuestions: result.suggestedQuestions,
          isFull: result.isFull,
        },
        { status: result.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/questions/:id/claim error:", error);

    // Handle concurrent transaction serialization conflict (P2034)
    if (error?.code === "P2034") {
      try {
        const targetQId = params.id;
        const activeCount = await prisma.questionClaim.count({
          where: { questionId: targetQId, status: "ACTIVE" },
        });
        if (activeCount >= 3) {
          const q = await prisma.question.findUnique({
            where: { id: targetQId },
            select: { categoryId: true },
          });
          const suggestedQuestions = await prisma.question.findMany({
            where: {
              categoryId: q?.categoryId,
              id: { not: targetQId },
              status: "OPEN",
              moderationStatus: { in: ["APPROVED", "approved"] },
            },
            take: 3,
            select: {
              id: true,
              title: true,
              category: { select: { name: true } },
            },
          });
          return NextResponse.json(
            {
              error: "This question already has 3 researchers. Explore another question!",
              isFull: true,
              suggestedQuestions,
            },
            { status: 400 }
          );
        }
      } catch (innerErr) {
        // Fallback to generic message
      }
    }

    return NextResponse.json(
      { error: "Failed to claim question. Please try again." },
      { status: 500 }
    );
  }
}
