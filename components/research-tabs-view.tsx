"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  MessageSquare,
  Search,
  Plus,
  Sparkles,
  ThumbsUp,
  User,
  Send,
  Filter,
  ArrowRight,
  Download,
  CheckCircle,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import { PublicationCard } from "@/components/publication-card";
import { ResearchReaderDialog, ResearchPublicationItem } from "@/components/research-reader-dialog";
import { OFFICIAL_CATEGORIES, TourCategoryConfig } from "@/lib/categories-config";

interface ResearchTabsViewProps {
  initialPublications: ResearchPublicationItem[];
}

export function ResearchTabsView({ initialPublications }: ResearchTabsViewProps) {
  const [activeTab, setActiveTab] = useState<"papers" | "questions" | "community">("papers");

  // PAPERS TAB STATE
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubtopic, setSelectedSubtopic] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("");
  const [readerPub, setReaderPub] = useState<ResearchPublicationItem | null>(null);

  // QUESTIONS TAB STATE (P1)
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [newQTitle, setNewQTitle] = useState("");
  const [newQDesc, setNewQDesc] = useState("");
  const [newQCat, setNewQCat] = useState("Science & Innovation (STEM)");
  const [newQSubtopic, setNewQSubtopic] = useState("");
  const [qNotice, setQNotice] = useState<string | null>(null);

  // COMMUNITY TAB STATE (P4)
  const [threads, setThreads] = useState<any[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [threadModalOpen, setThreadModalOpen] = useState(false);
  const [newTTitle, setNewTTitle] = useState("");
  const [newTBody, setNewTBody] = useState("");
  const [newTCat, setNewTCat] = useState("Science & Innovation (STEM)");
  const [tNotice, setTNotice] = useState<string | null>(null);

  // Active Thread Reader Modal State
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");

  // Subtopics for currently selected category
  const currentCategoryConfig = OFFICIAL_CATEGORIES.find(
    (c) => c.name === selectedCategory || c.slug === selectedCategory
  );
  const availableSubtopics = currentCategoryConfig ? currentCategoryConfig.subtopics : [];

  // Fetch Questions
  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (data.questions) setQuestions(data.questions);
    } catch (e) {
      console.error("Failed to load questions:", e);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Fetch Threads
  const loadThreads = async () => {
    setIsLoadingThreads(true);
    try {
      const res = await fetch("/api/community/threads");
      const data = await res.json();
      if (data.threads) setThreads(data.threads);
    } catch (e) {
      console.error("Failed to load threads:", e);
    } finally {
      setIsLoadingThreads(false);
    }
  };

  useEffect(() => {
    if (activeTab === "questions") loadQuestions();
    if (activeTab === "community") loadThreads();
  }, [activeTab]);

  // Filter papers locally
  const filteredPapers = initialPublications.filter((pub) => {
    const textMatches = `${pub.title} ${pub.author} ${pub.category} ${pub.abstract || ""}`.toLowerCase().includes(query.toLowerCase());
    const catMatches = selectedCategory === "All" || pub.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const authorMatches = !authorFilter || pub.author.toLowerCase().includes(authorFilter.toLowerCase());
    return textMatches && catMatches && authorMatches;
  });

  // Handle Question Creation
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQNotice(null);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newQTitle,
          description: newQDesc,
          categoryId: newQCat,
          subtopic: newQSubtopic,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setQNotice(data.error || "Failed to post question.");
        return;
      }

      setQuestionModalOpen(false);
      setNewQTitle("");
      setNewQDesc("");
      loadQuestions();
    } catch (err) {
      setQNotice("Please sign in to ask a research question.");
    }
  };

  // Handle Toggle Curious
  const handleToggleCurious = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/curious`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId ? { ...q, curiousCount: data.curiousCount } : q
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Research Question Adoption
  const handleAdoptQuestion = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/research`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to adopt question.");
        return;
      }
      alert("Research project created! You can track your workspace in your profile.");
      loadQuestions();
    } catch (e) {
      alert("Please log in to start researching this question.");
    }
  };

  // Handle Thread Creation
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setTNotice(null);
    try {
      const res = await fetch("/api/community/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTTitle,
          body: newTBody,
          category: newTCat,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTNotice(data.error || "Failed to create thread.");
        return;
      }

      setThreadModalOpen(false);
      setNewTTitle("");
      setNewTBody("");
      loadThreads();
    } catch (err) {
      setTNotice("Please sign in to start a discussion thread.");
    }
  };

  // Handle Fetch Thread Details
  const handleOpenThread = async (threadId: string) => {
    try {
      const res = await fetch(`/api/community/threads/${threadId}`);
      const data = await res.json();
      if (data.thread) setSelectedThread(data.thread);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Post Reply
  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;

    try {
      const res = await fetch(`/api/community/threads/${selectedThread.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyText }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setSelectedThread((prev: any) => ({
          ...prev,
          replies: [...(prev.replies || []), data.reply],
        }));
        setReplyText("");
      } else {
        alert(data.error || "Could not post reply.");
      }
    } catch (e) {
      alert("Please sign in to reply.");
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP MAIN NAVIGATION TABS */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-full border-2 border-navy/15 bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("papers")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "papers"
                ? "bg-navy text-ivory shadow-md"
                : "text-navy/70 hover:text-navy hover:bg-navy/5"
            }`}
          >
            <BookOpen size={16} />
            <span>Research Papers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("questions")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "questions"
                ? "bg-navy text-ivory shadow-md"
                : "text-navy/70 hover:text-navy hover:bg-navy/5"
            }`}
          >
            <HelpCircle size={16} />
            <span>Research Questions (P1)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("community")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "community"
                ? "bg-navy text-ivory shadow-md"
                : "text-navy/70 hover:text-navy hover:bg-navy/5"
            }`}
          >
            <MessageSquare size={16} />
            <span>Community (P4)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RESEARCH PAPERS LIBRARY */}
      {/* ========================================================================= */}
      {activeTab === "papers" && (
        <div className="space-y-8">
          {/* Search & Filter Control Panel */}
          <div className="rounded-3xl border-2 border-navy/15 bg-white p-6 shadow-sm space-y-4">
            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-8 relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" size={18} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search publications by title, keyword, or summary..."
                  className="h-12 w-full rounded-2xl border border-navy/15 bg-ivory/50 pl-11 pr-4 text-sm text-navy focus:border-sapphire focus:bg-white focus:outline-none transition"
                />
              </div>

              <div className="md:col-span-4">
                <input
                  type="text"
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  placeholder="Filter by author name..."
                  className="h-12 w-full rounded-2xl border border-navy/15 bg-ivory/50 px-4 text-sm text-navy focus:border-sapphire focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-navy/10">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedSubtopic("All");
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === "All"
                    ? "bg-navy text-ivory"
                    : "border border-navy/15 bg-ivory/60 text-navy hover:bg-navy/10"
                }`}
              >
                All Categories
              </button>

              {OFFICIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedSubtopic("All");
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === cat.name
                      ? "bg-sapphire text-white"
                      : "border border-navy/15 bg-ivory/60 text-navy hover:bg-navy/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Subtopics Dropdown if Category Selected */}
            {availableSubtopics.length > 0 && (
              <div className="flex items-center gap-3 pt-2 text-xs">
                <span className="font-bold text-navy/70">Subtopics:</span>
                <select
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                  className="rounded-xl border border-navy/15 bg-ivory/60 px-3 py-1.5 text-xs text-navy focus:outline-none font-medium"
                >
                  <option value="All">All Subtopics</option>
                  {availableSubtopics.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {filteredPapers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPapers.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  {...publication}
                  onRead={(pub) => setReaderPub(pub)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-navy/20 bg-white p-12 text-center space-y-3">
              <Sparkles className="mx-auto h-8 w-8 text-sapphire" />
              <h3 className="font-heading text-xl font-bold text-navy">No publications match your criteria</h3>
              <p className="text-xs sm:text-sm text-navy/65">
                Try clearing search terms or selecting a different category filter.
              </p>
            </div>
          )}

          {/* Reader Modal */}
          <ResearchReaderDialog
            publication={readerPub}
            isOpen={Boolean(readerPub)}
            onClose={() => setReaderPub(null)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RESEARCH QUESTIONS ("THE CURIOSITY LOOP") */}
      {/* ========================================================================= */}
      {activeTab === "questions" && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border-2 border-navy/15 bg-white p-6 shadow-sm">
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">Curiosity Question Board</h2>
              <p className="text-xs sm:text-sm text-navy/70 mt-1">
                Explore questions posted by young thinkers. Click <strong>&quot;I&apos;d Like to Research This&quot;</strong> to adopt a question into your workspace!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setQuestionModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-xs font-bold text-ivory hover:bg-sapphire transition shadow-md shrink-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Ask a Question</span>
            </button>
          </div>

          {isLoadingQuestions ? (
            <div className="text-center py-12 text-navy/60 font-medium">Loading research questions...</div>
          ) : questions.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-navy/20 bg-white p-12 text-center space-y-3">
              <HelpCircle className="mx-auto h-8 w-8 text-sapphire" />
              <h3 className="font-heading text-xl font-bold text-navy">No questions asked yet</h3>
              <p className="text-xs text-navy/65">Be the first student to post a curious scientific question!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="rounded-3xl border-2 border-navy/15 bg-white p-6 space-y-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-champagne/60 border border-navy/10 px-3 py-1 text-[11px] font-semibold text-navy">
                        {q.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          q.status === "RESEARCH_COMPLETED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : q.status === "BEING_RESEARCHED"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}
                      >
                        {q.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-navy">{q.title}</h3>
                    <p className="text-xs sm:text-sm text-navy/75 leading-relaxed font-light line-clamp-3">
                      {q.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-navy/10 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCurious(q.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-ivory/60 px-3 py-1 text-xs font-semibold text-navy hover:bg-navy/10 transition cursor-pointer"
                      >
                        <ThumbsUp size={13} className="text-sapphire" />
                        <span>Curious ({q.curiousCount})</span>
                      </button>
                    </div>

                    {q.status === "RESEARCH_COMPLETED" && q.linkedPaperId ? (
                      <Link
                        href={`/research?paper=${q.linkedPaperId}`}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                      >
                        <span>Research Completed</span> <CheckCircle size={14} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdoptQuestion(q.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-ivory hover:bg-sapphire transition cursor-pointer"
                      >
                        <span>I&apos;d Like to Research This</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* QUESTION MODAL FORM */}
          {questionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl border-2 border-navy/20 bg-white p-6 md:p-8 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-navy">Ask a Research Question</h3>
                  <button type="button" onClick={() => setQuestionModalOpen(false)} className="p-1 text-navy/60 hover:text-navy">
                    <X size={18} />
                  </button>
                </div>

                {qNotice && (
                  <div className="rounded-2xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 font-medium">
                    {qNotice}
                  </div>
                )}

                <form onSubmit={handleCreateQuestion} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80 mb-1">
                      Category
                    </label>
                    <select
                      value={newQCat}
                      onChange={(e) => setNewQCat(e.target.value)}
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-3 text-xs text-navy focus:outline-none"
                    >
                      {OFFICIAL_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80 mb-1">
                      Question Title
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. How do microplastics affect marine biodiversity in coastlines?"
                      value={newQTitle}
                      onChange={(e) => setNewQTitle(e.target.value)}
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-3 text-xs text-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80 mb-1">
                      Description & Background
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Explain what curious question you have and why it matters..."
                      value={newQDesc}
                      onChange={(e) => setNewQDesc(e.target.value)}
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-3 text-xs text-navy focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-navy py-3.5 text-xs font-bold text-white hover:bg-sapphire transition cursor-pointer"
                  >
                    Submit Question to Board
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMMUNITY DISCUSSION BOARD (P4) */}
      {/* ========================================================================= */}
      {activeTab === "community" && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border-2 border-navy/15 bg-white p-6 shadow-sm">
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">Student Community Board</h2>
              <p className="text-xs sm:text-sm text-navy/70 mt-1">
                Moderated academic discussion threads across research fields. Share thoughts, ask for advice, and exchange ideas!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setThreadModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-xs font-bold text-ivory hover:bg-sapphire transition shadow-md shrink-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Start Discussion</span>
            </button>
          </div>

          {isLoadingThreads ? (
            <div className="text-center py-12 text-navy/60 font-medium">Loading community threads...</div>
          ) : threads.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-navy/20 bg-white p-12 text-center space-y-3">
              <MessageSquare className="mx-auto h-8 w-8 text-sapphire" />
              <h3 className="font-heading text-xl font-bold text-navy">No discussion threads yet</h3>
              <p className="text-xs text-navy/65">Start a discussion thread to begin exchanging research ideas!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => handleOpenThread(thread.id)}
                  className="rounded-3xl border-2 border-navy/15 bg-white p-6 space-y-3 shadow-sm hover:border-navy transition cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-champagne/60 border border-navy/10 px-3 py-0.5 text-xs font-semibold text-navy">
                      {thread.category}
                    </span>
                    <span className="text-xs text-navy/50 font-mono">
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-navy">{thread.title}</h3>
                  <p className="text-xs sm:text-sm text-navy/75 line-clamp-2 font-light">{thread.body}</p>

                  <div className="pt-2 flex items-center justify-between text-xs text-navy/60 border-t border-navy/10">
                    <span>Started by {thread.authorName}</span>
                    <span className="font-bold text-sapphire">{thread.replyCount} Replies</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* THREAD DETAIL MODAL */}
          {selectedThread && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
              <div className="w-full max-w-2xl h-[85vh] flex flex-col rounded-3xl border-2 border-navy/20 bg-white overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-4 text-ivory">
                  <div>
                    <span className="rounded-full bg-sapphire px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {selectedThread.category}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-ivory mt-1 line-clamp-1">
                      {selectedThread.title}
                    </h3>
                  </div>
                  <button type="button" onClick={() => setSelectedThread(null)} className="p-1 text-ivory/80 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Thread Post */}
                  <div className="rounded-2xl border border-navy/15 bg-ivory/40 p-5 space-y-2">
                    <p className="text-xs font-bold text-navy">Posted by {selectedThread.author?.name}</p>
                    <p className="text-sm leading-relaxed text-navy/85 whitespace-pre-wrap">{selectedThread.body}</p>
                  </div>

                  {/* Replies List */}
                  <div className="space-y-4">
                    <h4 className="font-heading text-base font-bold text-navy">
                      Replies ({selectedThread.replies?.length || 0})
                    </h4>
                    {selectedThread.replies?.map((rep: any) => (
                      <div key={rep.id} className="rounded-2xl border border-navy/10 bg-white p-4 space-y-1">
                        <p className="text-xs font-bold text-sapphire">{rep.author?.name}</p>
                        <p className="text-xs sm:text-sm text-navy/80 leading-relaxed">{rep.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handlePostReply} className="border-t border-navy/10 p-4 bg-ivory flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a constructive reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-xs text-navy focus:outline-none"
                  />
                  <button type="submit" className="rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-sapphire transition cursor-pointer">
                    Reply
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* CREATE THREAD MODAL */}
          {threadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl border-2 border-navy/20 bg-white p-6 md:p-8 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-navy">Start a Discussion Thread</h3>
                  <button type="button" onClick={() => setThreadModalOpen(false)} className="p-1 text-navy/60 hover:text-navy">
                    <X size={18} />
                  </button>
                </div>

                {tNotice && (
                  <div className="rounded-2xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 font-medium">
                    {tNotice}
                  </div>
                )}

                <form onSubmit={handleCreateThread} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80 mb-1">
                      Category
                    </label>
                    <select
                      value={newTCat}
                      onChange={(e) => setNewTCat(e.target.value)}
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-3 text-xs text-navy focus:outline-none"
                    >
                      {OFFICIAL_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80 mb-1">
                      Topic Title
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Tips for organizing research citations in secondary school?"
                      value={newTTitle}
                      onChange={(e) => setNewTTitle(e.target.value)}
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-3 text-xs text-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80 mb-1">
                      Discussion Content
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your experience or question to start a community discussion..."
                      value={newTBody}
                      onChange={(e) => setNewTBody(e.target.value)}
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-3 text-xs text-navy focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-navy py-3.5 text-xs font-bold text-white hover:bg-sapphire transition cursor-pointer"
                  >
                    Post Discussion Thread
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
