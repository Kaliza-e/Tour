import { Trophy, Calendar, Sparkles, Flame, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const challenges = [
  {
    title: "Youth Climate Resilience Hackathon 2026",
    category: "Environmental Science",
    prize: "$2,500 Grant + Mentorship",
    deadline: "August 31, 2026",
    participants: 142,
    status: "Active Now",
  },
  {
    title: "AI Ethics & Algorithmic Fairness Writing Contest",
    category: "Computer Science & Philosophy",
    prize: "Publication in TOUR Volume IV + Certificate",
    deadline: "September 15, 2026",
    participants: 89,
    status: "Active Now",
  },
  {
    title: "Microbiome & Gut Health Student Hypothesis Sprint",
    category: "Medicine & Biology",
    prize: "Lab Access Sponsorship",
    deadline: "October 1, 2026",
    participants: 64,
    status: "Upcoming",
  },
];

export default function ChallengesPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <Trophy className="h-4 w-4" /> Global Research Competitions
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-navy">
            Monthly Research Challenges
          </h1>
          <p className="text-navy/70 leading-relaxed">
            Test your scientific curiosity, solve pressing real-world challenges, submit research proposals, and win seed grants and university recommendations.
          </p>
        </div>

        {/* Challenges List */}
        <div className="space-y-6">
          {challenges.map((c, idx) => (
            <div key={idx} className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card hover:shadow-soft transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-1 text-xs font-bold text-sapphire">
                    {c.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full">
                    <Flame className="h-3.5 w-3.5" /> {c.status}
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy">{c.title}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-navy/70 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-navy"><Trophy className="h-3.5 w-3.5 text-sapphire" /> Prize: {c.prize}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-sapphire" /> Deadline: {c.deadline}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-sapphire" /> {c.participants} Teams Entered</span>
                </div>
              </div>

              <Button className="rounded-full bg-navy hover:bg-sapphire text-ivory px-6 py-3 shrink-0 flex items-center gap-2">
                Join Challenge <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
