import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category")?.trim() || "";
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
    const pageSize = 10;

    const whereClause: any = {
      status: "visible",
    };

    if (category) {
      whereClause.category = { contains: category, mode: "insensitive" };
    }

    const total = await prisma.thread.count({ where: whereClause }).catch(() => 0);

    const threads = await prisma.thread.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { replies: true },
        },
      },
    }).catch(() => []);

    const items = threads.map((t) => ({
      id: t.id,
      title: t.title,
      body: t.body,
      category: t.category,
      createdAt: t.createdAt,
      authorName: t.author.name,
      authorId: t.author.id,
      replyCount: t._count.replies,
    }));

    return NextResponse.json({
      threads: items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (error) {
    console.error("GET /api/community/threads error:", error);
    return NextResponse.json({ threads: [], pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 } });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { title, body: content, category, paperId, questionId } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, category, and content are required." },
        { status: 400 }
      );
    }

    // Safety check: block personal contact details (emails & phone numbers)
    const textToCheck = `${title} ${content}`;
    const emailPhoneRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    if (emailPhoneRegex.test(textToCheck)) {
      return NextResponse.json(
        { error: "Community posts cannot contain personal contact information like emails or phone numbers." },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.create({
      data: {
        title: title.trim(),
        body: content.trim(),
        category: category.trim(),
        paperId: paperId || null,
        questionId: questionId || null,
        authorId: session.user.id,
        status: "visible",
      },
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("POST /api/community/threads error:", error);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
