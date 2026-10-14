import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    const questionId = params.id;

    const result = await prisma.$transaction(async (tx) => {
      const claim = await tx.questionClaim.findUnique({
        where: {
          questionId_userId: {
            questionId,
            userId,
          },
        },
      });

      if (!claim || claim.status !== "ACTIVE") {
        return {
          error: "You do not have an active claim for this question.",
          status: 400,
        };
      }

      // Release the claim
      const updatedClaim = await tx.questionClaim.update({
        where: { id: claim.id },
        data: {
          status: "RELEASED",
          releasedAt: new Date(),
        },
      });

      // Recalculate remaining active claims for this question
      const remainingActiveClaims = await tx.questionClaim.count({
        where: {
          questionId,
          status: "ACTIVE",
        },
      });

      // If question has no more active claims and isn't completed, revert to OPEN
      const question = await tx.question.findUnique({
        where: { id: questionId },
        select: { status: true },
      });

      if (remainingActiveClaims === 0 && question?.status === "BEING_RESEARCHED") {
        await tx.question.update({
          where: { id: questionId },
          data: { status: "OPEN" },
        });
      }

      return {
        success: true,
        status: 200,
        claim: updatedClaim,
        spotsLeft: Math.max(0, 3 - remainingActiveClaims),
        message: "Question claim released. The spot is now open for other researchers.",
      };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("POST /api/questions/:id/release error:", error);
    return NextResponse.json(
      { error: "Failed to release question claim." },
      { status: 500 }
    );
  }
}
