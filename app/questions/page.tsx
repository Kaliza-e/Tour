"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Search,
  Filter,
  PlusCircle,
  HelpCircle,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  BookOpen,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { QuestionCard } from "@/components/question-card";

interface QuestionItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  categoryId?: string;
  status: string;
  rawStatus?: string;
  askedBy?: string;
  activeClaimsCount: number;
  spotsLeft: number;
  isFull: boolean;
  spotsIndicator: string;
  isClaimedByCurrentUser: boolean;
  researchers?: Array<{ userId: string; name: string }>;
  createdAt: string;
}

interface UserClaim {
  id: string;
  questionId: string;
  questionTitle: string;
  category: string;
  notebookId?: string;
}

const CATEGORIES = [
  "All",
  "Computer Science",
  "Biology",
  "Medicine",
  "Environmental Science",
  "Physics",
  "Psychology",
  "Health & Society",
  "Science & Innovation (STEM)",
];

const STATUS_FILTERS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Open (Spots Available)", value: "OPEN" },
  { label: "In Progress", value: "BEING_RESEARCHED" },
  { label: "Completed", value: "RESEARCH_COMPLETED" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Most Active", value: "active" },
  { label: "Most Spots Left", value: "spots" },
];

function QuestionsBoardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession();
  const isAuthenticated = authStatus === "authenticated";

  // Data states
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [userActiveClaims, setUserActiveClaims] = useState<UserClaim[]>([]);
  const [userActiveClaimsCount, setUserActiveClaimsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("newest");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionCategory, setQuestionCategory] = useState(CATEGORIES[1]);
  const [questionContext, setQuestionContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [duplicateMatch, setDuplicateMatch] = useState<{ id: string; title: string } | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Quick release action state
  const [releasingId, setReleasingId] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
      if (selectedStatus && selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (searchTerm.trim()) params.set("q", searchTerm.trim());
      if (selectedSort) params.set("sort", selectedSort);

      const res = await fetch(`/api/questions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
        setUserActiveClaimsCount(data.userActiveClaimsCount || 0);
        setUserActiveClaims(data.userActiveClaims || []);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchTerm, selectedSort]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Handle URL callback for ask modal
  useEffect(() => {
    if (searchParams?.get("action") === "ask") {
      if (isAuthenticated) {
        setIsModalOpen(true);
      } else if (authStatus === "unauthenticated") {
        router.push("/login?callbackUrl=/questions?action=ask");
      }
    }
  }, [searchParams, isAuthenticated, authStatus, router]);

  const handleOpenAskModal = () => {
    if (!isAuthenticated) {
      router.push("/login?callbackUrl=/questions?action=ask");
      return;
    }
    setQuestionTitle("");
    setQuestionCategory(CATEGORIES[1]);
    setQuestionContext("");
    setModalError(null);
    setDuplicateMatch(null);
    setSubmitSuccess(false);
    setIsModalOpen(true);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setDuplicateMatch(null);

    const trimmedTitle = questionTitle.trim();
    if (trimmedTitle.length < 10 || trimmedTitle.length > 200) {
      setModalError("Question must be between 10 and 200 characters.");
      return;
    }

    if (!trimmedTitle.endsWith("?")) {
      setModalError("Question must end with a question mark ('?').");
      return;
    }

    if (questionContext.trim().length > 500) {
      setModalError("Optional context cannot exceed 500 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          categoryId: questionCategory,
          description: questionContext.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.existingQuestion) {
          setDuplicateMatch(data.existingQuestion);
          setModalError("A similar question already exists on the research board:");
        } else if (res.status === 429) {
          setModalError("You have reached the limit of 3 submitted questions per day. Please check back tomorrow!");
        } else {
          setModalError(data.error || "Failed to submit question. Please try again.");
        }
        return;
      }

      setSubmitSuccess(true);
      fetchQuestions();
    } catch (err) {
      setModalError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRelease = async (questionId: string) => {
    if (!confirm("Are you sure you want to release this research spot? Another student will be able to claim it.")) {
      return;
    }

    try {
      setReleasingId(questionId);
      const res = await fetch(`/api/questions/${questionId}/release`, {
        method: "POST",
      });
      if (res.ok) {
        fetchQuestions();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to release spot.");
      }
    } catch (err) {
      alert("Network error while releasing spot.");
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-28 sm:pt-36">
      <div className="container-tour">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-navy/10 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-sapphire/5 px-3.5 py-1 text-xs font-semibold text-sapphire mb-4">
              <Sparkles size={13} />
              <span>Collaborative Student Inquiry</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-navy">
              Question Board
            </h1>
            <p className="mt-3 text-sm sm:text-base text-navy/70 leading-relaxed font-light">
              Explore authentic student-proposed research inquiries, claim an open investigation for your
              Notebook (up to 3 researchers per question), or post an original question for the community.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAskModal}
              className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-navy px-6 py-3 text-xs sm:text-sm font-bold text-ivory shadow-md transition-all hover:bg-sapphire hover:border-sapphire active:scale-95 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Ask a Question</span>
            </button>
          </div>
        </div>

        {/* ACTIVE CLAIMS BANNER FOR LOGGED-IN USERS */}
        {isAuthenticated && userActiveClaimsCount > 0 && (
          <div className="mt-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/70 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm mt-0.5">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-emerald-950">
                    You have {userActiveClaimsCount} of 2 active research {userActiveClaimsCount === 1 ? "claim" : "claims"}
                  </h3>
                  <p className="text-xs text-emerald-800/80 mt-0.5">
                    Your investigations are draft-ready in your notebook. You can work on them or release your spot.
                  </p>
                </div>
              </div>

              <Link
                href="/researcher"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
              >
                <span>View in Notebook</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* List of active claims with quick release */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-emerald-200/60">
              {userActiveClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-white p-3 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {claim.category}
                    </span>
                    <Link
                      href={`/questions/${claim.questionId}`}
                      className="block truncate text-xs font-semibold text-navy hover:text-sapphire"
                    >
                      {claim.questionTitle}
                    </Link>
                  </div>

                  <button
                    onClick={() => handleQuickRelease(claim.questionId)}
                    disabled={releasingId === claim.questionId}
                    className="shrink-0 text-[11px] font-semibold text-rose-600 hover:text-rose-800 underline disabled:opacity-50 cursor-pointer"
                  >
                    {releasingId === claim.questionId ? "Releasing..." : "Release Spot"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH, FILTER & SORT BAR */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions by keyword, topic, or inquiry..."
                className="w-full rounded-2xl border border-navy/20 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm text-navy placeholder:text-navy/40 focus:border-sapphire focus:outline-none shadow-xs transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-52">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-2xl border border-navy/20 bg-white py-3 px-4 text-xs sm:text-sm font-medium text-navy focus:border-sapphire focus:outline-none shadow-xs transition cursor-pointer"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full rounded-2xl border border-navy/20 bg-white py-3 px-4 text-xs sm:text-sm font-medium text-navy focus:border-sapphire focus:outline-none shadow-xs transition cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-navy/50 mr-1 flex items-center gap-1">
              <Filter size={13} />
              <span>Category:</span>
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-navy text-white shadow-xs"
                      : "bg-white text-navy/70 border border-navy/15 hover:border-navy/40 hover:text-navy"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* QUESTIONS GRID */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-navy/40">
              <Loader2 size={32} className="animate-spin text-sapphire" />
              <p className="mt-3 text-xs font-semibold tracking-wide">Loading research inquiries...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-navy/15 bg-white/60 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy/40 mb-4">
                <HelpCircle size={28} />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy">No Questions Found</h3>
              <p className="mt-1 text-xs sm:text-sm text-navy/60 max-w-md mx-auto">
                No inquiries matched your filter criteria. Try clearing search keywords or selecting another category.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedStatus("ALL");
                  }}
                  className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy hover:bg-navy/5 transition"
                >
                  Reset Filters
                </button>
                <button
                  onClick={handleOpenAskModal}
                  className="rounded-full bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-sapphire transition"
                >
                  Submit a New Question
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  id={q.id}
                  title={q.title}
                  category={q.category}
                  askedBy={q.askedBy}
                  status={q.status}
                  spotsLeft={q.spotsLeft}
                  spotsIndicator={q.spotsIndicator}
                  isFull={q.isFull}
                  isClaimedByCurrentUser={q.isClaimedByCurrentUser}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ASK A QUESTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-navy/20 bg-ivory p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-navy/50 hover:bg-navy/10 hover:text-navy transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {submitSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy">
                  Question Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed max-w-sm mx-auto">
                  Your question has been submitted for review. It will appear on the board once approved by the editorial team.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white hover:bg-sapphire transition"
                >
                  Back to Board
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sapphire">
                    New Inquiry
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    Ask a Research Question
                  </h2>
                  <p className="text-xs text-navy/60 mt-1">
                    Propose a meaningful question for high school and university students to investigate.
                  </p>
                </div>

                {/* Question Input */}
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">
                    Question Text <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="e.g. How does microplastic runoff affect urban coastal fish populations?"
                    maxLength={200}
                    className="w-full rounded-xl border border-navy/20 bg-white p-3 text-xs sm:text-sm text-navy placeholder:text-navy/40 focus:border-sapphire focus:outline-none shadow-xs"
                    required
                  />
                  <div className="flex justify-between items-center text-[10px] text-navy/50 mt-1">
                    <span>Must be 10–200 characters and end with a question mark (?)</span>
                    <span>{questionTitle.length}/200</span>
                  </div>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">
                    Discipline / Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={questionCategory}
                    onChange={(e) => setQuestionCategory(e.target.value)}
                    className="w-full rounded-xl border border-navy/20 bg-white p-3 text-xs sm:text-sm text-navy focus:border-sapphire focus:outline-none shadow-xs cursor-pointer"
                    required
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Context / Background (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">
                    Background Context <span className="text-navy/40 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={questionContext}
                    onChange={(e) => setQuestionContext(e.target.value)}
                    placeholder="Provide any initial hypotheses, context, or specific areas of investigation..."
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-xl border border-navy/20 bg-white p-3 text-xs sm:text-sm text-navy placeholder:text-navy/40 focus:border-sapphire focus:outline-none shadow-xs resize-none"
                  />
                  <div className="text-right text-[10px] text-navy/50 mt-0.5">
                    {questionContext.length}/500
                  </div>
                </div>

                {/* Error Banner */}
                {modalError && (
                  <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                      <span>{modalError}</span>
                    </div>

                    {/* Duplicate match link */}
                    {duplicateMatch && (
                      <div className="pl-6 pt-1">
                        <Link
                          href={`/questions/${duplicateMatch.id}`}
                          onClick={() => setIsModalOpen(false)}
                          className="inline-flex items-center gap-1 font-bold text-sapphire hover:underline"
                        >
                          <span>&ldquo;{duplicateMatch.title}&rdquo;</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-2 border-t border-navy/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy hover:bg-navy/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-2 text-xs font-bold text-white hover:bg-sapphire disabled:opacity-50 transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Question</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestionsBoardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pb-20 pt-28 sm:pt-36">
          <div className="container-tour flex flex-col items-center justify-center py-24 text-navy/40">
            <Loader2 size={32} className="animate-spin text-sapphire" />
            <p className="mt-3 text-xs font-semibold tracking-wide">Loading question board...</p>
          </div>
        </div>
      }
    >
      <QuestionsBoardContent />
    </Suspense>
  );
}
