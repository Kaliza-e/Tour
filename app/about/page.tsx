import { Compass, Eye, Sparkles } from "lucide-react";

const values = [
  { title: "Curiosity", desc: "Every meaningful study begins with a question worth exploring." },
  { title: "Accessibility", desc: "Research and publishing should not depend on privilege, expensive programs, or elite institutions." },
  { title: "Learning", desc: "Students grow by researching, writing, reflecting, and sharing their work." },
  { title: "Contribution", desc: "Young people can help build knowledge by asking questions and publishing what they learn." },
];

export default function AboutPage() {
  return (
    <div className="bg-ivory py-16 md:py-20">
      <div className="container-tour space-y-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">
            <Compass className="h-4 w-4" /> About Tour
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-navy md:text-5xl">
            A space where young thinkers can begin their research journey early.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-navy/70">
            Tour is a student-led, non-profit research and educational platform that encourages young thinkers to start their research journey early, learn from their curiosity, and answer questions instead of only asking them. We believe curiosity, learning, and publishing should be accessible to everyone, regardless of privilege, resources, or background.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sapphire/10 text-sapphire">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">Our Mission</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy/70">
              We endeavor to empower young students to begin their research journey early by providing an accessible platform where they can think, explore their curiosity, research, write, publish, and exchange ideas freely.
            </p>
          </div>

          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sapphire/10 text-sapphire">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">Our Vision</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy/70">
              We strive to create opportunities for young researchers who are passionate about exploring science and becoming active contributors to knowledge.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-navy/10 bg-navy p-8 text-ivory shadow-soft md:p-10">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Why Tour exists</h2>
          <p className="mt-4 text-base leading-relaxed text-ivory/75">
            Research should not be reserved for elite institutions or expensive programs. Tour exists to create a space where young students can ask meaningful questions, explore science, conduct research, learn from the process, transform curiosity into meaningful knowledge, and share their work with others.
          </p>
        </div>

        <div>
          <h2 className="text-center font-heading text-3xl font-bold text-navy">What Tour offers</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
