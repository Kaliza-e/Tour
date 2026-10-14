"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicationCard } from "@/components/publication-card";
import { QuestionCard } from "@/components/question-card";
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

export default function LandingPage() {
  const { data: session } = useSession();
  const isSignedIn = Boolean(session);

  const [papers, setPapers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [papersLoadError, setPapersLoadError] = useState(false);
  const [questionsLoadError, setQuestionsLoadError] = useState(false);

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

    async function loadQuestions() {
      try {
        const response = await fetch("/api/questions?limit=6");
        if (!response.ok) {
          throw new Error(`Research questions request failed: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data?.questions)) {
          throw new Error("Research questions response has an invalid format.");
        }
        setQuestions(data.questions);
      } catch (err) {
        console.error("Failed to load research questions:", err);
        setQuestionsLoadError(true);
      } finally {
        setLoadingQuestions(false);
      }
    }

    void Promise.all([loadPapers(), loadQuestions()]);
  }, []);

  return (
    <>
      {/* 1.1 HERO SECTION (Warm Ivory Modern Header) */}
      <section className="relative overflow-hidden bg-ivory/60 pt-6 pb-14 md:pb-20 border-b border-navy/10">
        <div className="container-tour relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center py-6 md:py-10">
            
            {/* LEFT SIDE: Oval image frame with honest tag */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 relative flex flex-col items-center justify-center order-2 lg:order-1"
            >
              <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3] rounded-[60px] sm:rounded-[100px] border-4 border-navy/20 bg-navy overflow-hidden p-2 sm:p-3 shadow-xl">
                <Image
                  src="/hero-students.jpg"
                  alt="Student reading and taking research notes with an open book"
                  width={700}
                  height={525}
                  priority
                  className="w-full h-full object-cover rounded-[50px] sm:rounded-[90px]"
                />
              </div>

              {/* Clean Honest Tag Badge */}
              <div className="-mt-5 relative z-20 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-white/95 px-5 py-2.5 text-xs font-semibold text-navy shadow-lg backdrop-blur-sm">
                  <FlaticonIdea size={16} className="text-sapphire shrink-0" />
                  <span>A student-led platform for curiosity & research</span>
                </div>
              </div>

              {/* Floating icons */}
              <FlaticonPlus size={22} className="absolute top-4 left-4 text-navy/40" />
              <FlaticonStar size={20} className="absolute bottom-16 right-2 text-navy/50" />
              <FlaticonPlus size={18} className="absolute -top-2 right-12 text-navy/35" />
            </motion.div>

            {/* RIGHT SIDE: Headline, subline & CTA */}
            <div className="lg:col-span-6 relative text-left space-y-6 order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="absolute -top-12 right-0 sm:right-6 text-navy pointer-events-none"
              >
                <FlaticonRocket size={56} className="text-navy/80" />
              </motion.div>

              <FlaticonStar size={22} className="absolute -top-4 left-0 text-navy/40" />

              <AnimatedHeading 
                text="Take a Tour Between Minds" 
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold leading-[1.15] text-navy tracking-tight" 
                delay={0.15} 
              />

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-base sm:text-lg text-navy/70 leading-relaxed max-w-xl"
              >
                Tour is a student-led, non-profit research and educational platform empowering young minds to explore, write, and share knowledge.
              </motion.p>

              {/* Action buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="pt-3 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2.5 rounded-full border-2 border-navy bg-navy px-7 py-3.5 text-sm font-semibold text-ivory hover:bg-sapphire transition-all duration-200 active:scale-[0.98] shadow-md"
                >
                  <span>Join the journey</span>
                  <FlaticonArrowRight size={18} />
                </Link>

                <Link
                  href="/publications"
                  className="inline-flex items-center gap-2.5 rounded-full border border-navy/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-navy hover:border-navy transition-all duration-200"
                >
                  <span>Explore Publications</span>
                </Link>
              </motion.div>

              <div className="pt-2 flex items-center justify-end pr-8">
                <FlaticonPlus size={24} className="text-navy/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.2 QUESTION HUB (Dynamic Research Questions) */}
      <section className="py-20 bg-white border-b border-navy/10">
        <div className="container-tour space-y-12">
          
          {/* Header & Required Intro Copy */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-navy/10">
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl space-y-3"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/40 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-navy">
                <FlaticonIdea size={14} className="text-sapphire" />
                <span>Question Hub</span>
              </div>
              
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight">
                Found a question worth exploring?
              </h2>
              
              <p className="text-sm sm:text-base text-navy/70 leading-relaxed font-light">
                A question shared on Tour might be the starting point of your next research project. Choose a question that interests you, explore the topic, and begin looking for answers. You might discover something new, develop an idea, or even turn your findings into a research paper. Someone asked the question. You could be the one to explore it.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 shrink-0 lg:pb-1"
            >
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-navy px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-sapphire hover:border-sapphire transition-all duration-200 shadow-sm cursor-pointer"
              >
                <span>Browse all questions</span>
                <FlaticonArrowRight size={16} />
              </Link>
              
              <Link
                href={isSignedIn ? "/questions?action=ask" : "/login?callbackUrl=/questions?action=ask"}
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy/20 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-navy hover:bg-navy/5 hover:border-navy transition-all duration-200 cursor-pointer"
              >
                <FlaticonPlus size={16} />
                <span>Ask a question</span>
              </Link>
            </motion.div>
          </div>

          {/* Question Cards Grid */}
          <div>
            {loadingQuestions ? (
              <div className="py-16 text-center text-xs font-semibold text-navy/40">
                Loading approved questions...
              </div>
            ) : questionsLoadError ? (
              <p role="alert" className="py-10 text-center text-sm text-rose-700">
                Research questions are temporarily unavailable. Please try again later.
              </p>
            ) : questions.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {questions.slice(0, 3).map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="h-full flex flex-col"
                  >
                    <QuestionCard
                      id={q.id}
                      title={q.title}
                      category={q.category}
                      askedBy={q.askedBy}
                      status={q.status}
                      spotsLeft={q.spotsLeft}
                      spotsIndicator={q.spotsIndicator}
                      isFull={q.isFull}
                      isClaimedByCurrentUser={q.isClaimedByCurrentUser}
                      isAuthenticated={isSignedIn}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-navy/20 bg-ivory/40 p-10 text-center space-y-3">
                <p className="text-sm font-semibold text-navy">No approved research questions available yet.</p>
                <Link
                  href={isSignedIn ? "/questions?action=ask" : "/login?callbackUrl=/questions?action=ask"}
                  className="inline-block text-xs font-bold text-sapphire hover:underline"
                >
                  Be the first to share a question &rarr;
                </Link>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 1.5 WHAT WE OFFER (Dark Navy Contrast Luxury Section) */}
      <section className="py-20 bg-navy text-ivory relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-sapphire/10 blur-3xl pointer-events-none" />
        <div className="container-tour relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center space-y-4"
          >
            <span className="inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-champagne">
              Core Disciplines
            </span>
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
              What We Offer
            </h2>
            <p className="text-ivory/80 leading-relaxed text-base md:text-lg max-w-2xl mx-auto font-light">
              Tour provides a supportive environment for students to think, research, learn, write, and share their ideas, helping them gain an early and worthwhile start in science and academic research.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              { 
                title: "Science & Innovation (STEM)", 
                sub: "Life Sciences, Technology & Engineering, and Environment & Future Science", 
                desc: "Exploring STEM fields, scientific research, technology, and innovation that shape our understanding of the world and drive future progress.",
                icon: FlaticonOfferStem
              },
              { 
                title: "Health & Society", 
                sub: "Public & Global Health, Mental Health & Psychology, and Health Policy & Ethics", 
                desc: "Examining public health, health policy, psychology, and the social dimensions of health through research and critical analysis.",
                icon: FlaticonOfferHealth
              },
              { 
                title: "Education & Development", 
                sub: "Education & Learning, Youth & Human Development, and Access & Equity in Education", 
                desc: "Focusing on education, learning systems, youth development, and the role of knowledge in shaping individuals and communities.",
                icon: FlaticonOfferEducation
              },
              { 
                title: "Humanities & Perspectives", 
                sub: "History & Philosophy, Society & Culture, and Ethics & Social Issues", 
                desc: "Exploring history, philosophy, social sciences, and diverse perspectives that help us understand societies, cultures, and ideas.",
                icon: FlaticonOfferHumanities
              },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div 
                  key={cat.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-8 space-y-4 hover:border-champagne/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-champagne border border-white/20 flex items-center justify-center shrink-0">
                      <Icon size={30} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-white">{cat.title}</h3>
                      <p className="text-xs font-semibold text-champagne/80 uppercase tracking-wider">{cat.sub}</p>
                    </div>
                  </div>
                  <p className="text-sm text-ivory/80 leading-relaxed font-light">{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1.6 BEFORE SUBMITTING YOUR RESEARCH (Editorial Split Layout with Photo) */}
      <section className="py-20 bg-white border-t border-navy/10">
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
              <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden border-2 border-navy/15 shadow-2xl">
                <Image 
                  src="/student-writing.jpg" 
                  alt="Student author preparing and drafting research notes" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
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
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl border-2 border-navy bg-white p-4 shadow-xl text-navy">
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
                  className="rounded-2xl border border-navy/15 bg-ivory/50 p-5 space-y-2 hover:border-navy transition-all"
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
                  className="rounded-2xl border border-navy/15 bg-ivory/50 p-5 space-y-2 hover:border-navy transition-all"
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
                  className="rounded-2xl border border-navy/15 bg-ivory/50 p-5 space-y-2 hover:border-navy transition-all"
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
                  className="rounded-2xl border border-navy/15 bg-ivory/50 p-5 space-y-2 hover:border-navy transition-all"
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
                className="rounded-2xl border border-sapphire/30 bg-champagne/40 px-6 py-4 flex items-center gap-3"
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

      {/* 1.7 SUBMISSION TYPES (Warm Sand Section feel) */}
      <section className="py-20 bg-[#f8f7f2] border-t border-navy/10">
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
              className="rounded-3xl border-2 border-navy/15 bg-white p-8 flex flex-col justify-between hover:border-navy transition-all duration-300 hover:-translate-y-1.5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sapphire">
                    Format 01
                  </span>
                  <FlaticonBook size={24} className="text-navy/60" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy">Research Papers</h3>
                <p className="mt-4 text-sm text-navy/75 leading-relaxed font-light">
                  Original research-based work that explores a specific question or problem through structured methodology, analysis, and evidence. This type focuses on presenting new findings, insights, or data-driven conclusions.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="rounded-3xl border-2 border-navy/15 bg-white p-8 flex flex-col justify-between hover:border-navy transition-all duration-300 hover:-translate-y-1.5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Format 02
                  </span>
                  <FlaticonSearch size={24} className="text-navy/60" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy">Review Articles</h3>
                <p className="mt-4 text-sm text-navy/75 leading-relaxed font-light">
                  Analytical articles that summarize, compare, and evaluate existing research on a specific topic. Review articles do not present new data but aim to organize current knowledge and highlight patterns, gaps, or trends.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="rounded-3xl border-2 border-navy/15 bg-white p-8 flex flex-col justify-between hover:border-navy transition-all duration-300 hover:-translate-y-1.5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-900">
                    Format 03
                  </span>
                  <FlaticonGraduation size={24} className="text-navy/60" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy">Research Essays</h3>
                <p className="mt-4 text-sm text-navy/75 leading-relaxed font-light">
                  Thoughtful, research-informed essays that explore ideas, concepts, or questions through critical thinking and evidence. This format allows for more reflection and discussion while still requiring credible sources and academic reasoning.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2.0 LATEST PUBLICATIONS */}
      <section className="bg-white py-16 border-t border-navy/10">
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
      <section className="py-20 border-t border-navy/10 bg-ivory/30">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="px-8 py-16 md:py-20 text-center rounded-[40px] text-white shadow-2xl relative overflow-hidden border-2 border-navy/20"
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
