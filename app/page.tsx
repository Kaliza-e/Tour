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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-ivory/60 pt-6 pb-12 md:pb-16">
        <div className="container-tour relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center py-6 md:py-10">
            
            {/* LEFT SIDE: Oval/blob image frame with attached static stats ribbon */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 relative flex flex-col items-center justify-center order-2 lg:order-1"
            >
              <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3] rounded-[60px] sm:rounded-[100px] border-4 border-navy/20 bg-navy overflow-hidden p-2 sm:p-3">
                <Image
                  src="/hero-students.jpg"
                  alt="Young Student Researchers"
                  width={700}
                  height={525}
                  priority
                  className="w-full h-full object-cover rounded-[50px] sm:rounded-[90px]"
                />
              </div>

              {/* ATTACHED STATIC COMPACT STATS RIBBON */}
              <div className="-mt-8 relative z-20 w-full max-w-md sm:max-w-lg px-2">
                <div className="rounded-2xl sm:rounded-full border-2 border-navy bg-navy px-4 py-3 flex items-center justify-around gap-2 text-ivory">
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

              {/* Floating vector sparkles & plus icons around image */}
              <FlaticonPlus size={22} className="absolute top-4 left-4 text-navy/40" />
              <FlaticonStar size={20} className="absolute bottom-16 right-2 text-navy/50" />
              <FlaticonPlus size={18} className="absolute -top-2 right-12 text-navy/35" />
            </motion.div>

            {/* RIGHT SIDE: Headline, subtext & CTA */}
            <div className="lg:col-span-6 relative text-left space-y-6 order-1 lg:order-2">
              {/* Floating Rocket Doodle top right */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="absolute -top-12 right-0 sm:right-6 text-navy pointer-events-none"
              >
                <FlaticonRocket size={56} className="text-navy/80" />
              </motion.div>

              {/* Floating decorative sparkles */}
              <FlaticonStar size={22} className="absolute -top-4 left-0 text-navy/40" />

              <AnimatedHeading 
                text="Take a Tour Between Minds" 
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold leading-[1.15] text-navy tracking-tight pt-4 uppercase" 
                delay={0.15} 
              />

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-base sm:text-lg text-navy/70 leading-relaxed max-w-xl"
              >
                Tour is an international student-led research platform designed to inspire curiosity, creativity, and confidence in young scholars and researchers worldwide.
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
                  className="inline-flex items-center gap-2.5 rounded-full border-2 border-navy bg-white px-7 py-3.5 text-sm font-semibold text-navy hover:bg-navy hover:text-ivory transition-all duration-200 active:scale-[0.98]"
                >
                  <span>Join the Journey</span>
                  <FlaticonArrowRight size={18} />
                </Link>

                <Link
                  href="/publications"
                  className="inline-flex items-center gap-2.5 rounded-full border border-navy/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-navy hover:border-navy transition-all duration-200"
                >
                  <span>Explore Publications</span>
                </Link>
              </motion.div>

              {/* Floating plus at bottom right */}
              <div className="pt-2 flex items-center justify-end pr-8">
                <FlaticonPlus size={24} className="text-navy/40" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* WHY TOUR */}
      <section className="py-16">
        <div className="container-tour">

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
              Every discovery starts with a question worth exploring
            </h2>
            <p className="mt-4 text-navy/70 leading-relaxed">
              Tour removes the barriers between curiosity and meaningful research,
              helping ideas become projects, discoveries, and published work.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Explore without limits",
                desc: "Share your ideas and research questions without needing expensive labs or resources to begin.",
                icon: FlaticonSearch,
                badge: "Limitless",
              },
              {
                title: "A structured workspace",
                desc: "Manage sources, notes, tasks, and drafts in one place designed for impactful research.",
                icon: FlaticonBook,
                badge: "Workspace",
              },
              {
                title: "Share your discoveries",
                desc: "Publish your work, receive feedback, and showcase your contribution to the community.",
                icon: FlaticonGraduation,
                badge: "Publishing",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-3xl border-2 border-navy/15 bg-white p-8 transition-all duration-300 hover:border-navy hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-champagne/40 border border-navy/10 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-ivory transition-all duration-200">
                        <Icon size={26} />
                      </div>
                      <span className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-navy/70 border border-navy/10">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-navy">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-navy/70">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="py-16 bg-white border-t border-navy/10">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
              What We Offer
            </h2>
            <p className="mt-4 text-navy/70 leading-relaxed text-lg">
              Tour provides a supportive environment for students to think, research, learn, write, and share their ideas, helping them gain an early and worthwhile start in science and academic research.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { 
                title: "Science & Innovation (STEM)", 
                sub: "Life Sciences, Technology & Engineering, and Environment", 
                desc: "Exploring STEM fields, scientific research, technology, and innovation that shape our understanding of the world and drive future progress.",
                icon: FlaticonIdea
              },
              { 
                title: "Health & Society", 
                sub: "Public & Global Health, Mental Health, and Health Policy", 
                desc: "Examining public health, health policy, psychology, and the social dimensions of health through research and critical analysis.",
                icon: FlaticonBook
              },
              { 
                title: "Education & Development", 
                sub: "Education & Learning, Youth & Human Development", 
                desc: "Focusing on education, learning systems, youth development, and the role of knowledge in shaping individuals and communities.",
                icon: FlaticonGraduation
              },
              { 
                title: "Humanities & Perspectives", 
                sub: "History & Philosophy, Society & Culture, and Ethics", 
                desc: "Exploring history, philosophy, social sciences, and diverse perspectives that help us understand societies, cultures, and ideas.",
                icon: FlaticonSearch
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
                  className="rounded-3xl border-2 border-navy/15 bg-ivory/40 p-8 space-y-4 hover:border-navy hover:bg-white transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy text-ivory flex items-center justify-center shrink-0">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-navy">{cat.title}</h3>
                      <p className="text-xs font-semibold text-sapphire uppercase tracking-wider">{cat.sub}</p>
                    </div>
                  </div>
                  <p className="text-sm text-navy/75 leading-relaxed">{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR PATH */}
      <section className="bg-ivory py-16 border-t border-navy/10">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
              Built for Student Researchers and Research Communities
            </h2>
            <p className="mt-4 text-navy/70 leading-relaxed">
              Whether you are beginning your first research journey or supporting the next generation of innovators, Tour provides the tools to discover, collaborate, publish, and grow together.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* RESEARCHERS */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[32px] border-2 border-navy/20 bg-white p-8 sm:p-10 flex flex-col justify-between hover:border-navy transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-champagne/50 border border-navy/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
                    For Student Researchers
                  </span>
                  <FlaticonBook size={28} className="text-navy/70" />
                </div>

                <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-navy">
                  Explore, Research and Publish
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-navy/70">
                  Start your research journey with a platform designed for curious minds. Discover research topics, publish your work, collaborate with peers, and build an academic portfolio that grows with you.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-navy/80">
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-sapphire shrink-0" />
                    <span>Publish original research papers and articles</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-sapphire shrink-0" />
                    <span>Discover research across multiple disciplines</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-sapphire shrink-0" />
                    <span>Collaborate with students from around the world</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-sapphire shrink-0" />
                    <span>Build a lasting academic portfolio</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/questions"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy bg-navy px-7 py-3.5 text-sm font-semibold text-ivory hover:bg-sapphire transition-all duration-200 w-full sm:w-auto"
                >
                  <span>Explore Research</span>
                  <FlaticonArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* EDUCATORS */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[32px] border-2 border-navy bg-navy p-8 sm:p-10 text-ivory flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-white/10 border border-ivory/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-champagne">
                    For Educators & Mentors
                  </span>
                  <FlaticonGraduation size={28} className="text-champagne" />
                </div>

                <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-ivory">
                  Mentor, Support, and Inspire
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-ivory/80">
                  Empower young researchers by mentoring projects, sharing opportunities, organizing research initiatives, and building collaborative scientific communities without barriers.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-ivory/90">
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-champagne shrink-0" />
                    <span>Connect with promising student researchers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-champagne shrink-0" />
                    <span>Organize research initiatives and competitions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-champagne shrink-0" />
                    <span>Mentor and review student work</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FlaticonStar size={14} className="text-champagne shrink-0" />
                    <span>Foster global scientific collaboration</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/publications"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-semibold text-navy hover:bg-white transition-all duration-200 w-full sm:w-auto"
                >
                  <span>Join the Community</span>
                  <FlaticonArrowRight size={16} />
                </Link>
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

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gradient-to-b from-ivory/40 to-white border-t border-navy/10">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-sapphire/10 text-sapphire text-xs font-semibold uppercase tracking-wider mb-4 border border-sapphire/20">
              How It Works
            </span>
            <h2 className="font-heading text-3xl font-semibold text-navy md:text-4xl mb-4">
              Your Research Journey
            </h2>
            <p className="text-navy/70 max-w-2xl mx-auto">
              From curiosity to contribution, discover how Tour transforms questions into published research
            </p>
          </motion.div>

          <div className="relative">
            <div className="relative z-10 grid gap-6 md:grid-cols-4">
              {journey.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div 
                    key={step.label} 
                    initial={{ opacity: 0, y: 35, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative"
                  >
                    {/* Step number badge */}
                    <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-navy text-ivory text-sm font-bold flex items-center justify-center z-20 border-2 border-white">
                      {index + 1}
                    </div>

                    <div className="relative bg-white rounded-3xl p-6 border-2 border-navy/15 hover:border-navy transition-all duration-300 group-hover:-translate-y-1.5 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-14 h-14 rounded-2xl bg-ivory border border-navy/10 flex items-center justify-center mb-4 text-navy group-hover:bg-navy group-hover:text-ivory transition-all duration-200">
                          <Icon size={28} />
                        </div>

                        <h3 className="font-heading text-lg font-bold text-navy mb-2">
                          {step.label}
                        </h3>
                        <p className="text-sm text-navy/70 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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

      {/* CTA */}
      <section className="py-16 border-t border-navy/10">
        <div className="container-tour">
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="px-8 py-6 text-center"
          >
            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
              Your curiosity could become the next discovery
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-navy/60">
              Join researchers, innovators, and organizations turning questions into meaningful knowledge.
            </p>

            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-sapphire/15 bg-champagne/40 px-6 py-4">
              <p className="text-sm font-semibold text-navy/80 leading-relaxed">
                <span className="inline-block mr-1.5">⚠️</span>
                <span className="font-bold">TOUR is not yet a registered 501(c)(3) organization.</span>{" "}
                However, we are happy to provide verification or confirmation of participation for schools or clubs upon request.
              </p>
            </div>

            <div className="mt-9">
              <Link href="/join">
                <Button size="lg">
                  Join Tour — It's Free
                  <ArrowRight size={18}/>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
