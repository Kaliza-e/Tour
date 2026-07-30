import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";
import { PublicationCard } from "@/components/publication-card";

const featuredQuestions = [
  {
    id: "q1",
    title: "Why do octopuses have three hearts?",
    category: "Biology",
    askedBy: "Amara O.",
    interestedResearchers: 12,
    likes: 84,
    views: 512,
    status: "BEING_RESEARCHED" as const,
  },
  {
    id: "q2",
    title: "Could AI predict earthquakes before they happen?",
    category: "Earth Science",
    askedBy: "Diego R.",
    interestedResearchers: 21,
    likes: 143,
    views: 980,
    status: "OPEN" as const,
  },
  {
    id: "q3",
    title: "Why do some diseases affect only certain populations?",
    category: "Medicine",
    askedBy: "Priya K.",
    interestedResearchers: 9,
    likes: 67,
    views: 401,
    status: "RESEARCH_COMPLETED" as const,
  },
];

const featuredPapers = [
  { id: "p1", title: "Microplastic Accumulation in Freshwater Snails", author: "Leah M.", category: "Environmental Science", readingTime: "9 min read", views: 2140 },
  { id: "p2", title: "Predicting Wildfire Spread with Lightweight Neural Nets", author: "Kofi A.", category: "Computer Science", readingTime: "12 min read", views: 3320 },
  { id: "p3", title: "Sleep Patterns and Memory Consolidation in Teens", author: "Sofia N.", category: "Psychology", readingTime: "7 min read", views: 1870 },
];

const journey = [
  { label: "Question", desc: "Post something you're genuinely curious about." },
  { label: "Workspace", desc: "Turn a question into a structured project." },
  { label: "Research", desc: "Gather sources, notes, and data with guided tools." },
  { label: "Publication", desc: "Submit, get reviewed, and publish your paper." },
];

const stats = [
  { value: "4,200+", label: "Questions asked" },
  { value: "1,100+", label: "Papers published" },
  { value: "6,800+", label: "Student researchers" },
  { value: "312", label: "Partner schools" },
];

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-constellation [background-size:22px_22px] opacity-40" />
        <div className="container-tour relative py-20 md:py-28">
          {/* top stats ribbon */}
          <div className="mx-auto mb-8 max-w-4xl rounded-pill bg-navy/95 px-4 py-2 text-center text-ivory shadow-card hidden md:block">
            <div className="flex items-center justify-center gap-8 text-sm font-medium">
              <span>98+ RCA Talents</span>
              <span className="mx-4">•</span>
              <span>37+ Projects showcased</span>
              <span className="mx-4">•</span>
              <span>38% Verified profiles</span>
            </div>
          </div>

          <div className="container-tour relative">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="mt-2 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-navy md:text-hero">
                Where Curiosity Becomes Knowledge
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-navy/60">
                Tour empowers students to ask meaningful scientific questions, transform
                them into research projects, publish discoveries, and become
                contributors to global knowledge.
              </p>
              <div className="mt-10 flex items-center justify-center gap-6">
                <Link href="/questions">
                  <Button size="lg" className="rounded-full bg-navy px-8 py-4 shadow-card">Start Your Research Journey</Button>
                </Link>
                <Link href="/publications">
                  <Button size="lg" variant="ghost" className="rounded-full border border-navy/20 bg-transparent text-navy px-7 py-4">
                    Explore Publications
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-navy/8 bg-white/60">
        <div className="container-tour grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold text-navy md:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-navy/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY TOUR */}
      <section className="py-28">
        <div className="container-tour">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
              Every paper starts as a question worth asking
            </h2>
            <p className="mt-4 text-navy/60">
              Most students never publish because they never start. Tour removes
              every barrier between a curious question and a finished research paper.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { title: "Ask without a lab", desc: "Post a question the moment it occurs to you — no advisor or lab required to begin." },
              { title: "A guided workspace", desc: "Notes, references, tasks, and drafts live in one place built for a student's first project." },
              { title: "Real publication", desc: "Submit for peer review and publish alongside a community of student researchers." },
            ].map((f) => (
              <div key={f.title} className="rounded-card bg-white p-8 shadow-card">
                <h3 className="font-heading text-lg font-bold text-navy">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR PATH */}
      <section className="py-20 bg-ivory">
        <div className="container-tour">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">Built for students and employers alike</h2>
            <p className="mt-4 text-navy/60">Whether you're launching your career or building your team, Tour has the tools you need.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-card bg-white p-8 shadow-card">
              <div className="mb-4 inline-block rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-navy">FOR STUDENTS</div>
              <h3 className="mt-3 font-heading text-2xl font-bold text-navy">For Students<br/>Free forever</h3>
              <p className="mt-4 text-sm text-navy/60">Build your brand, publish a portfolio, and get discovered by employers actively hiring Tour talents.</p>
              <ul className="mt-6 space-y-3 text-sm text-navy/70">
                <li>• Professional portfolio builder with custom URL</li>
                <li>• Admin-verified badge for credibility</li>
                <li>• Direct messaging with recruiters</li>
              </ul>
              <div className="mt-6">
                <Link href="/questions">
                  <Button variant="secondary" className="rounded-full px-6 py-3">Explore for Students</Button>
                </Link>
              </div>
            </div>

            <div className="rounded-card bg-gradient-to-b from-sapphire to-navy p-8 text-ivory shadow-card">
              <div className="mb-4 inline-block rounded-full bg-navy/30 px-3 py-1 text-xs font-semibold text-ivory">FOR COMPANIES</div>
              <h3 className="mt-3 font-heading text-2xl font-bold">For Companies<br/>Verified talent</h3>
              <p className="mt-4 text-sm text-ivory/80">Search verified profiles, review real project work, and manage your entire hiring pipeline in one dashboard.</p>
              <ul className="mt-6 space-y-3 text-sm text-ivory/85">
                <li>• Advanced skill, cohort & availability filters</li>
                <li>• Job postings & interview invitations</li>
                <li>• Bookmark and track promising candidates</li>
              </ul>
              <div className="mt-6">
                <Link href="/publications">
                  <Button className="rounded-full bg-ivory text-navy px-6 py-3">Explore for Companies</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED QUESTIONS */}
      <section className="bg-white py-28">
        <div className="container-tour">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Question Hub</span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Questions students are exploring right now
              </h2>
            </div>
            <Link href="/questions" className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-sapphire">
              Browse all questions <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredQuestions.map((q) => (
              <QuestionCard key={q.id} {...q} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28">
        <div className="container-tour">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">The journey from question to publication</h2>
            <p className="mt-4 text-navy/60">A single path carries every project from a first spark of curiosity to a published paper.</p>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-navy/15 md:block" />
            {journey.map((step, i) => (
              <div key={step.label} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-ivory">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-heading text-base font-bold text-navy">{step.label}</h3>
                <p className="mt-2 text-sm text-navy/55">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST PUBLICATIONS */}
      <section className="bg-white py-28">
        <div className="container-tour">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Publications</span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Recently published by student researchers
              </h2>
            </div>
            <Link href="/publications" className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-sapphire">
              Explore the library <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredPapers.map((p) => (
              <PublicationCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="container-tour">
          <div className="relative overflow-hidden rounded-card bg-navy px-10 py-20 text-center">
            <div className="absolute inset-0 bg-constellation [background-size:22px_22px] opacity-10" />
            <h2 className="relative font-heading text-3xl font-bold text-ivory md:text-4xl">
              Your first question could become your first published paper
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-ivory/60">
              Join a community of students who turned curiosity into real research.
            </p>
            <div className="relative mt-9">
              <Link href="/join">
                <Button size="lg" variant="champagne">
                  Join Tour — It's Free <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
