import Link from "next/link";
import { FileText, FolderKanban, BookMarked, StickyNote, Link2, Calendar, CheckSquare, Upload, PenTool, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  { icon: FolderKanban, label: "Active Investigations", count: 2 },
  { icon: FileText, label: "Draft Papers in Notebook", count: 1 },
  { icon: BookMarked, label: "Published Papers", count: 2 },
  { icon: StickyNote, label: "Saved Question Topics", count: 7 },
];

const project = {
  title: "Microplastic Accumulation in Freshwater Gastropods",
  question: "How do microplastics bioaccumulate in local freshwater benthic organisms across varying rainfall runoff levels?",
  stage: "Draft",
  progress: 78,
};

const stageOrder = ["Workspace", "Research", "Draft", "Submission", "Publication"];

export default function WorkspacePage() {
  return (
    <div className="container-tour py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Research Workspace</span>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-navy">Welcome to your Lab & Workspace</h1>
          <p className="mt-2 max-w-xl text-xs md:text-sm text-navy/60">
            Organize hypotheses, draft manuscripts in the Research Notebook, and track peer review milestones.
          </p>
        </div>

        <Link href="/workspace/notebook">
          <Button className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs font-bold px-6 py-3 flex items-center gap-2 shadow-sm">
            <PenTool className="h-4 w-4" /> Open Active Research Notebook →
          </Button>
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <div key={s.label} className="rounded-3xl border border-navy/8 bg-white p-6 shadow-card hover:shadow-soft transition">
            <s.icon className="text-sapphire" size={22} />
            <p className="mt-4 font-heading text-2xl font-bold text-navy">{s.count}</p>
            <p className="mt-1 text-xs text-navy/55">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active project */}
      <div className="mt-10 rounded-3xl border border-navy/8 bg-white p-8 shadow-card space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Active Manuscript</span>
            <h2 className="font-heading text-2xl font-bold text-navy">{project.title}</h2>
            <p className="text-xs text-navy/60">Inquiry: “{project.question}”</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-full bg-sapphire/10 border border-sapphire/20 px-3.5 py-1 text-xs font-bold text-sapphire">
              Stage: {project.stage}
            </span>
            <Link href="/workspace/notebook">
              <Button size="sm" className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-4">
                Launch Editor
              </Button>
            </Link>
          </div>
        </div>

        {/* Stage tracker */}
        <div className="relative mt-8 flex justify-between">
          <div className="absolute left-0 right-0 top-3 h-px bg-navy/10" />
          {stageOrder.map((stage, i) => {
            const active = stageOrder.indexOf(project.stage) >= i;
            return (
              <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                <span
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    active ? "border-navy bg-navy text-ivory" : "border-navy/20 bg-ivory text-navy/40"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`text-xs font-semibold ${active ? "text-navy" : "text-navy/40"}`}>{stage}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 h-2.5 w-full overflow-hidden rounded-full bg-ivory">
          <div className="h-full rounded-full bg-sapphire transition-all" style={{ width: `${project.progress}%` }} />
        </div>
        <p className="text-xs text-navy/50">{project.progress}% complete towards submission readiness</p>

        {/* Workspace tools */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: PenTool, label: "Interactive Notebook Editor", href: "/workspace/notebook" },
            { icon: StickyNote, label: "Literature Notes", href: "/workspace/notebook" },
            { icon: Link2, label: "Citation Formatter", href: "/workspace/notebook" },
            { icon: CheckSquare, label: "Review Checklist", href: "/workspace/notebook" },
            { icon: Upload, label: "Submit Manuscript", href: "/submit" },
            { icon: BookMarked, label: "Explore Question Hub", href: "/questions" },
          ].map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="flex items-center gap-3 rounded-2xl border border-navy/8 bg-ivory/50 px-5 py-4 text-left text-xs font-semibold text-navy hover:bg-champagne/40 hover:border-sapphire transition"
            >
              <t.icon size={18} className="text-sapphire" /> {t.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
