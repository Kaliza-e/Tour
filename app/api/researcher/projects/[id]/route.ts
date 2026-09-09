import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireOwner(userId: string, projectId: string) {
  const project = await prisma.researchProject.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  });
  return project ?? null;
}

// ---------------------------------------------------------------------------
// GET /api/researcher/projects/[id]
// Full project detail for the owner.
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.researchProject.findFirst({
    where: { id: params.id, ownerId: userId },
    include: {
      category: { select: { name: true, slug: true } },
      tasks: { orderBy: { id: "asc" } },
      notes: { orderBy: { updatedAt: "desc" } },
      references: true,
      files: { orderBy: { createdAt: "desc" } },
      collaborators: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      paper: {
        select: {
          id: true,
          title: true,
          status: true,
          abstract: true,
          keywords: true,
          pdfUrl: true,
          views: true,
          citationCount: true,
          submittedAt: true,
          publishedAt: true,
        },
      },
      question: {
        select: { id: true, title: true, status: true, description: true },
      },
    },
  });

  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  return NextResponse.json(project);
}

// ---------------------------------------------------------------------------
// PATCH /api/researcher/projects/[id]
// Supports multiple update actions via `action` discriminator:
//   "UPDATE_STAGE"    — move stage + set progress
//   "UPDATE_PROGRESS" — update progress percentage only
//   "TOGGLE_TASK"     — flip a task's done flag
//   "ADD_TASK"        — add a new task
//   "ADD_NOTE"        — add a note
//   "ADD_REFERENCE"   — add a reference
//   "UPDATE_META"     — update title, goal, hypothesis, objectives
// ---------------------------------------------------------------------------

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("UPDATE_STAGE"),
    stage: z.enum(["WORKSPACE", "RESEARCH", "DRAFT", "SUBMISSION", "PUBLICATION"]),
    progress: z.number().min(0).max(100).optional(),
  }),
  z.object({
    action: z.literal("UPDATE_PROGRESS"),
    progress: z.number().min(0).max(100),
  }),
  z.object({
    action: z.literal("TOGGLE_TASK"),
    taskId: z.string().min(1),
    done: z.boolean(),
  }),
  z.object({
    action: z.literal("ADD_TASK"),
    title: z.string().min(1).max(200),
    dueDate: z.string().optional(),
  }),
  z.object({
    action: z.literal("DELETE_TASK"),
    taskId: z.string().min(1),
  }),
  z.object({
    action: z.literal("ADD_NOTE"),
    content: z.string().min(1),
  }),
  z.object({
    action: z.literal("ADD_REFERENCE"),
    citation: z.string().min(1),
    url: z.string().url().optional().or(z.literal("")),
  }),
  z.object({
    action: z.literal("DELETE_REFERENCE"),
    referenceId: z.string().min(1),
  }),
  z.object({
    action: z.literal("UPDATE_META"),
    title: z.string().min(3).max(200).optional(),
    researchGoal: z.string().min(10).optional(),
    hypothesis: z.string().optional(),
    objectives: z.array(z.string()).optional(),
  }),
]);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await requireOwner(userId, params.id);
  if (!owned) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // ── UPDATE_STAGE ──
  if (data.action === "UPDATE_STAGE") {
    const stageProgress: Record<string, number> = {
      WORKSPACE: 5,
      RESEARCH: 25,
      DRAFT: 50,
      SUBMISSION: 75,
      PUBLICATION: 100,
    };
    const project = await prisma.researchProject.update({
      where: { id: params.id },
      data: {
        stage: data.stage,
        progress: data.progress ?? stageProgress[data.stage] ?? 0,
      },
    });
    return NextResponse.json({ success: true, project });
  }

  // ── UPDATE_PROGRESS ──
  if (data.action === "UPDATE_PROGRESS") {
    const project = await prisma.researchProject.update({
      where: { id: params.id },
      data: { progress: data.progress },
    });
    return NextResponse.json({ success: true, project });
  }

  // ── TOGGLE_TASK ──
  if (data.action === "TOGGLE_TASK") {
    const task = await prisma.task.findFirst({
      where: { id: data.taskId, projectId: params.id },
    });
    if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });

    const updated = await prisma.task.update({
      where: { id: data.taskId },
      data: { done: data.done },
    });
    return NextResponse.json({ success: true, task: updated });
  }

  // ── ADD_TASK ──
  if (data.action === "ADD_TASK") {
    const task = await prisma.task.create({
      data: {
        projectId: params.id,
        title: data.title,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        done: false,
      },
    });
    return NextResponse.json({ success: true, task }, { status: 201 });
  }

  // ── DELETE_TASK ──
  if (data.action === "DELETE_TASK") {
    const task = await prisma.task.findFirst({
      where: { id: data.taskId, projectId: params.id },
    });
    if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
    await prisma.task.delete({ where: { id: data.taskId } });
    return NextResponse.json({ success: true });
  }

  // ── ADD_NOTE ──
  if (data.action === "ADD_NOTE") {
    const note = await prisma.researchNote.create({
      data: { projectId: params.id, content: data.content },
    });
    return NextResponse.json({ success: true, note }, { status: 201 });
  }

  // ── ADD_REFERENCE ──
  if (data.action === "ADD_REFERENCE") {
    const ref = await prisma.reference.create({
      data: {
        projectId: params.id,
        citation: data.citation,
        url: data.url || null,
      },
    });
    return NextResponse.json({ success: true, reference: ref }, { status: 201 });
  }

  // ── DELETE_REFERENCE ──
  if (data.action === "DELETE_REFERENCE") {
    const ref = await prisma.reference.findFirst({
      where: { id: data.referenceId, projectId: params.id },
    });
    if (!ref) return NextResponse.json({ error: "Reference not found." }, { status: 404 });
    await prisma.reference.delete({ where: { id: data.referenceId } });
    return NextResponse.json({ success: true });
  }

  // ── UPDATE_META ──
  if (data.action === "UPDATE_META") {
    const project = await prisma.researchProject.update({
      where: { id: params.id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.researchGoal ? { researchGoal: data.researchGoal } : {}),
        ...(data.hypothesis !== undefined ? { hypothesis: data.hypothesis } : {}),
        ...(data.objectives ? { objectives: data.objectives } : {}),
      },
    });
    return NextResponse.json({ success: true, project });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

// ---------------------------------------------------------------------------
// DELETE /api/researcher/projects/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owned = await requireOwner(userId, params.id);
  if (!owned) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  await prisma.researchProject.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
