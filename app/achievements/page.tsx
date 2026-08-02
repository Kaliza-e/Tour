import { Trophy, Award, Clock, Star, ShieldCheck, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const userAchievements = [
  { title: "First Hypothesizer", desc: "Submitted your first research question", icon: Sparkles, date: "Aug 2026" },
  { title: "Verified Peer Reviewer", desc: "Completed 5 peer reviews with high accuracy", icon: ShieldCheck, date: "Jul 2026" },
  { title: "25 Volunteer Hours", desc: "Tracked volunteer hours editing youth papers", icon: Clock, date: "Jun 2026" },
  { title: "Challenge Winner", desc: "1st Place in AI for Sustainability Hackathon", icon: Trophy, date: "May 2026" },
];

export default function AchievementsPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <Award className="h-4 w-4" /> Academic Portfolio & Recognition
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy">
            Badges, Certificates & Volunteer Hours
          </h1>
          <p className="text-navy/70 leading-relaxed">
            Every contribution on TOUR earns verifiable credentials, certified volunteer hours for university applications, and academic distinction badges.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card text-center space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire tracking-wider">Total Volunteer Hours</p>
            <p className="font-heading text-4xl font-extrabold text-navy">38.5 hrs</p>
            <p className="text-xs text-emerald-700 font-semibold">Verified by TOUR Board</p>
          </div>
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card text-center space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire tracking-wider">Badges Unlocked</p>
            <p className="font-heading text-4xl font-extrabold text-navy">8 / 12</p>
            <p className="text-xs text-navy/60">Top 5% Researcher</p>
          </div>
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card text-center space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire tracking-wider">Peer Reviews Done</p>
            <p className="font-heading text-4xl font-extrabold text-navy">14</p>
            <p className="text-xs text-navy/60">100% Acceptance Rate</p>
          </div>
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card text-center space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire tracking-wider">Certificates</p>
            <p className="font-heading text-4xl font-extrabold text-navy">3</p>
            <p className="text-xs text-navy/60">Downloadable PDFs</p>
          </div>
        </div>

        {/* Certificate Section */}
        <div className="rounded-3xl border border-navy/15 bg-navy p-8 text-ivory flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-bold text-ivory">Official Student Researcher Certificate</h3>
            <p className="text-sm text-ivory/80 max-w-xl">
              Generated with cryptographic verification hash. Suitable for university application portfolios and resume documentation.
            </p>
          </div>
          <Button className="rounded-full bg-champagne text-navy hover:bg-white font-semibold px-6 py-3 shrink-0 flex items-center gap-2">
            <Download className="h-4 w-4" /> Download Certified PDF
          </Button>
        </div>

        {/* Badges Grid */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-navy">Unlocked Badges</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {userAchievements.map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <div key={idx} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card flex flex-col items-center text-center space-y-3">
                  <div className="h-16 w-16 rounded-full bg-champagne/60 border border-navy/10 flex items-center justify-center text-navy shadow-inner">
                    <IconComp className="h-8 w-8 text-sapphire" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-navy">{badge.title}</h4>
                    <p className="text-xs text-navy/70 mt-1">{badge.desc}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase text-sapphire bg-champagne/40 px-3 py-1 rounded-full">
                    Earned {badge.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
