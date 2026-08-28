import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/papers/:id/publish
// Final step of the publication workflow. Requires status APPROVED.
// On success: paper -> PUBLISHED, and if the paper's project was adopted
// from a Question, that question flips to RESEARCH_COMPLETED and is linked
// to the published paper (Question.project.paper).
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const paper = await prisma.researchPaper.findUnique({
    where: { id: params.id },
    include: { project: { include: { question: true } } },
  });
  if (!paper) return NextResponse.json({ error: "Paper not found." }, { status: 404 });
  if (paper.ownerId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: "Only the paper owner can publish it." }, { status: 403 });
  }
  if (paper.status !== "APPROVED") {
    return NextResponse.json({ error: "Paper must be approved before it can be published." }, { status: 400 });
  }

  const updates: Prisma.PrismaPromise<unknown>[] = [
    prisma.researchPaper.update({
      where: { id: paper.id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    }),
    prisma.researchProject.update({
      where: { id: paper.projectId },
      data: { stage: "PUBLICATION", progress: 100 },
    }),
  ];

  if (paper.project.question) {
    updates.push(
      prisma.question.update({
        where: { id: paper.project.question.id },
        data: { status: "RESEARCH_COMPLETED" },
      })
    );
  }

  const [published] = await prisma.$transaction(updates);
  return NextResponse.json(published);
}
