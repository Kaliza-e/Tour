import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { PublicationLibrary } from "@/components/publication-library";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    where: { submission: { status: "PUBLISHED" } },
    orderBy: { publicationDate: "desc" },
    include: {
      authors: { select: { name: true, institution: true, bio: true } },
      submission: {
        select: {
          fileUrl: true,
          fileName: true,
          fileType: true,
          abstract: true,
          methodology: true,
          references: true,
          supportingLinks: true,
          researchType: true,
        },
      },
    },
  });

  const items = publications.map((publication) => ({
    id: publication.id,
    title: publication.title,
    category: publication.category,
    author: publication.authors.map((author) => author.name).join(", ") || "TOUR Author",
    authors: publication.authors.map((a) => ({
      name: a.name,
      institution: a.institution,
      bio: a.bio,
    })),
    abstract: publication.abstract || publication.submission?.abstract || "",
    summary: publication.summary || "",
    content: publication.content || "",
    methodology: publication.submission?.methodology || "",
    references: publication.references || publication.submission?.references || "",
    keywords: publication.keywords || [],
    authorBio: publication.authorBio || "",
    publishedAt: publication.publicationDate
      ? new Date(publication.publicationDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : undefined,
    fileUrl: publication.submission?.fileUrl || null,
    fileName: publication.submission?.fileName || null,
    fileType: publication.submission?.fileType || null,
    supportingLinks: publication.submission?.supportingLinks || [],
    researchType: publication.submission?.researchType
      ? publication.submission.researchType.replace(/_/g, " ")
      : "Research Article",
  }));

  return (
    <div className="bg-ivory py-16 md:py-20">
      <div className="container-tour space-y-8 max-w-6xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">
            <BookOpen className="h-4 w-4" /> Publications
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold text-navy md:text-4xl">
            Explore Published Student Research
          </h1>
          <p className="mt-3 text-base leading-relaxed text-navy/70">
            Read and download research that has completed TOUR&apos;s rigorous peer review process.
          </p>
        </div>

        <PublicationLibrary publications={items} />

        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">Research Ecosystem</p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-navy">Ready to publish your research?</h2>
              <p className="mt-1 text-sm text-navy/60">Submit your draft for peer review through your Researcher Notebook.</p>
            </div>
            <Link
              href="/researcher?action=new"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-sapphire transition"
            >
              <span>Create New Research</span> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
