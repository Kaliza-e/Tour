"use client";

import { useState } from "react";
import { BookOpen, FileText, Download, Share2, Bookmark, CheckCircle2, Quote, Eye, ThumbsUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const paper = {
    title: "Microplastic Accumulation in Freshwater Snails across Urban River Basins",
    authors: [
      { name: "Leah M.", school: "Oakridge High School", country: "United States" },
      { name: "Siddharth R.", school: "Stanford Online High School", country: "United States" },
    ],
    category: "Environmental Science",
    date: "August 2026",
    doi: "10.5281/zenodo.tour.2026.0812",
    abstract: "Microplastics pose an increasing ecological risk to benthic freshwater organisms. This study evaluates the bioaccumulation rates of low-density polyethylene (LDPE) particles (10–50 µm) in freshwater snails (Physella acuta) across three urban river gradients. Results indicate a strong correlation between upstream stormwater runoff volume and tissue microplastic concentration, suggesting benthic gastropods serve as reliable bioindicators.",
    citation: "Leah, M., & Siddharth, R. (2026). Microplastic Accumulation in Freshwater Snails across Urban River Basins. TOUR Journal of Youth Science, 4(2), 45–58.",
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(paper.citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-navy/10 pb-8">
          <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-1 text-xs font-bold text-sapphire">
            {paper.category}
          </span>

          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-navy leading-tight">
            {paper.title}
          </h1>

          {/* Authors */}
          <div className="flex flex-wrap gap-4 text-xs pt-2">
            {paper.authors.map((a, idx) => (
              <div key={idx} className="rounded-2xl border border-navy/10 bg-white p-3 space-y-0.5 shadow-sm">
                <p className="font-bold text-navy">{a.name}</p>
                <p className="text-navy/60">{a.school} • {a.country}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-navy/60 pt-4">
            <span>Published {paper.date} • DOI: {paper.doi}</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowPdfModal(true)} className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Read PDF
              </Button>
              <Button size="sm" variant="secondary" onClick={handleCopyCitation} className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs flex items-center gap-1.5">
                <Quote className="h-3.5 w-3.5" /> {copied ? "Copied APA!" : "Cite"}
              </Button>
            </div>
          </div>
        </div>

        {/* Abstract Box */}
        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card space-y-3">
          <h3 className="font-heading text-xl font-bold text-navy">Abstract</h3>
          <p className="text-sm text-navy/80 leading-relaxed">{paper.abstract}</p>
        </div>

        {/* PDF Embedded Reader Modal */}
        {showPdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-md">
            <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-3xl border border-navy/10 bg-ivory shadow-soft overflow-hidden">
              <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-4 text-ivory">
                <span className="font-heading font-bold text-sm">{paper.title} (PDF Document Viewer)</span>
                <button onClick={() => setShowPdfModal(false)} className="rounded-full p-1 text-ivory/70 hover:bg-white/10 hover:text-ivory">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 bg-slate-800 p-8 flex items-center justify-center text-ivory/80 text-center">
                <div className="space-y-4 max-w-md">
                  <FileText className="h-16 w-16 mx-auto text-champagne" />
                  <h4 className="font-heading text-xl font-bold text-ivory">TOUR PDF Reader Simulation</h4>
                  <p className="text-xs text-ivory/70">
                    Integrated PDF.js Reader allows full-page zoom, keyword search, text highlighting, and direct annotation export.
                  </p>
                  <Button className="rounded-full bg-champagne text-navy hover:bg-white text-xs px-6 py-2">
                    <Download className="h-4 w-4 mr-1.5" /> Download Full PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
