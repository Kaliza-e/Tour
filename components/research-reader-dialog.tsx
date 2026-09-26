"use client";

import { useEffect, useState } from "react";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  BookOpen,
  Maximize2,
  Minimize2,
  Quote,
  Sparkles,
  User,
  Building,
  Tag,
  Link as LinkIcon,
  FileCheck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ResearchPublicationItem {
  id: string;
  title: string;
  category: string;
  author: string;
  authors?: { name: string; institution?: string | null; bio?: string | null }[];
  abstract?: string;
  summary?: string;
  content?: string;
  methodology?: string;
  references?: string;
  keywords?: string[];
  authorBio?: string;
  publishedAt?: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  supportingLinks?: string[];
  researchType?: string;
}

export interface ResearchReaderDialogProps {
  publication: ResearchPublicationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResearchReaderDialog({
  publication,
  isOpen,
  onClose,
}: ResearchReaderDialogProps) {
  const [activeTab, setActiveTab] = useState<"text" | "pdf">("text");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Extracted document text state
  const [fileContentHtml, setFileContentHtml] = useState<string | null>(null);
  const [fileContentText, setFileContentText] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileReadError, setFileReadError] = useState<string | null>(null);

  // Fetch & extract file content whenever publication changes
  useEffect(() => {
    if (publication) {
      setActiveTab("text");
      setIsFullscreen(false);
      setFileContentHtml(null);
      setFileContentText(null);
      setFileReadError(null);

      if (publication.fileUrl) {
        const lowerUrl = publication.fileUrl.toLowerCase();
        const isDocx = lowerUrl.endsWith(".docx") || lowerUrl.endsWith(".doc");
        const isTxt = lowerUrl.endsWith(".txt") || lowerUrl.endsWith(".md");

        if (isDocx || isTxt) {
          setIsLoadingFile(true);
          fetch(`/api/read-file?url=${encodeURIComponent(publication.fileUrl)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.html) {
                setFileContentHtml(data.html);
                setFileContentText(data.text || null);
              } else if (data.text) {
                setFileContentText(data.text);
              }
            })
            .catch((err) => {
              console.error("Failed to read file:", err);
              setFileReadError("Could not extract file text");
            })
            .finally(() => {
              setIsLoadingFile(false);
            });
        }
      }
    }
  }, [publication]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !publication) return null;

  const hasFile = Boolean(publication.fileUrl);
  const fileName = publication.fileName || "Research Document";
  const fileExt = fileName.split(".").pop()?.toLowerCase() || "";

  // Strictly check if file is PDF. Non-PDF files (like .docx) are NEVER loaded in an iframe to prevent automatic downloads.
  const isPdf =
    fileExt === "pdf" ||
    publication.fileType === "application/pdf" ||
    (publication.fileUrl ? publication.fileUrl.toLowerCase().includes(".pdf") : false);

  const copyCitation = () => {
    const text = `${publication.author}. "${publication.title}." TOUR Research Journal (${publication.publishedAt || "2026"}).`;
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-navy/70 backdrop-blur-md transition-opacity">
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative z-10 flex flex-col w-full bg-white shadow-2xl rounded-3xl border border-navy/15 overflow-hidden transition-all duration-300 ${
            isFullscreen ? "h-[98vh] max-w-[98vw]" : "h-[92vh] max-w-5xl"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col border-b border-navy/10 bg-ivory/80 px-4 py-3 sm:px-6 sm:py-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              {/* Category & Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                  {publication.category}
                </span>
                {publication.researchType && (
                  <span className="rounded-full border border-navy/15 bg-white px-3 py-1 text-xs font-medium text-navy/70">
                    {publication.researchType}
                  </span>
                )}
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-2">
                {hasFile && (
                  <a
                    href={publication.fileUrl!}
                    download={publication.fileName || true}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-sapphire cursor-pointer"
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={copyCitation}
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5 transition"
                  title="Copy citation"
                >
                  <Quote size={13} />
                  <span className="hidden sm:inline">
                    {copiedCitation ? "Copied!" : "Cite"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="rounded-full border border-navy/15 bg-white p-1.5 text-navy hover:bg-navy/5 transition"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-navy/20 bg-navy/10 p-1.5 text-navy hover:bg-navy/20 transition"
                  title="Close reader (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Title & Author */}
            <div className="mt-2.5">
              <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-navy leading-tight line-clamp-2">
                {publication.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-navy/60">
                By <span className="text-navy font-semibold">{publication.author}</span>
                {publication.publishedAt && ` · Published ${publication.publishedAt}`}
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy/10 pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("text")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    activeTab === "text"
                      ? "bg-sapphire text-white shadow-xs"
                      : "bg-white border border-navy/15 text-navy/70 hover:text-navy"
                  }`}
                >
                  <BookOpen size={14} />
                  <span>Article &amp; File Text Reader</span>
                </button>

                {hasFile && isPdf && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("pdf")}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      activeTab === "pdf"
                        ? "bg-sapphire text-white shadow-xs"
                        : "bg-white border border-navy/15 text-navy/70 hover:text-navy"
                    }`}
                  >
                    <FileText size={14} />
                    <span>PDF Document View</span>
                  </button>
                )}
              </div>

              {hasFile && (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-xs text-navy/50">
                    File: {fileName}
                  </span>
                  <a
                    href={publication.fileUrl!}
                    download={publication.fileName || true}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sapphire hover:underline"
                  >
                    <Download size={12} /> Download File
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dialog Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 md:p-8">
            {/* TAB 1: ARTICLE & FILE TEXT READER (PARSES AND READS FILE CONTENT) */}
            {activeTab === "text" && (
              <div className="mx-auto max-w-3xl space-y-6">
                {/* Attached File Card */}
                {hasFile && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-navy/15 bg-champagne/40 p-4 text-xs text-navy">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                        <FileCheck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-navy">{fileName}</p>
                        <p className="text-navy/60">
                          {isLoadingFile
                            ? "Reading document content..."
                            : fileContentHtml || fileContentText
                            ? "Document text successfully loaded below"
                            : `${isPdf ? "PDF Document" : "Word Document (.docx)"} attached to this research`}
                        </p>
                      </div>
                    </div>
                    <a
                      href={publication.fileUrl!}
                      download={publication.fileName || true}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-sapphire shrink-0 cursor-pointer"
                    >
                      <Download size={14} /> Download File
                    </a>
                  </div>
                )}

                {/* Loading indicator for file parsing */}
                {isLoadingFile && (
                  <div className="flex items-center justify-center py-10 rounded-3xl border border-navy/10 bg-white p-8 text-navy/60">
                    <Loader2 className="h-6 w-6 animate-spin text-sapphire mr-3" />
                    <span className="text-sm font-medium">Parsing and reading file text...</span>
                  </div>
                )}

                {/* Extracted DOCX / File HTML Content */}
                {fileContentHtml && (
                  <section className="rounded-3xl border border-sapphire/25 bg-white p-6 sm:p-8 shadow-sm">
                    <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2 border-b border-navy/10 pb-3">
                      <Sparkles size={18} className="text-sapphire" />
                      Document Text Content ({fileName})
                    </h3>
                    <div
                      className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-navy/85 prose max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-navy prose-p:text-navy/80"
                      dangerouslySetInnerHTML={{ __html: fileContentHtml }}
                    />
                  </section>
                )}

                {/* Extracted DOCX / File Plain Text Content (Fallback if no HTML) */}
                {!fileContentHtml && fileContentText && (
                  <section className="rounded-3xl border border-sapphire/25 bg-white p-6 sm:p-8 shadow-sm">
                    <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2 border-b border-navy/10 pb-3">
                      <Sparkles size={18} className="text-sapphire" />
                      Document Text Content ({fileName})
                    </h3>
                    <div className="mt-4 whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-navy/85 font-sans">
                      {fileContentText}
                    </div>
                  </section>
                )}

                {/* Abstract Section */}
                {(publication.abstract || publication.summary) && (
                  <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
                    <h3 className="font-heading text-base font-bold uppercase tracking-wider text-sapphire">
                      Abstract
                    </h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-navy/80">
                      {publication.abstract || publication.summary}
                    </p>
                  </section>
                )}

                {/* Full Content / Research Details */}
                {publication.content && (
                  <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
                    <h3 className="font-heading text-lg font-bold text-navy">
                      Research Details &amp; Findings
                    </h3>
                    <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-navy/75 whitespace-pre-wrap">
                      {publication.content}
                    </div>
                  </section>
                )}

                {/* Methodology Section */}
                {publication.methodology && (
                  <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
                    <h3 className="font-heading text-base font-bold text-navy">
                      Methodology &amp; Approach
                    </h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-navy/75 whitespace-pre-wrap">
                      {publication.methodology}
                    </p>
                  </section>
                )}

                {/* Authors Info */}
                {((publication.authors && publication.authors.length > 0) || publication.authorBio) && (
                  <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
                    <h3 className="font-heading text-base font-bold text-navy flex items-center gap-2">
                      <User size={18} className="text-sapphire" /> About the Author(s)
                    </h3>
                    
                    {publication.authors && publication.authors.length > 0 ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {publication.authors.map((author, index) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-navy/10 bg-ivory/50 p-4 text-xs sm:text-sm"
                          >
                            <p className="font-bold text-navy">{author.name}</p>
                            {author.institution && (
                              <p className="mt-1 text-navy/60 flex items-center gap-1.5">
                                <Building size={12} /> {author.institution}
                              </p>
                            )}
                            {author.bio && (
                              <p className="mt-2 text-navy/70 leading-relaxed">
                                {author.bio}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : publication.authorBio ? (
                      <p className="mt-3 text-sm leading-relaxed text-navy/75">
                        {publication.authorBio}
                      </p>
                    ) : null}
                  </section>
                )}

                {/* Keywords */}
                {publication.keywords && publication.keywords.length > 0 && (
                  <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-xs">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy/60 flex items-center gap-1.5">
                      <Tag size={14} /> Keywords
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {publication.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-ivory px-3.5 py-1 text-xs font-medium text-navy/70 border border-navy/10"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* References */}
                {publication.references && (
                  <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
                    <h3 className="font-heading text-base font-bold text-navy">
                      References &amp; Bibliography
                    </h3>
                    <div className="mt-3 text-xs sm:text-sm leading-relaxed text-navy/70 whitespace-pre-wrap bg-ivory/40 p-4 rounded-2xl border border-navy/10">
                      {publication.references}
                    </div>
                  </section>
                )}

                {/* Supporting Links */}
                {publication.supportingLinks && publication.supportingLinks.length > 0 && (
                  <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-xs">
                    <h3 className="font-heading text-sm font-bold text-navy flex items-center gap-1.5">
                      <LinkIcon size={14} /> Supporting Links &amp; Resources
                    </h3>
                    <ul className="mt-3 space-y-2 text-xs sm:text-sm">
                      {publication.supportingLinks.map((link, i) => (
                        <li key={i}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sapphire hover:underline break-all"
                          >
                            {link} <ExternalLink size={12} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* TAB 2: PDF EMBEDDED VIEWER (STRICTLY PDF ONLY) */}
            {activeTab === "pdf" && hasFile && isPdf && (
              <div className="flex flex-col h-full min-h-[550px] w-full">
                <div className="mb-3 flex items-center justify-between rounded-2xl border border-navy/10 bg-champagne/40 px-4 py-2 text-xs text-navy">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-sapphire" />
                    <span>
                      Reading PDF Document: <strong>{fileName}</strong>
                    </span>
                  </div>
                  <a
                    href={publication.fileUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-sapphire hover:underline"
                  >
                    Open PDF <ExternalLink size={12} />
                  </a>
                </div>

                <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-navy/15 shadow-inner bg-slate-900 min-h-[580px]">
                  <iframe
                    src={`${publication.fileUrl}#toolbar=1&navpanes=0`}
                    title={publication.title}
                    className="w-full h-full min-h-[580px] border-0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-navy/10 bg-ivory/80 px-4 py-3 sm:px-6 shrink-0 text-xs text-navy/60">
            <span>TOUR Peer-Reviewed Research Publication</span>
            <div className="flex items-center gap-3">
              {hasFile && (
                <a
                  href={publication.fileUrl!}
                  download={publication.fileName || true}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-navy hover:text-sapphire cursor-pointer"
                >
                  <Download size={13} /> Save Copy
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="font-semibold text-navy hover:text-sapphire"
              >
                Close Reader
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
