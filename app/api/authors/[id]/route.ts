import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authorId = params.id;

    // Fetch user profile (by id or slug)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: authorId },
          { slug: authorId },
        ],
      },
      select: {
        id: true,
        name: true,
        bio: true,
        school: true,
        location: true,
        orcid: true,
        privacyConsent: true,
        isPublic: true,
        slug: true,
      },
    }).catch(() => null);

    if (!user) {
      // Fallback: check if author exists in SubmissionAuthor records
      const subAuthor = await prisma.submissionAuthor.findFirst({
        where: { id: authorId },
        select: {
          id: true,
          fullName: true,
          institution: true,
          country: true,
          bio: true,
        },
      }).catch(() => null);

      if (!subAuthor) {
        return NextResponse.json(
          { error: "Author not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        author: {
          id: subAuthor.id,
          name: subAuthor.fullName,
          bio: null, // Privacy default for non-registered/unconsented sub-authors
          school: null,
          country: null,
          orcid: null,
          papers: [],
        },
      });
    }

    // Privacy filter: Under 18 privacy rule
    const showDetails = Boolean(user.privacyConsent || user.isPublic);

    // Fetch author's published publications
    const publications = await prisma.publication.findMany({
      where: {
        submission: {
          OR: [
            { userId: user.id },
            { authors: { some: { userId: user.id } } },
          ],
          status: "PUBLISHED",
        },
      },
      include: {
        submission: {
          select: {
            researchType: true,
            abstract: true,
            fileUrl: true,
            authors: { select: { fullName: true } },
          },
        },
      },
      orderBy: { publicationDate: "desc" },
    }).catch(() => []);

    const papers = publications.map((pub) => ({
      id: pub.id,
      title: pub.title,
      category: pub.category,
      abstract: pub.abstract || pub.submission.abstract || "",
      publicationDate: pub.publicationDate,
      authors: pub.submission.authors.map((a) => a.fullName).join(", ") || user.name,
      fileUrl: pub.submission.fileUrl,
    }));

    return NextResponse.json({
      author: {
        id: user.id,
        name: user.name,
        bio: showDetails ? user.bio : null,
        school: showDetails ? user.school : null,
        country: showDetails ? user.location : null,
        orcid: showDetails ? user.orcid : null,
        papers,
      },
    });
  } catch (error) {
    console.error("GET /api/authors/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch author details" }, { status: 500 });
  }
}
