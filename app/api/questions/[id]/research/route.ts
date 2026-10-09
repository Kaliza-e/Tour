import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";

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

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        category: true,
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Check if user already adopted this question
    const existingProject = await prisma.researchProject.findFirst({
      where: {
        questionId: question.id,
        ownerId: userId,
      },
    }).catch(() => null);

    if (existingProject) {
      return NextResponse.json({
        message: "You are already researching this question!",
        project: existingProject,
      });
    }

    // Check multi-researcher limit (Max 3 concurrent researchers)
    const activeProjectsCount = await prisma.researchProject.count({
      where: { questionId: question.id },
    }).catch(() => 0);

    const MAX_RESEARCHERS = 3;
    if (activeProjectsCount >= MAX_RESEARCHERS) {
      return NextResponse.json(
        { error: `This question already has ${MAX_RESEARCHERS} active student researchers.` },
        { status: 400 }
      );
    }

    // Create ResearchProject in researcher's workspace
    const project = await prisma.researchProject.create({
      data: {
        title: question.title,
        researchGoal: question.description,
        stage: "RESEARCH",
        progress: 10,
        questionId: question.id,
        ownerId: userId,
        categoryId: question.categoryId,
      },
    });

    // Update question status to BEING_RESEARCHED
    await prisma.question.update({
      where: { id: question.id },
      data: { status: "BEING_RESEARCHED" },
    });

    // Send notification to question author
    if (question.authorId && question.authorId !== userId) {
      await notify(question.authorId, "QUESTION_RESEARCH", {
        title: "Someone is researching your question!",
        message: `A student researcher has started a project on your question: "${question.title}"`,
        link: `/research?question=${question.id}`,
        dedupeKey: `q-research-${question.id}-${userId}`,
      });
    }

    return NextResponse.json({
      message: "Research project created in your workspace!",
      project,
    });
  } catch (error) {
    console.error("POST /api/questions/:id/research error:", error);
    return NextResponse.json({ error: "Failed to adopt research question" }, { status: 500 });
  }
}
