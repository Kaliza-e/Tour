"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Review {
  decision: "APPROVE" | "REQUEST_REVISION" | "REJECT";
  feedback: string | null;
  createdAt: string;
}

interface Version {
  id: string;
  versionNumber: number;
  fileName: string | null;
  createdAt: string;
}

interface Submission {
  id: string;
  submissionId: string;
  title: string;
  abstract: string;
  description: string | null;
  methodology: string | null;
  references: string | null;
  category: string;
  keywords: string[];
  fileName: string | null;
  fileUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  reviews: Review[];
  publication: { id: string } | null;
  versions: Version[];
  assignedReviewer: { name: string } | null;
}

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

const STATUS_ICON: Record<string, React.ReactNode> = {
  SUBMITTED: <Clock className="h-4 w-4 text-blue-500" />,
  UNDER_REVIEW: <Clock className="h-4 w-4 text-amber-500" />,
  REVISION_REQUESTED: <AlertCircle className="h-4 w-4 text-orange-500" />,
  RESUBMITTED: <RotateCcw className="h-4 w-4 text-violet-500" />,
  APPROVED: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  PUBLISHED: <CheckCircle2 className="h-4 w-4 text-teal-500" />,
  REJECTED: <X className="h-4 w-4 text-red-500" />,
  DRAFT: <FileText className="h-4 w-4 text-slate-400" />,
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
// Revision modal
// ---------------------------------------------------------------------------

interface RevisionModalProps {
  submission: Submission;
  onClose: () => void;
  onSuccess: () => void;
}

function RevisionModal({ submission, onClose, onSuccess }: RevisionModalProps) {
  const [form, setForm] = useState({
    title: submission.title,
    abstract: submission.abstract,
    description: submission.description ?? "",
    methodology: submission.methodology ?? "",
    references: submission.references ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let fileName = submission.fileName ?? "";
      let fileUrl = submission.fileUrl ?? "";
      let fileType = "";

      // Upload new file if selected
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/submissions/upload", { method: "POST", body: fd });
        const uploadData = (await uploadRes.json()) as { fileName?: string; fileUrl?: string; error?: string };
        if (!uploadRes.ok) throw new Error(uploadData.error ?? "File upload failed.");
        fileName = uploadData.fileName ?? fileName;
        fileUrl = uploadData.fileUrl ?? fileUrl;
        fileType = file.type;
      }

      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id, ...form, fileName, fileUrl, fileType }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unable to submit revision.");

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-7 py-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy">Submit Revised Work</h2>
            <p className="mt-1 text-sm text-navy/55">
              Update your submission based on reviewer feedback, then send it back for review.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-navy/40 hover:bg-ivory hover:text-navy"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Latest feedback reminder */}
        {submission.reviews[0]?.feedback && (
          <div className="mx-7 mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-800">
              <MessageSquare className="h-4 w-4" /> Reviewer Feedback
            </div>
            <p className="mt-2 text-sm leading-relaxed text-orange-700">
              {submission.reviews[0].feedback}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 px-7 py-5">
          {/* Title */}
          <label className="block text-sm font-semibold text-navy">
            Research Title <span className="text-red-500">*</span>
            <input
              required
              minLength={3}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal outline-none focus:border-sapphire"
            />
          </label>

          {/* Abstract */}
          <label className="block text-sm font-semibold text-navy">
            Abstract <span className="text-red-500">*</span>
            <textarea
              required
              minLength={20}
              rows={4}
              value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
            />
          </label>

          {/* Description */}
          <label className="block text-sm font-semibold text-navy">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
            />
          </label>

          {/* Methodology */}
          <label className="block text-sm font-semibold text-navy">
            Methodology
            <textarea
              rows={3}
              value={form.methodology}
              onChange={(e) => setForm({ ...form, methodology: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
            />
          </label>

          {/* References */}
          <label className="block text-sm font-semibold text-navy">
            References
            <textarea
              rows={3}
              value={form.references}
              onChange={(e) => setForm({ ...form, references: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
            />
          </label>

          {/* File upload */}
          <div>
            <p className="text-sm font-semibold text-navy">Updated Document (optional)</p>
            <p className="mt-0.5 text-xs text-navy/50">
              Upload a revised PDF or DOCX if you changed the file. Maximum 10 MB.
              {submission.fileName && (
                <span> Current file: <strong>{submission.fileName}</strong></span>
              )}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-sm font-semibold text-navy hover:bg-ivory"
            >
              <Upload className="h-4 w-4" />
              {file ? file.name : "Choose revised file"}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-navy/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-ivory"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire disabled:opacity-50"
            >
              {saving ? "Submitting…" : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Submit Revision
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [revising, setRevising] = useState<Submission | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/submissions", { cache: "no-store" });
    const data = (await res.json()) as Submission[] | { error: string };
    if (res.ok) setSubmissions(data as Submission[]);
    else setMessage({ text: (data as { error: string }).error ?? "Unable to load your submissions.", ok: false });
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const handleRevisionSuccess = async () => {
    setRevising(null);
    setMessage({ text: "Revision submitted. TOUR will review your updated work shortly.", ok: true });
    await load();
  };

  return (
    <main className="min-h-screen bg-ivory px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ── Page header ── */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">My TOUR workspace</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-navy md:text-4xl">My Submissions</h1>
            <p className="mt-2 text-sm leading-relaxed text-navy/60">
              Track the status of your research, read reviewer feedback, and submit revisions.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <Link
              href="/get-published"
              className="rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-sapphire"
            >
              + New submission
            </Link>
          </div>
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

        {/* ── Content ── */}
        {loading ? (
          <p className="mt-10 text-sm text-navy/50">Loading your submissions…</p>
        ) : submissions.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-navy/10 bg-white p-12 text-center shadow-sm">
            <FileText className="mx-auto h-10 w-10 text-sapphire/50" />
            <p className="mt-4 font-semibold text-navy">No submissions yet</p>
            <p className="mt-1.5 text-sm text-navy/55">
              When you submit research to TOUR, it will appear here.
            </p>
            <Link
              href="/get-published"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire"
            >
              Submit your research
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {submissions.map((s) => {
              const latestReview = s.reviews[0] ?? null;
              const needsRevision = s.status === "REVISION_REQUESTED";
              const isPublished = s.status === "PUBLISHED";
              const isApproved = s.status === "APPROVED";

              return (
                <article
                  key={s.id}
                  className={`rounded-3xl border bg-white shadow-sm transition ${needsRevision
                      ? "border-orange-200 ring-1 ring-orange-200"
                      : "border-navy/10"
                    }`}
                >
                  {/* ── Card header ── */}
                  <div className="flex items-start justify-between gap-4 px-6 pt-6">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-sapphire">
                        {s.submissionId}
                      </p>
                      <h2 className="mt-1.5 font-heading text-xl font-bold text-navy leading-snug">
                        {s.title}
                      </h2>
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy/50">
                        <span>{s.category}</span>
                        <span>·</span>
                        <span>Submitted {fmt(s.submittedAt ?? s.createdAt)}</span>
                        {s.versions.length > 1 && (
                          <>
                            <span>·</span>
                            <span>{s.versions.length} versions</span>
                          </>
                        )}
                        {s.assignedReviewer && (
                          <>
                            <span>·</span>
                            <span>Reviewer: {s.assignedReviewer.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      {STATUS_ICON[s.status]}
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[s.status] ?? STATUS_STYLES.DRAFT}`}>
                        {STATUS_LABELS[s.status] ?? s.status}
                      </span>
                    </div>
                  </div>

                  {/* ── Abstract ── */}
                  <p className="mt-3 line-clamp-2 px-6 text-sm leading-relaxed text-navy/65">
                    {s.abstract}
                  </p>

                  {/* ── Reviewer feedback (shown prominently when present) ── */}
                  {latestReview?.feedback && (
                    <div className={`mx-6 mt-4 rounded-2xl border p-4 ${latestReview.decision === "APPROVE"
                        ? "border-emerald-200 bg-emerald-50"
                        : latestReview.decision === "REJECT"
                          ? "border-red-200 bg-red-50"
                          : "border-orange-200 bg-orange-50"
                      }`}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className={`h-4 w-4 ${latestReview.decision === "APPROVE" ? "text-emerald-600"
                            : latestReview.decision === "REJECT" ? "text-red-600"
                              : "text-orange-600"
                          }`} />
                        <p className={`text-xs font-bold uppercase tracking-wider ${latestReview.decision === "APPROVE" ? "text-emerald-700"
                            : latestReview.decision === "REJECT" ? "text-red-700"
                              : "text-orange-700"
                          }`}>
                          {latestReview.decision === "APPROVE"
                            ? "Approved — Reviewer Note"
                            : latestReview.decision === "REJECT"
                              ? "Rejected — Reviewer Feedback"
                              : "Revision Requested — Reviewer Feedback"}
                        </p>
                        <span className="ml-auto text-[10px] text-navy/40">{fmt(latestReview.createdAt)}</span>
                      </div>
                      <p className={`mt-2 text-sm leading-relaxed ${latestReview.decision === "APPROVE" ? "text-emerald-800"
                          : latestReview.decision === "REJECT" ? "text-red-800"
                            : "text-orange-800"
                        }`}>
                        {latestReview.feedback}
                      </p>
                    </div>
                  )}

                  {/* ── Version history ── */}
                  {s.versions.length > 1 && (
                    <div className="mx-6 mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-navy/40">
                        Version History
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {s.versions.map((v) => (
                          <span key={v.id} className="rounded-full bg-ivory px-2.5 py-1 text-[11px] text-navy/60">
                            v{v.versionNumber} — {fmt(v.createdAt)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Actions ── */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-navy/8 px-6 py-4 mt-4">
                    {/* Always: view file if available */}
                    {s.fileUrl && (
                      <a
                        href={s.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-4 py-2 text-sm font-semibold text-navy hover:bg-ivory"
                      >
                        <FileText className="h-4 w-4" /> View document
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}

                    {/* Revision requested: primary CTA */}
                    {needsRevision && (
                      <button
                        type="button"
                        onClick={() => setRevising(s)}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Resubmit Revised Work
                      </button>
                    )}

                    {/* Published: view publication */}
                    {isPublished && s.publication && (
                      <Link
                        href={`/publications/${s.publication.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Published Article
                      </Link>
                    )}

                    {/* Approved: waiting to be published */}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Approved — Pending Publication
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Revision modal ── */}
      {revising && (
        <RevisionModal
          submission={revising}
          onClose={() => setRevising(null)}
          onSuccess={handleRevisionSuccess}
        />
      )}
    </main>
  );
}
