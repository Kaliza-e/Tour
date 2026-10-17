"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  FlaskConical,
  Globe,
  LayoutGrid,
  Menu,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Review = {
  id: string;
  decision: "APPROVE" | "REQUEST_REVISION" | "REJECT";
  feedback: string | null;
  createdAt: string;
  reviewer?: { name: string; email: string } | null;
};

type Submission = {
  id: string;
  submissionId: string;
  title: string;
  abstract: string;
  category: string;
  researchType: string;
  keywords: string[];
  description: string | null;
  methodology: string | null;
  references: string | null;
  supportingLinks: string[];
  fileName: string | null;
  fileUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  authors: { fullName: string; email: string; institution: string | null; bio: string | null }[];
  reviews: Review[];
  user: { id: string; name: string; email: string };
  assignedReviewer: { id: string; name: string; email: string } | null;
  publication: { id: string } | null;
};

type Reviewer = { id: string; name: string; email: string };

// ---------------------------------------------------------------------------
// TOUR Brand Helpers & Status Styles
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  REVISION_REQUESTED: "Needs Revision",
  RESUBMITTED: "Resubmitted",
  APPROVED: "Approved",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  SUBMITTED: "bg-sapphire/10 text-sapphire border-sapphire/20",
  UNDER_REVIEW: "bg-champagne/60 text-navy border-taupe/40",
  REVISION_REQUESTED: "bg-rose-50 text-rose-700 border-rose-200",
  RESUBMITTED: "bg-sapphire/15 text-sapphire border-sapphire/30",
  APPROVED: "bg-sapphire/20 text-navy font-semibold border-sapphire/30",
  PUBLISHED: "bg-navy text-ivory border-navy",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const DECISION_LABELS: Record<string, string> = {
  APPROVE: "Approve",
  REQUEST_REVISION: "Request Revision",
  REJECT: "Reject",
};

function fmt(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Review form state
  const [decision, setDecision] = useState<"APPROVE" | "REQUEST_REVISION" | "REJECT">("REQUEST_REVISION");
  const [feedback, setFeedback] = useState("");
  const [reviewerId, setReviewerId] = useState("");

  // Publish form state
  const [pubForm, setPubForm] = useState({
    title: "",
    category: "",
    summary: "",
    coverImage: "",
    authorBio: "",
    date: "",
  });

  const drawerRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------

  const loadAll = async () => {
    setLoading(true);
    try {
      const [subRes, revRes] = await Promise.all([
        fetch("/api/admin/submissions", { cache: "no-store" }),
        fetch("/api/admin/reviewers", { cache: "no-store" }),
      ]);
      if (subRes.ok) {
        const data = (await subRes.json()) as Submission[];
        setSubmissions(data);
        setSelected((cur) => (cur ? data.find((s) => s.id === cur.id) ?? null : null));
      }
      if (revRes.ok) setReviewers((await revRes.json()) as Reviewer[]);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const counts = useMemo(
    () =>
      submissions.reduce<Record<string, number>>((acc, s) => {
        acc[s.status] = (acc[s.status] ?? 0) + 1;
        return acc;
      }, {}),
    [submissions]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.submissionId.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.user.name.toLowerCase().includes(q) ||
        s.user.email.toLowerCase().includes(q)
      );
    });
  }, [submissions, query, statusFilter]);

  // Spotlight submission: either the first pending review or the most recent submission
  const spotlightSubmission = useMemo(() => {
    const pending = submissions.find((s) => ["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED"].includes(s.status));
    return pending || submissions[0] || null;
  }, [submissions]);

  // Calculate stats for pipeline and metric cards
  const stats = useMemo(() => {
    const total = submissions.length;
    const underReview = (counts.UNDER_REVIEW ?? 0) + (counts.SUBMITTED ?? 0) + (counts.RESUBMITTED ?? 0);
    const revisions = counts.REVISION_REQUESTED ?? 0;
    const published = counts.PUBLISHED ?? 0;
    const approved = counts.APPROVED ?? 0;

    // Segment widths (percentages)
    const publishedPct = total > 0 ? Math.max(6, (published / total) * 100) : 0;
    const approvedPct = total > 0 ? Math.max(6, (approved / total) * 100) : 0;
    const underReviewPct = total > 0 ? Math.max(6, (underReview / total) * 100) : 0;
    const revisionsPct = total > 0 ? Math.max(6, (revisions / total) * 100) : 0;

    // Approval rate
    const reviewedCount = approved + published + revisions + (counts.REJECTED ?? 0);
    const acceptanceRate =
      reviewedCount > 0 ? Math.round(((approved + published) / reviewedCount) * 100) : 85;

    return {
      total,
      underReview,
      revisions,
      published,
      approved,
      publishedPct,
      approvedPct,
      underReviewPct,
      revisionsPct,
      acceptanceRate,
    };
  }, [submissions, counts]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const flash = (text: string, ok = true) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 5000);
  };

  const openDrawer = (s: Submission) => {
    setSelected(s);
    setDecision("REQUEST_REVISION");
    setFeedback("");
    setReviewerId(s.assignedReviewer?.id ?? "");
    setPubForm({
      title: s.publication ? "" : "",
      category: "",
      summary: "",
      coverImage: "",
      authorBio: s.authors[0]?.bio ?? "",
      date: new Date().toISOString().slice(0, 10),
    });
    setTimeout(() => drawerRef.current?.focus(), 50);
  };

  const closeDrawer = () => setSelected(null);

  const saveReview = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: selected.id, decision, feedback }),
    });
    const data = (await res.json()) as { error?: string };
    if (res.ok) {
      flash("Review saved successfully.");
      setFeedback("");
      await loadAll();
    } else {
      flash(data.error ?? "Unable to save review.", false);
    }
    setSaving(false);
  };

  const assignReviewer = async () => {
    if (!selected || !reviewerId) return;
    setSaving(true);
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: selected.id, action: "ASSIGN", reviewerId }),
    });
    const data = (await res.json()) as { error?: string };
    if (res.ok) {
      flash("Reviewer assigned.");
      await loadAll();
    } else {
      flash(data.error ?? "Unable to assign reviewer.", false);
    }
    setSaving(false);
  };

  const publishSubmission = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: selected.id,
        action: "PUBLISH",
        publicationTitle: pubForm.title,
        publicationCategory: pubForm.category,
        publicationSummary: pubForm.summary,
        publicationCoverImage: pubForm.coverImage,
        publicationAuthorBio: pubForm.authorBio,
        publicationDate: pubForm.date,
      }),
    });
    const data = (await res.json()) as { error?: string; publication?: { id: string } };
    if (res.ok) {
      flash("Published! The article is now live in Research & Publications.");
      await loadAll();
    } else {
      flash(data.error ?? "Unable to publish.", false);
    }
    setSaving(false);
  };

  const deleteSubmission = async () => {
    if (!selected) return;
    if (
      !window.confirm(
        `Permanently delete "${selected.title}"?\n\nThis removes all reviews, versions, and the uploaded file.`
      )
    )
      return;
    setSaving(true);
    const res = await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: selected.id }),
    });
    const data = (await res.json()) as { error?: string };
    if (res.ok) {
      flash("Submission deleted.");
      setSelected(null);
      await loadAll();
    } else {
      flash(data.error ?? "Unable to delete submission.", false);
    }
    setSaving(false);
  };

  // ---------------------------------------------------------------------------
  // Render (Image 2 CoachPro Layout with TOUR Navy/Ivory/Sapphire/Champagne Brand)
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#EBF1F5] p-3 sm:p-5 lg:p-7 flex items-center justify-center font-sans antialiased text-navy">
      {/* ── Floating Main Dashboard Shell (Imitating Image 2 with TOUR Branding) ── */}
      <div className="w-full max-w-[1540px] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_24px_70px_rgba(17,34,80,0.07)] border border-navy/10 overflow-hidden flex flex-col lg:flex-row min-h-[920px]">
        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Left Sidebar (Image 2 style in TOUR Navy & Sapphire)               */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-60 xl:w-64 border-b lg:border-b-0 lg:border-r border-navy/10 bg-ivory/30 lg:bg-transparent p-5 sm:p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Top Brand / Logo */}
            <div className="flex items-center justify-between lg:justify-start gap-3 mb-8">
              <Link href="/admin/submissions" className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-champagne font-extrabold text-lg shadow-sm">
                  T
                </div>
                <span className="font-heading text-xl font-bold tracking-tight text-navy">
                  TOUR Admin
                </span>
              </Link>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white text-navy hover:bg-ivory border border-navy/10 transition"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {/* Navigation Menu (Navy Active Pill) */}
            <nav className={`space-y-1.5 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}>
              {/* Active Tab: Dashboard */}
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className="w-full bg-navy text-white font-semibold rounded-2xl px-4 py-3 shadow-[0_4px_16px_rgba(17,34,80,0.25)] flex items-center gap-3 transition text-sm cursor-pointer"
              >
                <LayoutGrid className="h-4 w-4 text-champagne" />
                <span>Dashboard</span>
              </button>

              {/* Submissions Queue */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("SUBMITTED");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center justify-between text-sm font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-sapphire" />
                  <span>Submissions</span>
                </div>
                {submissions.length > 0 && (
                  <span className="rounded-full bg-champagne/70 border border-taupe/30 px-2 py-0.5 text-[11px] font-bold text-navy">
                    {submissions.length}
                  </span>
                )}
              </button>

              {/* Manage Users */}
              <Link
                href="/admin/users"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <Users className="h-4 w-4 text-sapphire" />
                <span>Manage Users</span>
              </Link>

              {/* Question Hub */}
              <Link
                href="/questions"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <MessageSquare className="h-4 w-4 text-sapphire" />
                <span>Question Hub</span>
              </Link>

              {/* Publications */}
              <Link
                href="/publications"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <BookOpen className="h-4 w-4 text-sapphire" />
                <span>Publications</span>
              </Link>

              {/* Researcher Mode */}
              <Link
                href="/researcher"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <FlaskConical className="h-4 w-4 text-sapphire" />
                <span>Researcher Mode</span>
              </Link>

              {/* Back to site */}
              <Link
                href="/"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 text-sapphire" />
                <span>Back to Site</span>
              </Link>
            </nav>
          </div>

          {/* Bottom user profile in sidebar */}
          <div className="mt-8 pt-4 border-t border-navy/10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sapphire/15 text-navy font-bold text-xs grid place-items-center shrink-0 border border-sapphire/20">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-navy truncate">TOUR Admin</p>
              <p className="text-[10px] text-navy/55 truncate">admin@tour.dev</p>
            </div>
          </div>
        </aside>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Main Dashboard Canvas                                              */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <main className="flex-1 p-5 sm:p-7 lg:p-9 flex flex-col justify-between overflow-x-hidden">
          <div>
            {/* ── Top Header Bar (Image 2 style) ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
              <div>
                <p className="text-xs sm:text-sm font-medium text-sapphire flex items-center gap-1.5">
                  Welcome back, Admin 👋
                </p>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-0.5">
                  Dashboard
                </h1>
              </div>

              {/* Right Header Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search trigger pill */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-navy/40" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search submissions…"
                    className="h-10 w-36 sm:w-56 rounded-full border border-navy/15 bg-white pl-9 pr-4 text-xs font-medium text-navy placeholder:text-navy/40 focus:border-sapphire focus:outline-none focus:ring-2 focus:ring-sapphire/20 transition"
                  />
                </div>

                {/* Refresh button */}
                <button
                  type="button"
                  onClick={() => void loadAll()}
                  title="Refresh data"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy/70 hover:text-navy hover:bg-ivory border border-navy/15 transition shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-sapphire" : ""}`} />
                </button>

                {/* Profile Pill */}
                <div className="flex items-center gap-2.5 rounded-full bg-white border border-navy/15 px-3 py-1.5 shadow-xs">
                  <div className="h-7 w-7 rounded-full bg-navy text-champagne text-[10px] font-bold grid place-items-center">
                    TA
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-navy">
                    TOUR Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Flash Message Banner */}
            {message && (
              <div
                className={`mb-6 flex items-center justify-between rounded-2xl border px-4 py-3 text-xs sm:text-sm font-semibold transition ${
                  message.ok
                    ? "border-sapphire/30 bg-sapphire/10 text-navy"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <span>{message.text}</span>
                <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── Content Grid (Exact Imitation of Image 2) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6">
              {/* ──────────────────────────────────────────────────────────── */}
              {/* Left Column (58-60% width on desktop)                         */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-7 flex flex-col gap-5 xl:gap-6">
                {/* 1. TOP-LEFT CARD: "Next game" Equivalent -> Spotlight Submission Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-navy">
                      Next in Review Queue
                    </span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("ALL")}
                      className="text-xs font-semibold text-sapphire hover:underline cursor-pointer"
                    >
                      View all queue
                    </button>
                  </div>

                  {spotlightSubmission ? (
                    <div>
                      {/* Subtitle with date and status */}
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-navy/60 mb-4">
                        <Clock className="h-3 w-3 text-sapphire" />
                        <span>
                          Priority Review • Submitted {fmt(spotlightSubmission.submittedAt || spotlightSubmission.createdAt)}
                        </span>
                      </div>

                      {/* The Matchup / Versus Nodes (Imitating Juventus vs Sassuolo in Image 2) */}
                      <div className="flex items-center justify-around py-3 px-2 rounded-2xl bg-ivory/60 border border-navy/10">
                        {/* Left Node: Author */}
                        <div className="flex flex-col items-center text-center gap-2 max-w-[130px]">
                          <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-navy/15 grid place-items-center text-sm font-bold text-navy">
                            {spotlightSubmission.authors[0]?.fullName?.slice(0, 2).toUpperCase() ||
                              spotlightSubmission.user.name?.slice(0, 2).toUpperCase() ||
                              "AU"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy truncate w-28">
                              {spotlightSubmission.authors[0]?.fullName || spotlightSubmission.user.name}
                            </p>
                            <p className="text-[10px] text-navy/55 truncate w-28">
                              {spotlightSubmission.user.email}
                            </p>
                          </div>
                        </div>

                        {/* Center VS / Status Badge */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-champagne text-navy font-black text-xs shadow-xs border border-taupe/30">
                            VS
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                            Peer Review
                          </span>
                        </div>

                        {/* Right Node: Research Topic & Title */}
                        <div className="flex flex-col items-center text-center gap-2 max-w-[150px]">
                          <div className="h-12 w-12 rounded-full bg-sapphire/15 shadow-sm border border-sapphire/25 grid place-items-center text-sm font-bold text-navy">
                            <BookOpen className="h-5 w-5 text-sapphire" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy truncate w-32">
                              {spotlightSubmission.title}
                            </p>
                            <span className="inline-block mt-0.5 rounded-full bg-sapphire/10 border border-sapphire/20 px-2 py-0.5 text-[9px] font-bold text-sapphire">
                              {spotlightSubmission.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick action button */}
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => openDrawer(spotlightSubmission)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-sapphire transition shadow-xs cursor-pointer"
                        >
                          <span>Review Submission Desk</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-navy/60">
                      No active submissions in queue.
                    </div>
                  )}
                </div>

                {/* 2. BOTTOM-LEFT CARD: "Standings" Equivalent -> Clean Table Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <span className="text-xs font-bold text-navy">
                      Submissions Queue
                    </span>

                    {/* Status filter pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "PUBLISHED"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                            statusFilter === st
                              ? "bg-navy text-white"
                              : "bg-ivory text-navy/70 hover:bg-navy/5 border border-navy/10"
                          }`}
                        >
                          {st === "ALL" ? "All" : STATUS_LABELS[st] || st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clean Modern Table (Image 2 style in TOUR Brand) */}
                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                    {loading ? (
                      <div className="py-12 text-center text-xs text-navy/60">
                        <RefreshCw className="mx-auto h-5 w-5 animate-spin text-sapphire mb-2" />
                        Loading submissions queue…
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="py-12 text-center text-xs text-navy/60">
                        No submissions matching current filter.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-navy/10 text-[10px] font-bold uppercase tracking-wider text-navy/60">
                            <th className="pb-3 pl-2">#</th>
                            <th className="pb-3">Submission</th>
                            <th className="pb-3 hidden sm:table-cell">Author</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 hidden md:table-cell">Reviewer</th>
                            <th className="pb-3 text-right pr-2">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                          {filtered.map((s, idx) => (
                            <tr
                              key={s.id}
                              onClick={() => openDrawer(s)}
                              className="group hover:bg-ivory/50 transition cursor-pointer"
                            >
                              {/* Row Index */}
                              <td className="py-3.5 pl-2 font-bold text-navy/50">
                                {idx + 1}
                              </td>

                              {/* Title & Topic */}
                              <td className="py-3.5 pr-3 max-w-[200px]">
                                <p className="font-bold text-navy truncate group-hover:text-sapphire transition">
                                  {s.title}
                                </p>
                                <span className="text-[10px] text-navy/60">
                                  {s.category}
                                </span>
                              </td>

                              {/* Author */}
                              <td className="py-3.5 pr-3 hidden sm:table-cell">
                                <p className="font-semibold text-navy">
                                  {s.authors[0]?.fullName || s.user.name}
                                </p>
                                <p className="text-[10px] text-navy/50 truncate max-w-[130px]">
                                  {s.user.email}
                                </p>
                              </td>

                              {/* Status Badge */}
                              <td className="py-3.5 pr-3">
                                <span
                                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                    STATUS_STYLES[s.status] ?? STATUS_STYLES.DRAFT
                                  }`}
                                >
                                  {STATUS_LABELS[s.status] ?? s.status}
                                </span>
                              </td>

                              {/* Assigned Reviewer */}
                              <td className="py-3.5 pr-3 text-[11px] hidden md:table-cell text-navy/70">
                                {s.assignedReviewer?.name ?? (
                                  <span className="italic text-navy/40">Unassigned</span>
                                )}
                              </td>

                              {/* Action Button */}
                              <td className="py-3.5 text-right pr-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(s);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-[11px] font-semibold text-white hover:bg-sapphire transition cursor-pointer"
                                >
                                  <span>{s.status === "PUBLISHED" ? "View" : "Review"}</span>
                                  <ArrowUpRight className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* Right Column (40-42% width on desktop)                        */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-5 flex flex-col gap-5 xl:gap-6">
                {/* 3. TOP-RIGHT CARD: "Games statistic" Equivalent -> Editorial Pipeline Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-navy">
                      Editorial Pipeline
                    </span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("ALL")}
                      className="text-xs font-semibold text-sapphire hover:underline cursor-pointer"
                    >
                      View all statistic
                    </button>
                  </div>

                  {/* Horizontal Segmented Progress Bar (TOUR Palette) */}
                  <div className="h-3 rounded-full overflow-hidden flex bg-ivory mb-4 border border-navy/10">
                    {/* Published (TOUR Navy) */}
                    <div
                      style={{ width: `${stats.publishedPct}%` }}
                      className="h-full bg-navy transition-all duration-500"
                      title={`Published: ${stats.published}`}
                    />
                    {/* Approved (TOUR Sapphire) */}
                    <div
                      style={{ width: `${stats.approvedPct}%` }}
                      className="h-full bg-sapphire transition-all duration-500"
                      title={`Approved: ${stats.approved}`}
                    />
                    {/* In Review (TOUR Champagne) */}
                    <div
                      style={{ width: `${stats.underReviewPct}%` }}
                      className="h-full bg-champagne border-r border-taupe/30 transition-all duration-500"
                      title={`In Review: ${stats.underReview}`}
                    />
                    {/* Revisions (Soft Coral/Rose) */}
                    <div
                      style={{ width: `${stats.revisionsPct}%` }}
                      className="h-full bg-rose-400 transition-all duration-500"
                      title={`Revisions: ${stats.revisions}`}
                    />
                  </div>

                  {/* 4 Stat Columns (Exact Image 2 PL 8 | VICTORIES 6 | DRAWS 1 | LOST 1) */}
                  <div className="grid grid-cols-4 text-center divide-x divide-navy/10 pt-1">
                    <button
                      type="button"
                      onClick={() => setStatusFilter("ALL")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Total
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-navy">
                        {stats.total}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusFilter("UNDER_REVIEW")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Review
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-sapphire">
                        {stats.underReview}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusFilter("REVISION_REQUESTED")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Revis.
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-rose-600">
                        {stats.revisions}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusFilter("PUBLISHED")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Publ.
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-navy">
                        {stats.published}
                      </p>
                    </button>
                  </div>
                </div>

                {/* 4. 2x2 METRIC CARDS (TOUR Color Palette) */}
                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                  {/* Card 1: Sapphire Accent (Queue Pending) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sapphire/10 text-sapphire border border-sapphire/20">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          Queue Pending
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {(counts.SUBMITTED ?? 0) + (counts.UNDER_REVIEW ?? 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Navy/Champagne Accent (Published Live) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-navy text-champagne">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          Published
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {counts.PUBLISHED ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Champagne Accent (Active Reviewers) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-champagne/70 text-navy border border-taupe/30">
                        <Users className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          Reviewers
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {reviewers.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Sapphire Accent (Acceptance Rate) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sapphire/15 text-sapphire border border-sapphire/20">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          Acceptance
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {stats.acceptanceRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. BOTTOM-RIGHT CALLOUT BANNER (TOUR Navy & Sapphire Gradient) */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-[#1b3470] to-sapphire p-5 sm:p-6 text-white shadow-md border border-navy/20">
                  {/* Subtle champagne light accents */}
                  <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-champagne/15 blur-xl" />
                  <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full bg-sapphire/30 blur-lg" />

                  <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-champagne">
                      Editorial Excellence
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-extrabold leading-snug text-white mt-1 max-w-[260px]">
                      Review &amp; Publish Peer Quality Research
                    </h3>
                    <div className="mt-4">
                      <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy shadow-sm hover:bg-ivory transition"
                      >
                        <span>Manage Users &amp; Roles</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Review / Detail Drawer (Slides in from Right)                       */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close drawer"
            className="flex-1 bg-navy/40 backdrop-blur-sm cursor-pointer"
            onClick={closeDrawer}
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            tabIndex={-1}
            className="relative flex w-full max-w-2xl flex-col overflow-y-auto bg-white border-l border-navy/15 shadow-2xl outline-none"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy/10 bg-white/95 backdrop-blur-md px-7 py-5">
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-sapphire">
                  {selected.submissionId}
                </span>
                <h2 className="mt-1 font-heading text-xl font-bold text-navy leading-snug">
                  {selected.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      STATUS_STYLES[selected.status] ?? STATUS_STYLES.DRAFT
                    }`}
                  >
                    {STATUS_LABELS[selected.status] ?? selected.status}
                  </span>
                  <span className="text-xs text-navy/60">{selected.category}</span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={closeDrawer}
                className="shrink-0 rounded-full p-2 text-navy/40 hover:bg-ivory hover:text-navy transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-6 px-7 py-6">
              {/* Submission details */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/60">
                  Submission Details
                </h3>
                <dl className="space-y-2 rounded-2xl border border-navy/10 bg-ivory/60 p-4 text-xs sm:text-sm">
                  {[
                    ["Author", selected.authors.map((a) => a.fullName).join(", ") || selected.user.name],
                    ["Email", selected.user.email],
                    ["Institution", selected.authors[0]?.institution ?? "—"],
                    ["Research type", selected.researchType.replace(/_/g, " ")],
                    ["Keywords", selected.keywords.join(", ") || "—"],
                    ["Submitted", fmt(selected.submittedAt)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3">
                      <dt className="w-32 shrink-0 font-semibold text-navy">{label}</dt>
                      <dd className="text-navy/70">{value}</dd>
                    </div>
                  ))}
                  {selected.fileUrl && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 font-semibold text-navy">Document</dt>
                      <dd>
                        <a
                          href={selected.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-sapphire hover:underline"
                        >
                          {selected.fileName ?? "Open file"} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* Abstract */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/60">
                  Abstract / Summary
                </h3>
                <p className="rounded-2xl border border-navy/10 bg-ivory/60 p-4 text-xs sm:text-sm leading-relaxed text-navy/80">
                  {selected.abstract}
                </p>
              </section>

              {/* Supporting links */}
              {selected.supportingLinks.length > 0 && (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/60">
                    Supporting Links
                  </h3>
                  <ul className="space-y-1 text-xs">
                    {selected.supportingLinks.map((link) => (
                      <li key={link}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sapphire hover:underline break-all"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Review history */}
              {selected.reviews.length > 0 && (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/60">
                    Review History ({selected.reviews.length})
                  </h3>
                  <div className="space-y-3">
                    {selected.reviews.map((r, i) => (
                      <div
                        key={r.id}
                        className="rounded-2xl border border-navy/10 bg-ivory/60 p-4 text-xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-sapphire" />
                            <span className="font-semibold text-navy">
                              {i === 0 ? "Latest Review" : `Review #${selected.reviews.length - i}`}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                r.decision === "APPROVE"
                                  ? "bg-sapphire/20 text-navy font-bold"
                                  : r.decision === "REJECT"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-champagne text-navy border border-taupe/30"
                              }`}
                            >
                              {DECISION_LABELS[r.decision]}
                            </span>
                          </div>
                          <span className="text-[10px] text-navy/50">{fmt(r.createdAt)}</span>
                        </div>
                        {r.reviewer && (
                          <p className="mt-1 text-[11px] text-navy/60">by {r.reviewer.name}</p>
                        )}
                        {r.feedback && (
                          <p className="mt-2 text-navy/80 leading-relaxed">{r.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Assign reviewer */}
              {reviewers.length > 0 && selected.status !== "PUBLISHED" && (
                <section className="rounded-2xl border border-navy/10 bg-ivory/60 p-4">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/60">
                    Assign Reviewer
                  </h3>
                  <div className="flex gap-2">
                    <label className="relative flex-1">
                      <select
                        value={reviewerId}
                        onChange={(e) => setReviewerId(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-navy/15 bg-white px-3 py-2 pr-8 text-xs font-medium text-navy outline-none focus:border-sapphire"
                      >
                        <option value="">Choose a reviewer</option>
                        {reviewers.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.email})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                    </label>
                    <button
                      type="button"
                      onClick={() => void assignReviewer()}
                      disabled={saving || !reviewerId}
                      className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-sapphire transition disabled:opacity-50 cursor-pointer"
                    >
                      Assign
                    </button>
                  </div>
                  {selected.assignedReviewer && (
                    <p className="mt-2 text-[11px] text-navy/60">
                      Currently assigned: <strong>{selected.assignedReviewer.name}</strong>
                    </p>
                  )}
                </section>
              )}

              {/* Review Decision Form */}
              {selected.status !== "PUBLISHED" && selected.status !== "REJECTED" && (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/60">
                    Review Decision &amp; Feedback
                  </h3>
                  <div className="space-y-4 rounded-2xl border border-navy/10 bg-ivory/60 p-4">
                    {/* Decision buttons */}
                    <div className="flex flex-wrap gap-2">
                      {(["APPROVE", "REQUEST_REVISION", "REJECT"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDecision(d)}
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                            decision === d
                              ? d === "APPROVE"
                                ? "bg-navy text-white shadow-xs"
                                : d === "REJECT"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "bg-navy text-white shadow-xs"
                              : "border border-navy/15 bg-white text-navy hover:bg-ivory"
                          }`}
                        >
                          {DECISION_LABELS[d]}
                        </button>
                      ))}
                    </div>

                    {/* Feedback textarea */}
                    <label className="block text-xs font-semibold text-navy">
                      Feedback{decision === "REQUEST_REVISION" && <span className="text-rose-600"> *</span>}
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                        placeholder={
                          decision === "REQUEST_REVISION"
                            ? "Thank you for your submission. Please expand the methodology section and clarify the analysis…"
                            : decision === "APPROVE"
                            ? "Add congratulations or notes for the author before publishing…"
                            : "Provide a constructive explanation of why the paper was not accepted…"
                        }
                        className="mt-1.5 w-full rounded-xl border border-navy/15 bg-white px-3 py-2.5 text-xs text-navy leading-relaxed outline-none focus:border-sapphire"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => void saveReview()}
                      disabled={saving || (decision === "REQUEST_REVISION" && !feedback.trim())}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-sapphire transition disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? "Saving Review…" : "Submit Review Decision"}
                    </button>
                  </div>
                </section>
              )}

              {/* Publish to TOUR section (when APPROVED) */}
              {selected.status === "APPROVED" && (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-sapphire">
                    Publish to TOUR
                  </h3>
                  <div className="space-y-3 rounded-2xl border border-sapphire/20 bg-sapphire/5 p-4 text-xs">
                    <p className="text-navy/70">
                      Review approved! Fill out final metadata below to publish to Research &amp; Publications.
                    </p>
                    {[
                      { key: "title", label: "Publication Title", placeholder: "Defaults to submission title" },
                      { key: "category", label: "Category", placeholder: "e.g. Biology, Technology, Environment" },
                      { key: "summary", label: "Summary / Executive Abstract", placeholder: "Brief description for card listings" },
                      { key: "coverImage", label: "Cover Image URL", placeholder: "https://…" },
                      { key: "authorBio", label: "Author Biography", placeholder: "Short background on author" },
                      { key: "date", label: "Publication Date", placeholder: "YYYY-MM-DD" },
                    ].map(({ key, label, placeholder }) => (
                      <label key={key} className="block font-semibold text-navy">
                        {label}
                        {key === "summary" ? (
                          <textarea
                            value={pubForm[key as keyof typeof pubForm]}
                            onChange={(e) => setPubForm({ ...pubForm, [key]: e.target.value })}
                            rows={3}
                            placeholder={placeholder}
                            className="mt-1 w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-xs text-navy outline-none focus:border-sapphire"
                          />
                        ) : (
                          <input
                            type={key === "date" ? "date" : "text"}
                            value={pubForm[key as keyof typeof pubForm]}
                            onChange={(e) => setPubForm({ ...pubForm, [key]: e.target.value })}
                            placeholder={placeholder}
                            className="mt-1 w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-xs text-navy outline-none focus:border-sapphire"
                          />
                        )}
                      </label>
                    ))}

                    <button
                      type="button"
                      onClick={() => void publishSubmission()}
                      disabled={saving}
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sapphire px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-navy transition disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? "Publishing to TOUR…" : "Publish Live to TOUR"}
                    </button>
                  </div>
                </section>
              )}

              {/* Published view link */}
              {selected.status === "PUBLISHED" && selected.publication && (
                <section className="rounded-2xl border border-navy/15 bg-champagne/40 p-4 text-xs">
                  <p className="font-semibold text-navy">
                    This research paper is published live!
                  </p>
                  <Link
                    href={`/publications/${selected.publication.id}`}
                    target="_blank"
                    className="mt-2 inline-flex items-center gap-1.5 font-bold text-sapphire hover:underline"
                  >
                    View Live Article <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </section>
              )}

              {/* Danger Zone: Delete */}
              <section className="border-t border-navy/10 pt-4">
                <button
                  type="button"
                  onClick={() => void deleteSubmission()}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Submission Permanently</span>
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
