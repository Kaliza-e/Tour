import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PublicationLibrary } from "@/components/publication-library";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const publications = await prisma.publication.findMany({
    where: { submission: { status: "PUBLISHED" } },
    orderBy: { publicationDate: "desc" },
    include: { authors: { select: { name: true } } },
  });
  const items = publications.map((publication) => ({
    id: publication.id,
    title: publication.title,
    category: publication.category,
    author: publication.authors.map((author) => author.name).join(", ") || "TOUR author",
  }));

  return (
    <div className="bg-ivory py-16 md:py-20">
      <div className="container-tour space-y-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sapphire"><BookOpen className="h-4 w-4" /> Research / Publications</div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-navy md:text-5xl">Discover student research and writing.</h1>
          <p className="mt-4 text-base leading-relaxed text-navy/70">Read research that has completed TOUR&apos;s review and publication process.</p>
        </div>
        <PublicationLibrary publications={items} />
        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">Publishing path</p><h2 className="mt-2 font-heading text-2xl font-bold text-navy">Want to share your own work?</h2></div><Link href="/get-published" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-sapphire">Learn how to get published <ArrowRight className="h-4 w-4" /></Link></div></div>
      </div>
    </div>
  );
}
