"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  ExternalLink,
  FileText,
  FlaskConical,
  Lightbulb,
  Link2,
  Loader2,
  MessageSquare,
  PenLine,
  Plus,
  RefreshCw,
  SendHorizonal,
  StickyNote,
  Target,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProjectStage = "WORKSPACE" | "RESEARCH" | "DRAFT" | "SUBMISSION" | "PUBLICATION";

interface Task {
  id: string;
  title: string;
  done: boolean;
  dueDate: string | null;
  createdAt: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Reference {
  id: string;
  citation: string;
  url: string | null;
}

interface FileAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

interface Paper {
  id: string;
  title: string;
  status: string;
  abstract: string | null;
  pdfUrl: string | null;
  views: number;
  citationCount: number;
  submittedAt: string | null;
  publishedAt: string | null;
}

interface ResearchProject {
  id: string;
  title: string;
  researchGoal: string;
  hypothesis: string | null;
  objectives: string[];
  stage: ProjectStage;
  progress: number;
  createdAt: string;
  updatedAt: string;
  category: { name: string; slug: string };
  tasks: Task[];
  notes: Note[];
  references: Reference[];
  files: FileAsset[];
  paper: Paper | null;
  question: { id: string; title: string; status: string } | null;
  collaborators: {
    id: string;
    role: string;
    user: { id: string; name: string; email: string; image: string | null };
  }[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STAGES: { key: ProjectStage; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    key: "WORKSPACE",
    label: "Workspace",
    icon: <Lightbulb className="h-4 w-4" />,
    desc: "Define your research question and goals",
  },
  {
    key: "RESEARCH",
    label: "Research",
    icon: <FlaskConical className="h-4 w-4" />,
    desc: "Collect data, take notes, build references",
  },
  {
    key: "DRAFT",
    label: "Draft",
    icon: <PenLine className="h-4 w-4" />,
    desc: "Write and refine your paper",
  },
  {
    key: "SUBMISSION",
    label: "Submission",
    icon: <SendHorizonal className="h-4 w-4" />,
    desc: "Submit to TOUR for peer review",
  },
  {
    key: "PUBLICATION",
    label: "Published",
    icon: <BookOpen className="h-4 w-4" />,
    desc: "Live on TOUR Research & Publications",
  },
];

const STAGE_ORDER: Record<ProjectStage, number> = {
  WORKSPACE: 0,
  RESEARCH: 1,
  DRAFT: 2,
  SUBMISSION: 3,
  PUBLICATION: 4,
};

const PAPER_STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-50 text-blue-700 border border-blue-200",
  IN_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PUBLISHED: "bg-teal-50 text-teal-700 border border-teal-200",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(date: string | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", opts ?? { month: "short", day: "numeric", year: "numeric" });
}

function fmtBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function stageColor(stage: ProjectStage, active: boolean) {
  const colors: Record<ProjectStage, { active: string; inactive: string }> = {
    WORKSPACE: { active: "bg-sapphire text-white", inactive: "bg-sapphire/10 text-sapphire" },
    RESEARCH:  { active: "bg-amber-500 text-white", inactive: "bg-amber-50 text-amber-600" },
    DRAFT:     { active: "bg-violet-600 text-white", inactive: "bg-violet-50 text-violet-600" },
    SUBMISSION:{ active: "bg-blue-600 text-white", inactive: "bg-blue-50 text-blue-600" },
    PUBLICATION:{ active: "bg-teal-600 text-white", inactive: "bg-teal-50 text-teal-600" },
  };
  return active ? colors[stage].active : colors[stage].inactive;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// Progress bar
function ProgressBar({ value, stage }: { value: number; stage: ProjectStage }) {
  const trackColor: Record<ProjectStage, string> = {
    WORKSPACE:   "bg-sapphire",
    RESEARCH:    "bg-amber-500",
    DRAFT:       "bg-violet-600",
    SUBMISSION:  "bg-blue-600",
    PUBLICATION: "bg-teal-600",
  };
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-navy/10">
      <div
        className={`h-full rounded-full transition-all duration-700 ${trackColor[stage]}`}
        style={{ width: `${Math.max(2, value)}%` }}
      />
    </div>
  );
}

// Stage pipeline strip
function StagePipeline({ current }: { current: ProjectStage }) {
  const currentIdx = STAGE_ORDER[current];
  return (
    <div className="flex items-center gap-0" role="list" aria-label="Research pipeline">
      {STAGES.map((s, i) => {
        const done = STAGE_ORDER[s.key] < currentIdx;
        const active = s.key === current;
        return (
          <div key={s.key} className="flex items-center" role="listitem">
            <div
              title={s.desc}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? stageColor(s.key, true)
                  : done
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-navy/8 text-navy/40"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STAGES.length - 1 && (
              <ChevronRight
                className={`mx-0.5 h-3.5 w-3.5 shrink-0 ${
                  STAGE_ORDER[s.key] < currentIdx ? "text-emerald-400" : "text-navy/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// New project modal
// ---------------------------------------------------------------------------

interface NewProjectModalProps {
  onClose: () => void;
  onCreated: (project: ResearchProject) => void;
}

function NewProjectModal({ onClose, onCreated }: NewProjectModalProps) {
  const [form, setForm] = useState({
    title: "",
    researchGoal: "",
    hypothesis: "",
    categoryName: "",
    objectives: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/researcher/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          researchGoal: form.researchGoal,
          hypothesis: form.hypothesis || undefined,
          categoryName: form.categoryName || "General",
          objectives: form.objectives
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean),
        }),
      });
      const data = (await res.json()) as { error?: string; project?: ResearchProject };
      if (!res.ok) throw new Error(data.error ?? "Unable to create project.");
      onCreated(data.project!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 px-4 py-12 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-7 py-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy">New Research Project</h2>
            <p className="mt-0.5 text-sm text-navy/55">
              Start by defining your research question and goal.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 text-navy/40 hover:bg-ivory hover:text-navy">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-7 py-5">
          <label className="block text-sm font-semibold text-navy">
            Research title <span className="text-red-500">*</span>
            <input
              required
              minLength={3}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. The Effects of Urban Air Pollution on Plant Growth"
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal outline-none focus:border-sapphire"
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Research goal / question <span className="text-red-500">*</span>
            <textarea
              required
              minLength={10}
              rows={3}
              value={form.researchGoal}
              onChange={(e) => setForm({ ...form, researchGoal: e.target.value })}
              placeholder="What are you trying to discover, prove, or understand?"
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Hypothesis (optional)
            <textarea
              rows={2}
              value={form.hypothesis}
              onChange={(e) => setForm({ ...form, hypothesis: e.target.value })}
              placeholder="What do you predict the outcome will be?"
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Category
            <input
              value={form.categoryName}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
              placeholder="e.g. Environment, Biology, Technology…"
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal outline-none focus:border-sapphire"
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Objectives (one per line, optional)
            <textarea
              rows={3}
              value={form.objectives}
              onChange={(e) => setForm({ ...form, objectives: e.target.value })}
              placeholder={"Measure particulate matter levels\nAnalyse leaf stomata samples\nCompare urban vs. rural sites"}
              className="mt-1.5 w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
            />
          </label>
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
          )}
          <div className="flex justify-end gap-3 border-t border-navy/10 pt-4">
            <button type="button" onClick={onClose} className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-ivory">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project detail panel
// ---------------------------------------------------------------------------

interface ProjectDetailProps {
  project: ResearchProject;
  onUpdate: (updated: ResearchProject) => void;
  onClose: () => void;
}

function ProjectDetail({ project, onUpdate, onClose }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "notes" | "references" | "files">("overview");
  const [savingTask, setSavingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newRef, setNewRef] = useState({ citation: "", url: "" });
  const [working, setWorking] = useState(false);

  const patchProject = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch(`/api/researcher/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // Reload full project
        const reload = await fetch(`/api/researcher/projects/${project.id}`, { cache: "no-store" });
        if (reload.ok) onUpdate((await reload.json()) as ResearchProject);
      }
    },
    [project.id, onUpdate]
  );

  // Toggle task
  const toggleTask = async (taskId: string, done: boolean) => {
    setSavingTask(taskId);
    await patchProject({ action: "TOGGLE_TASK", taskId, done });
    setSavingTask(null);
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    setSavingTask(taskId);
    await patchProject({ action: "DELETE_TASK", taskId });
    setSavingTask(null);
  };

  // Add task
  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setWorking(true);
    await patchProject({ action: "ADD_TASK", title: newTask.trim() });
    setNewTask("");
    setWorking(false);
  };

  // Add note
  const addNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setWorking(true);
    await patchProject({ action: "ADD_NOTE", content: newNote.trim() });
    setNewNote("");
    setWorking(false);
  };

  // Add reference
  const addRef = async (e: FormEvent) => {
    e.preventDefault();
    if (!newRef.citation.trim()) return;
    setWorking(true);
    await patchProject({ action: "ADD_REFERENCE", citation: newRef.citation.trim(), url: newRef.url.trim() || undefined });
    setNewRef({ citation: "", url: "" });
    setWorking(false);
  };

  // Delete reference
  const deleteRef = async (referenceId: string) => {
    setWorking(true);
    await patchProject({ action: "DELETE_REFERENCE", referenceId });
    setWorking(false);
  };

  // Advance stage
  const advanceStage = async () => {
    const nextIdx = STAGE_ORDER[project.stage] + 1;
    if (nextIdx >= STAGES.length) return;
    const nextStage = STAGES[nextIdx].key;
    setWorking(true);
    await patchProject({ action: "UPDATE_STAGE", stage: nextStage });
    setWorking(false);
  };

  const doneTasks = project.tasks.filter((t) => t.done).length;
  const totalTasks = project.tasks.length;
  const taskPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const isLastStage = project.stage === "PUBLICATION";

  const TABS = [
    { key: "overview", label: "Overview", icon: <Target className="h-3.5 w-3.5" /> },
    { key: "tasks", label: `Tasks ${totalTasks > 0 ? `(${doneTasks}/${totalTasks})` : ""}`, icon: <Check className="h-3.5 w-3.5" /> },
    { key: "notes", label: `Notes ${project.notes.length > 0 ? `(${project.notes.length})` : ""}`, icon: <StickyNote className="h-3.5 w-3.5" /> },
    { key: "references", label: `References ${project.references.length > 0 ? `(${project.references.length})` : ""}`, icon: <Link2 className="h-3.5 w-3.5" /> },
    { key: "files", label: `Files ${project.files.length > 0 ? `(${project.files.length})` : ""}`, icon: <FileText className="h-3.5 w-3.5" /> },
  ] as const;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <button type="button" className="flex-1 bg-navy/30 backdrop-blur-sm" onClick={onClose} aria-label="Close panel" />

      {/* Panel */}
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">

        {/* ── Panel header ── */}
        <div className="shrink-0 border-b border-navy/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sapphire/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sapphire">
                  {project.category.name}
                </span>
                {project.question && (
                  <span className="rounded-full bg-champagne/60 px-2.5 py-1 text-[10px] font-semibold text-navy/60">
                    From Question Hub
                  </span>
                )}
              </div>
              <h2 className="mt-2 font-heading text-xl font-bold text-navy leading-snug line-clamp-2">
                {project.title}
              </h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 rounded-full p-2 text-navy/40 hover:bg-ivory hover:text-navy">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Pipeline */}
          <div className="mt-4 overflow-x-auto">
            <StagePipeline current={project.stage} />
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar value={project.progress} stage={project.stage} />
            </div>
            <span className="shrink-0 text-xs font-bold text-navy/55">{project.progress}%</span>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="shrink-0 flex gap-1 overflow-x-auto border-b border-navy/10 bg-ivory/40 px-4 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "bg-navy text-white"
                  : "text-navy/60 hover:bg-navy/8 hover:text-navy"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Research goal */}
              <section>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/40">Research Goal</p>
                <p className="rounded-2xl bg-ivory p-4 text-sm leading-relaxed text-navy/75">{project.researchGoal}</p>
              </section>

              {/* Hypothesis */}
              {project.hypothesis && (
                <section>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/40">Hypothesis</p>
                  <p className="rounded-2xl bg-ivory p-4 text-sm italic leading-relaxed text-navy/70">
                    &ldquo;{project.hypothesis}&rdquo;
                  </p>
                </section>
              )}

              {/* Objectives */}
              {project.objectives.length > 0 && (
                <section>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/40">Objectives</p>
                  <ul className="space-y-2">
                    {project.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 rounded-2xl bg-ivory px-4 py-2.5 text-sm text-navy/75">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sapphire/15 text-[10px] font-bold text-sapphire">
                          {i + 1}
                        </span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Task mini-summary */}
              {totalTasks > 0 && (
                <section>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/40">Task Progress</p>
                  <div className="rounded-2xl bg-ivory p-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-navy">
                      <span>{doneTasks} of {totalTasks} tasks complete</span>
                      <span className="text-navy/45">{taskPct}%</span>
                    </div>
                    <ProgressBar value={taskPct} stage={project.stage} />
                    <div className="mt-3 space-y-1.5">
                      {project.tasks.slice(0, 4).map((t) => (
                        <div key={t.id} className="flex items-center gap-2 text-xs text-navy/65">
                          {t.done
                            ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                            : <Circle className="h-3.5 w-3.5 text-navy/30" />}
                          <span className={t.done ? "line-through text-navy/35" : ""}>{t.title}</span>
                        </div>
                      ))}
                      {project.tasks.length > 4 && (
                        <button type="button" onClick={() => setActiveTab("tasks")} className="text-xs font-semibold text-sapphire hover:underline">
                          + {project.tasks.length - 4} more tasks
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Linked paper */}
              {project.paper && (
                <section>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/40">Research Paper</p>
                  <div className="rounded-2xl border border-navy/10 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-navy text-sm">{project.paper.title}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${PAPER_STATUS_STYLES[project.paper.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {project.paper.status.replace("_", " ")}
                      </span>
                    </div>
                    {project.paper.abstract && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-navy/60">{project.paper.abstract}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-navy/45">
                      {project.paper.views > 0 && <span>{project.paper.views} views</span>}
                      {project.paper.citationCount > 0 && <span>{project.paper.citationCount} citations</span>}
                      {project.paper.submittedAt && <span>Submitted {fmt(project.paper.submittedAt)}</span>}
                      {project.paper.publishedAt && <span>Published {fmt(project.paper.publishedAt)}</span>}
                    </div>
                    {project.paper.pdfUrl && (
                      <a href={project.paper.pdfUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sapphire hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" /> View paper
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Collaborators */}
              {project.collaborators.length > 0 && (
                <section>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy/40">
                    Collaborators ({project.collaborators.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.collaborators.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sapphire/20 text-[9px] font-bold text-sapphire">
                          {c.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-navy">{c.user.name}</span>
                        <span className="text-navy/40">{c.role}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Advance stage */}
              {!isLastStage && (
                <section className="rounded-2xl border border-sapphire/20 bg-sapphire/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-sapphire/70">Next stage</p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    {STAGES[STAGE_ORDER[project.stage] + 1]?.label}
                    <span className="ml-1.5 font-normal text-navy/55">
                      — {STAGES[STAGE_ORDER[project.stage] + 1]?.desc}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => void advanceStage()}
                    disabled={working}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-sapphire px-4 py-2 text-sm font-semibold text-white hover:bg-navy disabled:opacity-50"
                  >
                    {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Move to {STAGES[STAGE_ORDER[project.stage] + 1]?.label}
                  </button>
                </section>
              )}

              {/* CTA if DRAFT → link to submission form */}
              {project.stage === "DRAFT" && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">Ready to submit?</p>
                  <p className="mt-1 text-xs text-blue-700">
                    Once your draft is complete, submit it to TOUR for peer review.
                  </p>
                  <Link
                    href="/get-published"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-sapphire"
                  >
                    <SendHorizonal className="h-3.5 w-3.5" /> Submit to TOUR
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TASKS */}
          {activeTab === "tasks" && (
            <div className="space-y-4">
              <p className="text-xs text-navy/50">
                {doneTasks} of {totalTasks} tasks completed
                {totalTasks > 0 && ` · ${taskPct}% done`}
              </p>

              {/* Add task form */}
              <form onSubmit={addTask} className="flex gap-2">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task…"
                  className="flex-1 rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm outline-none focus:border-sapphire"
                />
                <button
                  type="submit"
                  disabled={working || !newTask.trim()}
                  className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-sapphire disabled:opacity-40"
                >
                  {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </button>
              </form>

              {/* Task list */}
              {project.tasks.length === 0 ? (
                <p className="py-6 text-center text-sm text-navy/45">No tasks yet. Add your first one above.</p>
              ) : (
                <div className="space-y-2">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                        task.done ? "border-emerald-200 bg-emerald-50/50" : "border-navy/10 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                        onClick={() => void toggleTask(task.id, !task.done)}
                        disabled={savingTask === task.id}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          task.done
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-navy/25 hover:border-sapphire"
                        } disabled:opacity-40`}
                      >
                        {savingTask === task.id
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : task.done && <Check className="h-3 w-3" />}
                      </button>
                      <span className={`flex-1 text-sm ${task.done ? "line-through text-navy/40" : "text-navy"}`}>
                        {task.title}
                      </span>
                      {task.dueDate && (
                        <span className="shrink-0 text-[10px] text-navy/40">Due {fmt(task.dueDate, { month: "short", day: "numeric" })}</span>
                      )}
                      <button
                        type="button"
                        aria-label="Delete task"
                        onClick={() => void deleteTask(task.id)}
                        disabled={savingTask === task.id}
                        className="shrink-0 rounded-full p-1 text-navy/25 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NOTES */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              {/* Add note form */}
              <form onSubmit={addNote} className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  placeholder="Add a research note, observation, or idea…"
                  className="w-full rounded-xl border border-navy/10 bg-ivory px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-sapphire"
                />
                <button
                  type="submit"
                  disabled={working || !newNote.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-sapphire disabled:opacity-40"
                >
                  {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                  Save Note
                </button>
              </form>

              {/* Notes list */}
              {project.notes.length === 0 ? (
                <p className="py-6 text-center text-sm text-navy/45">No notes yet. Capture your observations above.</p>
              ) : (
                <div className="space-y-3">
                  {project.notes.map((note) => (
                    <div key={note.id} className="rounded-2xl border border-navy/10 bg-white p-4">
                      <p className="text-sm leading-relaxed text-navy/75 whitespace-pre-wrap">{note.content}</p>
                      <p className="mt-2 text-[10px] text-navy/35">
                        {fmt(note.updatedAt, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REFERENCES */}
          {activeTab === "references" && (
            <div className="space-y-4">
              {/* Add reference form */}
              <form onSubmit={addRef} className="space-y-2 rounded-2xl border border-navy/10 bg-ivory p-4">
                <label className="block text-xs font-semibold text-navy">
                  Citation <span className="text-red-500">*</span>
                  <textarea
                    required
                    rows={2}
                    value={newRef.citation}
                    onChange={(e) => setNewRef({ ...newRef, citation: e.target.value })}
                    placeholder="Author, A. (Year). Title. Journal, vol(issue), pages."
                    className="mt-1 w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-sm font-normal leading-relaxed outline-none focus:border-sapphire"
                  />
                </label>
                <label className="block text-xs font-semibold text-navy">
                  URL (optional)
                  <input
                    type="url"
                    value={newRef.url}
                    onChange={(e) => setNewRef({ ...newRef, url: e.target.value })}
                    placeholder="https://doi.org/…"
                    className="mt-1 w-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-sapphire"
                  />
                </label>
                <button
                  type="submit"
                  disabled={working || !newRef.citation.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-sapphire disabled:opacity-40"
                >
                  {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                  Add Reference
                </button>
              </form>

              {/* References list */}
              {project.references.length === 0 ? (
                <p className="py-6 text-center text-sm text-navy/45">No references yet. Add your first source above.</p>
              ) : (
                <ol className="space-y-3">
                  {project.references.map((ref, i) => (
                    <li key={ref.id} className="flex items-start gap-3 rounded-2xl border border-navy/10 bg-white p-4">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sapphire/10 text-[10px] font-bold text-sapphire">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed text-navy/75">{ref.citation}</p>
                        {ref.url && (
                          <a href={ref.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-sapphire hover:underline break-all">
                            {ref.url} <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Delete reference"
                        onClick={() => void deleteRef(ref.id)}
                        disabled={working}
                        className="shrink-0 rounded-full p-1 text-navy/25 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* FILES */}
          {activeTab === "files" && (
            <div className="space-y-3">
              {project.files.length === 0 ? (
                <div className="py-10 text-center">
                  <FileText className="mx-auto h-8 w-8 text-sapphire/30" />
                  <p className="mt-3 text-sm text-navy/45">No files attached to this project yet.</p>
                  <p className="mt-1 text-xs text-navy/35">Upload files when submitting your research through the submission form.</p>
                </div>
              ) : (
                project.files.map((f) => (
                  <a
                    key={f.id}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-white p-4 transition hover:border-sapphire/30 hover:bg-sapphire/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sapphire/10">
                      <FileText className="h-4 w-4 text-sapphire" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy">{f.name}</p>
                      <p className="text-xs text-navy/45">{fmtBytes(f.size)} · {fmt(f.createdAt)}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-sapphire/50" />
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project card (list view)
// ---------------------------------------------------------------------------

function ProjectCard({
  project,
  onOpen,
}: {
  project: ResearchProject;
  onOpen: (p: ResearchProject) => void;
}) {
  const doneTasks = project.tasks.filter((t) => t.done).length;
  const totalTasks = project.tasks.length;

  return (
    <article
      className="group flex cursor-pointer flex-col rounded-3xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-sapphire/30 hover:shadow-card"
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
      aria-label={`Open project: ${project.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-sapphire/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sapphire">
            {project.category.name}
          </span>
          <h3 className="mt-2 font-heading text-base font-bold text-navy leading-snug line-clamp-2 group-hover:text-sapphire transition-colors">
            {project.title}
          </h3>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-navy/25 transition group-hover:translate-x-0.5 group-hover:text-sapphire" />
      </div>

      {/* Research goal */}
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-navy/55">
        {project.researchGoal}
      </p>

      {/* Stage pipeline (compact) */}
      <div className="mt-4 overflow-x-auto">
        <StagePipeline current={project.stage} />
      </div>

      {/* Progress bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1">
          <ProgressBar value={project.progress} stage={project.stage} />
        </div>
        <span className="shrink-0 text-[10px] font-bold text-navy/40">{project.progress}%</span>
      </div>

      {/* Footer meta */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-navy/8 pt-3 text-[11px] text-navy/45">
        {totalTasks > 0 && (
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            {doneTasks}/{totalTasks} tasks
          </span>
        )}
        {project.references.length > 0 && (
          <span className="flex items-center gap-1">
            <Link2 className="h-3 w-3" />
            {project.references.length} refs
          </span>
        )}
        {project.notes.length > 0 && (
          <span className="flex items-center gap-1">
            <StickyNote className="h-3 w-3" />
            {project.notes.length} notes
          </span>
        )}
        {project.paper && (
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Paper: {project.paper.status.replace("_", " ")}
          </span>
        )}
        <span className="ml-auto">Updated {fmt(project.updatedAt, { month: "short", day: "numeric" })}</span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ResearcherDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string } | undefined;

  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ResearchProject | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [stageFilter, setStageFilter] = useState<ProjectStage | "ALL">("ALL");
  const [query, setQuery] = useState("");

  // ── Load ──
  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/researcher/projects", { cache: "no-store" });
    if (res.ok) setProjects((await res.json()) as ResearchProject[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  // ── Derived stats ──
  const totalProjects = projects.length;
  const published = projects.filter((p) => p.stage === "PUBLICATION").length;
  const inProgress = projects.filter((p) => !["WORKSPACE", "PUBLICATION"].includes(p.stage)).length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const doneTasks = projects.reduce((sum, p) => sum + p.tasks.filter((t) => t.done).length, 0);
  const totalRefs = projects.reduce((sum, p) => sum + p.references.length, 0);

  // ── Filter ──
  const filtered = projects.filter((p) => {
    if (stageFilter !== "ALL" && p.stage !== stageFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.researchGoal.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
    );
  });

  // ── Handle project update from detail panel ──
  const handleProjectUpdate = (updated: ResearchProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelected(updated);
  };

  return (
    <main className="min-h-screen bg-ivory">

      {/* ══════════════════════════════════════════════════════
          Top bar
      ══════════════════════════════════════════════════════ */}
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              TOUR Researcher
            </p>
            <h1 className="mt-1.5 font-heading text-2xl font-bold text-navy md:text-3xl">
              {user?.name ? `${user.name.split(" ")[0]}'s Research Dashboard` : "Research Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-navy/55">
              Track your research projects from first idea to published article.
            </p>
          </div>
            <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-sapphire"
            >
              <Plus className="h-4 w-4" /> New Project
            </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-10">

        {/* ══════════════════════════════════════════════════════
            Stats row
        ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              label: "Projects",
              value: totalProjects,
              icon: <FlaskConical className="h-5 w-5 text-sapphire/70" />,
            },
            {
              label: "In progress",
              value: inProgress,
              icon: <TrendingUp className="h-5 w-5 text-amber-500" />,
            },
            {
              label: "Published",
              value: published,
              icon: <BookOpen className="h-5 w-5 text-teal-500" />,
            },
            {
              label: "Tasks done",
              value: `${doneTasks}/${totalTasks}`,
              icon: <Check className="h-5 w-5 text-emerald-500" />,
            },
            {
              label: "References",
              value: totalRefs,
              icon: <Link2 className="h-5 w-5 text-violet-500" />,
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-2xl border border-navy/10 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy/40">{label}</p>
                {icon}
              </div>
              <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            Pipeline overview strip
        ══════════════════════════════════════════════════════ */}
        {projects.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm">
            <div className="border-b border-navy/8 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-navy/40">Pipeline overview</p>
            </div>
            <div className="grid grid-cols-5 divide-x divide-navy/8">
              {STAGES.map((s) => {
                const count = projects.filter((p) => p.stage === s.key).length;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setStageFilter(stageFilter === s.key ? "ALL" : s.key)}
                    className={`group flex flex-col items-center gap-1.5 py-4 transition hover:bg-ivory/60 ${
                      stageFilter === s.key ? "bg-ivory" : ""
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stageColor(s.key, count > 0)}`}>
                      {s.icon}
                    </div>
                    <p className="text-xs font-semibold text-navy">{count}</p>
                    <p className="hidden text-[10px] text-navy/45 sm:block">{s.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            Search + filter
        ══════════════════════════════════════════════════════ */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <FlaskConical className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, goal, or category…"
              className="w-full rounded-xl border border-navy/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sapphire"
            />
          </div>
          <div className="relative sm:w-48">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as ProjectStage | "ALL")}
              className="w-full appearance-none rounded-xl border border-navy/10 bg-white px-3 py-2.5 pr-8 text-sm outline-none focus:border-sapphire"
            >
              <option value="ALL">All stages</option>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            Project grid
        ══════════════════════════════════════════════════════ */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center gap-3 text-center text-navy/50">
            <Loader2 className="h-8 w-8 animate-spin text-sapphire/50" />
            <p className="text-sm">Loading your projects…</p>
          </div>
        ) : projects.length === 0 ? (
          /* ── Empty state ── */
          <div className="mt-10 rounded-3xl border border-dashed border-navy/20 bg-white p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sapphire/10">
              <FlaskConical className="h-8 w-8 text-sapphire" />
            </div>
            <h2 className="mt-5 font-heading text-xl font-bold text-navy">
              Start your first research project
            </h2>
            <p className="mt-2 text-sm text-navy/55">
              Create a project to track your research from hypothesis to publication. Add tasks, notes,
              references, and follow the pipeline all the way to getting published on TOUR.
            </p>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-sapphire"
            >
              <Plus className="h-4 w-4" /> Create Research Project
            </button>

            {/* Walkthrough */}
            <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
              {[
                {
                  step: "1",
                  icon: <Lightbulb className="h-5 w-5 text-sapphire" />,
                  title: "Define your question",
                  desc: "Start with a clear research goal and hypothesis in the Workspace stage.",
                },
                {
                  step: "2",
                  icon: <FlaskConical className="h-5 w-5 text-amber-500" />,
                  title: "Research & document",
                  desc: "Add tasks, notes, and references as you collect data and build your argument.",
                },
                {
                  step: "3",
                  icon: <BookOpen className="h-5 w-5 text-teal-500" />,
                  title: "Submit & publish",
                  desc: "Move through Draft → Submission → get reviewed and published on TOUR.",
                },
              ].map(({ step, icon, title, desc }) => (
                <div key={step} className="rounded-2xl border border-navy/8 bg-ivory/60 p-4">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-xs font-bold uppercase tracking-wider text-navy/35">Step {step}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-navy">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-navy/55">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-navy/10 bg-white p-10 text-center">
            <p className="text-sm text-navy/50">No projects match this filter.</p>
            <button
              type="button"
              onClick={() => { setQuery(""); setStageFilter("ALL"); }}
              className="mt-3 text-sm font-semibold text-sapphire hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={setSelected} />
            ))}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        {projects.length > 0 && (
          <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">Ready to publish?</p>
                <h3 className="mt-1.5 font-heading text-lg font-bold text-navy">
                  Submit your research to TOUR
                </h3>
                <p className="mt-1 text-sm text-navy/55">
                  Once your draft is complete, submit it for peer review and get published.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/my-submissions"
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
                >
                  My Submissions
                </Link>
                <Link
                  href="/get-published"
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-sapphire"
                >
                  <SendHorizonal className="h-4 w-4" /> Submit Research
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals / panels ── */}
      {showNewModal && (
        <NewProjectModal
          onClose={() => setShowNewModal(false)}
          onCreated={(p) => {
            setProjects((prev) => [p, ...prev]);
            setShowNewModal(false);
            setSelected(p);
          }}
        />
      )}

      {selected && (
        <ProjectDetail
          project={selected}
          onUpdate={handleProjectUpdate}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}
