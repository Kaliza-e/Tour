"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FlaticonArrowRight, 
  FlaticonCheckCircle, 
  FlaticonUsers, 
  FlaticonBriefcase, 
  FlaticonHeart,
  FlaticonBook,
  FlaticonFlask,
  FlaticonSend,
  FlaticonShieldCheck,
  FlaticonUser,
  FlaticonMail,
  FlaticonStar,
  FlaticonGraduation
} from "@/components/flaticons";
import { Button } from "@/components/ui/button";

const WAYS_TO_EARN = [
  {
    title: "Writing & Publishing",
    desc: "Writing and publishing research papers or essays",
    icon: FlaticonBook,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    title: "Opening Chapters",
    desc: "Opening chapters in your country or school. To help Tour reach more young thinkers, you can apply to open a chapter and inspire more students to explore research.",
    icon: FlaticonUsers,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    title: "Social Media Creation",
    desc: "Creating Instagram posts or TikTok content",
    icon: FlaticonStar,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    title: "Graphic & Visual Design",
    desc: "Designing graphic or visual content",
    icon: FlaticonFlask,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    title: "Editorial & Reviewing",
    desc: "Editing and reviewing submissions",
    icon: FlaticonShieldCheck,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    title: "Educational Initiatives",
    desc: "Organizing educational initiatives or learning campaigns",
    icon: FlaticonBriefcase,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    title: "Translation Services",
    desc: "Translation",
    icon: FlaticonCheckCircle,
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
];

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20">
      <div className="container-tour space-y-16 max-w-6xl">
        
        {/* 2.1 HERO HEADER WITH IMAGE */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-12 items-center"
        >
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/25 bg-sapphire/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              <FlaticonHeart size={16} /> Volunteer & Mentorship
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight">
              Volunteer With Tour!
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-navy/80 font-light">
              We recognize the time, effort, and commitment you invest in thinking, researching, and writing, and we truly value the work you contribute to supporting knowledge-sharing. And we want to appreciate it.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-navy/70 font-light">
              You can receive volunteer hours for any work you complete for Tour. If you would like to learn more about Tour's volunteer opportunities, please continue reading.
            </p>
            <div className="pt-2">
              <a 
                href="#volunteer-form" 
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-navy bg-navy px-7 py-3.5 text-sm font-semibold text-ivory hover:bg-sapphire transition-all duration-200 shadow-md cursor-pointer"
              >
                <span>Apply for Volunteer Hours</span>
                <FlaticonArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-[36px] overflow-hidden border-2 border-navy/15 shadow-xl">
              <Image 
                src="/about-mission.jpg"
                alt="Volunteers collaborating on research"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Youth Empowerment
                </span>
                <p className="mt-2 font-heading text-lg font-bold">
                  Mentoring & knowledge-sharing for aspiring student scholars.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2.2 WHAT COUNTS AS VOLUNTEER WORK? */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-2 border-navy/15 bg-ivory/50 p-8 md:p-10"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">Overview</span>
          <h2 className="mt-2 font-heading text-2xl font-bold text-navy md:text-3xl">What Counts as Volunteer Work?</h2>
          <p className="mt-4 text-base leading-relaxed text-navy/80 font-light">
            Any contribution to Tour is considered volunteer work, as it supports knowledge-sharing, helps learning, and creates opportunities for young students to engage in research.
          </p>
        </motion.div>

        {/* 2.3 WAYS TO EARN VOLUNTEER HOURS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">Opportunities</span>
            <h2 className="font-heading text-2xl font-bold text-navy md:text-4xl">Ways to Earn Volunteer Hours</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WAYS_TO_EARN.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx} 
                  className="rounded-3xl border-2 border-navy/15 bg-white p-7 flex flex-col justify-between hover:border-navy transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${item.color}`}>
                      <IconComp size={24} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-navy">{item.title}</h3>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-navy/75 font-light">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 2.4 VOLUNTEER HOURS & RECOGNITION (Deep Navy Contrast Banner) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[36px] border-2 border-navy bg-navy text-ivory p-8 md:p-12 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-4">
            <span className="inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-champagne">
              Guidelines & Policy
            </span>
            <h2 className="font-heading text-2xl font-bold text-white md:text-4xl">Volunteer Hours & Recognition</h2>
            <p className="text-base sm:text-lg text-ivory/85 leading-relaxed font-light">
              Tour recognizes the time, effort, and dedication contributors invest in researching, writing, and supporting knowledge-sharing.
            </p>
            
            <div className="pt-4 border-t border-white/15">
              <p className="text-sm font-semibold text-champagne mb-4">
                Volunteer hours may be granted for meaningful contributions, including but not limited to:
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 flex items-center gap-3">
                  <FlaticonCheckCircle size={20} className="text-champagne shrink-0" />
                  <span className="text-xs text-white font-medium">Research writing and submission</span>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 flex items-center gap-3">
                  <FlaticonCheckCircle size={20} className="text-champagne shrink-0" />
                  <span className="text-xs text-white font-medium">Editing and reviewing</span>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 flex items-center gap-3">
                  <FlaticonCheckCircle size={20} className="text-champagne shrink-0" />
                  <span className="text-xs text-white font-medium">Content organization or support</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2.5 VOLUNTEER RECOGNITION & REPORTING HOURS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-2 border-navy/15 bg-white p-8 md:p-10 space-y-6"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">Benefits</span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-navy md:text-3xl">Volunteer Recognition</h2>
          </div>
          
          <p className="text-sm font-semibold text-navy">
            Contributors may receive:
          </p>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-navy/15 bg-ivory/40 p-5 space-y-2">
              <FlaticonGraduation size={24} className="text-sapphire" />
              <h4 className="font-heading text-base font-bold text-navy">Digital Certificate</h4>
              <p className="text-xs text-navy/75 leading-relaxed">A digital volunteer certificate confirming your contribution.</p>
            </div>
            <div className="rounded-2xl border border-navy/15 bg-ivory/40 p-5 space-y-2">
              <FlaticonBook size={24} className="text-sapphire" />
              <h4 className="font-heading text-base font-bold text-navy">Hours Record</h4>
              <p className="text-xs text-navy/75 leading-relaxed">A record of volunteer hours for school, NHS, or college applications.</p>
            </div>
            <div className="rounded-2xl border border-navy/15 bg-ivory/40 p-5 space-y-2">
              <FlaticonStar size={24} className="text-sapphire" />
              <h4 className="font-heading text-base font-bold text-navy">Recommendation Letter</h4>
              <p className="text-xs text-navy/75 leading-relaxed">For contributors who have worked consistently for at least two consecutive months.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-navy/10 bg-ivory/60 p-5">
            <p className="text-sm text-navy/80 leading-relaxed font-light">
              To receive volunteer hours, contributors are asked to report the number of hours they spent working with Tour. We trust our contributors to report their hours honestly and responsibly.
            </p>
          </div>
        </motion.div>

        {/* 2.7 APPLY FOR VOLUNTEER HOURS */}
        <motion.div 
          id="volunteer-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[36px] border-2 border-navy/15 bg-white p-8 md:p-12 max-w-3xl mx-auto scroll-mt-24 space-y-8 shadow-lg"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sapphire/10 text-sapphire mb-4">
              <FlaticonHeart size={28} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy md:text-4xl">Apply for Volunteer Hours</h2>
            <p className="text-sm md:text-base font-medium text-navy/80">
              To apply for volunteer hours, please use the form below.
            </p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 rounded-3xl border-2 border-emerald-300 bg-emerald-50/70 p-8 text-center text-emerald-900"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                <FlaticonCheckCircle size={32} />
              </div>
              <h3 className="mt-4 font-heading text-2xl font-bold">Application Received!</h3>
              <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                Thank you for offering your time to Tour. We have logged your submission and will get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} 
              className="mt-8 space-y-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                    Full Name <span className="text-sapphire">*</span>
                  </label>
                  <div className="relative">
                    <FlaticonUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input 
                      required 
                      type="text" 
                      placeholder="Jane Doe" 
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 py-3.5 pl-11 pr-4 text-sm text-navy focus:border-sapphire focus:bg-white focus:outline-none transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                    Email Address <span className="text-sapphire">*</span>
                  </label>
                  <div className="relative">
                    <FlaticonMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input 
                      required 
                      type="email" 
                      placeholder="you@example.com" 
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 py-3.5 pl-11 pr-4 text-sm text-navy focus:border-sapphire focus:bg-white focus:outline-none transition" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                  Contribution Type / Interest
                </label>
                <div className="relative">
                  <FlaticonFlask size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Writing, Editing, Graphic Design, Chapter Opening" 
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/50 py-3.5 pl-11 pr-4 text-sm text-navy focus:border-sapphire focus:bg-white focus:outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                  Details / Hours Worked
                </label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us about the work completed or hours you wish to report..." 
                  className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-4 text-sm text-navy leading-relaxed focus:border-sapphire focus:bg-white focus:outline-none transition" 
                />
              </div>

              <Button type="submit" className="w-full rounded-full bg-navy py-4 text-sm font-semibold text-white transition hover:bg-sapphire flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Submit Volunteer Application</span> <FlaticonSend size={16} />
              </Button>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
