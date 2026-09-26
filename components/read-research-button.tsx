"use client";

import { useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { ResearchReaderDialog, ResearchPublicationItem } from "@/components/research-reader-dialog";

export interface ReadResearchButtonProps {
  publication: ResearchPublicationItem;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  label?: string;
}

export function ReadResearchButton({
  publication,
  className,
  variant = "primary",
  label = "Read Research",
}: ReadResearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  let baseStyle =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer";

  if (variant === "primary") {
    baseStyle += " bg-navy text-white hover:bg-sapphire shadow-xs";
  } else if (variant === "outline") {
    baseStyle += " border border-navy/20 bg-white text-navy hover:bg-navy/5";
  } else {
    baseStyle += " bg-champagne text-navy hover:bg-champagne/80";
  }

  const combinedClasses = className || baseStyle;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={combinedClasses}
      >
        <BookOpen className="h-4 w-4" />
        <span>{label}</span>
      </button>

      <ResearchReaderDialog
        publication={publication}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
