import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionId = params.id;
    const userId = session.user.id;

    // Check if user already marked curious
    const existing = await prisma.questionCurious.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId,
        },
      },
    }).catch(() => null);

    let isCurious = false;

    if (existing) {
      // Toggle OFF
      await prisma.questionCurious.delete({
        where: { id: existing.id },
      });
      await prisma.question.update({
        where: { id: questionId },
        data: { curiousCount: { decrement: 1 } },
      });
      isCurious = false;
    } else {
      // Toggle ON
      await prisma.questionCurious.create({
        data: {
          questionId,
          userId,
        },
      });
      await prisma.question.update({
        where: { id: questionId },
        data: { curiousCount: { increment: 1 } },
      });
      isCurious = true;
    }

    const updatedQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      select: { curiousCount: true },
    });

    return NextResponse.json({
      isCurious,
      curiousCount: updatedQuestion?.curiousCount || 0,
    });
  } catch (error) {
    console.error("POST /api/questions/:id/curious error:", error);
    return NextResponse.json({ error: "Failed to toggle curious status" }, { status: 500 });
  }
}
