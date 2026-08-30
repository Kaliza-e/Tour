import { Users, Linkedin, Github, Globe } from "lucide-react";

const teamMembers = [
  {
    name: "Wasan alnaqeeb",
    role: "Chief Executive Officer (CEO)",
    bio: "Visionary leader driving Tour's mission to democratize research and empower student scientists worldwide.",
    institution: "Tour",
  },
  {
    name: "Siddharth Rao",
    role: "Founder & Executive Director",
    bio: "High school senior passionate about democratizing scientific publishing and open peer review for youth.",
    institution: "Stanford Online High School",
  },
  {
    name: "Kaliza Esther",
    role: "Tech Lead",
    bio: "Lead engineer architecting Tour's platform — building scalable, open web tools for collaborative student research.",
    institution: "Tour",
  },
  {
    name: "Dr. Catherine Hayes",
    role: "Academic Advisor & Board Chair",
    bio: "Professor of Molecular Biology & Advocate for Early Research Mentorship in STEM.",
    institution: "MIT Dept of Biology",
  },
];

export default function TeamPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <Users className="h-4 w-4" /> Leadership & Contributors
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy">
            The Minds Behind TOUR
          </h1>
          <p className="text-navy/70 leading-relaxed">
            Driven by a global coalition of high school researchers, university mentors, software architects, and scientific editors.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((m, idx) => (
            <div key={idx} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card hover:shadow-soft transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-16 w-16 rounded-full bg-navy text-ivory font-heading font-bold text-xl flex items-center justify-center shadow-md">
                  {m.name.split(" ")[0][0]}{m.name.split(" ")[1]?.[0] || ""}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-navy">{m.name}</h3>
                  <p className="text-xs font-bold text-sapphire">{m.role}</p>
                  <p className="text-[11px] text-navy/60 font-semibold">{m.institution}</p>
                </div>
                <p className="text-xs text-navy/70 leading-relaxed">{m.bio}</p>
              </div>

              <div className="pt-3 border-t border-navy/5 flex gap-2 text-navy/60">
                <Globe className="h-4 w-4 hover:text-sapphire cursor-pointer" />
                <Linkedin className="h-4 w-4 hover:text-sapphire cursor-pointer" />
                <Github className="h-4 w-4 hover:text-sapphire cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
