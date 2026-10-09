import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const subtopic = searchParams.get("subtopic")?.trim() || "";
    const author = searchParams.get("author")?.trim() || "";
    const sort = searchParams.get("sort") || "newest";

    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);

    const rawPageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const pageSize = Math.min(50, Math.max(1, isNaN(rawPageSize) ? 10 : rawPageSize));

    // Construct Prisma where clause for published publications
    const whereClause: any = {
      submission: {
        status: "PUBLISHED",
      },
    };

    // Category filter
    if (category) {
      whereClause.category = { contains: category, mode: "insensitive" };
    }

    // Keyword search filter (title, abstract, keywords, author name)
    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { abstract: { contains: q, mode: "insensitive" } },
        { keywords: { hasSome: [q] } },
        { submission: { authors: { some: { fullName: { contains: q, mode: "insensitive" } } } } },
      ];
    }

    // Author filter
    if (author) {
      whereClause.submission = {
        ...whereClause.submission,
        authors: {
          some: {
            OR: [
              { fullName: { contains: author, mode: "insensitive" } },
              { userId: author },
            ],
          },
        },
      };
    }

    // Order By
    let orderBy: any = { publicationDate: "desc" };
    if (sort === "title") {
      orderBy = { title: "asc" };
    }

    // Count total matching publications
    const total = await prisma.publication.count({ where: whereClause }).catch(() => 0);

    // Fetch paginated publications
    const publications = await prisma.publication.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        submission: {
          select: {
            id: true,
            submissionId: true,
            fileUrl: true,
            fileName: true,
            fileType: true,
            abstract: true,
            methodology: true,
            references: true,
            researchType: true,
            authors: {
              select: {
                id: true,
                userId: true,
                fullName: true,
                institution: true,
                country: true,
              },
            },
          },
        },
      },
    }).catch(() => []);

    const totalPages = Math.ceil(total / pageSize) || 1;

    const items = publications.map((pub) => ({
      id: pub.id,
      title: pub.title,
      category: pub.category,
      subtopic: subtopic || null,
      abstract: pub.abstract || pub.submission.abstract || "",
      summary: pub.summary || "",
      keywords: pub.keywords || [],
      publicationDate: pub.publicationDate,
      authorNames: pub.submission.authors.map((a) => a.fullName).join(", ") || "TOUR Author",
      authors: pub.submission.authors.map((a) => ({
        id: a.id,
        userId: a.userId,
        name: a.fullName,
        institution: a.institution,
      })),
      fileUrl: pub.submission.fileUrl,
      fileName: pub.submission.fileName,
      fileType: pub.submission.fileType,
      researchType: pub.submission.researchType
        ? pub.submission.researchType.replace(/_/g, " ")
        : "Research Article",
    }));

    return NextResponse.json({
      papers: items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/papers error:", error);
    return NextResponse.json({ papers: [], pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 } });
  }
}
