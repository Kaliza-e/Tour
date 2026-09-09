"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  MessageSquare,
  Save,
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
  reviewer: { name: string; email: string } | null;
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
  submittedAt: string | null;
  updatedAt: string;
  authors: {
    fullName: string;
    email: string;
    institution: string | null;
    country: string | null;
    academicLevel: string | null;
    bio: string | null;
  }[];
  reviews: Review[];
  user: { name: string; email: string };
  assignedReviewer: { id: string; name: string; email: string } | null;
  publication: { id: string } | null;
  versions: { id: string; versionNumber: number; fileName: string | null; createdAt: string }[];
};

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
  SUBMITTED: "bg-blue-50 text-blue-700 border border-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  REVISION_REQUESTED: "bg-orange-50 text-orange-700 border border-orange-200",
  RESUBMITTED: "bg-violet-50 text-violet-700 border border-violet-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PUBLISHED: "bg-teal-50 text-teal-700 border border-teal-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
  DRAFT: "bg-slate-100 text-slate-600",
};

function fmt(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  // Review form
  const [decision, setDecision] = useState<"APPROVE" | "REQUEST_REVISION" | "REJECT">("REQUEST_REVISION");
  const [feedback, setFeedback] = useState("");

  // Publish form
  const [pubForm, setPubForm] = useState({
    title: "", category: "", summary: "", coverImage: "", authorBio: "", date: "",
  });

  // ── Load submission ──
  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/submissions", { cache: "no-store" });
    if (res.ok) {
      const all = (await res.json()) as Submission[];
      const found = all.find((s) => s.id === id);
      if (found) {
        setSubmission(found);
        setPubForm((prev) => ({ ...prev, authorBio: found.authors[0]?.bio ?? "" }));
      }
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, [id]);

  // ── Flash helper ──
  const flash = (text: string, ok = true) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 6000);
  };

  // ── Save review ──
  const saveReview = async () => {
    if (!submission) return;
    setSaving(true);
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: submission.id, decision, feedback }),
    });
    const data = (await res.json()) as { error?: string };
    if (res.ok) {
      flash(
        decision === "APPROVE"
          ? "Submission approved. An admin can now publish it."
          : decision === "REJECT"
          ? "Submission rejected. The author has been notified."
          : "Revision requested. The author has been notified with your feedback."
      );
      setFeedback("");
      await load();
    } else {
      flash(data.error ?? "Unable to save review.", false);
    }
    setSaving(false);
  };

  // ── Publish ──
  const publishSubmission = async () => {
    if (!submission) return;
    setSaving(true);
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: submission.id,
        action: "PUBLISH",
        publicationTitle: pubForm.title,
        publicationCategory: pubForm.category,
        publicationSummary: pubForm.summary,
        publicationCoverImage: pubForm.coverImage,
        publicationAuthorBio: pubForm.authorBio,
        publicationDate: pubForm.date,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (res.ok) {
      flash("Published! The article is now live in Research & Publications.");
      await load();
    } else {
      flash(data.error ?? "Unable to publish.", false);
    }
    setSaving(false);
  };

  // ---------------------------------------------------------------------------
  // Loading / not found
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <p className="text-sm text-navy/50">Loading submission…</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ivory">
        <p className="text-sm text-navy/60">Submission not found or you do not have access.</p>
        <Link href="/admin/submissions" className="text-sm font-semibold text-sapphire hover:underline">
          ← Back to submissions
        </Link>
      </div>
    );
  }

  const latestReview = submission.reviews[0] ?? null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Top bar ── */}
      <div className="border-b border-navy/10 bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/60 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> All submissions
          </button>
          <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[submission.status] ?? STATUS_STYLES.DRAFT}`}>
            {STATUS_LABELS[submission.status] ?? submission.status}
          </span>
        </div>
      </div>

      {/* ── Flash ── */}
      {message && (
        <div className={`mx-auto mt-4 max-w-screen-lg px-4 md:px-10`}>
          <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium ${
            message.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}>
            {message.text}
            <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-screen-lg gap-6 px-4 py-8 md:px-10 lg:grid-cols-[1fr_360px]">

        {/* ══════════════════════════
            LEFT — Submission content
        ══════════════════════════ */}
        <div className="space-y-6">

          {/* Title block */}
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              {submission.submissionId}
            </p>
            <h1 className="mt-2 font-heading text-2xl font-bold text-navy leading-tight md:text-3xl">
              {submission.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-navy/55">
              <span>{submission.category}</span>
              <span>·</span>
              <span>{submission.researchType.replace(/_/g, " ")}</span>
              <span>·</span>
              <span>Submitted {fmt(submission.submittedAt)}</span>
            </div>
            {submission.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {submission.keywords.map((k) => (
                  <span key={k} className="rounded-full bg-ivory px-2.5 py-1 text-[11px] text-navy/60">
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Author information */}
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-base font-bold text-navy">Author Information</h2>
            {submission.authors.length > 0 ? (
              <div className="space-y-4">
                {submission.authors.map((a, i) => (
                  <div key={i} className="rounded-2xl bg-ivory p-4 text-sm">
                    <p className="font-semibold text-navy">{a.fullName}</p>
                    <p className="text-navy/60">{a.email}</p>
                    {a.institution && <p className="text-navy/55">{a.institution}{a.country ? ` · ${a.country}` : ""}</p>}
                    {a.academicLevel && <p className="text-navy/50">{a.academicLevel}</p>}
                    {a.bio && <p className="mt-2 leading-relaxed text-navy/65">{a.bio}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-navy/55">{submission.user.name} · {submission.user.email}</p>
            )}
          </div>

          {/* Abstract */}
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-heading text-base font-bold text-navy">Abstract</h2>
            <p className="leading-relaxed text-navy/75">{submission.abstract}</p>
          </div>

          {/* Description / methodology */}
          {(submission.description || submission.methodology) && (
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              {submission.description && (
                <div className="mb-5">
                  <h2 className="mb-2 font-heading text-base font-bold text-navy">Description</h2>
                  <p className="whitespace-pre-wrap leading-relaxed text-navy/75">{submission.description}</p>
                </div>
              )}
              {submission.methodology && (
                <div>
                  <h2 className="mb-2 font-heading text-base font-bold text-navy">Methodology</h2>
                  <p className="whitespace-pre-wrap leading-relaxed text-navy/75">{submission.methodology}</p>
                </div>
              )}
            </div>
          )}

          {/* References */}
          {submission.references && (
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-heading text-base font-bold text-navy">References</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy/70">{submission.references}</p>
            </div>
          )}

          {/* Supporting links */}
          {submission.supportingLinks.length > 0 && (
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-heading text-base font-bold text-navy">Supporting Links</h2>
              <ul className="space-y-2">
                {submission.supportingLinks.map((link) => (
                  <li key={link}>
                    <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-sapphire hover:underline break-all">
                      {link} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Uploaded document */}
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-heading text-base font-bold text-navy">Uploaded Document</h2>
            {submission.fileUrl ? (
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-sapphire"
              >
                <FileText className="h-4 w-4" />
                {submission.fileName ?? "Open document"}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p className="text-sm text-navy/50">No file was uploaded with this submission.</p>
            )}

            {submission.versions.length > 1 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-navy/40">
                  Version History
                </p>
                <ul className="mt-2 space-y-1.5">
                  {submission.versions.map((v) => (
                    <li key={v.id} className="text-xs text-navy/60">
                      v{v.versionNumber} — {v.fileName ?? "no file"} — {fmt(v.createdAt)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════
            RIGHT — Review panel
        ══════════════════════════ */}
        <div className="space-y-5">

          {/* Previous review feedback (shown prominently) */}
          {latestReview && (
            <div className={`rounded-3xl border p-5 ${
              latestReview.decision === "APPROVE"
                ? "border-emerald-200 bg-emerald-50"
                : latestReview.decision === "REJECT"
                ? "border-red-200 bg-red-50"
                : "border-orange-200 bg-orange-50"
            }`}>
              <div className="flex items-center gap-2 text-sm font-bold text-navy">
                <MessageSquare className="h-4 w-4" />
                Latest Review
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  latestReview.decision === "APPROVE" ? "bg-emerald-200 text-emerald-800"
                  : latestReview.decision === "REJECT" ? "bg-red-200 text-red-800"
                  : "bg-orange-200 text-orange-800"
                }`}>
                  {latestReview.decision === "APPROVE" ? "Approved"
                    : latestReview.decision === "REJECT" ? "Rejected"
                    : "Revision Requested"}
                </span>
              </div>
              {latestReview.reviewer && (
                <p className="mt-1 text-xs text-navy/50">by {latestReview.reviewer.name}</p>
              )}
              {latestReview.feedback && (
                <p className="mt-2.5 text-sm leading-relaxed text-navy/75">{latestReview.feedback}</p>
              )}
            </div>
          )}

          {/* Review decision panel */}
          {submission.status !== "PUBLISHED" && submission.status !== "REJECTED" && (
            <div className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-heading text-base font-bold text-navy">Review Actions</h2>

              {/* Decision selector */}
              <label className="block text-sm font-semibold text-navy">
                Decision
                <div className="relative mt-1.5">
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as typeof decision)}
                    className="w-full appearance-none rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 pr-9 text-sm font-normal outline-none focus:border-sapphire"
                  >
                    <option value="REQUEST_REVISION">Request Revision</option>
                    <option value="APPROVE">Approve</option>
                    <option value="REJECT">Reject</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45" />
                </div>
              </label>

              {/* Visual decision intent */}
              {decision === "APPROVE" && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  This submission will be moved to <strong>Approved</strong>. An admin can then publish it to the platform.
                </div>
              )}
              {decision === "REJECT" && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  This submission will be <strong>Rejected</strong>. Please provide a clear reason in the feedback below.
                </div>
              )}
              {decision === "REQUEST_REVISION" && (
                <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
                  The author will be notified to revise and resubmit based on your feedback.
                </div>
              )}

              {/* Feedback */}
              <label className="mt-4 block text-sm font-semibold text-navy">
                Reviewer Feedback
                {decision === "REQUEST_REVISION" && (
                  <span className="ml-1 text-orange-600 font-normal text-xs">(required)</span>
                )}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  placeholder={
                    decision === "REQUEST_REVISION"
                      ? "Thank you for your submission. The research question is interesting, but please provide more information about your methodology and add references for the claims in section 3."
                      : decision === "APPROVE"
                      ? "Optional: add a note for the author alongside their approval notification."
                      : "Please explain why this submission is being rejected, so the author can improve future work."
                  }
                  className="mt-2 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
                />
              </label>

              {/* Action buttons */}
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => void saveReview()}
                  disabled={saving || (decision === "REQUEST_REVISION" && !feedback.trim())}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-50 ${
                    decision === "APPROVE"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : decision === "REJECT"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-navy hover:bg-sapphire"
                  }`}
                >
                  {saving ? (
                    "Saving…"
                  ) : (
                    <>
                      {decision === "APPROVE" && <Check className="h-4 w-4" />}
                      {decision === "REJECT" && <X className="h-4 w-4" />}
                      {decision === "REQUEST_REVISION" && <MessageSquare className="h-4 w-4" />}
                      <Save className="h-4 w-4" />
                      Save Review
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Publish panel (admin only, status = APPROVED) */}
          {submission.status === "APPROVED" && (
            <div className="rounded-3xl border border-sapphire/20 bg-sapphire/5 p-5">
              <h2 className="mb-1 font-heading text-base font-bold text-navy">Publish to TOUR</h2>
              <p className="mb-4 text-xs text-navy/55">
                Complete these details, then publish. The article will appear immediately in
                Research &amp; Publications.
              </p>
              <div className="space-y-3">
                {[
                  { key: "title", label: "Publication title", type: "text", placeholder: "Defaults to research title" },
                  { key: "category", label: "Category", type: "text", placeholder: "e.g. Environment" },
                  { key: "coverImage", label: "Cover image URL", type: "text", placeholder: "https://…" },
                  { key: "date", label: "Publication date", type: "date", placeholder: "" },
                ].map(({ key, label, type, placeholder }) => (
                  <label key={key} className="block text-xs font-semibold text-navy">
                    {label}
                    <input
                      type={type}
                      value={pubForm[key as keyof typeof pubForm]}
                      onChange={(e) => setPubForm({ ...pubForm, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="mt-1 w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-xs font-normal outline-none focus:border-sapphire"
                    />
                  </label>
                ))}
                <label className="block text-xs font-semibold text-navy">
                  Summary
                  <textarea
                    value={pubForm.summary}
                    onChange={(e) => setPubForm({ ...pubForm, summary: e.target.value })}
                    rows={3}
                    placeholder="Short description for the listing…"
                    className="mt-1 w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-xs font-normal outline-none focus:border-sapphire"
                  />
                </label>
                <label className="block text-xs font-semibold text-navy">
                  Author bio
                  <textarea
                    value={pubForm.authorBio}
                    onChange={(e) => setPubForm({ ...pubForm, authorBio: e.target.value })}
                    rows={3}
                    placeholder="Short author biography…"
                    className="mt-1 w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-xs font-normal outline-none focus:border-sapphire"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => void publishSubmission()}
                disabled={saving}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sapphire px-5 py-3 text-sm font-semibold text-white hover:bg-navy disabled:opacity-50"
              >
                {saving ? "Publishing…" : "Publish to TOUR"}
              </button>
            </div>
          )}

          {/* Published */}
          {submission.status === "PUBLISHED" && submission.publication && (
            <div className="rounded-3xl border border-teal-200 bg-teal-50 p-5">
              <p className="font-semibold text-teal-800">This research is published.</p>
              <Link
                href={`/publications/${submission.publication.id}`}
                target="_blank"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
              >
                View live article <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
