import Link from "next/link";
import Image from "next/image";
import { FlaticonBook, FlaticonArrowRight } from "@/components/flaticons";
import { PublicationLibrary } from "@/components/publication-library";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
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
    <div className="bg-transparent py-16 md:py-20">
      <div className="container-tour space-y-10 max-w-6xl">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-champagne/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy">
            <FlaticonBook size={14} /> Research Board
          </div>
          <h1 className="font-heading text-3xl font-bold text-navy md:text-5xl">
            Discover Student Research & Publications
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-navy/70">
            Read and download research that has completed TOUR&apos;s peer review process.
          </p>
        </div>

        <PublicationLibrary publications={items} />

        {/* Callout Banner with Image */}
        <div className="grid gap-6 md:grid-cols-[1fr_300px] overflow-hidden rounded-3xl border-2 border-navy/15 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">
                Publishing Path
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-navy">
                Want to share your own research?
              </h2>
              <p className="mt-2 text-sm text-navy/70 leading-relaxed">
                Start a draft in your Researcher Notebook, edit your work, and submit for peer review.
              </p>
            </div>
            <div>
              <Link
                href="/researcher?action=new"
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-navy px-6 py-3 text-sm font-semibold text-ivory hover:bg-sapphire transition-all shrink-0 cursor-pointer"
              >
                <span>Start New Research</span>
                <FlaticonArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative h-48 md:h-full w-full overflow-hidden rounded-2xl border border-navy/10">
            <Image
              src="/research-discovery.jpg"
              alt="Student researcher in lab"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
