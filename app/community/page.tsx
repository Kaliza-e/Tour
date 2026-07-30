import Link from "next/link";
import { MessageSquareText, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const groups = [
  {
    icon: Users,
    title: "Student circles",
    text: "Find peers working on similar questions, disciplines, and research goals.",
  },
  {
    icon: MessageSquareText,
    title: "Research discussions",
    text: "Share early ideas, ask for feedback, and learn how other students approach their work.",
  },
  {
    icon: Sparkles,
    title: "Mentor moments",
    text: "Connect with experienced researchers around methods, drafts, and publication standards.",
  },
];

export default function CommunityPage() {
  return (
    <div className="container-tour py-20">
      <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Community</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-navy">Research is better with people around it</h1>
      <p className="mt-4 max-w-2xl text-navy/60">
        Tour connects curious students, collaborators, and mentors so research feels supported from the
        first question through publication.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title} className="rounded-card border border-navy/8 bg-white p-7 shadow-card">
            <group.icon className="text-sapphire" size={24} />
            <h2 className="mt-5 font-heading text-xl font-bold text-navy">{group.title}</h2>
            <p className="mt-3 text-sm leading-6 text-navy/60">{group.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-card bg-navy p-8 text-ivory">
        <h2 className="font-heading text-2xl font-bold">Start with the community hub</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ivory/70">
          Create an account to join research conversations, save questions, and build toward your workspace.
        </p>
        <Link href="/join" className="mt-6 inline-flex">
          <Button variant="champagne">Join Tour</Button>
        </Link>
      </div>
    </div>
  );
}
