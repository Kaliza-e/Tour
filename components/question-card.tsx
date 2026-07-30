import Link from "next/link";
import { Heart, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="group flex flex-col rounded-card border border-navy/8 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
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
          <Heart size={15} /> {q.likes}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={15} /> {q.interestedResearchers}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={15} /> {q.views}
        </span>
      </div>

      <div className="mt-6">
        <Link href={`/questions/${q.id}`}>
          <Button variant="secondary" size="sm" className="w-full">
            I'd Like to Research This
          </Button>
        </Link>
      </div>
    </div>
  );
}
