"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  FlaskConical,
  LayoutGrid,
  Menu,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = "STUDENT" | "MENTOR" | "REVIEWER" | "ADMIN";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  school: string | null;
  createdAt: string;
  _count: {
    submissions: number;
    reviews: number;
  };
}

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
// Brand Helpers & Status Styles
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

const ROLE_STYLES: Record<Role, string> = {
  STUDENT: "bg-sapphire/10 text-sapphire border border-sapphire/20",
  MENTOR: "bg-champagne/50 text-navy border border-taupe/40",
  REVIEWER: "bg-navy/10 text-navy border border-navy/20",
  ADMIN: "bg-navy text-white border border-navy",
};

const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Author",
  MENTOR: "Mentor",
  REVIEWER: "Reviewer",
  ADMIN: "Admin",
};

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  STUDENT: [
    "Create and submit research",
    "Edit drafts",
    "View submission status",
    "Read reviewer feedback",
    "Submit revisions",
  ],
  MENTOR: [
    "All author permissions",
    "Mentor student researchers",
    "Access mentorship tools",
  ],
  REVIEWER: [
    "View assigned submissions",
    "Leave feedback",
    "Request revisions",
    "Recommend approval or rejection",
  ],
  ADMIN: [
    "All reviewer permissions",
    "Manage all submissions",
    "Assign reviewers",
    "Approve and publish research",
    "Manage authors and reviewers",
    "Delete submissions",
  ],
};

function fmt(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function readApiResponse(response: Response): Promise<{ error?: string }> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as { error?: string };
  } catch {
    return {};
  }
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        ROLE_STYLES[role] ?? "bg-navy/10 text-navy border border-navy/20"
      }`}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Content Component
// ---------------------------------------------------------------------------

function AdminDashboardContent() {
  const searchParams = useSearchParams();

  // Navigation tab state: dashboard | submissions | users
  const [activeTab, setActiveTab] = useState<"dashboard" | "submissions" | "users">("dashboard");

  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUserRole, setNewUserRole] = useState<Role>("STUDENT");
  const [userSaving, setUserSaving] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  // Admin Notifications state
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);

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

  // Sync tab with URL search parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "users") {
      setActiveTab("users");
    } else if (tab === "submissions") {
      setActiveTab("submissions");
    } else {
      setActiveTab("dashboard");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "dashboard" | "submissions" | "users") => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    const url = tab === "dashboard" ? "/admin/submissions" : `/admin/submissions?tab=${tab}`;
    window.history.pushState(null, "", url);
  };

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as AdminUser[];
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadAdminNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAdminNotifications(data.notifications || []);
        if (typeof data.unreadCount === "number") {
          setAdminUnreadCount(data.unreadCount);
        }
      }
    } catch {
      // ignore
    }
  };

  const markAllAdminNotificationsRead = async () => {
    setAdminUnreadCount(0);
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch {
      // ignore
    }
  };

  const markSingleAdminNotificationRead = async (n: any) => {
    if (!n.read) {
      setAdminUnreadCount((prev) => Math.max(0, prev - 1));
      setAdminNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id, read: true }),
        });
      } catch {
        // ignore
      }
    }
    if (n.link) {
      setNotifPopoverOpen(false);
    }
  };

  useEffect(() => {
    if (notifPopoverOpen && adminUnreadCount > 0) {
      const timer = setTimeout(() => {
        void markAllAdminNotificationsRead();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [notifPopoverOpen, adminUnreadCount]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [subRes, revRes, usrRes] = await Promise.all([
        fetch("/api/admin/submissions", { cache: "no-store" }),
        fetch("/api/admin/reviewers", { cache: "no-store" }),
        fetch("/api/admin/users", { cache: "no-store" }),
      ]);
      if (subRes.ok) {
        const data = (await subRes.json()) as Submission[];
        setSubmissions(data);
        setSelected((cur) => (cur ? data.find((s) => s.id === cur.id) ?? null : null));
      }
      if (revRes.ok) setReviewers((await revRes.json()) as Reviewer[]);
      if (usrRes.ok) setUsers((await usrRes.json()) as AdminUser[]);
      void loadAdminNotifications();
    } catch (err) {
      console.error("Failed to load submissions or users", err);
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

  const spotlightSubmission = useMemo(() => {
    const priority = submissions.find(
      (s) => s.status === "SUBMITTED" || s.status === "RESUBMITTED" || s.status === "UNDER_REVIEW"
    );
    return priority ?? submissions[0] ?? null;
  }, [submissions]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const underReview = (counts.SUBMITTED ?? 0) + (counts.UNDER_REVIEW ?? 0) + (counts.RESUBMITTED ?? 0);
    const approved = (counts.APPROVED ?? 0) + (counts.PUBLISHED ?? 0);
    const revisionReq = counts.REVISION_REQUESTED ?? 0;
    const rejected = counts.REJECTED ?? 0;
    const published = counts.PUBLISHED ?? 0;
    const acceptanceRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    return { total, underReview, approved, revisionReq, rejected, published, acceptanceRate };
  }, [submissions, counts]);

  // Derived user statistics
  const userCounts = useMemo(
    () =>
      users.reduce<Record<string, number>>((acc, u) => {
        acc[u.role] = (acc[u.role] ?? 0) + 1;
        return acc;
      }, {}),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.school ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, userQuery, roleFilter]);

  // ---------------------------------------------------------------------------
  // Flash messages
  // ---------------------------------------------------------------------------

  const flash = (text: string, ok = true) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 5000);
  };

  // ---------------------------------------------------------------------------
  // Drawer & Submission Actions
  // ---------------------------------------------------------------------------

  const openDrawer = (sub: Submission) => {
    setSelected(sub);
    setReviewerId(sub.assignedReviewer?.id ?? "");
    setPubForm({
      title: sub.title,
      category: sub.category,
      summary: sub.abstract,
      coverImage: "",
      authorBio: sub.authors[0]?.bio ?? "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const closeDrawer = () => {
    setSelected(null);
  };

  const saveReview = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await fetch("/api/admin/submissions", {
      method: "POST",
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
  // User Management Actions
  // ---------------------------------------------------------------------------

  const openEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setNewUserRole(user.role);
  };

  const saveUserRole = async () => {
    if (!editingUser) return;
    setUserSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editingUser.id, role: newUserRole }),
      });
      const data = await readApiResponse(res);
      if (res.ok) {
        flash(`${editingUser.name}'s role updated to ${ROLE_LABELS[newUserRole]}.`);
        setEditingUser(null);
        await loadUsers();
      } else {
        flash(data.error ?? "Unable to update role.", false);
      }
    } catch {
      flash("Failed to update role. Please try again.", false);
    } finally {
      setUserSaving(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    setUserSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deletingUser.id }),
      });
      const data = await readApiResponse(res);
      if (res.ok) {
        flash(`${deletingUser.name} has been removed.`);
        setDeletingUser(null);
        await loadUsers();
      } else {
        flash(data.error ?? "Unable to delete user.", false);
      }
    } catch {
      flash("Failed to delete user. Please try again.", false);
    } finally {
      setUserSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#EBF1F5] p-3 sm:p-5 lg:p-7 flex items-center justify-center font-sans antialiased text-navy">
      {/* ── Floating Main Dashboard Shell ── */}
      <div className="w-full max-w-[1540px] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_24px_70px_rgba(17,34,80,0.07)] border border-navy/10 overflow-hidden flex flex-col lg:flex-row min-h-[920px]">
        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Left Sidebar                                                       */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-60 xl:w-64 border-b lg:border-b-0 lg:border-r border-navy/10 bg-ivory/30 lg:bg-transparent p-5 sm:p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Top Brand / Logo */}
            <div className="flex items-center justify-between lg:justify-start gap-3 mb-8">
              <Link href="/admin/submissions" className="flex items-center gap-2.5">
                <Image
                  src="/logo.png"
                  alt="TOUR"
                  width={115}
                  height={34}
                  priority
                  className="h-6.5 sm:h-7.5 w-auto object-contain"
                />
              </Link>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white text-navy hover:bg-ivory border border-navy/10 transition cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className={`space-y-1.5 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}>
              {/* Tab: Dashboard */}
              <button
                type="button"
                onClick={() => {
                  handleTabChange("dashboard");
                  setStatusFilter("ALL");
                }}
                className={`w-full font-semibold rounded-2xl px-4 py-3 flex items-center gap-3 transition text-sm cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-navy text-white shadow-[0_4px_16px_rgba(17,34,80,0.25)]"
                    : "text-navy/70 hover:text-navy hover:bg-navy/5"
                }`}
              >
                <LayoutGrid className={`h-4 w-4 ${activeTab === "dashboard" ? "text-champagne" : "text-sapphire"}`} />
                <span>Dashboard</span>
              </button>

              {/* Submissions Queue */}
              <button
                type="button"
                onClick={() => {
                  handleTabChange("submissions");
                  setStatusFilter("SUBMITTED");
                }}
                className={`w-full rounded-2xl px-4 py-3 transition flex items-center justify-between text-sm font-medium cursor-pointer ${
                  activeTab === "submissions"
                    ? "bg-navy text-white font-semibold shadow-[0_4px_16px_rgba(17,34,80,0.25)]"
                    : "text-navy/70 hover:text-navy hover:bg-navy/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`h-4 w-4 ${activeTab === "submissions" ? "text-champagne" : "text-sapphire"}`} />
                  <span>Submissions</span>
                </div>
                {submissions.length > 0 && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                      activeTab === "submissions"
                        ? "bg-champagne text-navy border-taupe/30"
                        : "bg-champagne/70 border-taupe/30 text-navy"
                    }`}
                  >
                    {submissions.length}
                  </span>
                )}
              </button>

              {/* Manage Users (Integrated Tab) */}
              <button
                type="button"
                onClick={() => handleTabChange("users")}
                className={`w-full rounded-2xl px-4 py-3 transition flex items-center justify-between text-sm font-medium cursor-pointer ${
                  activeTab === "users"
                    ? "bg-navy text-white font-semibold shadow-[0_4px_16px_rgba(17,34,80,0.25)]"
                    : "text-navy/70 hover:text-navy hover:bg-navy/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`h-4 w-4 ${activeTab === "users" ? "text-champagne" : "text-sapphire"}`} />
                  <span>Manage Users</span>
                </div>
                {users.length > 0 && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                      activeTab === "users"
                        ? "bg-champagne text-navy border-taupe/30"
                        : "bg-champagne/70 border-taupe/30 text-navy"
                    }`}
                  >
                    {users.length}
                  </span>
                )}
              </button>

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
            {/* ── Top Header Bar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
              <div>
                <p className="text-xs sm:text-sm font-medium text-sapphire flex items-center gap-1.5">
                  {activeTab === "users" ? (
                    <>
                      <Shield className="h-3.5 w-3.5" />
                      TOUR Admin • Access Control
                    </>
                  ) : activeTab === "submissions" ? (
                    <>
                      <FileText className="h-3.5 w-3.5" />
                      TOUR Admin • Submissions Queue
                    </>
                  ) : (
                    <>Welcome back, Admin 👋</>
                  )}
                </p>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-0.5">
                  {activeTab === "users"
                    ? "User Management"
                    : activeTab === "submissions"
                      ? "Submissions Queue"
                      : "Dashboard"}
                </h1>
              </div>

              {/* Right Header Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search trigger pill */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-navy/40" />
                  <input
                    type="text"
                    value={activeTab === "users" ? userQuery : query}
                    onChange={(e) => {
                      if (activeTab === "users") {
                        setUserQuery(e.target.value);
                      } else {
                        setQuery(e.target.value);
                      }
                    }}
                    placeholder={activeTab === "users" ? "Search users…" : "Search submissions…"}
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
                  <RefreshCw className={`h-4 w-4 ${loading || usersLoading ? "animate-spin text-sapphire" : ""}`} />
                </button>

                {/* Notification Bell with unread counter & popover */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifPopoverOpen((prev) => !prev);
                      void loadAdminNotifications();
                    }}
                    title="Notifications"
                    className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-navy/70 hover:text-navy hover:bg-ivory border border-navy/15 transition shadow-xs cursor-pointer"
                  >
                    <Bell className="h-4 w-4" />
                    {adminUnreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                        {adminUnreadCount > 9 ? "9+" : adminUnreadCount}
                      </span>
                    )}
                  </button>

                  {notifPopoverOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-80 sm:w-88 overflow-hidden rounded-3xl border border-navy/15 bg-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between border-b border-navy/10 px-4 py-3 bg-ivory/40">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-sapphire" />
                          <span className="font-heading text-xs font-bold text-navy">Notifications</span>
                          {adminUnreadCount > 0 && (
                            <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[9px] font-bold text-white">
                              {adminUnreadCount}
                            </span>
                          )}
                        </div>
                        {adminUnreadCount > 0 && (
                          <button
                            type="button"
                            onClick={() => void markAllAdminNotificationsRead()}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-sapphire hover:text-navy hover:underline cursor-pointer"
                          >
                            <CheckCheck className="h-3 w-3" />
                            <span>Mark all read</span>
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-navy/5">
                        {adminNotifications.length === 0 ? (
                          <div className="py-8 text-center px-4 text-xs text-navy/50">
                            No notifications at this time.
                          </div>
                        ) : (
                          adminNotifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => void markSingleAdminNotificationRead(n)}
                              className={`px-4 py-3 transition cursor-pointer flex items-start gap-2.5 hover:bg-ivory/60 ${
                                !n.read ? "bg-sapphire/5" : "bg-white"
                              }`}
                            >
                              <div
                                className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full shrink-0 ${
                                  !n.read ? "bg-sapphire/15 text-sapphire" : "bg-navy/5 text-navy/40"
                                }`}
                              >
                                {!n.read ? <Bell className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                {n.title && (
                                  <p className="text-xs font-bold text-navy truncate">{n.title}</p>
                                )}
                                <p className={`text-xs leading-snug ${!n.read ? "font-semibold text-navy" : "text-navy/70"}`}>
                                  {n.message}
                                </p>
                                <p className="mt-1 text-[10px] text-navy/40">{fmt(n.createdAt)}</p>
                              </div>
                              {!n.read && (
                                <span className="h-2 w-2 rounded-full bg-sapphire shrink-0 mt-1" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
                  <X className="h-4 w-4 cursor-pointer" />
                </button>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB 1: INTEGRATED USER MANAGEMENT VIEW                         */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* 1. ROLE METRIC SUMMARY CARDS */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { key: "ALL" as const, label: "All Users", count: users.length, icon: Users },
                    { key: "STUDENT" as const, label: "Authors", count: userCounts["STUDENT"] ?? 0, icon: BookOpen },
                    { key: "REVIEWER" as const, label: "Reviewers", count: userCounts["REVIEWER"] ?? 0, icon: UserCheck },
                    { key: "ADMIN" as const, label: "Admins", count: userCounts["ADMIN"] ?? 0, icon: Award },
                  ].map((card) => {
                    const isSelected = roleFilter === card.key;
                    const Icon = card.icon;
                    return (
                      <button
                        key={card.key}
                        type="button"
                        onClick={() => setRoleFilter(card.key)}
                        className={`rounded-3xl p-4 sm:p-5 text-left transition border cursor-pointer ${
                          isSelected
                            ? "border-navy bg-navy text-white shadow-md"
                            : "border-navy/10 bg-white hover:border-navy/25 hover:shadow-xs text-navy"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isSelected ? "text-champagne" : "text-navy/50"
                            }`}
                          >
                            {card.label}
                          </p>
                          <Icon className={`h-4 w-4 ${isSelected ? "text-champagne" : "text-sapphire"}`} />
                        </div>
                        <p className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
                          {card.count}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* 2. SEARCH & ROLE FILTER BAR */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                      <input
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        placeholder="Search by name, email, or institution…"
                        className="w-full rounded-2xl border border-navy/10 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-navy outline-none focus:border-sapphire focus:ring-2 focus:ring-sapphire/20 transition"
                      />
                    </div>

                    {/* Role Filter Dropdown */}
                    <div className="relative sm:w-52">
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as Role | "ALL")}
                        className="w-full appearance-none rounded-2xl border border-navy/10 bg-white px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-navy outline-none focus:border-sapphire focus:ring-2 focus:ring-sapphire/20 transition cursor-pointer"
                      >
                        <option value="ALL">All Roles ({users.length})</option>
                        <option value="STUDENT">Authors ({userCounts["STUDENT"] ?? 0})</option>
                        <option value="MENTOR">Mentors ({userCounts["MENTOR"] ?? 0})</option>
                        <option value="REVIEWER">Reviewers ({userCounts["REVIEWER"] ?? 0})</option>
                        <option value="ADMIN">Admins ({userCounts["ADMIN"] ?? 0})</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                    </div>
                  </div>

                  <span className="text-xs text-navy/55 px-1">
                    Showing <strong>{filteredUsers.length}</strong> of {users.length} accounts
                  </span>
                </div>

                {/* 3. ROLE PERMISSIONS REFERENCE (Accordion) */}
                <details className="group rounded-3xl border border-navy/10 bg-white overflow-hidden transition shadow-[0_4px_24px_rgba(17,34,80,0.02)]">
                  <summary className="flex cursor-pointer items-center justify-between px-5 sm:px-6 py-4 text-xs sm:text-sm font-bold text-navy hover:bg-ivory/50 transition">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-sapphire" />
                      <span>Role Permissions Reference</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-navy/40 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="grid gap-4 border-t border-navy/8 bg-ivory/30 px-5 sm:px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
                    {(["STUDENT", "MENTOR", "REVIEWER", "ADMIN"] as Role[]).map((r) => (
                      <div key={r} className="rounded-2xl border border-navy/10 bg-white p-4 shadow-2xs">
                        <RoleBadge role={r} />
                        <ul className="mt-3 space-y-1.5">
                          {ROLE_PERMISSIONS[r].map((p) => (
                            <li key={p} className="flex items-start gap-1.5 text-xs text-navy/70 leading-snug">
                              <span className="mt-1 h-1 w-1 rounded-full bg-sapphire shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>

                {/* 4. USER DIRECTORY TABLE CARD */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold text-navy">User Directory</span>
                      <p className="text-[11px] text-navy/50">Manage author, mentor, reviewer, and admin access</p>
                    </div>
                    {roleFilter !== "ALL" && (
                      <button
                        type="button"
                        onClick={() => setRoleFilter("ALL")}
                        className="text-xs font-semibold text-sapphire hover:underline cursor-pointer"
                      >
                        Reset filter
                      </button>
                    )}
                  </div>

                  {usersLoading && users.length === 0 ? (
                    <div className="py-12 text-center text-xs text-navy/60">
                      <RefreshCw className="mx-auto h-5 w-5 animate-spin text-sapphire mb-2" />
                      Loading users directory…
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-12 text-center text-xs text-navy/60">
                      No accounts match your current search or filter.
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-navy/10 text-[10px] font-bold uppercase tracking-wider text-navy/60">
                            <th className="pb-3 pl-2">User</th>
                            <th className="pb-3 hidden sm:table-cell">Email</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3 hidden md:table-cell">Institution</th>
                            <th className="pb-3 hidden lg:table-cell">Activity</th>
                            <th className="pb-3 hidden sm:table-cell">Joined</th>
                            <th className="pb-3 text-right pr-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="group hover:bg-ivory/50 transition">
                              {/* User Name & Avatar */}
                              <td className="py-3.5 pl-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-full bg-sapphire/10 text-navy font-bold text-xs grid place-items-center shrink-0 border border-sapphire/20">
                                    {u.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-navy group-hover:text-sapphire transition">
                                      {u.name}
                                    </p>
                                    <p className="text-[10px] text-navy/50 sm:hidden">
                                      {u.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Email */}
                              <td className="py-3.5 pr-3 text-navy/70 hidden sm:table-cell">
                                {u.email}
                              </td>

                              {/* Role Badge */}
                              <td className="py-3.5 pr-3">
                                <RoleBadge role={u.role} />
                              </td>

                              {/* Institution */}
                              <td className="py-3.5 pr-3 text-navy/60 hidden md:table-cell">
                                {u.school ?? "—"}
                              </td>

                              {/* Activity */}
                              <td className="py-3.5 pr-3 text-navy/70 hidden lg:table-cell">
                                <span className="font-semibold">{u._count.submissions}</span> sub ·{" "}
                                <span className="font-semibold">{u._count.reviews}</span> rev
                              </td>

                              {/* Joined */}
                              <td className="py-3.5 pr-3 text-navy/50 hidden sm:table-cell">
                                {fmt(u.createdAt)}
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 text-right pr-2">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditUser(u)}
                                    className="inline-flex items-center gap-1 rounded-full border border-navy/15 bg-white px-3 py-1 text-[11px] font-semibold text-navy hover:bg-navy hover:text-white transition cursor-pointer"
                                  >
                                    Change role
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingUser(u)}
                                    disabled={userSaving}
                                    aria-label={`Delete ${u.name}`}
                                    className="rounded-full p-1.5 text-navy/35 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer disabled:opacity-40"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB 2 & 3: DASHBOARD & SUBMISSIONS QUEUE VIEWS                 */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab !== "users" && (
              <div
                className={`grid grid-cols-1 ${
                  activeTab === "submissions" ? "lg:grid-cols-1" : "lg:grid-cols-12"
                } gap-5 xl:gap-6 animate-in fade-in duration-200`}
              >
                {/* ──────────────────────────────────────────────────────────── */}
                {/* Left Column (or Full Width on Submissions Tab)               */}
                {/* ──────────────────────────────────────────────────────────── */}
                <div
                  className={`${
                    activeTab === "submissions" ? "w-full" : "lg:col-span-7"
                  } flex flex-col gap-5 xl:gap-6`}
                >
                  {/* 1. TOP CARD: Spotlight Priority Submission Card */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-navy">
                        Next in Review Queue
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          handleTabChange("submissions");
                          setStatusFilter("ALL");
                        }}
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

                        {/* Matchup Nodes */}
                        <div className="flex items-center justify-around py-3 px-2 rounded-2xl bg-ivory/60 border border-navy/10">
                          {/* Author Node */}
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

                          {/* Center VS Node */}
                          <div className="flex flex-col items-center gap-1">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-champagne text-navy font-black text-xs shadow-xs border border-taupe/30">
                              VS
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                              Peer Review
                            </span>
                          </div>

                          {/* Research Topic & Title */}
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

                  {/* 2. SUBMISSIONS QUEUE TABLE CARD */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <span className="text-xs font-bold text-navy">
                          Submissions Queue
                        </span>
                        <p className="text-[11px] text-navy/50">
                          {filtered.length} paper{filtered.length === 1 ? "" : "s"} listed
                        </p>
                      </div>

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

                    {/* Table */}
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
                {/* Right Column (Overview Cards on Dashboard Tab)               */}
                {/* ──────────────────────────────────────────────────────────── */}
                {activeTab === "dashboard" && (
                  <div className="lg:col-span-5 flex flex-col gap-5 xl:gap-6">
                    {/* 3. TOP-RIGHT CARD: Editorial Pipeline Card */}
                    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-navy">
                          Editorial Pipeline
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            handleTabChange("submissions");
                            setStatusFilter("ALL");
                          }}
                          className="text-xs font-semibold text-sapphire hover:underline cursor-pointer"
                        >
                          Details
                        </button>
                      </div>

                      {/* Visual Pipeline Bars */}
                      <div className="space-y-3.5 mt-2">
                        {[
                          {
                            label: "In Review Queue",
                            count: stats.underReview,
                            pct: stats.total > 0 ? (stats.underReview / stats.total) * 100 : 0,
                            barColor: "bg-sapphire",
                          },
                          {
                            label: "Approved & Published",
                            count: stats.approved,
                            pct: stats.total > 0 ? (stats.approved / stats.total) * 100 : 0,
                            barColor: "bg-navy",
                          },
                          {
                            label: "Revision Requested",
                            count: stats.revisionReq,
                            pct: stats.total > 0 ? (stats.revisionReq / stats.total) * 100 : 0,
                            barColor: "bg-champagne",
                          },
                          {
                            label: "Rejected",
                            count: stats.rejected,
                            pct: stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0,
                            barColor: "bg-rose-500",
                          },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-navy/70">{item.label}</span>
                              <span className="font-bold text-navy">
                                {item.count}{" "}
                                <span className="font-normal text-navy/40 text-[10px]">
                                  ({Math.round(item.pct)}%)
                                </span>
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-ivory border border-navy/5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                                style={{ width: `${Math.max(item.pct, item.count > 0 ? 8 : 0)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. METRICS / ACCEPTANCE STATS CARD */}
                    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(17,34,80,0.03)] border border-navy/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-navy">Key Highlights</span>
                        <TrendingUp className="h-4 w-4 text-sapphire" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center mt-4">
                        <div className="rounded-2xl bg-ivory/60 border border-navy/10 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                            Total Papers
                          </p>
                          <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                            {stats.total}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-ivory/60 border border-navy/10 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                            Active Users
                          </p>
                          <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                            {users.length}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-ivory/60 border border-navy/10 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-navy/60">
                            Acceptance
                          </p>
                          <p className="font-heading text-base sm:text-lg font-extrabold text-navy">
                            {stats.acceptanceRate}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 5. BOTTOM-RIGHT CALLOUT BANNER */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-[#1b3470] to-sapphire p-5 sm:p-6 text-white shadow-md border border-navy/20">
                      {/* Subtle champagne light accents */}
                      <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-champagne/15 blur-xl" />
                      <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full bg-sapphire/30 blur-lg" />

                      <div className="relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-champagne">
                          Editorial &amp; Team Control
                        </span>
                        <h3 className="font-heading text-base sm:text-lg font-extrabold leading-snug text-white mt-1 max-w-[260px]">
                          Manage Authors, Reviewers &amp; Team Roles
                        </h3>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => handleTabChange("users")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy shadow-sm hover:bg-ivory transition cursor-pointer"
                          >
                            <span>Manage Users &amp; Roles</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
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

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Role Change Modal                                                  */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-navy/15 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sapphire">
                  Role Assignment
                </span>
                <h2 className="font-heading text-xl font-bold text-navy mt-0.5">Change Role</h2>
                <p className="mt-1 text-xs text-navy/60">
                  Updating permissions for <strong className="text-navy">{editingUser.name}</strong> ({editingUser.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-full p-2 text-navy/40 hover:bg-ivory hover:text-navy transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current role */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-ivory/60 border border-navy/10 px-4 py-3 text-xs">
              <span className="text-navy/60 font-medium">Current role:</span>
              <RoleBadge role={editingUser.role} />
            </div>

            {/* New role select */}
            <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-navy/70">
              New Role Assignment
              <div className="relative mt-1.5">
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full appearance-none rounded-xl border border-navy/15 bg-white px-3 py-2.5 pr-9 text-xs font-medium text-navy outline-none focus:border-sapphire"
                >
                  <option value="STUDENT">Author (Student Researcher)</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
              </div>
            </label>

            {/* Permissions preview */}
            <div className="mt-4 rounded-2xl border border-navy/10 bg-ivory/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-3.5 w-3.5 text-sapphire" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy/60">
                  {ROLE_LABELS[newUserRole]} Permissions
                </p>
              </div>
              <ul className="space-y-1.5">
                {ROLE_PERMISSIONS[newUserRole].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-navy/70">
                    <span className="mt-1 h-1 w-1 rounded-full bg-sapphire shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy hover:bg-ivory cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveUserRole()}
                disabled={userSaving || newUserRole === editingUser.role}
                className="rounded-full bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-sapphire transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {userSaving ? "Saving…" : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Delete User Confirmation Modal                                     */}
      {/* ────────────────────────────────────────────────────────────────── */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-navy/15 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-full bg-rose-50 grid place-items-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-navy">Delete User Account</h2>
                <p className="text-xs text-navy/60">This action cannot be undone.</p>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-navy/75 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deletingUser.name}</strong> (
              <span className="text-navy/60">{deletingUser.email}</span>)? All associated account data will be
              permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy hover:bg-ivory cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmDeleteUser()}
                disabled={userSaving}
                className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {userSaving ? "Deleting…" : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page with Suspense
// ---------------------------------------------------------------------------

export default function AdminSubmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EBF1F5] flex items-center justify-center p-6 text-navy">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-navy/10 text-sm font-semibold">
            <RefreshCw className="h-5 w-5 animate-spin text-sapphire" />
            Loading TOUR Admin Dashboard…
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
