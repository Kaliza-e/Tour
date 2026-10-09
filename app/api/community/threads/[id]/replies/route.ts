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

    const threadId = params.id;
    const body = await req.json().catch(() => ({}));
    const { body: content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Reply content cannot be empty." }, { status: 400 });
    }

    // Safety check: block contact details
    const emailPhoneRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    if (emailPhoneRegex.test(content)) {
      return NextResponse.json(
        { error: "Replies cannot contain personal contact information." },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { id: true, authorId: true, title: true },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        threadId: thread.id,
        authorId: session.user.id,
        body: content.trim(),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    // Notify thread author
    if (thread.authorId && thread.authorId !== session.user.id) {
      await notify(thread.authorId, "THREAD_REPLY", {
        title: "New reply on your discussion thread!",
        message: `${session.user.name || "A student"} replied to your thread "${thread.title}"`,
        link: `/research?thread=${thread.id}`,
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("POST /api/community/threads/:id/replies error:", error);
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
