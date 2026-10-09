import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category")?.trim() || "";
    const subtopic = searchParams.get("subtopic")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";
    const sort = searchParams.get("sort") || "newest";

    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
    const pageSize = 12;

    const whereClause: any = {
      // Only show approved questions by default
      moderationStatus: { in: ["APPROVED", "approved"] },
    };

    if (category) {
      whereClause.OR = [
        { category: { is: { name: { contains: category, mode: "insensitive" } } } },
        { categoryId: category },
      ];
    }

    if (subtopic) {
      whereClause.subtopic = { contains: subtopic, mode: "insensitive" };
    }

    if (status) {
      whereClause.status = status;
    }

    if (q) {
      whereClause.AND = [
        {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { tags: { hasSome: [q] } },
          ],
        },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "curious") {
      orderBy = { curiousCount: "desc" };
    } else if (sort === "views") {
      orderBy = { views: "desc" };
    }

    const total = await prisma.question.count({ where: whereClause }).catch(() => 0);

    const questions = await prisma.question.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            isPublic: true,
            privacyConsent: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }).catch(() => []);

    const items = questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      status: q.status,
      subtopic: q.subtopic,
      curiousCount: q.curiousCount,
      views: q.views,
      linkedPaperId: q.linkedPaperId,
      createdAt: q.createdAt,
      author: {
        id: q.author.id,
        name: q.author.name,
      },
      category: q.category.name,
    }));

    return NextResponse.json({
      questions: items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json({ questions: [], pagination: { total: 0, page: 1, pageSize: 12, totalPages: 1 } });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { title, description, categoryId, subtopic, tags } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: "Title, description, and category are required." },
        { status: 400 }
      );
    }

    // Safety check: block personal contact details (email, phone)
    const textToCheck = `${title} ${description}`;
    const emailPhoneRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    if (emailPhoneRegex.test(textToCheck)) {
      return NextResponse.json(
        { error: "Questions cannot contain personal contact details like phone numbers or email addresses." },
        { status: 400 }
      );
    }

    // Find or fallback category
    let category = await prisma.category.findFirst({
      where: {
        OR: [{ id: categoryId }, { name: categoryId }, { slug: categoryId }],
      },
    }).catch(() => null);

    if (!category) {
      // Pick first existing category or create
      category = await prisma.category.findFirst().catch(() => null);
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: "General Science",
            slug: "general-science",
            description: "General academic and scientific research topics.",
          },
        });
      }
    }

    const question = await prisma.question.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        authorId: session.user.id,
        categoryId: category.id,
        subtopic: typeof subtopic === "string" ? subtopic.trim() : null,
        tags: Array.isArray(tags) ? tags : [],
        status: "OPEN",
        moderationStatus: "APPROVED", // Auto-approved for verified students
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error("POST /api/questions error:", error);
    return NextResponse.json({ error: "Failed to post question" }, { status: 500 });
  }
}
