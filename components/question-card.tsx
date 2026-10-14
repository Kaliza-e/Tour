import Link from "next/link";
import { FlaticonHeart, FlaticonUsers, FlaticonEye, FlaticonCheckCircle } from "@/components/flaticons";
import { Users } from "lucide-react";

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-100 text-emerald-800 border-emerald-300",
  BEING_RESEARCHED: "bg-amber-100 text-amber-900 border-amber-300",
  FULL: "bg-rose-100 text-rose-800 border-rose-300",
  RESEARCH_COMPLETED: "bg-navy/10 text-navy border-navy/20",
  ANSWERED: "bg-navy text-ivory",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  BEING_RESEARCHED: "In Progress",
  FULL: "Full",
  RESEARCH_COMPLETED: "Research Completed",
  ANSWERED: "Answered",
};

export interface QuestionCardProps {
  id: string;
  title: string;
  category: string;
  askedBy?: string | null;
  interestedResearchers?: number;
  likes?: number;
  views?: number;
  status?: string;
  spotsLeft?: number;
  spotsIndicator?: string;
  isFull?: boolean;
  isClaimedByCurrentUser?: boolean;
  isAuthenticated?: boolean;
}

export function QuestionCard(q: QuestionCardProps) {
  const currentStatus = q.status && statusLabels[q.status] ? q.status : "OPEN";
  const hasStats = Boolean((q.likes && q.likes > 0) || (q.interestedResearchers && q.interestedResearchers > 0) || (q.views && q.views > 0));

  // Determine button target & label
  const targetUrl = q.isAuthenticated
    ? `/questions/${q.id}`
    : `/login?callbackUrl=/questions/${q.id}`;

  const spotsText = q.spotsIndicator || (q.spotsLeft !== undefined ? (q.spotsLeft === 0 ? "Full" : `${q.spotsLeft} of 3 spots left`) : null);

  return (
    <div className="group flex flex-col justify-between rounded-3xl border-2 border-navy/15 bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy/40 shadow-sm h-full overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 min-h-[32px]">
          <span 
            className="rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-navy/70 border border-navy/10 truncate max-w-[140px] sm:max-w-[170px]"
            title={q.category}
          >
            {q.category}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {spotsText && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                q.isFull || spotsText === "Full"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-sapphire/5 text-sapphire border-sapphire/20"
              }`}>
                <Users size={11} className="shrink-0" />
                <span>{spotsText}</span>
              </span>
            )}
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold border ${statusStyles[currentStatus] || statusStyles.OPEN}`}>
              {statusLabels[currentStatus] || "Open"}
            </span>
          </div>
        </div>

        <Link href={`/questions/${q.id}`} className="block">
          <h3 className="mt-3.5 font-heading text-lg sm:text-xl font-bold leading-snug text-navy group-hover:text-sapphire transition-colors line-clamp-3 min-h-[4rem]">
            {q.title}
          </h3>
        </Link>

        {q.askedBy && (
          <p className="mt-2 text-xs font-medium text-navy/55">
            Asked by <span className="font-semibold text-navy/80">{q.askedBy}</span>
          </p>
        )}

        {/* Real Stats Only - hidden when 0 or undefined */}
        {hasStats && (
          <div className="mt-5 flex items-center gap-5 text-xs text-navy/50 border-t border-navy/10 pt-3">
            {Boolean(q.likes && q.likes > 0) && (
              <span className="flex items-center gap-1.5">
                <FlaticonHeart size={14} /> {q.likes}
              </span>
            )}
            {Boolean(q.interestedResearchers && q.interestedResearchers > 0) && (
              <span className="flex items-center gap-1.5">
                <FlaticonUsers size={14} /> {q.interestedResearchers}
              </span>
            )}
            {Boolean(q.views && q.views > 0) && (
              <span className="flex items-center gap-1.5">
                <FlaticonEye size={14} /> {q.views}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        {q.isClaimedByCurrentUser ? (
          <Link
            href="/researcher"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 border-emerald-500 bg-emerald-50 px-5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
          >
            <FlaticonCheckCircle size={14} />
            <span>In Your Notebook</span>
          </Link>
        ) : q.isFull ? (
          <Link
            href={`/questions/${q.id}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-full border border-navy/20 bg-ivory/60 px-5 text-xs font-semibold text-navy/70 transition hover:border-navy hover:text-navy"
          >
            <span>Full (View Details)</span>
          </Link>
        ) : (
          <Link 
            href={targetUrl} 
            className="inline-flex h-10 w-full items-center justify-center rounded-full border-2 border-navy bg-navy px-5 text-xs font-bold text-white transition-all hover:bg-sapphire hover:border-sapphire active:scale-[0.99] shadow-sm"
          >
            <span>I&apos;d Like to Research This</span>
          </Link>
        )}
      </div>
    </div>
  );
}
