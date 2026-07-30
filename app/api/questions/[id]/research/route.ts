import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/questions/:id/research
// Implements: "I'd Like To Research This" -> creates a ResearchProject in the
// student's workspace, links it to the question, and flips the question's
// status to BEING_RESEARCHED.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to research a question." }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: { project: true },
  });
  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }
  if (question.project) {
    return NextResponse.json({ error: "This question already has an active researcher." }, { status: 409 });
  }

  const [project] = await prisma.$transaction([
    prisma.researchProject.create({
      data: {
        title: question.title,
        researchGoal: `Investigate: ${question.title}`,
        questionId: question.id,
        ownerId: userId,
        categoryId: question.categoryId,
        stage: "WORKSPACE",
      },
    }),
    prisma.question.update({
      where: { id: question.id },
      data: { status: "BEING_RESEARCHED" },
    }),
  ]);

  return NextResponse.json(project, { status: 201 });
}
