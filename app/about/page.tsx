import Link from "next/link";
import { GraduationCap, Lightbulb, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

const principles = [
  {
    icon: Lightbulb,
    title: "Curiosity first",
    text: "Students begin with questions that feel alive, specific, and worth investigating.",
  },
  {
    icon: GraduationCap,
    title: "Guided rigor",
    text: "The platform helps students move through research habits, evidence, drafting, and review.",
  },
  {
    icon: Newspaper,
    title: "Publication mindset",
    text: "Every project is shaped toward clear communication and work that can be shared.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-tour py-20">
      <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">About Tour</span>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold text-navy">
        A student-led research ecosystem for the next generation of thinkers
      </h1>
      <p className="mt-4 max-w-2xl text-navy/60">
        Tour exists to make research feel reachable. It helps students ask stronger questions,
        organize real projects, collaborate with others, and publish discoveries with confidence.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {principles.map((item) => (
          <div key={item.title} className="rounded-card border border-navy/8 bg-white p-7 shadow-card">
            <item.icon className="text-sapphire" size={24} />
            <h2 className="mt-5 font-heading text-xl font-bold text-navy">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-navy/60">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/questions">
          <Button>Explore Questions</Button>
        </Link>
        <Link href="/publications">
          <Button variant="secondary">Read Publications</Button>
        </Link>
      </div>
    </div>
  );
}
