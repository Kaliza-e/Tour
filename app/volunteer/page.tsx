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
  FlaticonMail
} from "@/components/flaticons";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    num: "01",
    title: "Apply Online",
    desc: "Fill out the quick volunteer form below with your background & subject interests."
  },
  {
    num: "02",
    title: "Quick Orientation",
    desc: "A brief 20-minute intro to TOUR's peer review guidelines & mentorship ethos."
  },
  {
    num: "03",
    title: "Get Matched",
    desc: "We pair you with student researchers seeking guidance in your area of expertise."
  },
  {
    num: "04",
    title: "Make an Impact",
    desc: "Review drafts, provide constructive feedback, and help students get published."
  }
];

const ROLES = [
  {
    title: "Peer Reviewer & Mentor",
    desc: "Review student draft manuscripts, evaluate research methodology, and provide encouraging, constructive feedback.",
    icon: FlaticonCheckCircle,
    tags: ["Remote", "2 hrs / week", "High Impact"],
    color: "bg-navy/5 text-navy border border-navy/15"
  },
  {
    title: "Research Workshop Lead",
    desc: "Facilitate online writing sessions, guide research topic selection, and help students structure their papers.",
    icon: FlaticonBook,
    tags: ["Flexible", "Monthly", "Interactive"],
    color: "bg-navy/5 text-navy border border-navy/15"
  },
  {
    title: "School Outreach Ambassador",
    desc: "Connect with high schools and youth clubs to introduce students to TOUR and inspire young researchers.",
    icon: FlaticonUsers,
    tags: ["Regional", "Community", "Flexible"],
    color: "bg-navy/5 text-navy border border-navy/15"
  },
  {
    title: "Editorial & Publishing Assistant",
    desc: "Help format published papers, verify citation styles, and prepare seasonal journal releases.",
    icon: FlaticonBriefcase,
    tags: ["Remote", "3 hrs / week", "Editorial"],
    color: "bg-navy/5 text-navy border border-navy/15"
  }
];

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Peer Reviewer & Mentor");

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20">
      <div className="container-tour space-y-12">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/25 bg-sapphire/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
            <FlaticonHeart size={16} /> Volunteer & Mentorship
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold text-navy md:text-5xl">
            Empower the next generation of student researchers.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy/70 md:text-lg">
            TOUR relies on passionate educators, university researchers, and community mentors. Together, we ensure every young person has access to guidance, peer feedback, and publication opportunities.
          </p>
        </motion.div>

        {/* 4-STEP PROCESS BREAKDOWN */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-2 border-navy/15 bg-white p-6 md:p-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy/10 pb-6 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">How It Works</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-navy md:text-3xl">Your journey as a TOUR volunteer</h2>
            </div>
            <p className="text-xs font-semibold text-navy/50">Simple 4-step onboarding · Flexible commitments</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="relative rounded-2xl border border-navy/15 bg-ivory/40 p-6 flex flex-col justify-between">
                <div>
                  <span className="font-heading text-3xl font-extrabold text-sapphire/40">{step.num}</span>
                  <h3 className="mt-3 font-heading text-lg font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-navy/65">{step.desc}</p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-navy/25 font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* VOLUNTEER ROLES GRID */}
        <div className="space-y-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">Opportunities</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-navy md:text-4xl">Choose how you wish to contribute</h2>
            <p className="mt-2 text-sm text-navy/65">Find the role that best matches your schedule and academic expertise.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {ROLES.map((role, index) => {
              const IconComponent = role.icon;
              return (
                <motion.div 
                  key={role.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-3xl border-2 border-navy/15 bg-white p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${role.color}`}>
                        <IconComponent size={24} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedRole(role.title)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                          selectedRole === role.title
                            ? "border-sapphire bg-sapphire text-white"
                            : "border-navy/15 bg-ivory text-navy hover:bg-navy/10"
                        }`}
                      >
                        {selectedRole === role.title ? "Selected for Application" : "Select Role"}
                      </button>
                    </div>

                    <h3 className="mt-5 font-heading text-xl font-bold text-navy">{role.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy/70">{role.desc}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 border-t border-navy/10 pt-4">
                    {role.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-ivory px-3 py-1 text-[11px] font-semibold text-navy/70 border border-navy/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SPLIT BANNER WITH IMAGE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-3xl border-2 border-navy bg-navy p-6 md:p-10 text-white"
        >
          <div className="flex flex-col justify-center space-y-4">
            <span className="inline-block w-fit rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Community Impact
            </span>
            <h2 className="font-heading text-2xl font-bold text-white sm:text-4xl">
              &quot;Mentoring students through TOUR is one of the most rewarding academic experiences.&quot;
            </h2>
            <p className="text-sm leading-relaxed text-white/75">
              Volunteers support students from secondary school through undergraduate level, instilling confidence and scientific rigor.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a 
                href="#volunteer-form" 
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-navy transition hover:bg-white/90 cursor-pointer"
              >
                <span>Apply as Volunteer</span> <FlaticonArrowRight size={16} />
              </a>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/10"
              >
                <span>Learn about TOUR</span> <FlaticonArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 lg:h-full w-full overflow-hidden rounded-2xl border border-white/15">
            <Image
              src="/about-mission.jpg"
              alt="Students collaborating"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* QUICK VOLUNTEER APPLICATION FORM SECTION */}
        <motion.div 
          id="volunteer-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-2 border-navy/15 bg-white p-6 md:p-10 max-w-3xl mx-auto scroll-mt-24"
        >
          <div className="text-center max-w-xl mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sapphire/10 text-sapphire mb-3">
              <FlaticonHeart size={24} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">Apply to Volunteer</h2>
            <p className="mt-2 text-sm text-navy/65">
              Current selection: <strong className="text-sapphire">{selectedRole}</strong>. Fill out your info below and our team will get in touch within 24 hours.
            </p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-8 text-center text-emerald-900"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                <FlaticonCheckCircle size={32} />
              </div>
              <h3 className="mt-4 font-heading text-2xl font-bold">Application Received!</h3>
              <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                Thank you for offering your time to mentor student researchers. We have logged your interest for <strong className="font-semibold">{selectedRole}</strong> and will email you with orientation details soon.
              </p>
            </motion.div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} 
              className="mt-8 space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
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
                  Academic Field / Domain Expertise
                </label>
                <div className="relative">
                  <FlaticonFlask size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Computer Science, Public Health, Environmental Studies" 
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/50 py-3.5 pl-11 pr-4 text-sm text-navy focus:border-sapphire focus:bg-white focus:outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                  Brief Statement of Interest
                </label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us a little bit about your academic background and why you'd like to mentor..." 
                  className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-4 text-sm text-navy leading-relaxed focus:border-sapphire focus:bg-white focus:outline-none transition" 
                />
              </div>

              <Button type="submit" className="w-full rounded-full bg-navy py-4 text-sm font-semibold text-white transition hover:bg-sapphire flex items-center justify-center gap-2 cursor-pointer">
                <span>Submit Volunteer Application</span> <FlaticonSend size={16} />
              </Button>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
