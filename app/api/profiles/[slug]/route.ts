import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ slug: slug }, { id: slug }],
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
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const showDetails = Boolean(user.privacyConsent || user.isPublic);

    // Fetch published papers
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
      select: {
        id: true,
        title: true,
        category: true,
        publicationDate: true,
      },
      orderBy: { publicationDate: "desc" },
    }).catch(() => []);

    return NextResponse.json({
      profile: {
        id: user.id,
        name: user.name,
        slug: user.slug || user.id,
        bio: showDetails ? user.bio : null,
        school: showDetails ? user.school : null,
        location: showDetails ? user.location : null,
        orcid: showDetails ? user.orcid : null,
        publications,
      },
    });
  } catch (error) {
    console.error("GET /api/profiles/:slug error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
