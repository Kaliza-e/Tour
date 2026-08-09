import Link from "next/link";
import { Compass, Eye, Heart, ShieldCheck, Sparkles, Award, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  { title: "Curiosity", desc: "Every scientific breakthrough starts with a bold question. We encourage unbounded youth inquiry." },
  { title: "Integrity", desc: "Ethical research, transparent peer reviews, and rigorous citation standards across all disciplines." },
  { title: "Accessibility", desc: "100% free open-access publishing. Financial background should never limit a student's scientific reach." },
  { title: "Collaboration", desc: "Cross-border teamwork uniting young minds, university mentors, and high school research clubs." },
];

const timeline = [
  { year: "2024", title: "The Spark", desc: "Founded by student researchers seeking an accessible platform for non-university youth research." },
  { year: "2025", title: "Peer Review Network", desc: "Launched double-blind student peer review board and verified volunteer hour tracking system." },
  { year: "2026", title: "Global Ecosystem", desc: "Now powering 2,400+ student researchers across 40 countries with AI Co-Pilot guidance." },
];

export default function AboutPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <Compass className="h-4 w-4" /> Explore Knowledge Wisely
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-navy leading-tight">
            About Tour
          </h1>
          <p className="text-navy/70 leading-relaxed text-lg">
            Tour is a student-led, non-profit research and educational platform that encourages young thinkers to start their research journey early, to learn from their curiosity, and to answer questions instead of only asking them. We believe that curiosity, learning, and publishing should be accessible to everyone, not limited by privilege, resources, or background.
          </p>
        </div>

        {/* Why Tour */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-navy/10 bg-white p-8 md:p-10 shadow-soft text-center space-y-4">
          <h2 className="font-heading text-3xl font-bold text-navy">Why Tour</h2>
          <p className="text-navy/75 leading-relaxed text-lg mx-auto">
            We believe that research should not be reserved for elite institutions or expensive programs. At Tour, we aim to create a space where young thinkers can ask meaningful questions, explore science, and transform curiosity into impactful knowledge.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card space-y-4">
            <div className="h-12 w-12 rounded-full bg-sapphire/10 border border-sapphire/20 flex items-center justify-center text-sapphire">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">Our Mission</h2>
            <p className="text-sm text-navy/75 leading-relaxed">
              We endeavor to empower young students to begin their research journey early by providing an accessible platform where they can think, explore their curiosity, write, publish, and exchange ideas freely.
            </p>
          </div>

          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card space-y-4">
            <div className="h-12 w-12 rounded-full bg-sapphire/10 border border-sapphire/20 flex items-center justify-center text-sapphire">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">Our Vision</h2>
            <p className="text-sm text-navy/75 leading-relaxed">
              We strive to create opportunities for young researchers who are passionate about exploring science and becoming active contributors to knowledge.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-bold text-navy text-center">Core Platform Values</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {values.map((v, idx) => (
              <div key={idx} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-3">
                <h3 className="font-heading text-xl font-bold text-navy">{v.title}</h3>
                <p className="text-xs text-navy/70 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-3xl border border-navy/15 bg-navy p-8 md:p-12 text-ivory space-y-8 shadow-soft">
          <h2 className="font-heading text-3xl font-bold text-ivory text-center">Platform Journey</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {timeline.map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-white/10 p-6 space-y-2 border border-white/15">
                <span className="font-heading text-2xl font-extrabold text-champagne">{item.year}</span>
                <h3 className="font-heading text-lg font-bold text-ivory">{item.title}</h3>
                <p className="text-xs text-ivory/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
