import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createQuestionSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(20),
  categoryId: z.string(),
  tags: z.array(z.string()).max(8).default([]),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const questions = await prisma.question.findMany({
    where: {
      status: status as never,
      categoryId,
      title: q ? { contains: q, mode: "insensitive" } : undefined,
    },
    include: { author: true, category: true, likes: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(questions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to ask a question." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      ...parsed.data,
      authorId: (session.user as { id: string }).id,
    },
  });

  return NextResponse.json(question, { status: 201 });
}
