"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
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
// Helpers
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  REVISION_REQUESTED: "Revision Requested",
  RESUBMITTED: "Resubmitted",
  APPROVED: "Approved",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-50 text-blue-700 border border-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  REVISION_REQUESTED: "bg-orange-50 text-orange-700 border border-orange-200",
  RESUBMITTED: "bg-violet-50 text-violet-700 border border-violet-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PUBLISHED: "bg-teal-50 text-teal-700 border border-teal-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
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
// Main component
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

  // Review form state
  const [decision, setDecision] = useState<"APPROVE" | "REQUEST_REVISION" | "REJECT">("REQUEST_REVISION");
  const [feedback, setFeedback] = useState("");
  const [reviewerId, setReviewerId] = useState("");

  // Publish form state
  const [pubForm, setPubForm] = useState({
    title: "", category: "", summary: "", coverImage: "", authorBio: "", date: "",
  });

  const drawerRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------

  const loadAll = async () => {
    setLoading(true);
    const [subRes, revRes] = await Promise.all([
      fetch("/api/admin/submissions", { cache: "no-store" }),
      fetch("/api/admin/reviewers", { cache: "no-store" }),
    ]);
    if (subRes.ok) {
      const data = (await subRes.json()) as Submission[];
      setSubmissions(data);
      // Keep selected in sync after reload
      setSelected((cur) => cur ? data.find((s) => s.id === cur.id) ?? null : null);
    }
    if (revRes.ok) setReviewers((await revRes.json()) as Reviewer[]);
    setLoading(false);
  };

  useEffect(() => { void loadAll(); }, []);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const counts = useMemo(() =>
    submissions.reduce<Record<string, number>>((acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      return acc;
    }, {}), [submissions]);

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
    if (!window.confirm(`Permanently delete "${selected.title}"?\n\nThis removes all reviews, versions, and the uploaded file.`)) return;
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
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Header ── */}
      <div className="border-b border-navy/10 bg-white px-6 py-6 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy/55 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">TOUR Admin</p>
            <h1 className="mt-1.5 font-heading text-2xl font-bold text-navy md:text-3xl">Research Submissions</h1>
            <p className="mt-1 text-sm text-navy/60">
              Review, assign, and publish student research.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              <UserCheck className="h-4 w-4" /> Manage users
            </Link>
            <button
              type="button"
              onClick={() => void loadAll()}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-10">

        {/* ── Status summary cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["All", submissions.length, "ALL"],
            ["Submitted", (counts.SUBMITTED ?? 0) + (counts.RESUBMITTED ?? 0), "SUBMITTED"],
            ["Under Review", counts.UNDER_REVIEW ?? 0, "UNDER_REVIEW"],
            ["Needs Revision", counts.REVISION_REQUESTED ?? 0, "REVISION_REQUESTED"],
            ["Approved", counts.APPROVED ?? 0, "APPROVED"],
            ["Published", counts.PUBLISHED ?? 0, "PUBLISHED"],
          ].map(([label, count, filter]) => (
            <button
              key={String(filter)}
              type="button"
              onClick={() => setStatusFilter(String(filter))}
              className={`rounded-2xl border p-3 text-left transition ${statusFilter === filter
                  ? "border-navy bg-navy text-white"
                  : "border-navy/10 bg-white text-navy hover:border-navy/25"
                }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider ${statusFilter === filter ? "text-white/65" : "text-navy/45"}`}>
                {label}
              </p>
              <p className="mt-1.5 text-2xl font-bold">{count}</p>
            </button>
          ))}
        </div>

        {/* ── Flash message ── */}
        {message && (
          <div className={`mt-5 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium ${message.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
            }`}>
            {message.text}
            <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Search / filter bar ── */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, ID, or category…"
              className="w-full rounded-xl border border-navy/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sapphire"
            />
          </label>
          <label className="relative sm:w-52">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-navy/10 bg-white px-3 py-2.5 pr-8 text-sm outline-none focus:border-sapphire"
            >
              <option value="ALL">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45" />
          </label>
        </div>

        {/* ── Table ── */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-navy/50">Loading submissions…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-navy/50">
              No submissions match this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-navy/10 bg-ivory/60">
                    {["Submission", "Author", "Topic", "Status", "Reviewer", "Last Updated", "Action"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-navy/50">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/8">
                  {filtered.map((s) => (
                    <tr key={s.id} className="group transition-colors hover:bg-ivory/60">
                      {/* Submission title */}
                      <td className="max-w-[260px] px-5 py-4">
                        <p className="truncate font-semibold text-navy">{s.title}</p>
                        <p className="mt-0.5 text-[11px] text-navy/45">{s.submissionId}</p>
                      </td>
                      {/* Author */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-navy">
                          {s.authors[0]?.fullName ?? s.user.name}
                        </p>
                        <p className="text-[11px] text-navy/45">{s.user.email}</p>
                      </td>
                      {/* Topic */}
                      <td className="px-5 py-4 text-navy/70">{s.category}</td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[s.status] ?? STATUS_STYLES.DRAFT}`}>
                          {STATUS_LABELS[s.status] ?? s.status}
                        </span>
                      </td>
                      {/* Reviewer */}
                      <td className="px-5 py-4 text-navy/65">
                        {s.assignedReviewer?.name ?? (
                          <span className="text-navy/35 italic">Unassigned</span>
                        )}
                      </td>
                      {/* Last updated */}
                      <td className="px-5 py-4 text-navy/55">{fmt(s.updatedAt)}</td>
                      {/* Action */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openDrawer(s)}
                          className="inline-flex items-center gap-1 rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-sapphire"
                        >
                          {s.status === "PUBLISHED" ? "View" : "Review"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          Review / detail drawer (slides in from right)
      ══════════════════════════════════════════════════════════════════ */}
      {selected && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close drawer"
            className="flex-1 bg-navy/30 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <div
            ref={drawerRef}
            tabIndex={-1}
            className="relative flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl outline-none"
          >
            {/* Drawer header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy/10 bg-white px-7 py-5">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-sapphire">
                  {selected.submissionId}
                </p>
                <h2 className="mt-1.5 font-heading text-xl font-bold text-navy leading-snug">
                  {selected.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[selected.status] ?? STATUS_STYLES.DRAFT}`}>
                    {STATUS_LABELS[selected.status] ?? selected.status}
                  </span>
                  <span className="text-xs text-navy/45">{selected.category}</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeDrawer}
                className="shrink-0 rounded-full p-2 text-navy/40 hover:bg-ivory hover:text-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 px-7 py-6">

              {/* ── Submission details ── */}
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy/45">
                  Submission Details
                </h3>
                <dl className="space-y-2 rounded-2xl border border-navy/10 bg-ivory p-4 text-sm">
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

              {/* ── Abstract ── */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/45">Abstract</h3>
                <p className="rounded-2xl border border-navy/10 bg-ivory p-4 text-sm leading-relaxed text-navy/75">
                  {selected.abstract}
                </p>
              </section>

              {/* ── Supporting links ── */}
              {selected.supportingLinks.length > 0 && (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/45">
                    Supporting Links
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {selected.supportingLinks.map((link) => (
                      <li key={link}>
                        <a href={link} target="_blank" rel="noreferrer" className="text-sapphire hover:underline break-all">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── Review history ── */}
              {selected.reviews.length > 0 && (
                <section>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy/45">
                    Review History ({selected.reviews.length})
                  </h3>
                  <div className="space-y-3">
                    {selected.reviews.map((r, i) => (
                      <div key={r.id} className="rounded-2xl border border-navy/10 bg-ivory p-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-sapphire" />
                            <span className="font-semibold text-navy">
                              {i === 0 ? "Latest" : `Review ${selected.reviews.length - i}`}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${r.decision === "APPROVE" ? "bg-emerald-100 text-emerald-700"
                                : r.decision === "REJECT" ? "bg-red-100 text-red-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}>
                              {DECISION_LABELS[r.decision]}
                            </span>
                          </div>
                          <span className="text-xs text-navy/40">{fmt(r.createdAt)}</span>
                        </div>
                        {r.reviewer && (
                          <p className="mt-1.5 text-xs text-navy/50">
                            by {r.reviewer.name}
                          </p>
                        )}
                        {r.feedback && (
                          <p className="mt-2 leading-relaxed text-navy/70">{r.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Assign reviewer (admin only, non-published) ── */}
              {reviewers.length > 0 && selected.status !== "PUBLISHED" && (
                <section className="rounded-2xl border border-navy/10 bg-ivory p-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy/45">
                    Assign Reviewer
                  </h3>
                  <div className="flex gap-2">
                    <label className="relative flex-1">
                      <select
                        value={reviewerId}
                        onChange={(e) => setReviewerId(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-navy/10 bg-white px-3 py-2.5 pr-8 text-sm outline-none focus:border-sapphire"
                      >
                        <option value="">Choose a reviewer</option>
                        {reviewers.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45" />
                    </label>
                    <button
                      type="button"
                      onClick={() => void assignReviewer()}
                      disabled={saving || !reviewerId}
                      className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </div>
                  {selected.assignedReviewer && (
                    <p className="mt-2 text-xs text-navy/55">
                      Currently assigned: <strong>{selected.assignedReviewer.name}</strong>
                    </p>
                  )}
                </section>
              )}

              {/* ── Review decision (non-published) ── */}
              {selected.status !== "PUBLISHED" && selected.status !== "REJECTED" && (
                <section>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy/45">
                    Review Decision
                  </h3>
                  <div className="space-y-4 rounded-2xl border border-navy/10 bg-ivory p-4">
                    {/* Decision buttons */}
                    <div className="flex flex-wrap gap-2">
                      {(["APPROVE", "REQUEST_REVISION", "REJECT"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDecision(d)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${decision === d
                              ? d === "APPROVE"
                                ? "bg-emerald-600 text-white"
                                : d === "REJECT"
                                  ? "bg-red-600 text-white"
                                  : "bg-navy text-white"
                              : "border border-navy/15 bg-white text-navy hover:bg-navy/5"
                            }`}
                        >
                          {DECISION_LABELS[d]}
                        </button>
                      ))}
                    </div>

                    {/* Feedback textarea */}
                    <label className="block text-sm font-semibold text-navy">
                      Feedback{decision === "REQUEST_REVISION" && <span className="text-orange-600"> *</span>}
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        placeholder={
                          decision === "REQUEST_REVISION"
                            ? "Thank you for your submission. Please expand the methodology section and provide additional references…"
                            : decision === "APPROVE"
                              ? "Optionally add a congratulatory note for the author…"
                              : "Provide a reason for rejection to help the author understand the decision…"
                        }
                        className="mt-2 w-full rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => void saveReview()}
                      disabled={saving || (decision === "REQUEST_REVISION" && !feedback.trim())}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${decision === "APPROVE"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : decision === "REJECT"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-navy hover:bg-sapphire"
                        }`}
                    >
                      {saving ? "Saving…" : (
                        <>
                          {decision === "APPROVE" && <Check className="h-4 w-4" />}
                          {decision === "REJECT" && <X className="h-4 w-4" />}
                          {decision === "REQUEST_REVISION" && <MessageSquare className="h-4 w-4" />}
                          Save Review
                        </>
                      )}
                    </button>
                  </div>
                </section>
              )}

              {/* ── Publish section (only shown when APPROVED) ── */}
              {selected.status === "APPROVED" && (
                <section>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy/45">
                    Publish to TOUR
                  </h3>
                  <div className="space-y-3 rounded-2xl border border-sapphire/20 bg-sapphire/5 p-4">
                    <p className="text-xs text-navy/60">
                      Fill in the publication details below, then click{" "}
                      <strong>Publish to TOUR</strong>. The article will immediately
                      appear in Research &amp; Publications.
                    </p>
                    {[
                      { key: "title", label: "Publication title", placeholder: "Defaults to submission title if empty" },
                      { key: "category", label: "Category", placeholder: "e.g. Environment, Biology, Technology…" },
                      { key: "summary", label: "Summary / description", placeholder: "A short summary for the publication listing…" },
                      { key: "coverImage", label: "Cover image URL", placeholder: "https://res.cloudinary.com/…" },
                      { key: "authorBio", label: "Author bio", placeholder: "A short biography of the author(s)…" },
                      { key: "date", label: "Publication date", placeholder: "YYYY-MM-DD" },
                    ].map(({ key, label, placeholder }) => (
                      <label key={key} className="block text-sm font-semibold text-navy">
                        {label}
                        {key === "summary" ? (
                          <textarea
                            value={pubForm[key as keyof typeof pubForm]}
                            onChange={(e) => setPubForm({ ...pubForm, [key]: e.target.value })}
                            rows={3}
                            placeholder={placeholder}
                            className="mt-1.5 w-full rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-sapphire"
                          />
                        ) : (
                          <input
                            type={key === "date" ? "date" : "text"}
                            value={pubForm[key as keyof typeof pubForm]}
                            onChange={(e) => setPubForm({ ...pubForm, [key]: e.target.value })}
                            placeholder={placeholder}
                            className="mt-1.5 w-full rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-sapphire"
                          />
                        )}
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => void publishSubmission()}
                      disabled={saving}
                      className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sapphire px-5 py-3 text-sm font-semibold text-white hover:bg-navy disabled:opacity-50"
                    >
                      {saving ? "Publishing…" : "Publish to TOUR"}
                    </button>
                  </div>
                </section>
              )}

              {/* ── Published — view link ── */}
              {selected.status === "PUBLISHED" && selected.publication && (
                <section className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
                  <p className="text-sm font-semibold text-teal-800">
                    This submission is published.
                  </p>
                  <Link
                    href={`/publications/${selected.publication.id}`}
                    target="_blank"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
                  >
                    View published article <ExternalLink className="h-4 w-4" />
                  </Link>
                </section>
              )}

              {/* ── Danger zone ── */}
              <section className="border-t border-navy/10 pt-5">
                <button
                  type="button"
                  onClick={() => void deleteSubmission()}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete submission permanently
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
