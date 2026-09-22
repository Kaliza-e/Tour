import Link from "next/link";
import { FlaticonBook, FlaticonEye } from "@/components/flaticons";

export interface PublicationCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  readingTime?: string;
  views?: number;
}

export function PublicationCard(p: PublicationCardProps) {
  return (
    <Link
      href={`/publications/${p.id}`}
      className="group flex flex-col justify-between rounded-card border-2 border-navy/15 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-navy/40"
    >
      <div>
        <span className="rounded-pill bg-ivory px-3 py-1 text-xs font-semibold text-navy/70">
          {p.category}
        </span>
        <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-navy group-hover:text-sapphire">
          {p.title}
        </h3>
        <p className="mt-2 text-sm text-navy/50">by {p.author}</p>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-navy/50">
          {p.readingTime && <span className="flex items-center gap-1.5"><FlaticonBook size={16} /> {p.readingTime}</span>}
          {typeof p.views === "number" && <span className="flex items-center gap-1.5"><FlaticonEye size={16} /> {p.views}</span>}
      </div>
    </Link>
  );
}
