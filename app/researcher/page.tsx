"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FlaskConical,
  MessageSquare,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  Upload,
  X,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";

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
}

// ---------------------------------------------------------------------------
// Constants & Helpers
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

const STATUS_MAP: Record<string, { label: string; badge: string; icon: React.ReactNode }> = {
  DRAFT: {
    label: "Draft",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    icon: <FileText className="h-3.5 w-3.5 text-slate-500" />,
  },
  SUBMITTED: {
    label: "Under Review",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5 text-amber-600" />,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5 text-amber-600" />,
  },
  REVISION_REQUESTED: {
    label: "Changes Requested",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <AlertCircle className="h-3.5 w-3.5 text-orange-600" />,
  },
  RESUBMITTED: {
    label: "Under Review",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <RotateCcw className="h-3.5 w-3.5 text-blue-600" />,
  },
  APPROVED: {
    label: "Approved",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />,
  },
  PUBLISHED: {
    label: "Published",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />,
  },
  REJECTED: {
    label: "Rejected",
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: <X className="h-3.5 w-3.5 text-red-600" />,
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
// Main Component
// ---------------------------------------------------------------------------

export default function ResearcherDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();

  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"ALL" | "DRAFT" | "UNDER_REVIEW" | "CHANGES_REQUESTED" | "PUBLISHED">("ALL");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  // Check query params to open create modal if requested
  useEffect(() => {
    if (searchParams?.get("action") === "new") {
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
    }
  }, [sessionStatus]);

  // Filtered research items
  const filteredList = useMemo(() => {
    return researchList.filter((item) => {
      if (filterTab === "DRAFT") return item.status === "DRAFT";
      if (filterTab === "UNDER_REVIEW")
        return ["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED", "APPROVED"].includes(item.status);
      if (filterTab === "CHANGES_REQUESTED") return item.status === "REVISION_REQUESTED";
      if (filterTab === "PUBLISHED") return item.status === "PUBLISHED";
      return true;
    });
  }, [researchList, filterTab]);

  // Handle file upload to backend
  const uploadDraftFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/submissions/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "File upload failed.");
    return data as { fileUrl: string; fileName: string; fileType: string };
  };

  // Create Research submit handler
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

  // Start editing a research item
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

  // Edit/Resubmit submit handler
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-sapphire" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory/40 pb-24 pt-8">
      <div className="container-tour max-w-6xl space-y-8">
        {/* ------------------------------------------------------------------ */}
        {/* Header Bar                                                          */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-col gap-4 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-navy/60 hover:text-navy transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sapphire">
                <FlaskConical className="h-3.5 w-3.5" /> Researcher Notebook
              </span>
            </div>
            <h1 className="mt-3 font-heading text-2xl font-bold text-navy sm:text-3xl">
              My Research
            </h1>
            <p className="mt-1 text-sm text-navy/60">
              Create drafts, edit work, and manage peer review submissions in one simple place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sapphire active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Research</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Category / Status Tabs                                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-wrap items-center gap-2 border-b border-navy/10 pb-4">
          {[
            { key: "ALL", label: `All (${researchList.length})` },
            { key: "DRAFT", label: `Drafts (${researchList.filter((r) => r.status === "DRAFT").length})` },
            { key: "UNDER_REVIEW", label: `Under Review (${researchList.filter((r) => ["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED", "APPROVED"].includes(r.status)).length})` },
            { key: "CHANGES_REQUESTED", label: `Changes Requested (${researchList.filter((r) => r.status === "REVISION_REQUESTED").length})` },
            { key: "PUBLISHED", label: `Published (${researchList.filter((r) => r.status === "PUBLISHED").length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key as any)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filterTab === tab.key
                  ? "bg-navy text-white shadow-sm"
                  : "bg-white text-navy/70 hover:bg-navy/5 border border-navy/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Research List / Cards                                               */}
        {/* ------------------------------------------------------------------ */}
        {loading ? (
          <div className="rounded-3xl border border-navy/10 bg-white p-12 text-center">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-sapphire" />
            <p className="mt-3 text-sm text-navy/60">Loading your research notebook...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-navy/20 bg-white p-12 text-center">
            <FlaskConical className="mx-auto h-10 w-10 text-navy/30" />
            <h3 className="mt-4 font-heading text-lg font-bold text-navy">No research items found</h3>
            <p className="mt-1 text-sm text-navy/60">
              {filterTab === "ALL"
                ? "Click '+ New Research' above to start your first draft."
                : "No research matching this filter."}
            </p>
            {filterTab === "ALL" && (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-xs font-semibold text-white hover:bg-sapphire"
              >
                <Plus className="h-4 w-4" /> Start New Research
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1">
            {filteredList.map((item) => {
              const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.DRAFT;
              const latestReview = item.reviews?.[0];

              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-navy/25 hover:shadow-md md:flex-row md:items-center"
                >
                  <div className="space-y-2 md:max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${statusInfo.badge}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      <span className="rounded-full bg-ivory px-2.5 py-0.5 text-xs font-semibold text-navy/70">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold leading-snug text-navy">
                      {item.title}
                    </h3>

                    <p className="line-clamp-2 text-sm text-navy/65">
                      {item.abstract}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-navy/45 pt-1">
                      <span>Updated: {fmtDate(item.updatedAt)}</span>
                      {item.submittedAt && <span>Submitted: {fmtDate(item.submittedAt)}</span>}
                      {item.fileName && (
                        <span className="inline-flex items-center gap-1 text-sapphire">
                          <FileText className="h-3.5 w-3.5" /> {item.fileName}
                        </span>
                      )}
                    </div>

                    {/* Show Admin Feedback inline preview if changes requested or rejected */}
                    {(item.status === "REVISION_REQUESTED" || item.status === "REJECTED") && latestReview?.feedback && (
                      <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50/60 p-3 text-xs text-orange-900">
                        <span className="font-bold">Admin Feedback: </span>
                        {latestReview.feedback}
                      </div>
                    )}
                  </div>

                  {/* Context-Specific Action Buttons */}
                  <div className="mt-4 flex items-center gap-3 shrink-0 md:mt-0">
                    {item.status === "DRAFT" && (
                      <button
                        type="button"
                        onClick={() => openEditor(item)}
                        className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-ivory px-4 py-2 text-xs font-semibold text-navy hover:bg-navy hover:text-white transition"
                      >
                        Continue Editing
                      </button>
                    )}

                    {["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED", "APPROVED"].includes(item.status) && (
                      <button
                        type="button"
                        onClick={() => setViewingItem(item)}
                        className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 text-xs font-semibold text-navy hover:bg-ivory transition"
                      >
                        View Submission
                      </button>
                    )}

                    {item.status === "REVISION_REQUESTED" && (
                      <button
                        type="button"
                        onClick={() => openEditor(item)}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-700 transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Edit & Resubmit
                      </button>
                    )}

                    {item.status === "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => setViewingItem(item)}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                      >
                        View Feedback
                      </button>
                    )}

                    {item.status === "PUBLISHED" && (
                      <Link
                        href={item.publication?.id ? `/publications/${item.publication.id}` : `/publications`}
                        className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-800 transition"
                      >
                        <BookOpen className="h-3.5 w-3.5" /> View Published Research
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 1. CREATE RESEARCH MODAL                                             */}
      {/* -------------------------------------------------------------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-navy/5 text-navy/60 hover:bg-navy/10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-sapphire">
              <Plus className="h-4 w-4" /> New Research Project
            </div>
            <h2 className="mt-1 font-heading text-2xl font-bold text-navy">
              Create Research
            </h2>
            <p className="mt-1 text-xs text-navy/60">
              Fill in basic details and attach your draft file. Your author profile info will be linked automatically.
            </p>

            {createError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {createError}
              </div>
            )}

            <div className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                  Research Title *
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Understanding Rare Disease Awareness in Rwanda"
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/30 px-4 text-sm text-navy placeholder:text-navy/30 focus:border-sapphire focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                  Short Summary / Abstract *
                </label>
                <textarea
                  rows={3}
                  value={createForm.abstract}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, abstract: e.target.value }))}
                  placeholder="Summarize the core objectives, findings, and relevance of your work..."
                  className="mt-1.5 w-full rounded-xl border border-navy/15 bg-ivory/30 p-3 text-sm text-navy placeholder:text-navy/30 focus:border-sapphire focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                  Research Category *
                </label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/30 px-4 text-sm text-navy focus:border-sapphire focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
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
                  className="mt-1.5 flex h-20 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy/20 bg-ivory/40 p-4 text-center transition hover:border-sapphire hover:bg-ivory"
                >
                  <Upload className="h-5 w-5 text-sapphire" />
                  <span className="mt-1 text-xs font-semibold text-navy/70">
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
                className="rounded-full border border-navy/20 bg-white px-5 py-2.5 text-xs font-semibold text-navy hover:bg-ivory"
              >
                {createSubmitting ? "Saving..." : "Save Draft"}
              </button>
              <button
                type="button"
                disabled={createSubmitting}
                onClick={() => handleCreateResearch(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-semibold text-white hover:bg-sapphire shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                {createSubmitting ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 2. DRAFT & REVISION EDITOR MODAL                                     */}
      {/* -------------------------------------------------------------------- */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-navy/5 text-navy/60 hover:bg-navy/10"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-heading text-2xl font-bold text-navy">
              {editingItem.status === "REVISION_REQUESTED" ? "Edit & Resubmit Research" : "Edit Research Draft"}
            </h2>
            <p className="mt-1 text-xs text-navy/60">
              Update your research details or upload a revised draft file.
            </p>

            {/* Display Admin Feedback Banner if Changes Requested */}
            {editingItem.status === "REVISION_REQUESTED" && editingItem.reviews?.[0]?.feedback && (
              <div className="mt-4 rounded-2xl border border-orange-300 bg-orange-50 p-4 text-xs text-orange-950">
                <div className="flex items-center gap-2 font-bold text-orange-900">
                  <MessageSquare className="h-4 w-4 text-orange-600" /> Admin Feedback / Change Request
                </div>
                <p className="mt-1.5 leading-relaxed text-orange-900/90">
                  {editingItem.reviews[0].feedback}
                </p>
              </div>
            )}

            {editError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {editError}
              </div>
            )}

            <div className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                  Research Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/30 px-4 text-sm text-navy focus:border-sapphire focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                  Short Summary / Abstract
                </label>
                <textarea
                  rows={3}
                  value={editForm.abstract}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, abstract: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-navy/15 bg-ivory/30 p-3 text-sm text-navy focus:border-sapphire focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                  Research Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-navy/15 bg-ivory/30 px-4 text-sm text-navy focus:border-sapphire focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
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
                  className="mt-1.5 flex h-20 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy/20 bg-ivory/40 p-4 text-center transition hover:border-sapphire"
                >
                  <Upload className="h-5 w-5 text-sapphire" />
                  <span className="mt-1 text-xs font-semibold text-navy/70">
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
                className="rounded-full border border-navy/20 bg-white px-5 py-2.5 text-xs font-semibold text-navy hover:bg-ivory"
              >
                {editSubmitting ? "Saving..." : "Save Draft"}
              </button>
              <button
                type="button"
                disabled={editSubmitting}
                onClick={() => handleSaveEdit(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-semibold text-white hover:bg-sapphire shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                {editSubmitting ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 3. VIEW SUBMISSION / FEEDBACK MODAL                                  */}
      {/* -------------------------------------------------------------------- */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setViewingItem(null)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-navy/5 text-navy/60 hover:bg-navy/10"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-navy/70">
              {viewingItem.category}
            </span>
            <h2 className="mt-3 font-heading text-xl font-bold text-navy">
              {viewingItem.title}
            </h2>

            <div className="mt-4 space-y-3 rounded-2xl bg-ivory/50 p-4 text-xs text-navy/80">
              <div>
                <span className="font-bold">Status: </span>
                <span className="capitalize">{viewingItem.status.replace("_", " ")}</span>
              </div>
              <div>
                <span className="font-bold">Submitted Date: </span>
                {fmtDate(viewingItem.submittedAt || viewingItem.createdAt)}
              </div>
              {viewingItem.fileName && viewingItem.fileUrl && (
                <div>
                  <span className="font-bold">Draft File: </span>
                  <a
                    href={viewingItem.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sapphire underline"
                  >
                    {viewingItem.fileName} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy/70">Summary</h4>
              <p className="mt-1 text-xs leading-relaxed text-navy/80">{viewingItem.abstract}</p>
            </div>

            {/* Admin Reviews & Feedback */}
            {viewingItem.reviews && viewingItem.reviews.length > 0 && (
              <div className="mt-6 border-t border-navy/10 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy/70">Admin Feedback History</h4>
                <div className="mt-2 space-y-2">
                  {viewingItem.reviews.map((rev, idx) => (
                    <div key={idx} className="rounded-xl border border-navy/10 bg-white p-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-navy">
                        <span>Decision: {rev.decision}</span>
                        <span className="text-[10px] text-navy/40">{fmtDate(rev.createdAt)}</span>
                      </div>
                      {rev.feedback && <p className="mt-1 text-navy/70">{rev.feedback}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="rounded-full bg-navy px-5 py-2 text-xs font-semibold text-white hover:bg-sapphire"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
