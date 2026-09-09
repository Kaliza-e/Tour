import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET /api/researcher/projects
// Returns every ResearchProject owned by the current user, with full detail.
// ---------------------------------------------------------------------------

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.researchProject.findMany({
    where: { ownerId: userId },
    include: {
      category: { select: { name: true, slug: true } },
      tasks: { orderBy: { id: "asc" } },
      notes: { orderBy: { updatedAt: "desc" }, take: 5 },
      references: true,
      files: { orderBy: { createdAt: "desc" } },
      collaborators: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
      paper: {
        select: {
          id: true,
          title: true,
          status: true,
          abstract: true,
          pdfUrl: true,
          views: true,
          citationCount: true,
          submittedAt: true,
          publishedAt: true,
        },
      },
      question: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

// ---------------------------------------------------------------------------
// POST /api/researcher/projects
// Create a new ResearchProject for the current user.
// ---------------------------------------------------------------------------

const createSchema = z.object({
  title: z.string().min(3).max(200),
  researchGoal: z.string().min(10),
  hypothesis: z.string().optional(),
  objectives: z.array(z.string()).default([]),
  categoryName: z.string().min(1),   // human-readable category name
  questionId: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 }
    );
  }

  // Find-or-create category by name
  const slug = parsed.data.categoryName.toLowerCase().replace(/\s+/g, "-");
  const category = await prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name: parsed.data.categoryName, slug },
  });

  const project = await prisma.researchProject.create({
    data: {
      title: parsed.data.title,
      researchGoal: parsed.data.researchGoal,
      hypothesis: parsed.data.hypothesis ?? null,
      objectives: parsed.data.objectives,
      ownerId: userId,
      categoryId: category.id,
      questionId: parsed.data.questionId ?? null,
      stage: "WORKSPACE",
      progress: 0,
    },
    include: {
      category: { select: { name: true, slug: true } },
      tasks: true,
      notes: true,
      references: true,
      files: true,
      collaborators: true,
      paper: true,
      question: { select: { id: true, title: true, status: true } },
    },
  });

  return NextResponse.json({ success: true, project }, { status: 201 });
}
