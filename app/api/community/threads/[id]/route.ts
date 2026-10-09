import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = params.id;

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!thread || thread.status !== "visible") {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("GET /api/community/threads/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 });
  }
}
