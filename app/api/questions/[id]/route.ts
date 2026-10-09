import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;

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
        project: {
          select: {
            id: true,
            title: true,
            stage: true,
            owner: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("GET /api/questions/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}
