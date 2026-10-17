"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCode,
  FileSpreadsheet,
  FileText,
  Filter,
  FlaskConical,
  Globe,
  HelpCircle,
  LayoutGrid,
  Menu,
  MessageSquare,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { PublicationSubmissionModal } from "@/components/publication-submission-modal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Review {
  id?: string;
  decision: "APPROVE" | "REQUEST_REVISION" | "REJECT";
  feedback: string | null;
  createdAt: string;
}

interface ResearchItem {
  id: string;
  submissionId: string;
  title: string;
  abstract: string;
  category: string;
  status: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  reviews: Review[];
  publication: { id: string } | null;
  assignedReviewer: { name: string } | null;
  questionId?: string | null;
  questionTitle?: string | null;
}

// ---------------------------------------------------------------------------
// Constants & TOUR Brand Status Styles
// ---------------------------------------------------------------------------

const CATEGORIES = [
  "Computer Science & AI",
  "Biology & Medicine",
  "Physics & Astronomy",
  "Environmental Science",
  "Social Sciences",
  "Engineering & Technology",
  "Chemistry",
  "Humanities & Literature",
  "Mathematics",
];

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  DRAFT: {
    label: "Draft",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  SUBMITTED: {
    label: "Under Review",
    badge: "bg-sapphire/10 text-sapphire border-sapphire/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    badge: "bg-champagne/60 text-navy border-taupe/40",
  },
  REVISION_REQUESTED: {
    label: "Changes Requested",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  RESUBMITTED: {
    label: "Under Review",
    badge: "bg-sapphire/15 text-sapphire border-sapphire/30",
  },
  APPROVED: {
    label: "Approved",
    badge: "bg-sapphire/20 text-navy font-semibold border-sapphire/30",
  },
  PUBLISHED: {
    label: "Published",
    badge: "bg-navy text-ivory border-navy",
  },
  REJECTED: {
    label: "Rejected",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

function fmtDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Main Researcher Dashboard Content
// ---------------------------------------------------------------------------

function ResearcherDashboardContent() {
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();

  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterTab, setFilterTab] = useState<
    "ALL" | "DRAFT" | "UNDER_REVIEW" | "CHANGES_REQUESTED" | "PUBLISHED"
  >("ALL");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitDraftId, setSubmitDraftId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ResearchItem | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    title: "",
    abstract: "",
    category: CATEGORIES[0],
    file: null as File | null,
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editForm, setEditForm] = useState({
    title: "",
    abstract: "",
    category: "",
    file: null as File | null,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const prefilledQuestionId = searchParams?.get("questionId");
  const prefilledQuestionTitle = searchParams?.get("questionTitle");

  // Check query params to open modals if requested
  useEffect(() => {
    const action = searchParams?.get("action");
    if (action === "submit" || searchParams?.get("questionId")) {
      setShowSubmitModal(true);
    } else if (action === "new") {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  // Load research items
  const fetchResearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as ResearchItem[];
        setResearchList(data);
      }
    } catch (err) {
      console.error("Failed to fetch research items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      void fetchResearch();
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [sessionStatus]);

  // Derived filter list
  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return researchList.filter((item) => {
      // Tab filter
      if (filterTab === "DRAFT" && item.status !== "DRAFT") return false;
      if (
        filterTab === "UNDER_REVIEW" &&
        !["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED", "APPROVED"].includes(item.status)
      )
        return false;
      if (filterTab === "CHANGES_REQUESTED" && item.status !== "REVISION_REQUESTED") return false;
      if (filterTab === "PUBLISHED" && item.status !== "PUBLISHED") return false;

      // Search query
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.abstract.toLowerCase().includes(q) ||
        item.submissionId.toLowerCase().includes(q)
      );
    });
  }, [researchList, filterTab, query]);

  // Spotlight Draft / Active item (CoachPro style "Next Game" card)
  const spotlightItem = useMemo(() => {
    const revReq = researchList.find((r) => r.status === "REVISION_REQUESTED");
    if (revReq) return revReq;
    const draft = researchList.find((r) => r.status === "DRAFT");
    if (draft) return draft;
    return researchList[0] || null;
  }, [researchList]);

  // Metrics for Image 2 layout
  const counts = useMemo(() => {
    const drafts = researchList.filter((r) => r.status === "DRAFT").length;
    const underReview = researchList.filter((r) =>
      ["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED", "APPROVED"].includes(r.status)
    ).length;
    const revisions = researchList.filter((r) => r.status === "REVISION_REQUESTED").length;
    const published = researchList.filter((r) => r.status === "PUBLISHED").length;
    const total = researchList.length;

    // Segment widths
    const publishedPct = total > 0 ? Math.max(6, (published / total) * 100) : 0;
    const underReviewPct = total > 0 ? Math.max(6, (underReview / total) * 100) : 0;
    const revisionsPct = total > 0 ? Math.max(6, (revisions / total) * 100) : 0;
    const draftsPct = total > 0 ? Math.max(6, (drafts / total) * 100) : 0;

    return {
      drafts,
      underReview,
      revisions,
      published,
      total,
      publishedPct,
      underReviewPct,
      revisionsPct,
      draftsPct,
    };
  }, [researchList]);

  // Upload draft file
  const uploadDraftFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/submissions/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "File upload failed.");
    return data as { fileUrl: string; fileName: string; fileType: string };
  };

  // Create research draft
  const handleCreateResearch = async (isDraft: boolean) => {
    setCreateSubmitting(true);
    setCreateError("");
    try {
      if (!createForm.title.trim()) throw new Error("Please enter a research title.");
      if (!isDraft && !createForm.abstract.trim()) throw new Error("Please enter a short summary.");

      let uploaded: { fileUrl?: string; fileName?: string; fileType?: string } = {};
      if (createForm.file) {
        uploaded = await uploadDraftFile(createForm.file);
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createForm.title.trim(),
          abstract: createForm.abstract.trim() || createForm.title.trim(),
          category: createForm.category,
          fileUrl: uploaded.fileUrl,
          fileName: uploaded.fileName || createForm.file?.name,
          fileType: uploaded.fileType || createForm.file?.type,
          isDraft,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create research.");

      setShowCreateModal(false);
      setCreateForm({ title: "", abstract: "", category: CATEGORIES[0], file: null });
      await fetchResearch();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Open editor modal
  const openEditor = (item: ResearchItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      abstract: item.abstract,
      category: item.category,
      file: null,
    });
    setEditError("");
  };

  // Edit / Resubmit handler
  const handleSaveEdit = async (isSubmit: boolean) => {
    if (!editingItem) return;
    setEditSubmitting(true);
    setEditError("");

    try {
      let uploaded: { fileUrl?: string; fileName?: string; fileType?: string } = {};
      if (editForm.file) {
        uploaded = await uploadDraftFile(editForm.file);
      }

      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: editingItem.id,
          title: editForm.title.trim(),
          abstract: editForm.abstract.trim(),
          category: editForm.category,
          fileUrl: uploaded.fileUrl ?? editingItem.fileUrl ?? undefined,
          fileName: uploaded.fileName ?? editingItem.fileName ?? undefined,
          fileType: uploaded.fileType ?? editingItem.fileType ?? undefined,
          isSubmit,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update research.");

      setEditingItem(null);
      await fetchResearch();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setEditSubmitting(false);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EBF1F5]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-sapphire" />
          <p className="text-xs font-semibold text-navy">Loading researcher notebook…</p>
        </div>
      </div>
    );
  }

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
              <Link href="/researcher" className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-champagne font-extrabold text-lg shadow-sm">
                  R
                </div>
                <span className="font-heading text-xl font-bold tracking-tight text-navy">
                  TOUR Notebook
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
                onClick={() => setFilterTab("ALL")}
                className="w-full bg-navy text-white font-semibold rounded-2xl px-4 py-3 shadow-[0_4px_16px_rgba(17,34,80,0.25)] flex items-center gap-3 transition text-sm cursor-pointer"
              >
                <LayoutGrid className="h-4 w-4 text-champagne" />
                <span>My Notebook</span>
              </button>

              {/* New Draft Button */}
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium cursor-pointer"
              >
                <Plus className="h-4 w-4 text-sapphire" />
                <span>New Research Draft</span>
              </button>

              {/* Submit for Publication */}
              <button
                type="button"
                onClick={() => {
                  setSubmitDraftId(null);
                  setShowSubmitModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-sapphire" />
                <span>Submit for Review</span>
              </button>

              {/* Question Hub */}
              <Link
                href="/questions"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <MessageSquare className="h-4 w-4 text-sapphire" />
                <span>Question Hub</span>
              </Link>

              {/* Publications Library */}
              <Link
                href="/publications"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <FlaskConical className="h-4 w-4 text-sapphire" />
                <span>Publications</span>
              </Link>

              {/* Back to Home */}
              <Link
                href="/"
                className="w-full text-navy/70 hover:text-navy hover:bg-navy/5 rounded-2xl px-4 py-3 transition flex items-center gap-3 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 text-sapphire" />
                <span>Back to Site</span>
              </Link>
            </nav>
          </div>

          {/* Bottom user profile card in sidebar */}
          <div className="mt-8 pt-4 border-t border-navy/10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sapphire/15 text-navy font-bold text-xs grid place-items-center shrink-0 border border-sapphire/20">
              {session?.user?.name?.slice(0, 2).toUpperCase() || "RE"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-navy truncate">
                {session?.user?.name || "Student Researcher"}
              </p>
              <p className="text-[10px] text-navy/55 truncate">
                {session?.user?.email || "researcher@tour.dev"}
              </p>
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
                  Welcome back, {session?.user?.name?.split(" ")[0] || "Researcher"} 👋
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
                    placeholder="Search notebook…"
                    className="h-10 w-36 sm:w-56 rounded-full border border-navy/15 bg-white pl-9 pr-4 text-xs font-medium text-navy placeholder:text-navy/40 focus:border-sapphire focus:outline-none focus:ring-2 focus:ring-sapphire/20 transition"
                  />
                </div>

                {/* Refresh button */}
                <button
                  type="button"
                  onClick={() => void fetchResearch()}
                  title="Refresh notebook"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy/70 hover:text-navy hover:bg-ivory border border-navy/15 transition shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-sapphire" : ""}`} />
                </button>

                {/* Profile Pill */}
                <div className="flex items-center gap-2.5 rounded-full bg-white border border-navy/15 px-3 py-1.5 shadow-xs">
                  <div className="h-7 w-7 rounded-full bg-navy text-champagne text-[10px] font-bold grid place-items-center">
                    {session?.user?.name?.slice(0, 2).toUpperCase() || "RE"}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-navy">
                    {session?.user?.name || "Researcher"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Content Grid (Exact Imitation of Image 2 in TOUR Brand) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6">
              {/* ──────────────────────────────────────────────────────────── */}
              {/* Left Column (58-60% width on desktop)                         */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-7 flex flex-col gap-5 xl:gap-6">
                {/* 1. TOP-LEFT CARD: "Next game" Equivalent -> Spotlight Draft / Research Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-navy">
                      Active Research Spotlight
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      className="text-xs font-semibold text-sapphire hover:underline cursor-pointer"
                    >
                      + New Draft
                    </button>
                  </div>

                  {spotlightItem ? (
                    <div>
                      {/* Subtitle with date and status */}
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-navy/60 mb-4">
                        <Clock className="h-3 w-3 text-sapphire" />
                        <span>
                          {spotlightItem.status === "REVISION_REQUESTED"
                            ? "Action Required: Revisions Requested"
                            : spotlightItem.status === "DRAFT"
                            ? "Active Working Draft"
                            : `Submitted for Peer Review • ${fmtDate(spotlightItem.submittedAt || spotlightItem.createdAt)}`}
                        </span>
                      </div>

                      {/* The Matchup / Versus Nodes (Imitating Juventus vs Sassuolo in Image 2) */}
                      <div className="flex items-center justify-around py-3 px-2 rounded-2xl bg-ivory/60 border border-navy/10">
                        {/* Left Node: Author */}
                        <div className="flex flex-col items-center text-center gap-2 max-w-[130px]">
                          <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-navy/15 grid place-items-center text-sm font-bold text-navy">
                            {session?.user?.name?.slice(0, 2).toUpperCase() || "ME"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy truncate w-28">
                              {session?.user?.name || "My Work"}
                            </p>
                            <p className="text-[10px] text-navy/55 truncate w-28">
                              Primary Author
                            </p>
                          </div>
                        </div>

                        {/* Center VS / Status Badge */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-champagne text-navy font-black text-xs shadow-xs border border-taupe/30">
                            ⚡
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                            {spotlightItem.status.replace("_", " ")}
                          </span>
                        </div>

                        {/* Right Node: Research Topic & Title */}
                        <div className="flex flex-col items-center text-center gap-2 max-w-[150px]">
                          <div className="h-12 w-12 rounded-full bg-sapphire/15 shadow-sm border border-sapphire/25 grid place-items-center text-sm font-bold text-navy">
                            <BookOpen className="h-5 w-5 text-sapphire" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy truncate w-32">
                              {spotlightItem.title}
                            </p>
                            <span className="inline-block mt-0.5 rounded-full bg-sapphire/10 border border-sapphire/20 px-2 py-0.5 text-[9px] font-bold text-sapphire">
                              {spotlightItem.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick action buttons */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[11px] text-navy/50">
                          Updated {fmtDate(spotlightItem.updatedAt)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditor(spotlightItem)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-sapphire transition shadow-xs cursor-pointer"
                          >
                            <span>
                              {spotlightItem.status === "REVISION_REQUESTED"
                                ? "Revise & Resubmit"
                                : "Continue Editing"}
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-navy/60">
                      <FlaskConical className="mx-auto h-8 w-8 text-sapphire/40 mb-2" />
                      <p className="font-bold text-navy">No research drafts yet</p>
                      <p className="text-[11px] text-navy/55 mt-1">
                        Start your first paper to track review feedback and publish.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-sapphire shadow-xs cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Start New Draft</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. BOTTOM-LEFT CARD: "Standings" Equivalent -> Clean Table Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <span className="text-xs font-bold text-navy">
                      Notebook Papers &amp; Drafts
                    </span>

                    {/* Filter tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { key: "ALL", label: `All (${researchList.length})` },
                        { key: "DRAFT", label: `Drafts (${counts.drafts})` },
                        { key: "UNDER_REVIEW", label: `In Review (${counts.underReview})` },
                        { key: "CHANGES_REQUESTED", label: `Revisions (${counts.revisions})` },
                        { key: "PUBLISHED", label: `Published (${counts.published})` },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setFilterTab(tab.key as any)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                            filterTab === tab.key
                              ? "bg-navy text-white"
                              : "bg-ivory text-navy/70 hover:bg-navy/5 border border-navy/10"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clean Modern Table (Image 2 style in TOUR Brand) */}
                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                    {loading ? (
                      <div className="py-12 text-center text-xs text-navy/60">
                        <RefreshCw className="mx-auto h-5 w-5 animate-spin text-sapphire mb-2" />
                        Loading notebook items…
                      </div>
                    ) : filteredList.length === 0 ? (
                      <div className="py-12 text-center text-xs text-navy/60">
                        No research items match current filter.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-navy/10 text-[10px] font-bold uppercase tracking-wider text-navy/60">
                            <th className="pb-3 pl-2">#</th>
                            <th className="pb-3">Title &amp; Topic</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 hidden sm:table-cell">File</th>
                            <th className="pb-3 hidden md:table-cell">Updated</th>
                            <th className="pb-3 text-right pr-2">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                          {filteredList.map((item, idx) => {
                            const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.DRAFT;
                            return (
                              <tr
                                key={item.id}
                                onClick={() => setViewingItem(item)}
                                className="group hover:bg-ivory/50 transition cursor-pointer"
                              >
                                {/* Row Index */}
                                <td className="py-3.5 pl-2 font-bold text-navy/50">
                                  {idx + 1}
                                </td>

                                {/* Title & Topic */}
                                <td className="py-3.5 pr-3 max-w-[220px]">
                                  <p className="font-bold text-navy truncate group-hover:text-sapphire transition">
                                    {item.title}
                                  </p>
                                  <span className="text-[10px] text-navy/60">
                                    {item.category}
                                  </span>
                                </td>

                                {/* Status Badge */}
                                <td className="py-3.5 pr-3">
                                  <span
                                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusInfo.badge}`}
                                  >
                                    {statusInfo.label}
                                  </span>
                                </td>

                                {/* File Attachment */}
                                <td className="py-3.5 pr-3 hidden sm:table-cell text-[11px] text-navy/70">
                                  {item.fileName ? (
                                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-sapphire">
                                      <FileText className="h-3 w-3" />
                                      {item.fileName.slice(0, 12)}…
                                    </span>
                                  ) : (
                                    <span className="text-navy/40 italic">No file</span>
                                  )}
                                </td>

                                {/* Updated Date */}
                                <td className="py-3.5 pr-3 hidden md:table-cell text-[11px] text-navy/55">
                                  {fmtDate(item.updatedAt)}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 text-right pr-2">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {item.status === "DRAFT" || item.status === "REVISION_REQUESTED" ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditor(item);
                                        }}
                                        className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-[11px] font-semibold text-white hover:bg-sapphire transition cursor-pointer"
                                      >
                                        <span>Edit</span>
                                        <ArrowUpRight className="h-3 w-3" />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewingItem(item);
                                        }}
                                        className="inline-flex items-center gap-1 rounded-full bg-ivory text-navy px-3 py-1 text-[11px] font-semibold hover:bg-champagne/60 border border-navy/10 transition cursor-pointer"
                                      >
                                        <span>View</span>
                                        <ArrowUpRight className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
                {/* 3. TOP-RIGHT CARD: "Games statistic" Equivalent -> Research Progress Pipeline */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-navy">
                      Research Pipeline
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterTab("ALL")}
                      className="text-xs font-semibold text-sapphire hover:underline cursor-pointer"
                    >
                      View all statistic
                    </button>
                  </div>

                  {/* Horizontal Segmented Progress Bar (TOUR Palette) */}
                  <div className="h-3 rounded-full overflow-hidden flex bg-ivory mb-4 border border-navy/10">
                    {/* Published (TOUR Navy) */}
                    <div
                      style={{ width: `${counts.publishedPct}%` }}
                      className="h-full bg-navy transition-all duration-500"
                      title={`Published: ${counts.published}`}
                    />
                    {/* In Review (TOUR Sapphire) */}
                    <div
                      style={{ width: `${counts.underReviewPct}%` }}
                      className="h-full bg-sapphire transition-all duration-500"
                      title={`In Review: ${counts.underReview}`}
                    />
                    {/* Revisions (Soft Coral/Pink) */}
                    <div
                      style={{ width: `${counts.revisionsPct}%` }}
                      className="h-full bg-rose-400 transition-all duration-500"
                      title={`Revisions: ${counts.revisions}`}
                    />
                    {/* Drafts (TOUR Champagne) */}
                    <div
                      style={{ width: `${counts.draftsPct}%` }}
                      className="h-full bg-champagne border-r border-taupe/30 transition-all duration-500"
                      title={`Drafts: ${counts.drafts}`}
                    />
                  </div>

                  {/* 4 Stat Columns (Exact Image 2 PL 8 | VICTORIES 6 | DRAWS 1 | LOST 1) */}
                  <div className="grid grid-cols-4 text-center divide-x divide-navy/10 pt-1">
                    <button
                      type="button"
                      onClick={() => setFilterTab("ALL")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Total
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-navy">
                        {counts.total}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterTab("DRAFT")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Drafts
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-navy/70">
                        {counts.drafts}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterTab("UNDER_REVIEW")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Review
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-sapphire">
                        {counts.underReview}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFilterTab("PUBLISHED")}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                        Publ.
                      </p>
                      <p className="mt-1 font-heading text-lg font-extrabold text-navy">
                        {counts.published}
                      </p>
                    </button>
                  </div>
                </div>

                {/* 4. 2x2 METRIC CARDS (TOUR Color Palette) */}
                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                  {/* Card 1: Sapphire Accent (Active Drafts) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sapphire/10 text-sapphire border border-sapphire/20">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          Active Drafts
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {counts.drafts}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Champagne Accent (In Peer Review) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-champagne/70 text-navy border border-taupe/30">
                        <Clock className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          In Review
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {counts.underReview}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Rose/Amber Accent (Changes Requested) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          Revisions
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {counts.revisions}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Navy Accent (Published Papers) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-navy/10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-navy text-champagne">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                          Published
                        </p>
                        <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                          {counts.published}
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
                      Ready to Publish?
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-extrabold leading-snug text-white mt-1 max-w-[260px]">
                      Submit Your Research for Global Peer Review
                    </h3>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitDraftId(null);
                          setShowSubmitModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy shadow-sm hover:bg-ivory transition cursor-pointer"
                      >
                        <span>Submit for Publication</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 1. CREATE RESEARCH DRAFT MODAL                                     */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 border border-navy/10">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-ivory text-navy/60 hover:bg-navy/10 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-heading text-2xl font-bold text-navy">
              Create Research Draft
            </h2>
            <p className="mt-1 text-xs text-navy/60">
              Begin a draft paper. You can save it for later or submit it right away.
            </p>

            {createError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {createError}
              </div>
            )}

            <div className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Research Title *
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Understanding Rare Disease Awareness in Rwanda"
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/40 px-4 text-xs font-medium text-navy placeholder:text-navy/40 focus:border-sapphire focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Short Summary / Abstract *
                </label>
                <textarea
                  rows={3}
                  value={createForm.abstract}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, abstract: e.target.value }))}
                  placeholder="Summarize the core objectives, findings, and relevance of your work…"
                  className="mt-1.5 w-full rounded-xl border border-navy/15 bg-ivory/40 p-3 text-xs text-navy placeholder:text-navy/40 focus:border-sapphire focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Research Category *
                </label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/40 px-4 text-xs font-medium text-navy focus:border-sapphire focus:bg-white focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Upload Draft File (PDF or Document)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setCreateForm((prev) => ({ ...prev, file: f }));
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 flex h-20 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy/20 bg-ivory/40 p-4 text-center transition hover:border-sapphire hover:bg-white cursor-pointer"
                >
                  <Upload className="h-5 w-5 text-sapphire" />
                  <span className="mt-1 text-xs font-semibold text-navy">
                    {createForm.file ? createForm.file.name : "Click to select draft file (.pdf, .docx)"}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={createSubmitting}
                onClick={() => handleCreateResearch(true)}
                className="rounded-full border border-navy/15 bg-white px-5 py-2.5 text-xs font-semibold text-navy hover:bg-ivory cursor-pointer"
              >
                {createSubmitting ? "Saving…" : "Save as Draft"}
              </button>
              <button
                type="button"
                disabled={createSubmitting}
                onClick={() => handleCreateResearch(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white hover:bg-sapphire shadow-md cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                {createSubmitting ? "Submitting…" : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 2. DRAFT & REVISION EDITOR MODAL                                   */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 border border-navy/10">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-ivory text-navy/60 hover:bg-navy/10 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-heading text-2xl font-bold text-navy">
              {editingItem.status === "REVISION_REQUESTED"
                ? "Revise & Resubmit Paper"
                : "Edit Research Draft"}
            </h2>
            <p className="mt-1 text-xs text-navy/60">
              Update your research details or upload an updated draft file.
            </p>

            {/* Display Admin Feedback Banner if Changes Requested */}
            {editingItem.status === "REVISION_REQUESTED" && editingItem.reviews?.[0]?.feedback && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-950">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <MessageSquare className="h-4 w-4 text-rose-600" /> Reviewer Feedback / Change Request
                </div>
                <p className="mt-1.5 leading-relaxed text-rose-900/90">
                  {editingItem.reviews[0].feedback}
                </p>
              </div>
            )}

            {editError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {editError}
              </div>
            )}

            <div className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Research Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/40 px-4 text-xs font-medium text-navy focus:border-sapphire focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Short Summary / Abstract
                </label>
                <textarea
                  rows={3}
                  value={editForm.abstract}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, abstract: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-navy/15 bg-ivory/40 p-3 text-xs text-navy focus:border-sapphire focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Research Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/40 px-4 text-xs font-medium text-navy focus:border-sapphire focus:bg-white focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                  Replace / Update Draft File
                </label>
                <input
                  type="file"
                  ref={editFileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setEditForm((prev) => ({ ...prev, file: f }));
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="mt-1.5 flex h-20 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy/20 bg-ivory/40 p-4 text-center transition hover:border-sapphire hover:bg-white cursor-pointer"
                >
                  <Upload className="h-5 w-5 text-sapphire" />
                  <span className="mt-1 text-xs font-semibold text-navy">
                    {editForm.file
                      ? editForm.file.name
                      : editingItem.fileName
                      ? `Current file: ${editingItem.fileName} (click to replace)`
                      : "Upload draft file (.pdf, .docx)"}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={editSubmitting}
                onClick={() => handleSaveEdit(false)}
                className="rounded-full border border-navy/15 bg-white px-5 py-2.5 text-xs font-semibold text-navy hover:bg-ivory cursor-pointer"
              >
                {editSubmitting ? "Saving…" : "Save Draft"}
              </button>
              <button
                type="button"
                disabled={editSubmitting}
                onClick={() => handleSaveEdit(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white hover:bg-sapphire shadow-md cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                {editSubmitting ? "Submitting…" : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 3. VIEW SUBMISSION / FEEDBACK MODAL                                */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 border border-navy/10">
            <button
              type="button"
              onClick={() => setViewingItem(null)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-ivory text-navy/60 hover:bg-navy/10 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-1 text-xs font-semibold text-sapphire">
              {viewingItem.category}
            </span>
            <h2 className="mt-3 font-heading text-xl font-bold text-navy">
              {viewingItem.title}
            </h2>

            <div className="mt-4 space-y-2 rounded-2xl bg-ivory/60 border border-navy/10 p-4 text-xs text-navy">
              <div className="flex justify-between">
                <span className="font-bold text-navy/60">Status:</span>
                <span className="font-semibold">{viewingItem.status.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-navy/60">Date:</span>
                <span>{fmtDate(viewingItem.submittedAt || viewingItem.createdAt)}</span>
              </div>
              {viewingItem.fileName && viewingItem.fileUrl && (
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy/60">Document:</span>
                  <a
                    href={viewingItem.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sapphire font-bold underline"
                  >
                    {viewingItem.fileName} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy/60">Summary</h4>
              <p className="mt-1 text-xs leading-relaxed text-navy/80">{viewingItem.abstract}</p>
            </div>

            {/* Admin Reviews & Feedback History */}
            {viewingItem.reviews && viewingItem.reviews.length > 0 && (
              <div className="mt-5 border-t border-navy/10 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy/60">
                  Reviewer Feedback
                </h4>
                <div className="mt-2 space-y-2">
                  {viewingItem.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-navy/10 bg-ivory/60 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-navy">
                        <span>Decision: {rev.decision}</span>
                        <span className="text-[10px] text-navy/50">{fmtDate(rev.createdAt)}</span>
                      </div>
                      {rev.feedback && <p className="mt-1 text-navy/80">{rev.feedback}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="rounded-full bg-navy px-5 py-2 text-xs font-semibold text-white hover:bg-sapphire cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* 4. FORMAL PUBLICATION SUBMISSION MODAL                             */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <PublicationSubmissionModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          setSubmitDraftId(null);
        }}
        onSuccess={() => {
          void fetchResearch();
        }}
        existingDrafts={researchList.filter((r) => r.status === "DRAFT")}
        preselectedDraftId={submitDraftId}
        prefilledQuestionId={prefilledQuestionId}
        prefilledQuestionTitle={prefilledQuestionTitle}
      />
    </div>
  );
}

export default function ResearcherDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EBF1F5] text-xs font-bold text-navy">
          Loading researcher notebook…
        </div>
      }
    >
      <ResearcherDashboardContent />
    </Suspense>
  );
}
