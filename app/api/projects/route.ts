import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const projectSchema = z.object({
  title: z.string().min(3),
  researchGoal: z.string().min(5),
  hypothesis: z.string().optional(),
  category: z.string().default("Environmental Science"),
  stage: z.enum(["WORKSPACE", "RESEARCH", "DRAFT", "SUBMISSION", "PUBLICATION"]).default("WORKSPACE"),
  progress: z.number().min(0).max(100).default(10),
  questionId: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.researchProject.findMany({
      where: { ownerId: userId },
      include: { category: true, notes: true, references: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error: unknown) {
    console.error("GET /api/projects error:", error);
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid project data" }, { status: 400 });
    }

    const { title, researchGoal, hypothesis, category, stage, progress, questionId } = parsed.data;

    // Find or create category
    let categoryRecord = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: category, mode: "insensitive" } },
          { slug: { equals: category.toLowerCase().replace(/\s+/g, "-") } },
        ],
      },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category,
          slug: category.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    }

    const project = await prisma.researchProject.create({
      data: {
        title,
        researchGoal,
        hypothesis: hypothesis || null,
        categoryId: categoryRecord.id,
        ownerId: userId,
        questionId: questionId || null,
        stage,
        progress,
        notes: {
          create: {
            content: `Initial workspace created for "${title}"`,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/projects error:", error);
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
