"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Loader2,
  Lock,
  Send,
} from "lucide-react";

interface Researcher {
  id: string;
  userId: string;
  name: string;
  claimedAt: string;
}

interface SuggestedQuestion {
  id: string;
  title: string;
  category: { name: string };
}

interface QuestionDetail {
  id: string;
  title: string;
  description?: string;
  category: string;
  categoryId: string;
  status: string;
  rawStatus: string;
  asker: string;
  authorId: string;
  tags: string[];
  views: number;
  activeClaimsCount: number;
  spotsLeft: number;
  isFull: boolean;
  spotsIndicator: string;
  isClaimedByCurrentUser: boolean;
  userNotebookId?: string | null;
  researchers: Researcher[];
  suggestedQuestions: SuggestedQuestion[];
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-sapphire/10 text-sapphire border-sapphire/25",
  BEING_RESEARCHED: "bg-champagne/40 text-navy border-taupe/40",
  FULL: "bg-rose-100 text-rose-800 border-rose-300",
  RESEARCH_COMPLETED: "bg-navy/10 text-navy border-navy/20",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open for Research",
  BEING_RESEARCHED: "In Progress",
  FULL: "Full (3 of 3 spots claimed)",
  RESEARCH_COMPLETED: "Research Completed",
};

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;
  const { data: session, status: authStatus } = useSession();
  const isAuthenticated = authStatus === "authenticated";

  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [userActiveClaimsCount, setUserActiveClaimsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  const fetchQuestion = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/questions/${questionId}`);
      if (res.ok) {
        const data = await res.json();
        setQuestion(data.question);
      } else {
        setQuestion(null);
      }

      // If user is logged in, check their active claims count from /api/questions
      if (isAuthenticated) {
        const boardRes = await fetch("/api/questions?limit=1");
        if (boardRes.ok) {
          const boardData = await boardRes.json();
          setUserActiveClaimsCount(boardData.userActiveClaimsCount || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch question details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [questionId, isAuthenticated]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleClaim = async () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/questions/${questionId}`);
      return;
    }

    if (userActiveClaimsCount >= 2 && !question?.isClaimedByCurrentUser) {
      setActionError(
        "You have reached the maximum of 2 active research claims. Complete or release an existing claim to research this question."
      );
      return;
    }

    try {
      setIsClaiming(true);
      setActionError(null);
      const res = await fetch(`/api/questions/${questionId}/claim`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Unable to claim research spot.");
        if (data.suggestedQuestions) {
          setQuestion((prev) =>
            prev ? { ...prev, suggestedQuestions: data.suggestedQuestions } : null
          );
        }
        return;
      }

      setClaimSuccessMessage(
        "You have claimed this question! A research draft has been added to your Research Notebook."
      );
      fetchQuestion();
    } catch (err) {
      setActionError("Network error while claiming spot. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRelease = async () => {
    if (
      !confirm(
        "Are you sure you want to release this research spot? Another student will be able to claim it."
      )
    ) {
      return;
    }

    try {
      setIsReleasing(true);
      setActionError(null);
      const res = await fetch(`/api/questions/${questionId}/release`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Unable to release research spot.");
        return;
      }

      setClaimSuccessMessage(null);
      fetchQuestion();
    } catch (err) {
      setActionError("Network error while releasing spot.");
    } finally {
      setIsReleasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 pt-28 sm:pt-36">
        <div className="container-tour flex flex-col items-center justify-center py-24 text-navy/40">
          <Loader2 size={36} className="animate-spin text-sapphire" />
          <p className="mt-4 text-xs font-semibold tracking-wide">Loading question details...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen pb-20 pt-28 sm:pt-36">
        <div className="container-tour max-w-2xl py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy/40 mb-4">
            <HelpCircle size={28} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-navy">Question Not Found</h1>
          <p className="mt-2 text-xs sm:text-sm text-navy/60">
            This research inquiry does not exist or may have been removed.
          </p>
          <div className="mt-6">
            <Link
              href="/questions"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white hover:bg-sapphire transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Question Hub</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const effectiveStatus = question.status;
  const isUserAtLimit = userActiveClaimsCount >= 2 && !question.isClaimedByCurrentUser;

  return (
    <div className="min-h-screen pb-24 pt-28 sm:pt-36">
      <div className="container-tour">
        {/* BACK BUTTON */}
        <div className="mb-6">
          <Link
            href="/questions"
            className="inline-flex items-center gap-2 text-xs font-bold text-navy/60 hover:text-navy transition group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Question Hub</span>
          </Link>
        </div>

        {/* MAIN QUESTION CARD */}
        <div className="rounded-3xl border-2 border-navy/15 bg-white p-6 sm:p-10 shadow-sm">
          {/* TOP BADGES ROW */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 pb-5">
            <span className="rounded-full bg-ivory px-3.5 py-1 text-xs font-semibold text-navy/70 border border-navy/10">
              {question.category}
            </span>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                  question.isFull
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-sapphire/5 text-sapphire border-sapphire/20"
                }`}
              >
                <Users size={13} className="shrink-0" />
                <span>{question.spotsIndicator}</span>
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold border ${
                  statusStyles[effectiveStatus] || statusStyles.OPEN
                }`}
              >
                {statusLabels[effectiveStatus] || "Open for Research"}
              </span>
            </div>
          </div>

          {/* QUESTION TITLE AS H1 */}
          <h1 className="mt-6 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-navy">
            {question.title}
          </h1>

          {/* ASKER & METADATA */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-navy/60">
            {question.asker && (
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-navy/40" />
                <span>
                  Asked by <strong className="font-semibold text-navy/85">{question.asker}</strong>
                </span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-navy/40" />
              <span>
                {new Date(question.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </span>
          </div>

          {/* CONTEXT / DESCRIPTION */}
          {question.description && (
            <div className="mt-8 rounded-2xl border border-navy/10 bg-ivory/60 p-5 sm:p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sapphire mb-2">
                Research Context & Background
              </h2>
              <p className="text-xs sm:text-sm text-navy/80 leading-relaxed whitespace-pre-line">
                {question.description}
              </p>
            </div>
          )}

          {/* CURRENT RESEARCHERS SECTION */}
          <div className="mt-8 border-t border-navy/10 pt-6">
            <h2 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
              <Users size={18} className="text-sapphire" />
              <span>Active Researchers ({question.activeClaimsCount} of 3 spots claimed)</span>
            </h2>

            {question.researchers.length === 0 ? (
              <p className="mt-2 text-xs sm:text-sm text-navy/60 font-light italic">
                No researchers have claimed this question yet. Be the first to start investigating!
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {question.researchers.map((resItem, idx) => (
                  <div
                    key={resItem.id}
                    className="flex items-center gap-3 rounded-xl border border-navy/15 bg-white p-3 shadow-2xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sapphire/10 text-sapphire font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy">{resItem.name}</p>
                      <p className="text-[10px] text-navy/50">
                        Claimed {new Date(resItem.claimedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUCCESS BANNER */}
          {claimSuccessMessage && (
            <div className="mt-6 rounded-2xl border border-sapphire/30 bg-sapphire/5 p-4 text-xs sm:text-sm text-navy flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-sapphire shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{claimSuccessMessage}</p>
                  <p className="text-xs text-navy/70 mt-1 font-light">
                    You can record your hypotheses, sources, methodology, and progress directly in your notebook.
                  </p>
                </div>
              </div>
              <Link
                href="/researcher"
                className="shrink-0 inline-flex items-center gap-1 rounded-full bg-navy px-4 py-1.5 text-xs font-bold text-white hover:bg-sapphire transition"
              >
                <span>Open Notebook</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {/* ACTION ERROR BANNER */}
          {actionError && (
            <div className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{actionError}</p>
                {isUserAtLimit && (
                  <div className="mt-2">
                    <Link
                      href="/researcher"
                      className="inline-flex items-center gap-1 font-bold text-sapphire hover:underline"
                    >
                      <span>Manage your active claims in the Research Notebook</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CALL TO ACTION BUTTONS */}
          <div className="mt-8 pt-6 border-t border-navy/10 flex flex-wrap items-center gap-4">
            {!isAuthenticated ? (
              <Link
                href={`/login?callbackUrl=/questions/${question.id}`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-navy px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-sapphire hover:border-sapphire transition active:scale-95"
              >
                <Sparkles size={16} />
                <span>Log In to Claim This Question</span>
              </Link>
            ) : question.isClaimedByCurrentUser ? (
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/researcher?action=submit&questionId=${question.id}&questionTitle=${encodeURIComponent(question.title)}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-navy px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sapphire transition shadow-xs"
                >
                  <Send size={15} />
                  <span>Submit for Publication</span>
                </Link>

                <Link
                  href="/researcher"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-sapphire/40 bg-sapphire/10 px-6 py-3 text-xs sm:text-sm font-bold text-navy hover:bg-sapphire/20 transition shadow-xs"
                >
                  <BookOpen size={16} className="text-sapphire" />
                  <span>In Your Notebook</span>
                </Link>

                <button
                  onClick={handleRelease}
                  disabled={isReleasing}
                  className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition disabled:opacity-50 cursor-pointer"
                >
                  {isReleasing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Releasing...</span>
                    </>
                  ) : (
                    <span>Release Claim</span>
                  )}
                </button>
              </div>
            ) : question.isFull ? (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-5 py-3 rounded-full">
                <Lock size={15} />
                <span>All 3 research spots have been claimed.</span>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={isClaiming || isUserAtLimit}
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-navy px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-sapphire hover:border-sapphire disabled:opacity-40 transition active:scale-95 cursor-pointer"
              >
                {isClaiming ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Claiming Research Spot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Claim This Question</span>
                  </>
                )}
              </button>
            )}

            {isUserAtLimit && !question.isClaimedByCurrentUser && (
              <span className="text-xs text-navy/60 italic">
                (Limit of 2 active claims reached)
              </span>
            )}
          </div>
        </div>

        {/* SUGGESTED QUESTIONS IF FULL */}
        {(question.isFull || question.suggestedQuestions?.length > 0) && (
          <div className="mt-12 rounded-3xl border-2 border-navy/15 bg-ivory/70 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-navy mb-2">
              <Sparkles size={18} className="text-sapphire" />
              <h2 className="font-heading text-xl font-bold">
                Suggested Questions to Research
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-navy/60 mb-6 font-light">
              This question currently has all 3 research spots filled. Explore these open questions in related disciplines:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {question.suggestedQuestions.map((sug) => (
                <Link
                  key={sug.id}
                  href={`/questions/${sug.id}`}
                  className="flex flex-col justify-between rounded-2xl border border-navy/15 bg-white p-5 hover:border-sapphire hover:shadow-md transition group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sapphire">
                      {sug.category.name}
                    </span>
                    <h3 className="mt-2 text-xs sm:text-sm font-bold text-navy group-hover:text-sapphire transition line-clamp-3">
                      {sug.title}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-sapphire group-hover:translate-x-0.5 transition-transform">
                    <span>View Question</span>
                    <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
