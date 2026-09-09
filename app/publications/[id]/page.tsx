import { Download, Quote } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const publication = await prisma.publication.findFirst({
    where: { id: params.id, submission: { status: "PUBLISHED" } },
    include: { authors: true, submission: { select: { fileUrl: true, fileName: true } } },
  });

  if (!publication) notFound();

  return (
    <div className="container-tour max-w-3xl py-20">
      {publication.coverImage && <Image src={publication.coverImage} alt="" width={1200} height={320} unoptimized className="mb-8 h-48 w-full rounded-3xl object-cover" />}
      <span className="rounded-pill bg-champagne px-3 py-1 text-xs font-semibold text-navy">{publication.category}</span>
      <h1 className="mt-5 font-heading text-2xl font-semibold text-navy md:text-3xl">{publication.title}</h1>
      <p className="mt-3 text-sm text-navy/50">{publication.authors.map((author) => author.name).join(", ")} · {publication.authors.map((author) => author.institution).filter(Boolean).join(", ")} · Published {publication.publicationDate?.toLocaleDateString()}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {publication.submission.fileUrl ? <a href={publication.submission.fileUrl} download={publication.submission.fileName || undefined} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"><Download size={15} /> Download paper</a> : <span className="text-sm text-navy/55">No downloadable file was attached.</span>}
        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-sm font-semibold text-navy"><Quote size={15} /> Cite this paper</button>
      </div>
      <div className="mt-10 rounded-card bg-white p-8 shadow-card"><h2 className="font-heading text-lg font-bold text-navy">Abstract</h2><p className="mt-3 leading-relaxed text-navy/65">{publication.abstract}</p></div>
      {publication.summary && <div className="mt-8 rounded-card border border-navy/8 bg-white p-8"><h2 className="font-heading text-lg font-bold text-navy">Summary</h2><p className="mt-3 leading-relaxed text-navy/65">{publication.summary}</p></div>}
      {publication.content && <div className="mt-8 rounded-card border border-navy/8 bg-white p-8"><h2 className="font-heading text-lg font-bold text-navy">Research details</h2><p className="mt-3 whitespace-pre-wrap leading-relaxed text-navy/65">{publication.content}</p></div>}
      {publication.authorBio && <div className="mt-8 rounded-card border border-navy/8 bg-white p-6"><h3 className="font-heading text-sm font-bold text-navy">Author bio</h3><p className="mt-2 leading-relaxed text-navy/65">{publication.authorBio}</p></div>}
      <div className="mt-8 rounded-card border border-navy/8 bg-white p-6"><h3 className="font-heading text-sm font-bold text-navy">Keywords</h3><div className="mt-2 flex flex-wrap gap-2">{publication.keywords.map((keyword) => <span key={keyword} className="rounded-pill bg-ivory px-3 py-1 text-xs text-navy/60">{keyword}</span>)}</div></div>
      {publication.references && <div className="mt-8 rounded-card border border-navy/8 bg-white p-6"><h3 className="font-heading text-sm font-bold text-navy">References</h3><p className="mt-2 whitespace-pre-wrap leading-relaxed text-navy/65">{publication.references}</p></div>}
    </div>
  );
}
