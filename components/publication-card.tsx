"use client";

import { useState } from "react";
import { FlaticonArrowRight } from "@/components/flaticons";
import { Download, BookOpen } from "lucide-react";
import { ResearchReaderDialog, ResearchPublicationItem } from "@/components/research-reader-dialog";

export interface PublicationCardProps extends ResearchPublicationItem {
  onRead?: (publication: ResearchPublicationItem) => void;
}

export function PublicationCard(p: PublicationCardProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const handleReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (p.onRead) {
      p.onRead(p);
    } else {
      setIsReaderOpen(true);
    }
  };

  return (
    <>
      <div className="group flex flex-col justify-between rounded-3xl border-2 border-navy/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy/40 hover:shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-navy/70">
              {p.category}
            </span>
            {p.publishedAt && (
              <span className="text-xs text-navy/40">{p.publishedAt}</span>
            )}
          </div>

          <h3
            onClick={handleReadClick}
            className="mt-4 font-heading text-lg font-bold leading-snug text-navy group-hover:text-sapphire cursor-pointer"
          >
            {p.title}
          </h3>

          <p className="mt-1 text-xs font-semibold text-navy/60">by {p.author}</p>

          {(p.summary || p.abstract) && (
            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-navy/65">
              {p.summary || p.abstract}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={handleReadClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-white transition hover:bg-sapphire cursor-pointer"
          >
            <BookOpen size={14} />
            <span>Read Research</span>
            <FlaticonArrowRight size={14} />
          </button>

          {p.fileUrl && (
            <a
              href={p.fileUrl}
              download={p.fileName || true}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-ivory px-3.5 py-2 text-navy hover:bg-navy/10 transition"
            >
              <Download size={14} /> Download
            </a>
          )}
        </div>
      </div>

      {!p.onRead && (
        <ResearchReaderDialog
          publication={p}
          isOpen={isReaderOpen}
          onClose={() => setIsReaderOpen(false)}
        />
      )}
    </>
  );
}
