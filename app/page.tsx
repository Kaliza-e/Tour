"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";
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
import { CountUp } from "@/components/count-up";
import { AnimatedHeading } from "@/components/animated-heading";

const featuredQuestions = [
  {
    id: "q1",
    title: "Why do octopuses have three hearts?",
    category: "Biology",
    askedBy: "Amara O.",
    interestedResearchers: 12,
    likes: 84,
    views: 512,
    status: "BEING_RESEARCHED" as const,
  },
  {
    id: "q2",
    title: "Could AI predict earthquakes before they happen?",
    category: "Earth Science",
    askedBy: "Diego R.",
    interestedResearchers: 21,
    likes: 143,
    views: 980,
    status: "OPEN" as const,
  },
  {
    id: "q3",
    title: "Why do some diseases affect only certain populations?",
    category: "Medicine",
    askedBy: "Priya K.",
    interestedResearchers: 9,
    likes: 67,
    views: 401,
    status: "RESEARCH_COMPLETED" as const,
  },
];

const featuredPapers = [
  {
    id: "p1",
    title: "Microplastic Accumulation in Freshwater Snails",
    author: "Leah M.",
    category: "Environmental Science",
    readingTime: "9 min read",
    views: 2140,
  },
  {
    id: "p2",
    title: "Predicting Wildfire Spread with Lightweight Neural Nets",
    author: "Kofi A.",
    category: "Computer Science",
    readingTime: "12 min read",
    views: 3320,
  },
  {
    id: "p3",
    title: "Sleep Patterns and Memory Consolidation in Teens",
    author: "Sofia N.",
    category: "Psychology",
    readingTime: "7 min read",
    views: 1870,
  },
];

const journey = [
  {
    label: "Think About the Question",
    desc: "Start by exploring the research question provided by the platform. Reflect on what it means, why it matters, and what you want to discover.",
    icon: FlaticonIdea,
  },
  {
    label: "Explore & Plan",
    desc: "Explore the topic, gather relevant sources, and create a clear plan for how you will investigate the question.",
    icon: FlaticonSearch,
  },
  {
    label: "Conduct Research",
    desc: "Put your plan into action by gathering information, analyzing evidence, and documenting your findings in your research workspace.",
    icon: FlaticonBook,
  },
  {
    label: "Publish Your Discoveries",
    desc: "Turn your research into a meaningful contribution by sharing your findings with the community and contributing to knowledge.",
    icon: FlaticonGraduation,
  },
];

export default function LandingPage() {
  return (
    <>
      {/* 1.1 HERO SECTION (Warm Ivory Modern Header) */}
      <section className="relative overflow-hidden bg-ivory/60 pt-6 pb-14 md:pb-20 border-b border-navy/10">
        <div className="container-tour relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center py-6 md:py-10">
            
            {/* LEFT SIDE: Oval image frame with stats ribbon */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 relative flex flex-col items-center justify-center order-2 lg:order-1"
            >
              <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3] rounded-[60px] sm:rounded-[100px] border-4 border-navy/20 bg-navy overflow-hidden p-2 sm:p-3 shadow-xl">
                <Image
                  src="/hero-students.jpg"
                  alt="Young Student Researchers"
                  width={700}
                  height={525}
                  priority
                  className="w-full h-full object-cover rounded-[50px] sm:rounded-[90px]"
                />
              </div>

              {/* STATS RIBBON */}
              <div className="-mt-8 relative z-20 w-full max-w-md sm:max-w-lg px-2">
                <div className="rounded-2xl sm:rounded-full border-2 border-navy bg-navy px-4 py-3 flex items-center justify-around gap-2 text-ivory shadow-lg">
                  <div className="flex items-center gap-2">
                    <FlaticonIdea size={16} className="text-champagne shrink-0" />
                    <div>
                      <p className="font-heading text-sm sm:text-base font-bold text-white leading-none">
                        <CountUp end={4200} suffix="+" />
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-ivory/70">Questions</p>
                    </div>
                  </div>

                  <span className="h-6 w-px bg-white/20" />

                  <div className="flex items-center gap-2">
                    <FlaticonBook size={16} className="text-champagne shrink-0" />
                    <div>
                      <p className="font-heading text-sm sm:text-base font-bold text-white leading-none">
                        <CountUp end={1100} suffix="+" />
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-ivory/70">Papers</p>
                    </div>
                  </div>

                  <span className="h-6 w-px bg-white/20" />

                  <div className="flex items-center gap-2">
                    <FlaticonGraduation size={16} className="text-champagne shrink-0" />
                    <div>
                      <p className="font-heading text-sm sm:text-base font-bold text-white leading-none">
                        <CountUp end={6800} suffix="+" />
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-ivory/70">Minds</p>
                    </div>
                  </div>

                  <span className="h-6 w-px bg-white/20" />

                  <div className="flex items-center gap-2">
                    <FlaticonRocket size={16} className="text-champagne shrink-0" />
                    <div>
                      <p className="font-heading text-sm sm:text-base font-bold text-white leading-none">
                        <CountUp end={312} suffix="+" />
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-ivory/70">Partners</p>
                    </div>
                  </div>
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
        <div className="container-tour max-w-6xl">
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
                  alt="Student author preparing research" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="rounded-full bg-sapphire px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Publishing Integrity
                  </span>
                  <p className="mt-3 font-heading text-xl font-bold leading-snug">
                    "Original student research published with academic excellence."
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
                  <p className="text-[11px] text-navy/65">Official Author Certificate</p>
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
                    <li>All submitted research must be the author's own original work.</li>
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
                  After publication, authors will receive a certificate for their work.
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.7 SUBMISSION TYPES (Warm Sand Section feel) */}
      <section className="py-20 bg-[#f8f7f2] border-t border-navy/10">
        <div className="container-tour max-w-6xl">
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

      {/* FEATURED QUESTIONS */}
      <section className="bg-white py-16 border-t border-navy/10">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">
                Question Hub
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Questions researchers are exploring right now
              </h2>
            </div>

            <Link
              href="/questions"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-sapphire"
            >
              <span>Browse all questions</span>
              <FlaticonArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredQuestions.map((question, i) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <QuestionCard {...question} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR RESEARCH JOURNEY (Dark Banner Showcase with Certificate Image) */}
      <section className="py-20 bg-[#182338] text-white border-t border-navy/10 overflow-hidden relative">
        <div className="container-tour max-w-6xl relative z-10">
          
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Timeline Steps Left */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-champagne text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
                  How It Works
                </span>
                <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                  Your Research Journey
                </h2>
                <p className="mt-2 text-white/75 text-sm md:text-base font-light">
                  From curiosity to contribution, discover how Tour transforms questions into published research
                </p>
              </motion.div>

              <div className="space-y-4">
                {journey.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div 
                      key={step.label} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="rounded-2xl border border-white/15 bg-white/5 p-5 flex items-start gap-4 hover:bg-white/10 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-champagne text-navy font-bold flex items-center justify-center shrink-0">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-white mb-1">
                          {step.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-light">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Certificate Photo Frame Right */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden border-2 border-white/20 shadow-2xl">
                <Image 
                  src="/publication-certificate.jpg" 
                  alt="Student author holding publication certificate" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="rounded-full bg-champagne text-navy px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Author Recognition
                  </span>
                  <p className="mt-3 font-heading text-lg font-bold leading-snug">
                    "Receive an official certificate upon publishing your work."
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* LATEST PUBLICATIONS */}
      <section className="bg-white py-16 border-t border-navy/10">
        <div className="container-tour">
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

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredPapers.map((paper, i) => (
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
        </div>
      </section>

      {/* CTA MEGA BANNER */}
      <section className="py-20 border-t border-navy/10 bg-ivory/30">
        <div className="container-tour max-w-5xl">
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
              alt="Student researchers collaborating"
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
                Join researchers, innovators, and organizations turning questions into meaningful knowledge.
              </p>

              <div className="pt-4">
                <Link href="/join">
                  <Button size="lg" className="rounded-full bg-white text-navy hover:bg-champagne hover:text-navy px-9 py-4 font-bold text-base transition-all duration-200 shadow-xl cursor-pointer">
                    Join Tour — It's Free
                    <ArrowRight size={18}/>
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
