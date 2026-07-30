import { FileText, FolderKanban, BookMarked, StickyNote, Link2, Calendar, CheckSquare, Upload } from "lucide-react";

const sections = [
  { icon: FolderKanban, label: "Research Projects", count: 3 },
  { icon: FileText, label: "Draft Papers", count: 1 },
  { icon: BookMarked, label: "Published Papers", count: 2 },
  { icon: StickyNote, label: "Saved Questions", count: 7 },
];

const project = {
  title: "Cardiac Redundancy in Cephalopods",
  question: "Why do octopuses have three hearts?",
  stage: "Research",
  progress: 42,
};

const stageOrder = ["Workspace", "Research", "Draft", "Submission", "Publication"];

export default function WorkspacePage() {
  return (
    <div className="container-tour py-20">
      <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Workspace</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-navy">Welcome back, Amara</h1>
      <p className="mt-3 max-w-xl text-navy/60">
        Everything for your current research lives here — notes, references, files,
        and progress toward publication.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <div key={s.label} className="rounded-card border border-navy/8 bg-white p-6 shadow-card">
            <s.icon className="text-sapphire" size={22} />
            <p className="mt-4 font-heading text-2xl font-bold text-navy">{s.count}</p>
            <p className="mt-1 text-sm text-navy/55">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active project */}
      <div className="mt-14 rounded-card border border-navy/8 bg-white p-8 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Active project</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-navy">{project.title}</h2>
            <p className="mt-1 text-sm text-navy/50">From question: “{project.question}”</p>
          </div>
          <span className="shrink-0 rounded-pill bg-sapphire px-4 py-2 text-xs font-semibold text-ivory">
            {project.stage}
          </span>
        </div>

        {/* Stage tracker */}
        <div className="relative mt-10 flex justify-between">
          <div className="absolute left-0 right-0 top-3 h-px bg-navy/10" />
          {stageOrder.map((stage, i) => {
            const active = stageOrder.indexOf(project.stage) >= i;
            return (
              <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                <span
                  className={`h-6 w-6 rounded-full border-2 ${
                    active ? "border-navy bg-navy" : "border-navy/20 bg-ivory"
                  }`}
                />
                <span className={`text-xs font-semibold ${active ? "text-navy" : "text-navy/40"}`}>{stage}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 h-2 w-full overflow-hidden rounded-pill bg-ivory">
          <div className="h-full rounded-pill bg-sapphire" style={{ width: `${project.progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-navy/50">{project.progress}% complete</p>

        {/* Workspace tools */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: StickyNote, label: "Research Notes" },
            { icon: Link2, label: "References" },
            { icon: CheckSquare, label: "Tasks" },
            { icon: Upload, label: "Files" },
            { icon: Calendar, label: "Calendar" },
            { icon: FileText, label: "Draft Paper" },
          ].map((t) => (
            <button
              key={t.label}
              className="flex items-center gap-3 rounded-2xl border border-navy/8 bg-ivory px-5 py-4 text-left text-sm font-semibold text-navy hover:border-sapphire"
            >
              <t.icon size={18} className="text-sapphire" /> {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
