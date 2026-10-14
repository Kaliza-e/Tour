import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatAskerName } from "@/lib/questions";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string })?.role;

    if (!session || (role !== "ADMIN" && role !== "REVIEWER")) {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    const questions = await prisma.question.findMany({
      where: status === "ALL" ? {} : { moderationStatus: status },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      questions: questions.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        category: q.category.name,
        author: {
          id: q.author.id,
          name: q.author.name,
          email: q.author.email,
          formatted: formatAskerName(q.author.name),
        },
        moderationStatus: q.moderationStatus,
        moderationReason: q.moderationReason,
        createdAt: q.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/questions error:", error);
    return NextResponse.json({ error: "Failed to load moderation list." }, { status: 500 });
  }
}
