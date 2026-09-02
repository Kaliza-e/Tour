import Link from "next/link";
import { Users, GraduationCap, Award, Calendar, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const mentorList = [
  {
    name: "Dr. Elena Rostova",
    title: "Postdoctoral Researcher in Computational Neuroscience",
    institution: "MIT / Harvard Mind Initiative",
    specialty: "Brain-Computer Interfaces & EEG Signal Analysis",
    slots: "Tuesdays & Thursdays",
  },
  {
    name: "Marcus Vance",
    title: "PhD Candidate in Climate Physics",
    institution: "Stanford Doerr School of Sustainability",
    specialty: "Satellite Remote Sensing & Ocean Modeling",
    slots: "Wednesdays",
  },
  {
    name: "Amina Al-Mansoor",
    title: "Bioinformatics Specialist",
    institution: "Cambridge Genetics Institute",
    specialty: "CRISPR Off-target Analysis & Genomic Pipelines",
    slots: "Fridays",
  },
];

export default function MentorshipPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <GraduationCap className="h-4 w-4" /> Academic Guidance
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-navy">
            Connect with Academic Mentors
          </h1>
          <p className="text-navy/70 leading-relaxed">
            Get 1-on-1 feedback on your hypotheses, research methodologies, paper structure, and university research opportunities from verified graduate researchers and postdocs.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {mentorList.map((m, idx) => (
            <div key={idx} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card hover:shadow-soft transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-sapphire/10 border border-sapphire/20 flex items-center justify-center font-heading font-bold text-navy text-lg">
                  {m.name.split(" ")[1]?.[0] || "M"}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-navy">{m.name}</h3>
                  <p className="text-xs font-semibold text-sapphire mt-0.5">{m.title}</p>
                  <p className="text-xs text-navy/60 mt-1">{m.institution}</p>
                </div>
                <div className="rounded-2xl bg-champagne/30 p-3 text-xs text-navy space-y-1">
                  <p className="font-semibold text-navy">Specialty Focus:</p>
                  <p className="text-navy/70">{m.specialty}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-navy/5">
                <div className="flex items-center justify-between text-xs text-navy/60">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-sapphire" /> {m.slots}</span>
                  <span className="text-emerald-700 font-semibold">Free Sessions</span>
                </div>
                <Button className="w-full rounded-full bg-navy text-ivory hover:bg-sapphire text-xs py-2.5">
                  Book 1-on-1 Office Hour
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
