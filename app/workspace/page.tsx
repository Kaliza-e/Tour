"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FileText,
  FolderKanban,
  BookMarked,
  StickyNote,
  Link2,
  Calendar,
  CheckSquare,
  Upload,
  PenTool,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectItem {
  id: string;
  title: string;
  researchGoal: string;
  hypothesis?: string | null;
  stage: string;
  progress: number;
  category?: { name: string } | null;
  notes?: Array<{ id: string; content: string }>;
  references?: Array<{ id: string; citation: string }>;
  updatedAt: string;
}

const stageOrder = ["WORKSPACE", "RESEARCH", "DRAFT", "SUBMISSION", "PUBLICATION"];

export default function WorkspacePage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProjects(data);
          }
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProjects();
  }, [session]);

  const activeProject = projects[0] || {
    id: "default",
    title: "Untitled Research Investigation",
    researchGoal: "Formulate research question and begin literature synthesis.",
    hypothesis: "To be defined in notebook",
    stage: "WORKSPACE",
    progress: 15,
    category: { name: "General Science" },
    updatedAt: new Date().toISOString(),
  };

  const activeStageIndex = stageOrder.indexOf(activeProject.stage.toUpperCase()) >= 0
    ? stageOrder.indexOf(activeProject.stage.toUpperCase())
    : 0;

  return (
    <div className="container-tour py-10 sm:py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">
              Research Workspace & Lab
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy">
              Welcome to your Research Lab
            </h1>
            <p className="max-w-xl text-xs md:text-sm text-navy/60">
              Organize hypotheses, draft manuscripts in the Research Notebook, and track peer review milestones for your projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/workspace/notebook">
              <Button className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs font-bold px-6 py-3 flex items-center gap-2 shadow-sm">
                <PenTool className="h-4 w-4" /> Open Active Research Notebook →
              </Button>
            </Link>
            <Link href="/join/writer">
              <Button
                variant="secondary"
                className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-4 py-3 flex items-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" /> New Topic
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Project Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-navy/8 bg-white p-6 shadow-card hover:shadow-soft transition">
            <FolderKanban className="text-sapphire" size={22} />
            <p className="mt-4 font-heading text-2xl font-bold text-navy">{projects.length}</p>
            <p className="mt-1 text-xs text-navy/55">Active Investigations</p>
          </div>

          <div className="rounded-3xl border border-navy/8 bg-white p-6 shadow-card hover:shadow-soft transition">
            <FileText className="text-sapphire" size={22} />
            <p className="mt-4 font-heading text-2xl font-bold text-navy">
              {projects.filter((p) => p.stage === "DRAFT" || p.stage === "WORKSPACE").length}
            </p>
            <p className="mt-1 text-xs text-navy/55">Draft Papers in Notebook</p>
          </div>

          <div className="rounded-3xl border border-navy/8 bg-white p-6 shadow-card hover:shadow-soft transition">
            <BookMarked className="text-sapphire" size={22} />
            <p className="mt-4 font-heading text-2xl font-bold text-navy">
              {projects.filter((p) => p.stage === "PUBLICATION").length}
            </p>
            <p className="mt-1 text-xs text-navy/55">Published Papers</p>
          </div>

          <div className="rounded-3xl border border-navy/8 bg-white p-6 shadow-card hover:shadow-soft transition">
            <StickyNote className="text-sapphire" size={22} />
            <p className="mt-4 font-heading text-2xl font-bold text-navy">
              {projects.reduce((acc, p) => acc + (p.notes?.length || 0), 0)}
            </p>
            <p className="mt-1 text-xs text-navy/55">Saved Research Notes</p>
          </div>
        </div>

        {/* Active Project Card Loaded Directly from User Database */}
        <div className="rounded-3xl border border-navy/8 bg-white p-8 shadow-card space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">
                  Active Manuscript
                </span>
                {activeProject.category?.name && (
                  <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-2.5 py-0.5 text-[10px] font-bold text-sapphire">
                    {activeProject.category.name}
                  </span>
                )}
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy">{activeProject.title}</h2>
              <p className="text-xs text-navy/70 leading-relaxed">
                <strong>Inquiry / Research Goal:</strong> {activeProject.researchGoal}
              </p>
              {activeProject.hypothesis && (
                <p className="text-xs text-navy/60">
                  <strong>Hypothesis:</strong> {activeProject.hypothesis}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3.5 py-1 text-xs font-bold text-sapphire">
                Stage: {activeProject.stage}
              </span>
              <Link href="/workspace/notebook">
                <Button size="sm" className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-5 shadow-sm">
                  Launch Notebook Editor
                </Button>
              </Link>
            </div>
          </div>

          {/* Stage Tracker */}
          <div className="space-y-3 pt-2">
            <div className="relative flex justify-between">
              <div className="absolute left-0 right-0 top-3 h-px bg-navy/10" />
              {["Workspace", "Research", "Draft", "Submission", "Publication"].map((stage, i) => {
                const active = activeStageIndex >= i;
                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                    <span
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition ${
                        active
                          ? "border-navy bg-navy text-ivory shadow-xs"
                          : "border-navy/20 bg-ivory text-navy/40"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        active ? "text-navy" : "text-navy/40"
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-ivory mt-4">
              <div
                className="h-full rounded-full bg-sapphire transition-all duration-300"
                style={{ width: `${activeProject.progress || 20}%` }}
              />
            </div>
            <p className="text-xs text-navy/50">
              {activeProject.progress || 20}% complete towards submission readiness
            </p>
          </div>

          {/* All User Projects List if more than 1 */}
          {projects.length > 1 && (
            <div className="space-y-3 pt-6 border-t border-navy/10">
              <h3 className="font-heading font-bold text-base text-navy">All Your Research Projects</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-navy/10 bg-ivory/30 space-y-2 hover:bg-white transition"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-sapphire">{p.category?.name || "Science"}</span>
                      <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-bold text-navy">
                        {p.stage}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-navy">{p.title}</h4>
                    <p className="text-xs text-navy/60 line-clamp-2">{p.researchGoal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workspace quick tools */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 pt-4 border-t border-navy/8">
            {[
              { icon: PenTool, label: "Interactive Notebook Editor", href: "/workspace/notebook" },
              { icon: StickyNote, label: "Literature Notes & Scratchpad", href: "/workspace/notebook" },
              { icon: Link2, label: "Citation & Bibliography Formatter", href: "/workspace/notebook" },
              { icon: CheckSquare, label: "Peer Review Readiness Checklist", href: "/workspace/notebook" },
              { icon: Upload, label: "Submit Manuscript to Editorial Board", href: "/submit" },
              { icon: Compass, label: "Explore Question Hub Inquiries", href: "/questions" },
            ].map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className="flex items-center gap-3 rounded-2xl border border-navy/8 bg-ivory/50 px-5 py-4 text-left text-xs font-semibold text-navy hover:bg-champagne/40 hover:border-sapphire transition"
              >
                <t.icon size={18} className="text-sapphire shrink-0" /> 
                <span>{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}

