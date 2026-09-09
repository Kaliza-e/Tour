"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  RotateCcw,
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

interface Submission {
  id: string;
  submissionId: string;
  title: string;
  abstract: string;
  category: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  updatedAt: string;
  reviews: Review[];
  publication: { id: string } | null;
  versions: { id: string; versionNumber: number }[];
  assignedReviewer: { name: string } | null;
  fileName: string | null;
  fileUrl: string | null;
}

interface Notification {
  id: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
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

function fmt(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusIcon({ status }: { status: string }) {
  if (status === "PUBLISHED" || status === "APPROVED")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "REVISION_REQUESTED")
    return <AlertCircle className="h-4 w-4 text-orange-500" />;
  if (status === "UNDER_REVIEW" || status === "SUBMITTED")
    return <Clock className="h-4 w-4 text-amber-500" />;
  if (status === "RESUBMITTED")
    return <RotateCcw className="h-4 w-4 text-violet-500" />;
  if (status === "REJECTED")
    return <X className="h-4 w-4 text-red-500" />;
  return <FileText className="h-4 w-4 text-slate-400" />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuthorDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; role?: string } | undefined;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load submissions
  useEffect(() => {
    void (async () => {
      setLoadingSubs(true);
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (res.ok) setSubmissions((await res.json()) as Submission[]);
      setLoadingSubs(false);
    })();
  }, []);

  // Load notifications
  const loadNotifications = async () => {
    const res = await fetch("/api/notifications", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { notifications: Notification[]; unreadCount: number };
      setNotifications(data.notifications);
      setUnread(data.unreadCount);
    }
  };

  useEffect(() => { void loadNotifications(); }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Derived counts
  const published = submissions.filter((s) => s.status === "PUBLISHED").length;
  const underReview = submissions.filter((s) =>
    ["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED"].includes(s.status)
  ).length;
  const needsRevision = submissions.filter((s) => s.status === "REVISION_REQUESTED").length;

  return (
    <main className="min-h-screen bg-ivory">

      {/* ── Top bar ── */}
      <div className="border-b border-navy/10 bg-white px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy/55 hover:text-navy"
            >
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              TOUR workspace
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold text-navy">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications((open) => !open);
                if (!showNotifications && unread > 0) void markAllRead();
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy hover:bg-ivory"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-navy/10 px-4 py-3">
                  <p className="text-sm font-bold text-navy">Notifications</p>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-full p-1 text-navy/40 hover:text-navy"
                    aria-label="Close notifications"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-navy/8">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-navy/50">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 ${!n.read ? "bg-sapphire/5" : ""}`}
                      >
                        {n.link ? (
                          <Link
                            href={n.link}
                            onClick={() => setShowNotifications(false)}
                            className="block"
                          >
                            <p className={`text-sm leading-relaxed ${!n.read ? "font-semibold text-navy" : "text-navy/70"}`}>
                              {n.message}
                            </p>
                            <p className="mt-0.5 text-[11px] text-navy/40">{fmt(n.createdAt)}</p>
                          </Link>
                        ) : (
                          <>
                            <p className={`text-sm leading-relaxed ${!n.read ? "font-semibold text-navy" : "text-navy/70"}`}>
                              {n.message}
                            </p>
                            <p className="mt-0.5 text-[11px] text-navy/40">{fmt(n.createdAt)}</p>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-10">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total submissions", value: submissions.length, icon: <FileText className="h-5 w-5 text-sapphire/70" /> },
            { label: "Under review", value: underReview, icon: <Clock className="h-5 w-5 text-amber-500" /> },
            { label: "Needs revision", value: needsRevision, icon: <AlertCircle className="h-5 w-5 text-orange-500" /> },
            { label: "Published", value: published, icon: <BookOpen className="h-5 w-5 text-teal-500" /> },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-navy/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy/45">{label}</p>
                {icon}
              </div>
              <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Urgent: revision requested ── */}
        {needsRevision > 0 && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="font-semibold text-orange-800">
                {needsRevision} submission{needsRevision > 1 ? "s need" : " needs"} revision
              </p>
            </div>
            <p className="mt-1 text-sm text-orange-700">
              Review the feedback from your reviewer and submit revised work.
            </p>
            <Link
              href="/my-submissions"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 hover:underline"
            >
              Go to My Submissions <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* ── My Research / Submissions section ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-navy">My Research</h2>
            <Link
              href="/my-submissions"
              className="text-sm font-semibold text-sapphire hover:underline"
            >
              View all
            </Link>
          </div>

          {loadingSubs ? (
            <p className="mt-6 text-sm text-navy/50">Loading your submissions…</p>
          ) : submissions.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-navy/20 bg-white p-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-sapphire/40" />
              <p className="mt-3 font-semibold text-navy">No submissions yet</p>
              <p className="mt-1 text-sm text-navy/55">
                Ready to share your research with the world?
              </p>
              <Link
                href="/get-published"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire"
              >
                Submit your research
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {submissions.map((s) => {
                const latestReview = s.reviews[0] ?? null;
                const needsRevisionNow = s.status === "REVISION_REQUESTED";

                return (
                  <article
                    key={s.id}
                    className={`flex flex-col rounded-3xl border bg-white p-5 shadow-sm transition ${
                      needsRevisionNow
                        ? "border-orange-200 ring-1 ring-orange-100"
                        : "border-navy/10"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-sapphire">
                          {s.submissionId}
                        </p>
                        <h3 className="mt-1 font-heading text-base font-bold text-navy leading-snug line-clamp-2">
                          {s.title}
                        </h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <StatusIcon status={s.status} />
                      </div>
                    </div>

                    {/* Category + date */}
                    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-navy/50">
                      <span>{s.category}</span>
                      <span>·</span>
                      <span>Submitted {fmt(s.submittedAt ?? s.createdAt)}</span>
                    </div>

                    {/* Status badge */}
                    <div className="mt-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[s.status] ?? STATUS_STYLES.DRAFT}`}>
                        {STATUS_LABELS[s.status] ?? s.status}
                      </span>
                    </div>

                    {/* Reviewer feedback excerpt */}
                    {latestReview?.feedback && (
                      <div className={`mt-3 rounded-xl border p-3 text-xs leading-relaxed ${
                        latestReview.decision === "APPROVE"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : latestReview.decision === "REJECT"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-orange-200 bg-orange-50 text-orange-800"
                      }`}>
                        <p className="font-semibold mb-1">Reviewer feedback:</p>
                        <p className="line-clamp-3">{latestReview.feedback}</p>
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-navy/8 pt-4">
                      <Link
                        href="/my-submissions"
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-ivory"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View Submission
                      </Link>

                      {needsRevisionNow && (
                        <Link
                          href="/my-submissions"
                          className="inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Resubmit Revision
                        </Link>
                      )}

                      {s.status === "PUBLISHED" && s.publication && (
                        <Link
                          href={`/publications/${s.publication.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          View Article
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick links ── */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            {
              href: "/get-published",
              icon: <FileText className="h-5 w-5 text-sapphire" />,
              title: "Submit Research",
              desc: "Share new work with TOUR",
            },
            {
              href: "/research",
              icon: <BookOpen className="h-5 w-5 text-sapphire" />,
              title: "Browse Publications",
              desc: "Read published student research",
            },
            {
              href: "/my-submissions",
              icon: <Clock className="h-5 w-5 text-sapphire" />,
              title: "All Submissions",
              desc: "Track every submission",
            },
          ].map(({ href, icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-2xl border border-navy/10 bg-white p-4 shadow-sm transition hover:border-navy/25 hover:shadow"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sapphire/8">
                {icon}
              </div>
              <div>
                <p className="text-sm font-bold text-navy">{title}</p>
                <p className="text-xs text-navy/55">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
