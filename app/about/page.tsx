"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FlaticonIdea, 
  FlaticonEye, 
  FlaticonSparkles, 
  FlaticonBook, 
  FlaticonGraduation, 
  FlaticonSearch,
  FlaticonHeart
} from "@/components/flaticons";
import { AnimatedHeading } from "@/components/animated-heading";

const values = [
  { title: "Curiosity", desc: "Every meaningful study begins with a question worth exploring.", icon: FlaticonIdea },
  { title: "Accessibility", desc: "Research and publishing should not depend on privilege, expensive programs, or elite institutions.", icon: FlaticonSearch },
  { title: "Learning", desc: "Students grow by researching, writing, reflecting, and sharing their work.", icon: FlaticonBook },
  { title: "Contribution", desc: "Young people can help build knowledge by asking questions and publishing what they learn.", icon: FlaticonGraduation },
];

export default function AboutPage() {
  return (
    <div className="bg-transparent py-12 md:py-16">
      <div className="container-tour space-y-12 md:space-y-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-champagne/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy">
            <FlaticonSparkles size={14} className="text-navy" /> About Tour
          </div>
          <AnimatedHeading 
            text="A space where young thinkers can begin their research journey early." 
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight" 
          />
          <p className="text-base sm:text-lg leading-relaxed text-navy/75">
            Tour is a student-led, non-profit research and educational platform that encourages young thinkers to start their research journey early, learn from their curiosity, and answer questions instead of only asking them. We believe curiosity, learning, and publishing should be accessible to everyone.
          </p>
        </motion.div>

        {/* Hero Image Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border-2 border-navy/15 bg-white p-2"
        >
          <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/about-mission.jpg"
              alt="Students collaborating on research"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white max-w-xl">
              <span className="inline-block rounded-full bg-sapphire/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                Empowering Youth
              </span>
              <p className="mt-2 font-heading text-xl sm:text-2xl font-bold">
                Fostering collaborative discovery across disciplines.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border-2 border-navy/15 bg-white p-8 space-y-4 transition-all duration-300 hover:border-navy hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-ivory">
              <FlaticonEye size={24} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">Our Mission</h2>
            <p className="text-sm leading-relaxed text-navy/75">
              We endeavor to empower young students to begin their research journey early by providing an accessible platform where they can think, explore their curiosity, research, write, publish, and exchange ideas freely.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl border-2 border-navy/15 bg-white p-8 space-y-4 transition-all duration-300 hover:border-navy hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-ivory">
              <FlaticonSparkles size={24} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">Our Vision</h2>
            <p className="text-sm leading-relaxed text-navy/75">
              We strive to create opportunities for young researchers who are passionate about exploring science and becoming active contributors to knowledge.
            </p>
          </motion.div>
        </div>

        {/* Why Tour Exists Banner with side image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] overflow-hidden rounded-3xl border-2 border-navy bg-navy text-ivory p-6 md:p-8"
        >
          <div className="flex flex-col justify-center space-y-4 p-4 md:p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-champagne w-fit">
              <FlaticonHeart size={14} /> Open Access For All
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ivory leading-tight">
              Why Tour Exists
            </h2>
            <p className="text-base leading-relaxed text-ivory/80">
              Research should not be reserved for elite institutions or expensive programs. Tour exists to create a space where young students can ask meaningful questions, explore science, conduct research, learn from the process, transform curiosity into meaningful knowledge, and share their work with others.
            </p>
          </div>

          <div className="relative h-64 sm:h-80 lg:h-full w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/research-discovery.jpg"
              alt="Student researcher in laboratory"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="space-y-6 pt-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-heading text-3xl font-bold text-navy"
          >
            What Tour Offers
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-4">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="rounded-3xl border-2 border-navy/15 bg-white p-6 space-y-3 transition-all duration-300 hover:border-navy hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-champagne/40 border border-navy/10 flex items-center justify-center text-navy">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-navy">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-navy/70">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

