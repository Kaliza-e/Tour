import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { PublicationLibrary } from "@/components/publication-library";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
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
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sapphire"><BookOpen className="h-4 w-4" /> Publications</div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-navy md:text-4xl">Explore student research</h1>
          <p className="mt-4 text-base leading-relaxed text-navy/70">Read work that has completed TOUR&apos;s review and publication process.</p>
        </div>
        <PublicationLibrary publications={items} />
        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">Open to new work</p><h2 className="mt-2 font-heading text-2xl font-bold text-navy">Ready to publish your research?</h2></div><Link href="/get-published" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-sapphire">Get published <ArrowRight className="h-4 w-4" /></Link></div></div>
      </div>
    </div>
  );
}
