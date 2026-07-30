import Link from "next/link";
import { BookOpenCheck, ClipboardList, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: BookOpenCheck,
    title: "Shape the question",
    text: "Turn a promising idea into a clear research direction with scope, context, and next steps.",
  },
  {
    icon: ClipboardList,
    title: "Plan the work",
    text: "Organize tasks, references, notes, collaborators, and milestones before drafting.",
  },
  {
    icon: FileText,
    title: "Draft the paper",
    text: "Move from evidence to argument with a workspace built around publication-ready research.",
  },
  {
    icon: Upload,
    title: "Submit and publish",
    text: "Prepare your paper, attach supporting material, and share completed discoveries.",
  },
];

export default function ResearchPage() {
  return (
    <div className="container-tour py-20">
      <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Research</span>
      <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-heading text-4xl font-bold text-navy">Build research from first question to final paper</h1>
          <p className="mt-4 max-w-2xl text-navy/60">
            Tour gives students a structured path for turning curiosity into rigorous projects,
            drafts, submissions, and published work.
          </p>
        </div>
        <Link href="/workspace">
          <Button>Open Workspace</Button>
        </Link>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div key={step.title} className="rounded-card border border-navy/8 bg-white p-6 shadow-card">
            <step.icon className="text-sapphire" size={24} />
            <h2 className="mt-5 font-heading text-xl font-bold text-navy">{step.title}</h2>
            <p className="mt-3 text-sm leading-6 text-navy/60">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
