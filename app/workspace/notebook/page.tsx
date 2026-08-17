"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Save,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ListTodo,
  Quote,
  StickyNote,
  Download,
  Send,
  Eye,
  Clock,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
  BarChart3,
  AlignLeft,
  ChevronDown,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SectionKey =
  | "title"
  | "abstract"
  | "introduction"
  | "methodology"
  | "results"
  | "discussion"
  | "conclusion"
  | "references";

interface SectionContent {
  key: SectionKey;
  label: string;
  wordTarget: number;
  guidePrompt: string;
  content: string;
}

const defaultSections: SectionContent[] = [
  {
    key: "abstract",
    label: "Abstract",
    wordTarget: 250,
    guidePrompt:
      "A succinct single-paragraph summary (150-250 words) outlining the research problem, hypothesis, methodology, key findings, and scientific implication.",
    content:
      "Microplastics pose an escalating ecological threat to freshwater benthic ecosystems. This study quantifies the bioaccumulation rates of low-density polyethylene (LDPE) particles (10–50 µm) in freshwater snails (Physella acuta) across three urban river basins exhibiting differing runoff intensities. Water samples and biological specimens were harvested across dry and peak precipitation periods. Nile Red fluorometric microscopy revealed a 4.2-fold increase in digestive tissue particle retention in downstream industrial tributaries relative to upstream reference points (p < 0.001). These findings provide strong empirical evidence that benthic gastropods function as sensitive, cost-effective bioindicators for urban microplastic pollution tracking.",
  },
  {
    key: "introduction",
    label: "Introduction & Literature Review",
    wordTarget: 800,
    guidePrompt:
      "Establish the scientific background, summarize relevant peer-reviewed literature, identify research gaps, and clearly articulate the primary hypothesis.",
    content:
      "Anthropogenic plastic accumulation represents one of the most pervasive ecological crises of the 21st century. While marine microplastic dynamics have been extensively cataloged (Thompson et al., 2004; Galloway & Lewis, 2016), freshwater river systems remain critically under-studied despite acting as the primary conduits transporting land-based waste to oceanic reservoirs.\n\nBenthic macroinvertebrates, particularly grazing gastropods such as Physella acuta, occupy a pivotal trophic niche by consuming biofilm and detrital material from submerged benthic substrates. Consequently, they are directly exposed to settled microplastic particles.\n\nThis paper investigates whether stormwater runoff gradient correlates with LDPE uptake in freshwater gastropods, testing the hypothesis that increased urban runoff volume directly amplifies digestive tract particle retention.",
  },
  {
    key: "methodology",
    label: "Materials & Methodology",
    wordTarget: 700,
    guidePrompt:
      "Detail your experimental design, sample collection procedures, instrumentation, controls, and statistical analysis methods.",
    content:
      "1. Study Area & Sampling:\nSamples were collected across three designated sampling stations along the Cedar River Basin: Station A (upstream nature reserve control), Station B (suburban stormwater outfall), and Station C (urban industrial canal).\n\n2. Specimen Extraction:\nAt each site, n=15 adult Physella acuta individuals of uniform shell length (8.5 ± 0.6 mm) were collected using acid-washed stainless steel sieves.\n\n3. Digestion & Nile Red Staining:\nDigestive gland tissues were dissected and digested using 10% potassium hydroxide (KOH) solution at 60°C for 24 hours to dissolve organic cellular matter without degrading LDPE polymers. Solutions were stained with Nile Red (1 µg/mL in acetone) and filtered onto 0.45 µm glass microfiber filters.\n\n4. Fluorescence Microscopy & Statistical Analysis:\nParticles were quantified under green excitation (450–490 nm) on an epifluorescence microscope. Group differences were evaluated using one-way ANOVA followed by Tukey's HSD post-hoc test.",
  },
  {
    key: "results",
    label: "Data & Results",
    wordTarget: 600,
    guidePrompt:
      "Present empirical findings clearly with quantitative metrics, observations, data trends, and statistical significance.",
    content:
      "A total of 45 specimens across the three river stations were analyzed. All examined individuals from urban stations B and C exhibited quantifiable fluorescent microplastic particles within their digestive tracts.\n\n- Station A (Upstream Control): Mean retention was 3.2 ± 1.1 particles/individual.\n- Station B (Suburban Outflow): Mean retention was 8.7 ± 2.3 particles/individual.\n- Station C (Urban Industrial): Mean retention was 14.8 ± 3.4 particles/individual (4.6x higher than control, p < 0.001).\n\nParticle size distribution skewed heavily toward 15–25 µm fragments (68% of all identified items), suggesting active ingestion rather than passive exterior adhesion.",
  },
  {
    key: "discussion",
    label: "Discussion & Critical Analysis",
    wordTarget: 800,
    guidePrompt:
      "Interpret results in context of existing knowledge, evaluate whether hypotheses were supported, analyze limitations, and discuss broader scientific impact.",
    content:
      "The empirical data strongly support the original hypothesis: urban stormwater runoff volume directly correlates with elevated microplastic bioaccumulation in freshwater gastropods.\n\nThe pronounced retention observed in Physella acuta indicates that benthic grazers readily ingest LDPE fragments during natural biofilm foraging. This bioaccumulation creates potential pathways for trophic transfer to predator species including freshwater fish and waterfowl.\n\nLimitations:\nThis study was constrained to low-density polyethylene (LDPE) and did not quantify polyvinyl chloride (PVC) or synthetic textile fibers. Future youth research initiatives should expand spectroscopic analysis with micro-FTIR.",
  },
  {
    key: "conclusion",
    label: "Conclusion & Future Work",
    wordTarget: 300,
    guidePrompt:
      "Summarize major conclusions, state the core contribution of your study, and propose actionable avenues for future research.",
    content:
      "This study establishes that freshwater snails (Physella acuta) serve as responsive biological monitors for urban microplastic contamination. Standardized gastropod bioassays provide high schools, youth science clubs, and municipal river watch programs with an accessible, high-accuracy protocol for assessing watershed health.",
  },
];

const initialReferences = [
  {
    id: "ref-1",
    citation: "Thompson, R. C., et al. (2004). Lost at sea: where is all the plastic? Science, 304(5672), 838-838.",
    url: "https://doi.org/10.1126/science.1094559",
    style: "APA 7th",
  },
  {
    id: "ref-2",
    citation: "Galloway, T. S., & Lewis, C. N. (2016). Marine microplastics: spell disaster for organisms? Science, 354(6314), 844-845.",
    url: "https://doi.org/10.1126/science.aak9767",
    style: "APA 7th",
  },
  {
    id: "ref-3",
    citation: "Wagner, M., et al. (2014). Microplastics in freshwater ecosystems: what we know and what we need to know. Environmental Sciences Europe, 26(1), 1-9.",
    url: "https://doi.org/10.1186/s12302-014-0012-7",
    style: "APA 7th",
  },
];

const initialNotes = [
  { id: "note-1", title: "KOH Digestion Ratio", text: "Use 10% KOH at 60°C for 24h. Temperatures above 65°C can deform LDPE shape.", tag: "Protocol" },
  { id: "note-2", title: "Control Baseline", text: "Station A upstream count is 3.2 items. Make sure to note in discussion.", tag: "Data" },
  { id: "note-3", title: "Citation Needed", text: "Look up Wagner 2014 freshwater literature review for Intro para 2.", tag: "Lit Review" },
];

export default function ResearchNotebookPage() {
  const [paperTitle, setPaperTitle] = useState("Microplastic Accumulation in Freshwater Snails Across Urban River Basins");
  const [category, setCategory] = useState("Environmental Science");
  const [activeSection, setActiveSection] = useState<SectionKey>("abstract");
  const [sections, setSections] = useState<SectionContent[]>(defaultSections);
  const [references, setReferences] = useState(initialReferences);
  const [notes, setNotes] = useState(initialNotes);
  const [newNoteText, setNewNoteText] = useState("");
  const [newRefCitation, setNewRefCitation] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"checklist" | "references" | "notes" | "ai">("checklist");
  
  // Autosave status
  const [savedStatus, setSavedStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");
  const [showExportModal, setShowExportModal] = useState(false);
  const [citationFormat, setCitationFormat] = useState<"APA" | "MLA" | "IEEE" | "Chicago">("APA");

  // Checklist items
  const [checklist, setChecklist] = useState([
    { id: "chk-1", text: "Define hypothesis and core inquiry in Introduction", done: true },
    { id: "chk-2", text: "Detail materials, specimen sizes, and sample sites", done: true },
    { id: "chk-3", text: "Include statistical p-values in Results", done: true },
    { id: "chk-4", text: "Acknowledge experimental limitations in Discussion", done: true },
    { id: "chk-5", text: "Ensure minimum of 3 peer-reviewed citations", done: true },
    { id: "chk-6", text: "Review against TOUR AI Ethics & Originality guidelines", done: false },
  ]);

  const currentSection = sections.find((s) => s.key === activeSection) || sections[0];

  // Calculate total word count
  const totalWords = sections.reduce((acc, s) => {
    const words = s.content.trim() ? s.content.trim().split(/\s+/).length : 0;
    return acc + words;
  }, 0);

  const targetWordsTotal = sections.reduce((acc, s) => acc + s.wordTarget, 0);
  const progressPercent = Math.min(100, Math.round((totalWords / targetWordsTotal) * 100));

  const handleSectionContentChange = (content: string) => {
    setSavedStatus("unsaved");
    setSections((prev) =>
      prev.map((s) => (s.key === activeSection ? { ...s, content } : s))
    );
  };

  const handleSave = () => {
    setSavedStatus("saving");
    setTimeout(() => {
      setSavedStatus("saved");
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 500);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    setNotes([
      ...notes,
      { id: "note-" + Date.now(), title: "Research Memo", text: newNoteText.trim(), tag: "Notebook" },
    ]);
    setNewNoteText("");
  };

  const handleAddReference = () => {
    if (!newRefCitation.trim()) return;
    setReferences([
      ...references,
      { id: "ref-" + Date.now(), citation: newRefCitation.trim(), url: "", style: `${citationFormat} 7th` },
    ]);
    setNewRefCitation("");
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="bg-ivory/30 min-h-screen pb-16">
      {/* ── Top Header / Sticky Action Bar ── */}
      <div className="sticky top-0 z-30 border-b border-navy/10 bg-white/95 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/dashboard"
              title="Return to Dashboard"
              className="rounded-full p-1.5 sm:p-2 text-navy/60 hover:bg-navy/5 hover:text-navy transition shrink-0"
            >
              <Layers className="h-4 w-4" />
            </Link>
            
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-sapphire/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-sapphire uppercase tracking-wider">
                  {category}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-navy/50 flex items-center gap-1">
                  {savedStatus === "saving" ? (
                    <span className="text-amber-600 animate-pulse font-semibold">Saving...</span>
                  ) : savedStatus === "saved" ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Saved at {lastSavedTime}
                    </span>
                  ) : (
                    <span className="text-navy/60">Unsaved changes</span>
                  )}
                </span>
              </div>
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                placeholder="Enter Manuscript Title..."
                className="font-heading text-sm sm:text-base md:text-lg font-bold text-navy bg-transparent border-b border-transparent hover:border-navy/20 focus:border-sapphire focus:outline-none w-full truncate py-0.5"
              />
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 flex-wrap justify-end">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-ivory/80 border border-navy/10 px-3 py-1 text-xs">
              <BarChart3 className="h-3.5 w-3.5 text-sapphire" />
              <span className="font-bold text-navy">{totalWords}</span>
              <span className="text-navy/50">/ {targetWordsTotal} ({progressPercent}%)</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              className="rounded-full border-navy/20 text-navy hover:bg-navy hover:text-ivory text-[11px] sm:text-xs px-3 sm:px-4 py-1 flex items-center gap-1"
            >
              <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Save
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="rounded-full border-navy/20 text-navy hover:bg-navy hover:text-ivory text-[11px] sm:text-xs px-3 sm:px-4 py-1 flex items-center gap-1"
            >
              <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Export
            </Button>

            <Link href="/submit">
              <Button
                size="sm"
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-ivory text-[11px] sm:text-xs font-bold px-3.5 sm:px-5 py-1 flex items-center gap-1 shadow-sm"
              >
                <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Submit to Review
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Workspace Layout (Spacious 3-Column Responsive Grid) ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ═══════════════════════════════════════════════════════════════
              LEFT COLUMN: SECTION OUTLINE & PROGRESS (3 Cols)
             ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-navy/8">
                <h3 className="font-heading font-bold text-sm text-navy flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-sapphire" /> Sections
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  {progressPercent}% Written
                </span>
              </div>

              {/* Overall Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full bg-ivory border border-navy/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sapphire transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-[10px] font-medium text-navy/50 text-right">
                  {totalWords} of {targetWordsTotal} target words
                </p>
              </div>

              {/* Sections List */}
              <div className="space-y-1.5 pt-1">
                {sections.map((s) => {
                  const isActive = activeSection === s.key;
                  const words = s.content.trim() ? s.content.trim().split(/\s+/).length : 0;
                  const sectionPercent = Math.min(100, Math.round((words / s.wordTarget) * 100));

                  return (
                    <button
                      key={s.key}
                      onClick={() => setActiveSection(s.key)}
                      className={`w-full text-left p-3 rounded-2xl transition-all duration-150 flex items-center justify-between group ${
                        isActive
                          ? "bg-navy text-ivory shadow-sm font-bold"
                          : "hover:bg-ivory text-navy/80 hover:text-navy"
                      }`}
                    >
                      <div className="space-y-0.5 pr-2 min-w-0 flex-1">
                        <p className="text-xs font-semibold leading-snug truncate">{s.label}</p>
                        <p
                          className={`text-[10px] ${
                            isActive ? "text-ivory/75" : "text-navy/50"
                          }`}
                        >
                          {words} / {s.wordTarget} words
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        {sectionPercent >= 90 ? (
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              isActive ? "text-emerald-300" : "text-emerald-600"
                            }`}
                          />
                        ) : (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-ivory"
                                : "bg-navy/5 text-navy/60"
                            }`}
                          >
                            {sectionPercent}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Research Writing Ethics Card */}
            <div className="rounded-3xl border border-sapphire/20 bg-champagne/40 p-4 space-y-2 text-xs text-navy/80">
              <div className="flex items-center gap-1.5 font-bold text-sapphire text-[11px] uppercase tracking-wider">
                <Lightbulb className="h-3.5 w-3.5" /> Scholar Tip
              </div>
              <p className="leading-relaxed text-[11px]">
                Always format primary data with standard deviations (e.g. <em>n=15, p&lt;0.01</em>) to ensure peer review readiness.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CENTER COLUMN: NOTEBOOK EDITOR CANVAS (6 Cols)
             ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-card space-y-5">
              {/* Section Header */}
              <div className="space-y-2.5 border-b border-navy/8 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="rounded-full bg-champagne/80 border border-sapphire/10 text-navy font-bold text-[10px] px-3 py-1 uppercase tracking-wider">
                    Editing Section: {currentSection.label}
                  </span>
                  <span className="text-xs text-navy/50 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Target: ~{currentSection.wordTarget} words
                  </span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">
                  {currentSection.label}
                </h2>
                <div className="text-xs text-navy/70 bg-ivory/60 p-3.5 rounded-2xl border border-navy/5 leading-relaxed flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">💡</span>
                  <div>
                    <strong>Guideline:</strong> {currentSection.guidePrompt}
                  </div>
                </div>
              </div>

              {/* Main Textarea Notebook Canvas */}
              <div className="space-y-2">
                <textarea
                  rows={15}
                  value={currentSection.content}
                  onChange={(e) => handleSectionContentChange(e.target.value)}
                  placeholder={`Write your ${currentSection.label.toLowerCase()} here...`}
                  className="w-full rounded-2xl border border-navy/10 bg-ivory/20 p-5 text-sm text-navy leading-relaxed font-body focus:outline-none focus:ring-2 focus:ring-sapphire focus:bg-white transition min-h-[360px]"
                ></textarea>

                <div className="flex items-center justify-between text-xs text-navy/50 pt-1 px-1">
                  <span>
                    Words in section:{" "}
                    <strong className="text-navy font-bold">
                      {currentSection.content.trim() ? currentSection.content.trim().split(/\s+/).length : 0}
                    </strong>
                  </span>
                  <span>
                    Press <kbd className="px-1.5 py-0.5 bg-navy/10 rounded text-[10px] font-mono">Ctrl+S</kbd> to save
                  </span>
                </div>
              </div>

              {/* Section Navigation Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-navy/8 gap-3">
                {sections.findIndex((s) => s.key === activeSection) > 0 ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.key === activeSection);
                      setActiveSection(sections[idx - 1].key);
                    }}
                    className="rounded-full border-navy/20 text-navy hover:bg-navy hover:text-ivory text-xs px-4"
                  >
                    ← Previous Section
                  </Button>
                ) : <div />}

                {sections.findIndex((s) => s.key === activeSection) < sections.length - 1 && (
                  <Button
                    size="sm"
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.key === activeSection);
                      setActiveSection(sections[idx + 1].key);
                    }}
                    className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs px-5 font-bold ml-auto"
                  >
                    Next: {sections[sections.findIndex((s) => s.key === activeSection) + 1]?.label} →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT COLUMN: RESEARCH TOOLS & INSPECTOR (3 Cols)
             ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card space-y-4">
              
              {/* Spacious 2x2 Tab Grid */}
              <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-navy/10 bg-ivory/70 p-1.5">
                <button
                  onClick={() => setSidebarTab("checklist")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    sidebarTab === "checklist"
                      ? "bg-navy text-ivory shadow-sm"
                      : "text-navy/70 hover:bg-white hover:text-navy"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Checklist</span>
                </button>
                <button
                  onClick={() => setSidebarTab("references")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    sidebarTab === "references"
                      ? "bg-navy text-ivory shadow-sm"
                      : "text-navy/70 hover:bg-white hover:text-navy"
                  }`}
                >
                  <Quote className="h-3.5 w-3.5 shrink-0" />
                  <span>Citations</span>
                </button>
                <button
                  onClick={() => setSidebarTab("notes")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    sidebarTab === "notes"
                      ? "bg-navy text-ivory shadow-sm"
                      : "text-navy/70 hover:bg-white hover:text-navy"
                  }`}
                >
                  <StickyNote className="h-3.5 w-3.5 shrink-0" />
                  <span>Notes</span>
                </button>
                <button
                  onClick={() => setSidebarTab("ai")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    sidebarTab === "ai"
                      ? "bg-navy text-ivory shadow-sm"
                      : "text-navy/70 hover:bg-white hover:text-navy"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>AI Copilot</span>
                </button>
              </div>

              {/* TAB: CHECKLIST */}
              {sidebarTab === "checklist" && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between pb-1 border-b border-navy/8">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                      Submission Readiness
                    </h4>
                    <span className="text-[10px] text-sapphire font-bold bg-sapphire/10 px-2.5 py-0.5 rounded-full">
                      {checklist.filter((c) => c.done).length} / {checklist.length} Done
                    </span>
                  </div>

                  <div className="space-y-2">
                    {checklist.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                          item.done
                            ? "border-emerald-200/90 bg-emerald-50/70 text-emerald-950"
                            : "border-navy/10 bg-ivory/40 text-navy/85 hover:bg-white hover:border-navy/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleChecklistItem(item.id)}
                          className="mt-0.5 h-3.5 w-3.5 rounded border-navy/20 text-sapphire shrink-0 cursor-pointer"
                        />
                        <span className={item.done ? "line-through opacity-70 leading-snug" : "font-medium leading-snug"}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: CITATIONS & REFERENCES */}
              {sidebarTab === "references" && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1 border-b border-navy/8">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                      Bibliography ({references.length})
                    </h4>
                    <select
                      value={citationFormat}
                      onChange={(e) => setCitationFormat(e.target.value as never)}
                      className="rounded-xl border border-navy/15 bg-ivory px-2 py-0.5 text-[10px] font-bold text-navy"
                    >
                      <option>APA</option>
                      <option>MLA</option>
                      <option>IEEE</option>
                      <option>Chicago</option>
                    </select>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {references.map((r, i) => (
                      <div key={r.id} className="p-3 rounded-2xl border border-navy/10 bg-ivory/40 space-y-1 text-xs text-navy/80">
                        <div className="flex justify-between items-center text-[10px] font-bold text-sapphire">
                          <span>[{i + 1}] {r.style}</span>
                          {r.url && (
                            <a href={r.url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                              DOI <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                        <p className="leading-snug text-[11px]">{r.citation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-navy/8">
                    <textarea
                      rows={2}
                      value={newRefCitation}
                      onChange={(e) => setNewRefCitation(e.target.value)}
                      placeholder="Paste reference citation (e.g. Author, Year, Title)..."
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/40 p-2.5 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    ></textarea>
                    <Button
                      size="sm"
                      onClick={handleAddReference}
                      disabled={!newRefCitation.trim()}
                      className="w-full rounded-full bg-navy text-ivory hover:bg-sapphire text-xs py-1.5"
                    >
                      + Add Reference
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB: RESEARCH NOTES */}
              {sidebarTab === "notes" && (
                <div className="space-y-3.5">
                  <div className="pb-1 border-b border-navy/8">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                      Scratchpad & Lab Notes
                    </h4>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notes.map((n) => (
                      <div key={n.id} className="p-3 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-1 text-xs text-amber-950">
                        <div className="flex justify-between items-center text-[10px] font-bold text-amber-800">
                          <span>{n.title}</span>
                          <span className="bg-amber-200/70 px-2 py-0.5 rounded-full">{n.tag}</span>
                        </div>
                        <p className="leading-snug text-[11px]">{n.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-navy/8">
                    <textarea
                      rows={2}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Jot down a quick finding or experiment note..."
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/40 p-2.5 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    ></textarea>
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!newNoteText.trim()}
                      className="w-full rounded-full bg-navy text-ivory hover:bg-sapphire text-xs py-1.5"
                    >
                      + Add Note
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB: AI ASSISTANT / ETHICS DOCK */}
              {sidebarTab === "ai" && (
                <div className="space-y-3 text-xs text-navy">
                  <div className="flex items-center gap-1.5 text-sapphire font-bold">
                    <Sparkles className="h-4 w-4" /> AI Writing Copilot
                  </div>
                  <p className="text-navy/70 leading-relaxed text-[11px]">
                    Compliant with TOUR Youth Ethics: AI assists with readability and hypothesis structuring.
                  </p>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        const btn = document.querySelector('[aria-label="Open AI Assistant"]') as HTMLButtonElement;
                        if (btn) btn.click();
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-navy/10 bg-ivory/60 hover:bg-champagne/50 transition font-semibold text-xs"
                    >
                      ✨ Check Scientific Tone & Flow
                    </button>
                    <button
                      onClick={() => {
                        const btn = document.querySelector('[aria-label="Open AI Assistant"]') as HTMLButtonElement;
                        if (btn) btn.click();
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-navy/10 bg-ivory/60 hover:bg-champagne/50 transition font-semibold text-xs"
                    >
                      🔍 Refine Hypothesis Structure
                    </button>
                    <button
                      onClick={() => {
                        const btn = document.querySelector('[aria-label="Open AI Assistant"]') as HTMLButtonElement;
                        if (btn) btn.click();
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-navy/10 bg-ivory/60 hover:bg-champagne/50 transition font-semibold text-xs"
                    >
                      📖 Search Literature Gaps
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EXPORT MODAL (MANUSCRIPT PREVIEW & DOWNLOAD)
         ═══════════════════════════════════════════════════════════════ */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-md">
          <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-3xl border border-navy/10 bg-white shadow-soft overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-4 text-ivory">
              <div>
                <h3 className="font-heading font-bold text-base">Manuscript Export & Print Preview</h3>
                <p className="text-xs text-ivory/70">{paperTitle}</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-full p-1 text-ivory/70 hover:bg-white/10 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 text-navy">
              <div className="text-center space-y-2 border-b border-navy/10 pb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-sapphire">TOUR Student Scientific Manuscript</span>
                <h1 className="font-heading text-2xl font-bold">{paperTitle}</h1>
                <p className="text-xs text-navy/70">Category: {category} • Compiled: {new Date().toLocaleDateString()}</p>
              </div>

              {sections.map((s) => (
                <div key={s.key} className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-navy border-b border-navy/10 pb-1">
                    {s.label}
                  </h3>
                  <p className="text-xs text-navy/85 leading-relaxed whitespace-pre-line">
                    {s.content}
                  </p>
                </div>
              ))}

              <div className="space-y-2 pt-4 border-t border-navy/10">
                <h3 className="font-heading text-lg font-bold text-navy">References ({citationFormat})</h3>
                <ol className="list-decimal pl-5 space-y-1 text-xs text-navy/80">
                  {references.map((r) => (
                    <li key={r.id}>{r.citation}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-navy/10 bg-ivory/60 px-6 py-4">
              <span className="text-xs text-navy/60 font-medium">Ready for double-blind peer submission</span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowExportModal(false)}
                  className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-4"
                >
                  Close Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    alert("Manuscript ready for export!");
                    setShowExportModal(false);
                  }}
                  className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-5 flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download PDF Manuscript
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
