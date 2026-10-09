import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const u = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      }).catch(() => null);
      if (u) userId = u.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        school: true,
        gradeLevel: true,
        researchInterests: true,
        skills: true,
        location: true,
        orcid: true,
        privacyConsent: true,
        isPublic: true,
        slug: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user's research projects
    const projects = await prisma.researchProject.findMany({
      where: { ownerId: userId },
      select: {
        id: true,
        title: true,
        stage: true,
        progress: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "desc" },
    }).catch(() => []);

    // Fetch user's published papers
    const publications = await prisma.publication.findMany({
      where: {
        submission: {
          OR: [
            { userId: userId },
            { authors: { some: { userId: userId } } },
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
        ...user,
        projects,
        publications,
      },
    });
  } catch (error) {
    console.error("GET /api/profile/me error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const u = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      }).catch(() => null);
      if (u) userId = u.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const {
      name,
      bio,
      school,
      gradeLevel,
      location,
      orcid,
      researchInterests,
      privacyConsent,
      isPublic,
    } = body;

    // Generate slug from name if not present
    let slug = body.slug;
    if (typeof slug === "string") {
      slug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    if (!slug && typeof name === "string" && name.trim()) {
      slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    if (slug) {
      const existing = await prisma.user.findFirst({
        where: { slug, id: { not: userId } },
        select: { id: true },
      }).catch(() => null);
      if (existing) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: typeof name === "string" ? name.trim() : undefined,
        bio: typeof bio === "string" ? bio.trim() : undefined,
        school: typeof school === "string" ? school.trim() : undefined,
        gradeLevel: typeof gradeLevel === "string" ? gradeLevel.trim() : undefined,
        location: typeof location === "string" ? location.trim() : undefined,
        orcid: typeof orcid === "string" ? orcid.trim() : undefined,
        researchInterests: Array.isArray(researchInterests) ? researchInterests : undefined,
        privacyConsent: typeof privacyConsent === "boolean" ? privacyConsent : undefined,
        isPublic: typeof isPublic === "boolean" ? isPublic : undefined,
        slug: slug || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        school: true,
        gradeLevel: true,
        location: true,
        orcid: true,
        privacyConsent: true,
        isPublic: true,
        slug: true,
      },
    });

    return NextResponse.json({ profile: updatedUser });
  } catch (error) {
    console.error("PUT /api/profile/me error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
