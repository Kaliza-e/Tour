import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatAskerName, findDuplicateQuestion, runLazyReleaseCheck } from "@/lib/questions";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as { id?: string })?.id;

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";
    const sort = searchParams.get("sort") || "newest";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Periodically run lazy release check for 30-day inactive claims
    await runLazyReleaseCheck();

    const whereClause: any = {
      moderationStatus: { in: ["APPROVED", "approved"] },
    };

    if (category && category !== "All") {
      whereClause.OR = [
        { category: { is: { name: { contains: category, mode: "insensitive" } } } },
        { categoryId: category },
      ];
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

    const questions = await prisma.question.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        claims: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(100, Math.max(1, limit)),
    });

    // Map and calculate spots left
    let items = questions.map((item) => {
      const activeClaimsCount = item.claims.length;
      const spotsLeft = Math.max(0, 3 - activeClaimsCount);
      const isFull = spotsLeft === 0;

      let effectiveStatus = item.status as string;
      if (item.status === "RESEARCH_COMPLETED") {
        effectiveStatus = "RESEARCH_COMPLETED";
      } else if (isFull) {
        effectiveStatus = "FULL";
      } else if (activeClaimsCount > 0) {
        effectiveStatus = "BEING_RESEARCHED";
      } else {
        effectiveStatus = "OPEN";
      }

      const isClaimedByCurrentUser = currentUserId
        ? item.claims.some((c) => c.userId === currentUserId)
        : false;

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category.name,
        categoryId: item.categoryId,
        status: effectiveStatus,
        rawStatus: item.status,
        author: {
          id: item.author.id,
          name: item.author.name,
          formattedName: formatAskerName(item.author.name),
        },
        askedBy: formatAskerName(item.author.name),
        tags: item.tags,
        activeClaimsCount,
        spotsLeft,
        isFull,
        spotsIndicator: isFull ? "Full" : `${spotsLeft} of 3 spots left`,
        isClaimedByCurrentUser,
        researchers: item.claims.map((c) => ({
          userId: c.userId,
          name: formatAskerName(c.user.name),
        })),
        createdAt: item.createdAt,
      };
    });

    // Filter by status if specified
    if (status && status !== "ALL") {
      if (status === "OPEN") {
        items = items.filter((i) => i.status === "OPEN");
      } else if (status === "BEING_RESEARCHED") {
        items = items.filter((i) => i.status === "BEING_RESEARCHED");
      } else if (status === "FULL") {
        items = items.filter((i) => i.isFull);
      } else if (status === "RESEARCH_COMPLETED") {
        items = items.filter((i) => i.status === "RESEARCH_COMPLETED");
      }
    }

    // Sort items
    if (sort === "spots") {
      items.sort((a, b) => b.spotsLeft - a.spotsLeft);
    } else if (sort === "active") {
      items.sort((a, b) => b.activeClaimsCount - a.activeClaimsCount);
    } else {
      // newest
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Also get current user's active claims if logged in
    let userActiveClaims: any[] = [];
    if (currentUserId) {
      userActiveClaims = await prisma.questionClaim.findMany({
        where: {
          userId: currentUserId,
          status: "ACTIVE",
        },
        include: {
          question: {
            select: {
              id: true,
              title: true,
              category: { select: { name: true } },
            },
          },
        },
      });
    }

    return NextResponse.json({
      questions: items,
      total: items.length,
      userActiveClaimsCount: userActiveClaims.length,
      userActiveClaims: userActiveClaims.map((c) => ({
        id: c.id,
        questionId: c.questionId,
        questionTitle: c.question.title,
        category: c.question.category.name,
        notebookId: c.notebookId,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json({ questions: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to submit a question." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let { title, description, categoryId } = body;

    title = typeof title === "string" ? title.trim() : "";
    description = typeof description === "string" ? description.trim() : "";

    // Validation: 10 to 200 characters, must end with a question mark
    if (title.length < 10 || title.length > 200) {
      return NextResponse.json(
        { error: "Question text must be between 10 and 200 characters." },
        { status: 400 }
      );
    }

    if (!title.endsWith("?")) {
      return NextResponse.json(
        { error: "Question must end with a question mark ('?')." },
        { status: 400 }
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: "Optional context cannot exceed 500 characters." },
        { status: 400 }
      );
    }

    // Safety filter: sanitize and block personal details
    const textToCheck = `${title} ${description}`;
    const emailPhoneRegex =
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    if (emailPhoneRegex.test(textToCheck)) {
      return NextResponse.json(
        { error: "Questions cannot contain personal contact details (phone numbers or emails)." },
        { status: 400 }
      );
    }

    // Rate limiting: maximum 3 questions per user per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const submittedInLast24h = await prisma.question.count({
      where: {
        authorId: userId,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (submittedInLast24h >= 3) {
      return NextResponse.json(
        { error: "You have reached the limit of 3 submitted questions per day. Please check back tomorrow!" },
        { status: 429 }
      );
    }

    // Duplicate and near-duplicate prevention
    const duplicate = await findDuplicateQuestion(title);
    if (duplicate) {
      return NextResponse.json(
        {
          error: "A similar question already exists on the research board.",
          existingQuestion: {
            id: duplicate.id,
            title: duplicate.title,
            category: duplicate.category?.name,
          },
        },
        { status: 409 }
      );
    }

    // Resolve Category
    let category = await prisma.category.findFirst({
      where: {
        OR: [{ id: categoryId }, { name: categoryId }, { slug: categoryId }],
      },
    });

    if (!category) {
      category = await prisma.category.findFirst();
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: "Science & Innovation (STEM)",
            slug: "stem",
          },
        });
      }
    }

    // Create Question in PENDING status for admin moderation
    const question = await prisma.question.create({
      data: {
        title,
        description: description || title,
        authorId: userId,
        categoryId: category.id,
        status: "OPEN",
        moderationStatus: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your question has been submitted for editorial review! It will appear on the Question Board once approved.",
        question: {
          id: question.id,
          title: question.title,
          moderationStatus: question.moderationStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/questions error:", error);
    return NextResponse.json(
      { error: "Failed to submit question. Please try again." },
      { status: 500 }
    );
  }
}
