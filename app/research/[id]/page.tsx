import { Download, ExternalLink, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const publication = await prisma.publication.findFirst({
    where: { id: params.id, submission: { status: "PUBLISHED" } },
    include: {
      authors: true,
      submission: {
        select: {
          fileUrl: true,
          fileName: true,
          keywords: true,
          references: true,
          supportingLinks: true,
          category: true,
          researchType: true,
        },
      },
    },
  });

  if (!publication) notFound();

  const { submission } = publication;
  const keywords = publication.keywords.length
    ? publication.keywords
    : submission.keywords;
  const references = publication.references ?? submission.references;

  return (
    <div className="bg-ivory py-16 md:py-20">
      <div className="container-tour max-w-4xl">

        {/* ── Breadcrumb ── */}
        <nav className="mb-8 text-sm text-navy/50" aria-label="Breadcrumb">
          <Link href="/research" className="hover:text-navy">Research &amp; Publications</Link>
          <span className="mx-2">›</span>
          <span className="text-navy/75">{publication.title}</span>
        </nav>

        {/* ── Cover image ── */}
        {publication.coverImage && (
          <Image
            src={publication.coverImage}
            alt=""
            width={1200}
            height={400}
            unoptimized
            className="mb-8 h-64 w-full rounded-3xl object-cover"
          />
        )}

        {/* ── Category + research type ── */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-sapphire/20 bg-champagne/60 px-3 py-1 text-xs font-semibold text-sapphire">
            {publication.category}
          </span>
          <span className="rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-medium text-navy/60">
            {submission.researchType.replace(/_/g, " ")}
          </span>
        </div>

        {/* ── Title ── */}
        <h1 className="mt-5 font-heading text-2xl font-bold text-navy md:text-4xl leading-tight">
          {publication.title}
        </h1>

        {/* ── Authors + meta ── */}
        <div className="mt-4 flex flex-wrap gap-3">
          {publication.authors.map((author) => (
            <div
              key={author.id}
              className="rounded-2xl border border-navy/10 bg-white px-4 py-2.5 text-sm shadow-sm"
            >
              <p className="font-semibold text-navy">{author.name}</p>
              {author.institution && (
                <p className="text-xs text-navy/55">{author.institution}</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-navy/50">
          Published{" "}
          {publication.publicationDate
            ? new Date(publication.publicationDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
            : "—"}
        </p>

        {/* ── Action buttons ── */}
        <div className="mt-6 flex flex-wrap gap-3">
          {submission.fileUrl ? (
            <>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire"
              >
                <ExternalLink className="h-4 w-4" /> Read Research
              </a>
              <a
                href={submission.fileUrl}
                download={submission.fileName ?? undefined}
                className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </>
          ) : (
            <span className="text-sm text-navy/50">No downloadable file attached.</span>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
          >
            <Quote className="h-4 w-4" /> Cite this paper
          </button>
        </div>

        {/* ── Abstract ── */}
        <section className="mt-10 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-navy">Abstract</h2>
          <p className="mt-3 leading-relaxed text-navy/70">{publication.abstract}</p>
        </section>

        {/* ── Summary / description ── */}
        {publication.summary && (
          <section className="mt-6 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-navy">Summary</h2>
            <p className="mt-3 leading-relaxed text-navy/70">{publication.summary}</p>
          </section>
        )}

        {/* ── Full research content / methodology ── */}
        {publication.content && (
          <section className="mt-6 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-navy">Research Details</h2>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-navy/70">
              {publication.content}
            </p>
          </section>
        )}

        {/* ── Author bios ── */}
        {(publication.authorBio || publication.authors.some((a) => a.bio)) && (
          <section className="mt-6 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-navy">About the Author{publication.authors.length > 1 ? "s" : ""}</h2>
            {publication.authorBio && (
              <p className="mt-3 leading-relaxed text-navy/70">{publication.authorBio}</p>
            )}
            {publication.authors
              .filter((a) => a.bio && a.bio !== publication.authorBio)
              .map((a) => (
                <div key={a.id} className="mt-4">
                  <p className="text-sm font-semibold text-navy">{a.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-navy/65">{a.bio}</p>
                </div>
              ))}
          </section>
        )}

        {/* ── Keywords ── */}
        {keywords.length > 0 && (
          <section className="mt-6 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-navy">Keywords</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-ivory px-3 py-1 text-xs text-navy/60"
                >
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── References ── */}
        {references && (
          <section className="mt-6 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-navy">References</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy/65">
              {references}
            </p>
          </section>
        )}

        {/* ── Supporting links ── */}
        {submission.supportingLinks.length > 0 && (
          <section className="mt-6 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-navy">Supporting Links</h2>
            <ul className="mt-3 space-y-2">
              {submission.supportingLinks.map((link) => (
                <li key={link}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-sapphire hover:underline break-all"
                  >
                    {link} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Related research CTA ── */}
        <div className="mt-10 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
                More research
              </p>
              <h3 className="mt-1.5 font-heading text-xl font-bold text-navy">
                Explore more student research
              </h3>
            </div>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire"
            >
              Browse all publications
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
