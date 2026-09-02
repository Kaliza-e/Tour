import { Search } from "lucide-react";
import { PublicationCard } from "@/components/publication-card";

const papers = [
  { id: "p1", title: "Microplastic Accumulation in Freshwater Snails", author: "Leah M.", category: "Environmental Science", readingTime: "9 min read", views: 2140 },
  { id: "p2", title: "Predicting Wildfire Spread with Lightweight Neural Nets", author: "Kofi A.", category: "Computer Science", readingTime: "12 min read", views: 3320 },
  { id: "p3", title: "Sleep Patterns and Memory Consolidation in Teens", author: "Sofia N.", category: "Psychology", readingTime: "7 min read", views: 1870 },
  { id: "p4", title: "Antibiotic Resistance in Urban Soil Bacteria", author: "Tariq H.", category: "Biology", readingTime: "10 min read", views: 1420 },
  { id: "p5", title: "Voter Turnout and Local News Deserts", author: "Grace P.", category: "Social Science", readingTime: "8 min read", views: 990 },
  { id: "p6", title: "Low-Cost Water Filtration Using Moringa Seeds", author: "Ben O.", category: "Engineering", readingTime: "6 min read", views: 2650 },
];

export default function PublicationsPage() {
  return (
    <div className="container-tour py-20">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Publications</span>
        <h1 className="mt-3 font-heading text-2xl font-semibold text-navy">Explore research</h1>
        <p className="mt-3 text-navy/60">
          A modern library of published student research — searchable, citable, and
          growing every week.
        </p>
      </div>

      <div className="mt-10 relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" size={18} />
        <input
          type="search"
          placeholder="Search publications..."
          className="h-12 w-full rounded-pill border border-navy/10 bg-white pl-11 pr-5 text-sm outline-none focus-visible:border-sapphire"
        />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {papers.map((p) => (
          <PublicationCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
