"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, BookOpen, Clock, Eye, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const allPapers = [
  {
    id: "p1",
    title: "Microplastic Accumulation in Freshwater Snails",
    author: "Leah M.",
    institution: "Oakridge High School",
    country: "United States",
    category: "Environmental Science",
    readingTime: "9 min read",
    views: 2140,
    abstract: "Investigating the biological uptake rates of low-density polyethylene microplastics in biomonitor snails across urban river basins.",
    date: "Aug 2026",
    trending: true,
  },
  {
    id: "p2",
    title: "Predicting Wildfire Spread with Lightweight Neural Nets",
    author: "Kofi A.",
    institution: "Accra Academy",
    country: "Ghana",
    category: "Computer Science",
    readingTime: "12 min read",
    views: 3320,
    abstract: "Convolutional neural network architecture optimized for edge devices onboard low-cost drones for real-time wildfire perimeter forecasting.",
    date: "Jul 2026",
    trending: true,
  },
  {
    id: "p3",
    title: "Sleep Patterns and Memory Consolidation in Teens",
    author: "Sofia N.",
    institution: "International School of Geneva",
    country: "Switzerland",
    category: "Psychology",
    readingTime: "7 min read",
    views: 1870,
    abstract: "Observational study mapping REM sleep duration against declarative memory retention test scores across 150 adolescent subjects.",
    date: "Jul 2026",
    trending: false,
  },
  {
    id: "p4",
    title: "Acoustic Levitation Dynamics in Microgravity Simulations",
    author: "Elena V.",
    institution: "Kyiv Science Lyceum",
    country: "Ukraine",
    category: "Physics",
    readingTime: "14 min read",
    views: 940,
    abstract: "Experimental setup evaluating ultrasonic standing wave node stability for containerless liquid droplet crystallization.",
    date: "Jun 2026",
    trending: false,
  },
];

const categories = ["All Categories", "Environmental Science", "Computer Science", "Psychology", "Physics", "Biology", "Medicine"];

export default function ExploreResearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredPapers = allPapers.filter((p) => {
    const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.abstract.toLowerCase().includes(query.toLowerCase()) || p.author.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <BookOpen className="h-4 w-4" /> Global Open Access Archive
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy">
            Explore Peer-Reviewed Student Research
          </h1>
          <p className="text-navy/70 leading-relaxed">
            Discover pioneering papers, review articles, and scientific hypotheses published by young researchers around the globe.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-navy/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, keyword, author, or institution..."
              className="w-full rounded-full border border-navy/15 bg-ivory/40 pl-12 pr-4 py-3 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sapphire"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pt-2 pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-navy text-ivory shadow-sm"
                    : "border border-navy/10 bg-ivory/50 text-navy hover:bg-champagne/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPapers.map((paper) => (
            <div key={paper.id} className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card hover:shadow-soft transition flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-1 text-xs font-bold text-sapphire">
                    {paper.category}
                  </span>
                  {paper.trending && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3" /> Trending
                    </span>
                  )}
                </div>

                <Link href={`/research/${paper.id}`}>
                  <h3 className="font-heading text-2xl font-bold text-navy hover:text-sapphire transition">
                    {paper.title}
                  </h3>
                </Link>

                <p className="text-xs text-navy/70 leading-relaxed line-clamp-3">
                  {paper.abstract}
                </p>
              </div>

              <div className="pt-4 border-t border-navy/5 flex items-center justify-between text-xs text-navy/60">
                <div>
                  <p className="font-bold text-navy">{paper.author}</p>
                  <p className="text-[11px]">{paper.institution} • {paper.country}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {paper.readingTime}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {paper.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
