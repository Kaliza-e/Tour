import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OFFICIAL_CATEGORIES } from "@/lib/categories-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Count published papers per category
    const publications = await prisma.publication.findMany({
      select: { category: true },
    }).catch(() => []);

    const categoryCounts: Record<string, number> = {};
    for (const pub of publications) {
      if (pub.category) {
        const key = pub.category.toLowerCase().trim();
        categoryCounts[key] = (categoryCounts[key] || 0) + 1;
      }
    }

    const result = OFFICIAL_CATEGORIES.map((cat) => {
      let count = 0;
      for (const [key, val] of Object.entries(categoryCounts)) {
        if (
          key.includes(cat.slug) ||
          cat.name.toLowerCase().includes(key) ||
          (key.includes("stem") && cat.slug === "science-innovation")
        ) {
          count += val;
        }
      }

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        subtopics: cat.subtopics,
        publishedCount: count,
      };
    });

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ categories: OFFICIAL_CATEGORIES.map(c => ({ ...c, publishedCount: 0 })) });
  }
}
