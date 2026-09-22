import Link from "next/link";
import { FlaticonHeart, FlaticonUsers, FlaticonEye } from "@/components/flaticons";

const statusStyles: Record<string, string> = {
  OPEN: "bg-champagne text-navy",
  BEING_RESEARCHED: "bg-sapphire text-ivory",
  RESEARCH_COMPLETED: "bg-taupe text-navy",
  ANSWERED: "bg-navy text-ivory",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  BEING_RESEARCHED: "Being Researched",
  RESEARCH_COMPLETED: "Research Completed",
  ANSWERED: "Answered",
};

export interface QuestionCardProps {
  id: string;
  title: string;
  category: string;
  askedBy: string;
  interestedResearchers: number;
  likes: number;
  views: number;
  status: keyof typeof statusLabels;
}

export function QuestionCard(q: QuestionCardProps) {
  return (
    <div className="group flex flex-col rounded-card border-2 border-navy/15 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-navy/40">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-pill bg-ivory px-3 py-1 text-xs font-semibold text-navy/70">
          {q.category}
        </span>
        <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${statusStyles[q.status]}`}>
          {statusLabels[q.status]}
        </span>
      </div>

      <Link href={`/questions/${q.id}`}>
        <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-navy group-hover:text-sapphire">
          {q.title}
        </h3>
      </Link>

      <p className="mt-2 text-sm text-navy/50">Asked by {q.askedBy}</p>

      <div className="mt-6 flex items-center gap-5 text-sm text-navy/50">
        <span className="flex items-center gap-1.5">
          <FlaticonHeart size={16} /> {q.likes}
        </span>
        <span className="flex items-center gap-1.5">
          <FlaticonUsers size={16} /> {q.interestedResearchers}
        </span>
        <span className="flex items-center gap-1.5">
          <FlaticonEye size={16} /> {q.views}
        </span>
      </div>

      <div className="mt-6">
        <Link href={`/questions/${q.id}`} className="inline-flex h-10 w-full items-center justify-center rounded-pill border border-navy/20 px-5 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-white">
          I&apos;d Like to Research This
        </Link>
      </div>
    </div>
  );
}
