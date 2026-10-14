import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatAskerName, runLazyReleaseCheck } from "@/lib/questions";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as { id?: string })?.id;

    // Run lazy release check for 30-day inactive claims
    await runLazyReleaseCheck(questionId);

    // Increment view count
    await prisma.question.update({
      where: { id: questionId },
      data: { views: { increment: 1 } },
    }).catch(() => null);

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        claims: {
          where: { status: "ACTIVE" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const activeClaimsCount = question.claims.length;
    const spotsLeft = Math.max(0, 3 - activeClaimsCount);
    const isFull = spotsLeft === 0;

    let effectiveStatus = question.status as string;
    if (question.status === "RESEARCH_COMPLETED") {
      effectiveStatus = "RESEARCH_COMPLETED";
    } else if (isFull) {
      effectiveStatus = "FULL";
    } else if (activeClaimsCount > 0) {
      effectiveStatus = "BEING_RESEARCHED";
    } else {
      effectiveStatus = "OPEN";
    }

    const userClaim = currentUserId
      ? question.claims.find((c) => c.userId === currentUserId)
      : null;
    const isClaimedByCurrentUser = Boolean(userClaim);

    // Active researchers formatted as first name and last initial
    const researchers = question.claims.map((claim) => ({
      id: claim.id,
      userId: claim.userId,
      name: formatAskerName(claim.user.name),
      claimedAt: claim.createdAt,
    }));

    // If question is full or has fewer spots, suggest 3 other open questions in the same category
    let suggestedQuestions: any[] = [];
    if (isFull || effectiveStatus === "RESEARCH_COMPLETED") {
      suggestedQuestions = await prisma.question.findMany({
        where: {
          categoryId: question.categoryId,
          id: { not: question.id },
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
    }

    return NextResponse.json({
      question: {
        id: question.id,
        title: question.title,
        description: question.description,
        category: question.category.name,
        categoryId: question.categoryId,
        status: effectiveStatus,
        rawStatus: question.status,
        asker: formatAskerName(question.author.name),
        authorId: question.author.id,
        tags: question.tags,
        views: question.views,
        activeClaimsCount,
        spotsLeft,
        isFull,
        spotsIndicator: isFull ? "Full" : `${spotsLeft} of 3 spots left`,
        isClaimedByCurrentUser,
        userNotebookId: userClaim?.notebookId || null,
        researchers,
        suggestedQuestions,
        createdAt: question.createdAt,
      },
    });
  } catch (error) {
    console.error("GET /api/questions/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}
