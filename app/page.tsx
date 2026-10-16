"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicationCard } from "@/components/publication-card";
import {
  FlaticonRocket,
  FlaticonStar,
  FlaticonPlus,
  FlaticonArrowRight,
  FlaticonBook,
  FlaticonIdea,
  FlaticonSearch,
  FlaticonGraduation,
  FlaticonCheckCircle,
  FlaticonShieldCheck,
  FlaticonOfferStem,
  FlaticonOfferHealth,
  FlaticonOfferEducation,
  FlaticonOfferHumanities,
} from "@/components/flaticons";
import { AnimatedHeading } from "@/components/animated-heading";

const HERO_SLIDES = [
  {
    id: "research-papers",
    image: "/hero-research-papers.jpg",
    alt: "Scholarly research papers, open notebook, pen, and academic literature on study table",
    tag: "Research Papers",
    title: "Open Manuscripts, Scholarly Notes & Peer Review",
  },
  {
    id: "academic-library",
    image: "/hero-academic-library.jpg",
    alt: "Curved architectural academic library with vast collections of research books and literature",
    tag: "Archive of Minds",
    title: "A Tour Across Curated Human Knowledge & Literature",
  },
  {
    id: "library-aisle",
    image: "/hero-library-aisle.jpg",
    alt: "Warm academic library aisle filled with research journals and scholarly books",
    tag: "Books & Inquiry",
    title: "Inquiring, Reading, and Discovering New Perspectives",
  },
  {
    id: "student-study",
    image: "/hero-student-reading.jpg",
    alt: "Student researcher drafting a paper manuscript, writing notes, and analyzing literature",
    tag: "Student Authorship",
    title: "Young Scholars Writing & Publishing Original Research",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const isSignedIn = Boolean(session);

  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [papersLoadError, setPapersLoadError] = useState(false);

  /* Hero search and slide states */
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const handleHeroSearch = () => {
    const q = heroSearchQuery.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/research${params.toString() ? `?${params.toString()}` : ""}`);
  };

  useEffect(() => {
    async function loadPapers() {
      try {
        const response = await fetch("/api/papers?pageSize=3");
        if (!response.ok) {
          throw new Error(`Published research request failed: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data?.papers)) {
          throw new Error("Published research response has an invalid format.");
        }
        setPapers(data.papers);
      } catch (err) {
        console.error("Failed to load published research:", err);
        setPapersLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadPapers();
  }, []);

  /* Auto-advancing Hero Carousel (every 6 seconds) */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1.1 HERO SECTION (Ultra-Luxury Full-Bleed Layout with Dynamic Research Carousel) */}
      <section className="relative -mt-20 sm:-mt-24 min-h-[680px] lg:min-h-[780px] flex flex-col justify-between pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[4.5rem] shadow-2xl relative z-20">
        {/* Background Image Carousel with Cinematic Multi-Stage Dark Gradient & Smooth Transitions */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = activeHeroSlide === idx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                {/* Multi-stage luxury overlay to ensure text and search dock remain ultra-readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#070D1E]/90 via-[#070D1E]/75 to-[#070D1E]/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070D1E]/40 to-[#070D1E]/90 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-64 bg-sapphire/20 blur-[130px] pointer-events-none z-10" />

        {/* Hero Main Copy: Clean, majestic, editorial */}
        <div className="container-tour relative z-10 my-auto text-center px-4 sm:px-6 pt-6 sm:pt-10 pb-8 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto space-y-5 sm:space-y-6"
          >
            {/* The single majestic headline */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-md">
              Take a Tour between minds
            </h1>

            {/* Wordings below headline as requested */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
              Tour is an open, student-led academic platform providing young scholars a supportive environment to inquire, research, write, and publish peer-reviewed work.
            </p>

            {/* Sleek, elevated single search box */}
            <div className="w-full max-w-2xl mx-auto pt-2 sm:pt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleHeroSearch();
                }}
                className="relative flex items-center rounded-full bg-white/95 border-2 border-white/20 shadow-2xl p-1.5 sm:p-2 backdrop-blur-xl transition-all duration-300 focus-within:bg-white focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.4)] focus-within:border-white"
              >
                <div className="flex items-center pl-4 sm:pl-5 pr-2 pointer-events-none text-[#112250]/50">
                  <FlaticonSearch size={20} className="stroke-[2.5]" />
                </div>
                <input
                  type="text"
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  placeholder="Search research papers, topics, authors, or ideas..."
                  aria-label="Search research papers"
                  className="w-full bg-transparent py-3 sm:py-3.5 pr-4 text-xs sm:text-sm md:text-base text-[#112250] placeholder:text-[#112250]/45 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  aria-label="Search Tour"
                  className="shrink-0 flex items-center gap-2 rounded-full bg-[#112250] hover:bg-[#1A3365] px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <span>Search</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Carousel indicators & research slide navigator at bottom (matching luxury editorial aesthetic) */}
        <div className="container-tour relative z-20 flex flex-col sm:flex-row items-center sm:justify-between gap-3 pt-4 px-4 sm:px-6">
          {/* Active research theme badge */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-white/85 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-champagne animate-pulse" />
            <span className="font-semibold text-champagne">{HERO_SLIDES[activeHeroSlide].tag}</span>
            <span className="text-white/30 hidden md:inline">·</span>
            <span className="font-light text-white/80 hidden md:inline text-[11px]">{HERO_SLIDES[activeHeroSlide].title}</span>
          </div>

          {/* Controls: Prev, Dots, Next */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              aria-label="Previous research slide"
              className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            
            <div className="flex items-center gap-1.5 mx-1">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveHeroSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${slide.tag}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeHeroSlide === idx
                      ? "h-2 w-7 bg-champagne shadow-sm"
                      : "h-2 w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next research slide"
              className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 1.5 WHAT WE OFFER (Editorial Disciplines Showcase on Airy Canvas) */}
      <section className="pt-24 sm:pt-32 pb-20 sm:pb-28 relative overflow-hidden">
        {/* Ambient subtle glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[35rem] bg-gradient-to-tr from-sapphire/5 via-champagne/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="container-tour relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center space-y-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-navy/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sapphire shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sapphire animate-pulse" />
              Core Disciplines
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-navy tracking-tight">
              What We Offer
            </h2>
            <p className="text-navy/70 leading-relaxed text-base md:text-lg max-w-2xl mx-auto font-light">
              Tour provides a supportive environment for students to think, research, learn, write, and share their ideas, helping them gain an early and worthwhile start in science and academic research.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-2">
            {[
              { 
                number: "01",
                title: "Science & Innovation (STEM)", 
                tags: ["Life Sciences", "Technology & Engineering", "Environment & Future"], 
                desc: "Exploring STEM fields, scientific research, technology, and innovation that shape our understanding of the world and drive future progress.",
                icon: FlaticonOfferStem,
                href: "/research?discipline=stem",
              },
              { 
                number: "02",
                title: "Health & Society", 
                tags: ["Public & Global Health", "Mental Health & Psychology", "Health Policy & Ethics"], 
                desc: "Examining public health, health policy, psychology, and the social dimensions of health through research and critical analysis.",
                icon: FlaticonOfferHealth,
                href: "/research?discipline=health",
              },
              { 
                number: "03",
                title: "Education & Development", 
                tags: ["Education & Learning", "Youth & Human Development", "Access & Equity"], 
                desc: "Focusing on education, learning systems, youth development, and the role of knowledge in shaping individuals and communities.",
                icon: FlaticonOfferEducation,
                href: "/research?discipline=education",
              },
              { 
                number: "04",
                title: "Humanities & Perspectives", 
                tags: ["History & Philosophy", "Society & Culture", "Ethics & Social Issues"], 
                desc: "Exploring history, philosophy, social sciences, and diverse perspectives that help us understand societies, cultures, and ideas.",
                icon: FlaticonOfferHumanities,
                href: "/research?discipline=humanities",
              },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div 
                  key={cat.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col justify-between rounded-[2rem] border border-navy/10 bg-white/95 backdrop-blur-md p-7 sm:p-9 shadow-card hover:shadow-2xl hover:border-sapphire/40 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-navy/[0.04] text-navy border border-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:text-champagne transition-colors duration-300 shadow-xs">
                        <Icon size={30} />
                      </div>
                      <span className="font-sans text-3xl font-light text-navy/25 group-hover:text-sapphire/50 transition-colors">
                        {cat.number}
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading text-2xl font-bold text-navy group-hover:text-sapphire transition-colors">
                      {cat.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cat.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="rounded-full bg-sapphire/[0.05] border border-sapphire/15 px-2.5 py-0.5 text-[11px] font-semibold text-sapphire"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-navy/70 leading-relaxed font-light">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-navy/5">
                    <Link 
                      href={cat.href}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy/60 group-hover:text-sapphire group-hover:gap-3 transition-all"
                    >
                      <span>Explore {cat.title.split(" ")[0]} Papers</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1.6 BEFORE SUBMITTING YOUR RESEARCH (Editorial Split Layout with Photo) */}
      <section className="py-20 sm:py-28 relative">
        <div className="container-tour">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Image Feature */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-navy/15 shadow-2xl">
                <Image 
                  src="/student-writing.jpg" 
                  alt="Student author preparing and drafting research notes" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="rounded-full bg-sapphire px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Publishing Integrity
                  </span>
                  <p className="mt-3 font-heading text-xl font-bold leading-snug">
                    &quot;Original student research published with academic excellence.&quot;
                  </p>
                </div>
              </div>

              {/* Floating badge overlay */}
              <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-3 rounded-2xl border border-navy/15 bg-white/95 backdrop-blur-md p-4 shadow-xl text-navy">
                <div className="w-10 h-10 rounded-xl bg-sapphire/10 text-sapphire flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Peer Reviewed</p>
                  <p className="text-[11px] text-navy/65">Editorial Recognition</p>
                </div>
              </div>
            </motion.div>

            {/* Right Copy & Guideline Blocks */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
                  Author Guidelines
                </span>
                <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-navy">
                  Before Submitting Your Research
                </h2>
                <p className="mt-3 text-navy/70 text-base">
                  Before submitting your work, please carefully review the following guidelines.
                </p>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                {/* Block 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-navy/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-navy/30 hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 text-navy font-bold">
                    <FlaticonCheckCircle size={18} className="text-sapphire" />
                    <h4 className="font-heading text-base">Authorship & Originality</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-navy/75 list-disc pl-4 leading-relaxed">
                    <li>All submitted research must be the author&apos;s own original work.</li>
                    <li>The author is fully responsible for the content submitted.</li>
                    <li>Plagiarism in any form, including AI-generated text, is strictly prohibited.</li>
                  </ul>
                </motion.div>

                {/* Block 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="rounded-2xl border border-navy/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-navy/30 hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 text-navy font-bold">
                    <FlaticonShieldCheck size={18} className="text-sapphire" />
                    <h4 className="font-heading text-base">Use of Artificial Intelligence (AI)</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-navy/75 list-disc pl-4 leading-relaxed">
                    <li>AI tools are not allowed when writing or preparing research.</li>
                    <li>AI may be used only as a tool, not as a writer.</li>
                    <li>Permitted uses of AI include grammar checks only.</li>
                  </ul>
                </motion.div>

                {/* Block 3 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="rounded-2xl border border-navy/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-navy/30 hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 text-navy font-bold">
                    <FlaticonBook size={18} className="text-sapphire" />
                    <h4 className="font-heading text-base">Editorial Review & Publication</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-navy/75 list-disc pl-4 leading-relaxed">
                    <li>Tour may review and edit research for publication purposes.</li>
                    <li>The author will be notified to approve or reject edits.</li>
                    <li>If no response is received in time, Tour may proceed.</li>
                  </ul>
                </motion.div>

                {/* Block 4 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="rounded-2xl border border-navy/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-navy/30 hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 text-navy font-bold">
                    <FlaticonSearch size={18} className="text-sapphire" />
                    <h4 className="font-heading text-base">Referencing & Sources</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-navy/75 list-disc pl-4 leading-relaxed">
                    <li>All sources must be clearly cited using consistent style.</li>
                    <li>Inaccurate references may result in revision or rejection.</li>
                  </ul>
                </motion.div>
              </div>

              {/* Callout */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-sapphire/20 bg-champagne/45 px-6 py-4 flex items-center gap-3 shadow-xs"
              >
                <FlaticonStar size={20} className="text-navy shrink-0" />
                <p className="text-sm font-semibold text-navy">
                  After publication, authors receive editorial recognition and an official publication record on TOUR.
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.7 SUBMISSION TYPES (Airy Architectural Formats Showcase) */}
      <section className="py-20 sm:py-28 relative">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              Publishing Formats
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-navy md:text-4xl">
              Submission Types
            </h2>
            <p className="mt-3 text-navy/70 text-base">
              Choose the format that best fits your scientific methodology and research goals.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="rounded-[2.25rem] border border-navy/10 bg-white/95 backdrop-blur-md p-8 sm:p-9 flex flex-col justify-between hover:border-navy/40 transition-all duration-300 hover:-translate-y-1.5 shadow-card hover:shadow-2xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sapphire">
                    Format 01
                  </span>
                  <FlaticonBook size={24} className="text-navy/50 group-hover:text-navy transition-colors" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy group-hover:text-sapphire transition-colors">Research Papers</h3>
                <p className="mt-4 text-sm text-navy/70 leading-relaxed font-light">
                  Original research-based work that explores a specific question or problem through structured methodology, analysis, and evidence. This type focuses on presenting new findings, insights, or data-driven conclusions.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-navy/5">
                <Link href="/get-published" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy/60 group-hover:text-sapphire transition-colors">
                  <span>Paper Guidelines</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="rounded-[2.25rem] border border-navy/10 bg-white/95 backdrop-blur-md p-8 sm:p-9 flex flex-col justify-between hover:border-navy/40 transition-all duration-300 hover:-translate-y-1.5 shadow-card hover:shadow-2xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sapphire">
                    Format 02
                  </span>
                  <FlaticonSearch size={24} className="text-navy/50 group-hover:text-navy transition-colors" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy group-hover:text-sapphire transition-colors">Review Articles</h3>
                <p className="mt-4 text-sm text-navy/70 leading-relaxed font-light">
                  Analytical articles that summarize, compare, and evaluate existing research on a specific topic. Review articles do not present new data but aim to organize current knowledge and highlight patterns, gaps, or trends.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-navy/5">
                <Link href="/get-published" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy/60 group-hover:text-sapphire transition-colors">
                  <span>Review Guidelines</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="rounded-[2.25rem] border border-navy/10 bg-white/95 backdrop-blur-md p-8 sm:p-9 flex flex-col justify-between hover:border-navy/40 transition-all duration-300 hover:-translate-y-1.5 shadow-card hover:shadow-2xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-champagne/40 border border-champagne/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
                    Format 03
                  </span>
                  <FlaticonGraduation size={24} className="text-navy/50 group-hover:text-navy transition-colors" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy group-hover:text-sapphire transition-colors">Research Essays</h3>
                <p className="mt-4 text-sm text-navy/70 leading-relaxed font-light">
                  Thoughtful, research-informed essays that explore ideas, concepts, or questions through critical thinking and evidence. This format allows for more reflection and discussion while still requiring credible sources and academic reasoning.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-navy/5">
                <Link href="/get-published" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy/60 group-hover:text-sapphire transition-colors">
                  <span>Essay Guidelines</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2.0 LATEST PUBLICATIONS */}
      <section className="py-20 sm:py-28 relative">
        <div className="container-tour space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">
                Publications
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Recently published research
              </h2>
            </div>

            <Link
              href="/publications"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-sapphire"
            >
              <span>Explore the library</span>
              <FlaticonArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Real Papers or Honest Empty State */}
          <div>
            {loading ? (
              <div className="py-12 text-center text-xs font-semibold text-navy/40">
                Loading published research...
              </div>
            ) : papersLoadError ? (
              <p role="alert" className="py-10 text-center text-sm text-rose-700">
                Published research is temporarily unavailable. Please try again later.
              </p>
            ) : papers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {papers.map((paper, i) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <PublicationCard {...paper} />
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Honest Empty State */
              <div className="rounded-3xl border-2 border-dashed border-navy/20 bg-ivory/40 p-10 sm:p-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-champagne/60 text-navy">
                  <FlaticonBook size={28} />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-navy">
                  Be the first to publish your research
                </h3>
                <p className="text-xs sm:text-sm text-navy/70 leading-relaxed max-w-md mx-auto">
                  TOUR features peer-reviewed student research across science, health, education, and humanities. Submit your manuscript to get reviewed and published.
                </p>
                <div className="pt-2">
                  <Link
                    href="/get-published"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-navy px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-sapphire transition shadow-sm cursor-pointer"
                  >
                    <span>Submit Your Research</span>
                    <FlaticonArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2.1 CTA MEGA BANNER */}
      <section className="py-16 sm:py-24 relative">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="px-8 py-16 md:py-20 text-center rounded-[2.5rem] sm:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/20"
          >
            {/* Background Image & Gradient Overlay */}
            <Image
              src="/cta-bg.jpg"
              alt="Atmospheric library inspiring curiosity and research discovery"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/80 to-navy/90 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-white md:text-5xl leading-tight">
                Your curiosity could become the next discovery
              </h2>

              <p className="text-white/85 text-base md:text-lg font-light leading-relaxed">
                Join researchers, innovators, and students turning questions into meaningful knowledge.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link href="/join">
                  <Button size="lg" className="rounded-full bg-white text-navy hover:bg-champagne hover:text-navy px-9 py-4 font-bold text-base transition-all duration-200 shadow-xl cursor-pointer">
                    Join Tour — It&apos;s Free
                    <ArrowRight size={18}/>
                  </Button>
                </Link>
                <Link href="/get-published">
                  <Button size="lg" className="rounded-full border-2 border-white/40 bg-white/10 text-white hover:bg-white hover:text-navy px-8 py-4 font-bold text-base transition-all duration-200 cursor-pointer backdrop-blur-sm">
                    Submit Your Research
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
