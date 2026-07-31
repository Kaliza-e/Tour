import Link from "next/link";
import { BookOpen, Eye } from "lucide-react";

export interface PublicationCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  readingTime: string;
  views: number;
}

export function PublicationCard(p: PublicationCardProps) {
  return (
    <Link
      href={`/publications/${p.id}`}
      className="group flex flex-col justify-between rounded-card border border-white/20 bg-white/70 p-7 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/80 hover:shadow-card"
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
        <span className="flex items-center gap-1.5">
          <BookOpen size={15} /> {p.readingTime}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={15} /> {p.views}
        </span>
      </div>
    </Link>
  );
}
