"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { PublicationCard } from "@/components/publication-card";

type PublicationItem = {
  id: string;
  title: string;
  category: string;
  author: string;
};

export function PublicationLibrary({ publications }: { publications: PublicationItem[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(publications.map((publication) => publication.category))).sort()];
  const filtered = useMemo(() => publications.filter((publication) => {
    const text = `${publication.title} ${publication.author} ${publication.category}`.toLowerCase();
    return (selectedCategory === "All" || publication.category === selectedCategory) && text.includes(query.toLowerCase());
  }), [publications, query, selectedCategory]);

  return (
    <>
      <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" size={18} />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, topic, or author" className="h-12 w-full rounded-full border border-navy/10 bg-ivory/40 pl-11 pr-5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sapphire" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${selectedCategory === category ? "bg-navy text-ivory" : "border border-navy/10 bg-ivory/50 text-navy hover:border-navy/30"}`}>{category}</button>)}
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((publication) => <PublicationCard key={publication.id} {...publication} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-navy/20 bg-white p-10 text-center shadow-card"><Sparkles className="mx-auto h-8 w-8 text-sapphire" /><h2 className="mt-4 font-heading text-2xl font-bold text-navy">No published research yet</h2><p className="mt-3 text-sm leading-relaxed text-navy/65">Approved research will appear here after an admin publishes it.</p></div>
      )}
    </>
  );
}
