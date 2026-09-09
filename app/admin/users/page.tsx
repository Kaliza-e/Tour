"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = "STUDENT" | "MENTOR" | "REVIEWER" | "ADMIN";

interface User {
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

async function readApiResponse(response: Response): Promise<{ error?: string }> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as { error?: string };
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROLE_STYLES: Record<Role, string> = {
  STUDENT: "bg-blue-50 text-blue-700 border border-blue-200",
  MENTOR: "bg-violet-50 text-violet-700 border border-violet-200",
  REVIEWER: "bg-amber-50 text-amber-700 border border-amber-200",
  ADMIN: "bg-rose-50 text-rose-700 border border-rose-200",
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

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Role badge component
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ROLE_STYLES[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  // Role change modal
  const [editing, setEditing] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>("STUDENT");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.ok) setUsers((await res.json()) as User[]);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  // ── Derived ──
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.school ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, query, roleFilter]);

  const counts = useMemo(
    () => users.reduce<Record<string, number>>((acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1;
      return acc;
    }, {}),
    [users]
  );

  // ── Flash ──
  const flash = (text: string, ok = true) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 5000);
  };

  // ── Open role editor ──
  const openEdit = (user: User) => {
    setEditing(user);
    setNewRole(user.role);
  };

  // ── Save role ──
  const saveRole = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: editing.id, role: newRole }),
    });
    const data = await readApiResponse(res);
    if (res.ok) {
      flash(`${editing.name}'s role updated to ${ROLE_LABELS[newRole]}.`);
      setEditing(null);
      await load();
    } else {
      flash(data.error ?? "Unable to update role.", false);
    }
    setSaving(false);
  };

  // ── Delete user ──
  const deleteUser = async (user: User) => {
    if (
      !window.confirm(
        `Delete "${user.name}" (${user.email})?\n\nThis will permanently remove their account and all associated data.`
      )
    )
      return;
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await readApiResponse(res);
    if (res.ok) {
      flash(`${user.name} has been removed.`);
      await load();
    } else {
      flash(data.error ?? "Unable to delete user.", false);
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
            href="/admin/submissions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/55 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Back to submissions
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
                TOUR Admin
              </p>
              <h1 className="mt-1.5 font-heading text-2xl font-bold text-navy md:text-3xl">
                User Management
              </h1>
              <p className="mt-1 text-sm text-navy/55">
                Manage author and reviewer accounts and assign roles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-10">

        {/* ── Role summary cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["ALL", "STUDENT", "REVIEWER", "ADMIN"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`rounded-2xl border p-3 text-left transition ${
                roleFilter === r
                  ? "border-navy bg-navy text-white"
                  : "border-navy/10 bg-white hover:border-navy/25"
              }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider ${roleFilter === r ? "text-white/60" : "text-navy/45"}`}>
                {r === "ALL" ? "All users" : r === "STUDENT" ? "Authors" : r === "REVIEWER" ? "Reviewers" : "Admins"}
              </p>
              <p className="mt-1.5 text-2xl font-bold">
                {r === "ALL" ? users.length : counts[r] ?? 0}
              </p>
            </button>
          ))}
        </div>

        {/* ── Flash ── */}
        {message && (
          <div className={`mt-5 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium ${
            message.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}>
            {message.text}
            <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Search + role filter ── */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or institution…"
              className="w-full rounded-xl border border-navy/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sapphire"
            />
          </label>
          <label className="relative sm:w-44">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "ALL")}
              className="w-full appearance-none rounded-xl border border-navy/10 bg-white px-3 py-2.5 pr-8 text-sm outline-none focus:border-sapphire"
            >
              <option value="ALL">All roles</option>
              <option value="STUDENT">Authors</option>
              <option value="MENTOR">Mentors</option>
              <option value="REVIEWER">Reviewers</option>
              <option value="ADMIN">Admins</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45" />
          </label>
        </div>

        {/* ── Role permissions reference ── */}
        <details className="mt-4 rounded-2xl border border-navy/10 bg-white">
          <summary className="flex cursor-pointer items-center gap-2 px-5 py-3.5 text-sm font-semibold text-navy hover:bg-ivory/60">
            <Shield className="h-4 w-4 text-sapphire" />
            Role permissions reference
            <ChevronDown className="ml-auto h-4 w-4 text-navy/45" />
          </summary>
          <div className="grid gap-4 border-t border-navy/8 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["STUDENT", "MENTOR", "REVIEWER", "ADMIN"] as Role[]).map((r) => (
              <div key={r}>
                <RoleBadge role={r} />
                <ul className="mt-2 space-y-1">
                  {ROLE_PERMISSIONS[r].map((p) => (
                    <li key={p} className="flex items-start gap-1.5 text-xs text-navy/65">
                      <span className="mt-0.5 text-sapphire">·</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>

        {/* ── User table ── */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-navy/50">Loading users…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-navy/50">No users match this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-navy/10 bg-ivory/60">
                    {["Name", "Email", "Role", "Institution", "Submissions", "Joined", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-navy/45"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/8">
                  {filtered.map((u) => (
                    <tr key={u.id} className="group transition-colors hover:bg-ivory/60">
                      <td className="px-5 py-4 font-semibold text-navy">{u.name}</td>
                      <td className="px-5 py-4 text-navy/65">{u.email}</td>
                      <td className="px-5 py-4">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-5 py-4 text-navy/55">{u.school ?? "—"}</td>
                      <td className="px-5 py-4 text-navy/65">
                        {u._count.submissions} sub · {u._count.reviews} rev
                      </td>
                      <td className="px-5 py-4 text-navy/50">{fmt(u.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-ivory"
                          >
                            Change role
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteUser(u)}
                            disabled={saving}
                            aria-label={`Delete ${u.name}`}
                            className="rounded-full p-1.5 text-navy/30 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* ── Role change modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-navy">Change Role</h2>
                <p className="mt-1 text-sm text-navy/55">
                  Updating role for <strong>{editing.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full p-2 text-navy/40 hover:bg-ivory hover:text-navy"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current role */}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-ivory px-4 py-3 text-sm">
              <span className="text-navy/55">Current role:</span>
              <RoleBadge role={editing.role} />
            </div>

            {/* New role select */}
            <label className="mt-4 block text-sm font-semibold text-navy">
              New role
              <div className="relative mt-1.5">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full appearance-none rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 pr-9 text-sm font-normal outline-none focus:border-sapphire"
                >
                  <option value="STUDENT">Author (Student)</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45" />
              </div>
            </label>

            {/* Permissions preview */}
            <div className="mt-3 rounded-xl border border-navy/10 bg-ivory/60 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-navy/40">
                {ROLE_LABELS[newRole]} permissions
              </p>
              <ul className="mt-2 space-y-1">
                {ROLE_PERMISSIONS[newRole].map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-xs text-navy/65">
                    <span className="mt-0.5 text-sapphire">·</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-ivory"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveRole()}
                disabled={saving || newRole === editing.role}
                className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire disabled:opacity-50"
              >
                {saving ? "Saving…" : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
