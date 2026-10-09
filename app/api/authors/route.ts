import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const users = await prisma.user.findMany({
      where: query
        ? {
            name: { contains: query, mode: "insensitive" },
          }
        : undefined,
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
        submissions: {
          where: { status: "PUBLISHED" },
          select: { id: true },
        },
      },
      take: 20,
    });

    const authors = users.map((u) => ({
      id: u.id,
      name: u.name,
      slug: u.slug || u.id,
      bio: (u.privacyConsent || u.isPublic) ? u.bio : null,
      school: (u.privacyConsent || u.isPublic) ? u.school : null,
      country: (u.privacyConsent || u.isPublic) ? u.location : null,
      orcid: (u.privacyConsent || u.isPublic) ? u.orcid : null,
      publishedCount: Array.isArray(u.submissions) ? u.submissions.length : 0,
    }));

    return NextResponse.json({ authors });
  } catch (error) {
    console.error("GET /api/authors error:", error);
    return NextResponse.json({ authors: [] });
  }
}

