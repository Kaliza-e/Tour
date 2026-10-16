"use client";

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
    color: "bg-sapphire/10 text-sapphire border-sapphire/20",
  },
  {
    title: "Opening Chapters",
    desc: "Opening chapters in your country or school. To help Tour reach more young thinkers, you can apply to open a chapter and inspire more students to explore research.",
    icon: FlaticonUsers,
    color: "bg-champagne/40 text-navy border-taupe/30",
  },
  {
    title: "Social Media Creation",
    desc: "Creating Instagram posts or TikTok content",
    icon: FlaticonStar,
    color: "bg-sapphire/10 text-sapphire border-sapphire/20",
  },
  {
    title: "Graphic & Visual Design",
    desc: "Designing graphic or visual content",
    icon: FlaticonFlask,
    color: "bg-champagne/40 text-navy border-taupe/30",
  },
  {
    title: "Editorial & Reviewing",
    desc: "Editing and reviewing submissions",
    icon: FlaticonShieldCheck,
    color: "bg-sapphire/10 text-sapphire border-sapphire/20",
  },
  {
    title: "Educational Initiatives",
    desc: "Organizing educational initiatives or learning campaigns",
    icon: FlaticonBriefcase,
    color: "bg-champagne/40 text-navy border-taupe/30",
  },
  {
    title: "Translation Services",
    desc: "Translation",
    icon: FlaticonCheckCircle,
    color: "bg-sapphire/10 text-sapphire border-sapphire/20",
  },
];

export default function VolunteerPage() {
  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20">
      <div className="container-tour space-y-16">
        
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
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a 
                href="https://tally.so/r/9qglQ4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-navy bg-navy px-7 py-3.5 text-sm font-semibold text-ivory hover:bg-sapphire transition-all duration-200 shadow-md cursor-pointer"
              >
                <span>Apply for Volunteer Hours</span>
                <FlaticonArrowRight size={16} />
              </a>
              <Link
                href="/join-team"
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy/20 bg-white px-6 py-3.5 text-sm font-semibold text-navy hover:border-navy hover:bg-ivory transition-all duration-200 shadow-sm cursor-pointer"
              >
                <span>Want to join a Tour team? Apply here</span>
                <FlaticonArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-[36px] overflow-hidden border-2 border-navy/15 shadow-xl">
              <Image 
                src="/about-mission.jpg"
                alt="Young student researchers collaborating on academic projects"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <span className="text-xs text-white font-medium">Graphic Design & visual media</span>
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

        {/* 2.6 WANT TO JOIN A TOUR TEAM? CALLOUT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-2 border-sapphire/30 bg-champagne/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              Staff & Contributor Roles
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-navy">
              Want to join a Tour team? Apply here.
            </h3>
            <p className="text-xs sm:text-sm text-navy/75 max-w-xl">
              Looking to contribute to Editorial, Research, Visuals, Tech, or Community? Apply directly to become an active Tour team member.
            </p>
          </div>
          <Link
            href="/join-team"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-sapphire transition shrink-0 shadow-md cursor-pointer"
          >
            <span>Apply to Join Team</span>
            <FlaticonArrowRight size={16} />
          </Link>
        </motion.div>

        {/* 2.7 APPLY FOR VOLUNTEER HOURS */}
        <motion.div 
          id="volunteer-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[36px] border-2 border-navy/15 bg-white p-8 sm:p-12 md:p-14 max-w-3xl mx-auto text-center space-y-6 shadow-lg"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sapphire/10 text-sapphire mb-2">
            <FlaticonHeart size={32} />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              Official Reporting
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
              Apply for Volunteer Hours
            </h2>
            <p className="text-sm sm:text-base text-navy/75 leading-relaxed font-light">
              To record your contributions and request official volunteer hours documentation or digital certificates, please complete our verification form.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://tally.so/r/9qglQ4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-navy bg-navy px-8 py-4 text-sm font-bold text-white hover:bg-sapphire hover:border-sapphire transition shadow-md cursor-pointer"
            >
              <span>Apply for Volunteer Hours</span>
              <FlaticonArrowRight size={16} />
            </a>
            <Link
              href="/join-team"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy/20 bg-white px-7 py-4 text-sm font-semibold text-navy hover:bg-ivory hover:border-navy transition cursor-pointer"
            >
              <span>Join a Tour Team</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
