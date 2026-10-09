import Link from "next/link";
import { notFound } from "next/navigation";
import { User, BookOpen, ArrowLeft, Building, Globe, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: { slug: string };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const slug = params.slug;

  let user = null;
  try {
    user = await prisma.user.findFirst({
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
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }

  if (!user) {
    notFound();
  }

  const showDetails = Boolean(user.privacyConsent || user.isPublic);

  let publications: any[] = [];
  try {
    publications = await prisma.publication.findMany({
      where: {
        submission: {
          OR: [
            { userId: user.id },
            { authors: { some: { userId: user.id } } },
          ],
          status: "PUBLISHED",
        },
      },
      include: {
        submission: {
          select: {
            abstract: true,
            fileUrl: true,
            authors: { select: { fullName: true } },
          },
        },
      },
      orderBy: { publicationDate: "desc" },
    });
  } catch (err) {
    console.error("Error fetching user publications:", err);
  }

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-16">
      <div className="container-tour max-w-4xl space-y-8">
        
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sapphire hover:text-navy transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Research Board</span>
        </Link>

        <div className="rounded-3xl border-2 border-navy/15 bg-white p-8 md:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-ivory text-2xl font-bold font-heading shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="inline-block rounded-full bg-sapphire/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sapphire mb-1">
                  Student Profile
                </span>
                <h1 className="font-heading text-3xl font-bold text-navy">
                  {user.name}
                </h1>
              </div>
            </div>

            {user.orcid && showDetails && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>ORCID: {user.orcid}</span>
              </div>
            )}
          </div>

          {showDetails ? (
            <div className="space-y-4 pt-4 border-t border-navy/10">
              {user.bio && (
                <p className="text-sm sm:text-base leading-relaxed text-navy/80 font-light">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-navy/70">
                {user.school && (
                  <div className="flex items-center gap-1.5 rounded-full border border-navy/15 bg-ivory/60 px-3 py-1.5">
                    <Building size={14} className="text-sapphire" />
                    <span>{user.school}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-1.5 rounded-full border border-navy/15 bg-ivory/60 px-3 py-1.5">
                    <Globe size={14} className="text-sapphire" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-navy/10 bg-ivory/50 p-4 text-xs text-navy/60 font-light">
              This student researcher has enabled privacy protection mode. Metadata is hidden by default.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-navy flex items-center gap-2">
            <BookOpen size={22} className="text-sapphire" />
            <span>Published Research ({publications.length})</span>
          </h2>

          {publications.length === 0 ? (
            <div className="rounded-3xl border border-navy/15 bg-white p-8 text-center text-navy/60 font-light">
              No published papers yet.
            </div>
          ) : (
            <div className="space-y-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="rounded-3xl border-2 border-navy/15 bg-white p-6 space-y-3 transition hover:border-navy hover:shadow-md"
                >
                  <span className="rounded-full bg-champagne/60 border border-navy/10 px-3 py-0.5 text-xs font-semibold text-navy">
                    {pub.category}
                  </span>

                  <h3 className="font-heading text-xl font-bold text-navy">
                    {pub.title}
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-navy/75 line-clamp-3 font-light">
                    {pub.abstract || pub.submission?.abstract}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-navy/60">
                      Author: {pub.submission?.authors?.map((a: { fullName: string }) => a.fullName).join(", ") || user.name}
                    </span>

                    <Link
                      href={`/research?paper=${pub.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sapphire hover:underline"
                    >
                      <span>View Paper</span>
                      <BookOpen size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
