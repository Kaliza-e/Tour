"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FlaticonMail, 
  FlaticonCheckCircle, 
  FlaticonIdea, 
  FlaticonSend,
  FlaticonUser,
  FlaticonBook,
  FlaticonShieldCheck,
  FlaticonChevronDown,
  FlaticonHeart,
  FlaticonFlask
} from "@/components/flaticons";
import { Button } from "@/components/ui/button";

const SUBJECT_OPTIONS = [
  "Paper Submission",
  "Volunteer Inquiry",
  "Mentorship / Review",
  "General Question"
];

const FAQS = [
  {
    q: "How fast will the TOUR team respond?",
    a: "We guarantee a response within 24 hours on business days for all student, volunteer, and mentor inquiries."
  },
  {
    q: "Can high school students submit research?",
    a: "Yes! TOUR is specifically designed to support secondary and undergraduate researchers at all skill levels."
  },
  {
    q: "How can my school collaborate with TOUR?",
    a: "Schools and universities can partner with us to host student workshops, peer-review training, and research exhibitions."
  }
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [subjectChip, setSubjectChip] = useState("Paper Submission");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-16">
      <div className="container-tour space-y-10">
        
        {/* HERO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/25 bg-sapphire/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
            <FlaticonMail size={16} /> Contact TOUR Team
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold text-navy md:text-5xl">
            We&apos;re here to guide your research journey.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy/70 md:text-lg">
            Whether you have a question about publishing your research, volunteering as a mentor, or getting your school involved — reach out anytime.
          </p>

          {/* Quick contact feature chips */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-navy/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy">
              <FlaticonCheckCircle size={15} className="text-emerald-500" />
              <span>24-Hour Response Time</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-navy/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy">
              <FlaticonFlask size={15} className="text-sapphire" />
              <span>Peer Review Desk</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-navy/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy">
              <FlaticonHeart size={15} className="text-rose-500" />
              <span>Community Support</span>
            </div>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* LEFT: INTERACTIVE FORM (7 COLS) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl border-2 border-navy/15 bg-white p-6 md:p-10"
          >
            <h2 className="font-heading text-2xl font-bold text-navy">Send us a message</h2>
            <p className="mt-1 text-sm text-navy/60">Select a topic below so we can route your message to the right mentor.</p>

            {/* Subject selector chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setSubjectChip(subj)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    subjectChip === subj
                      ? "border-sapphire bg-sapphire text-white"
                      : "border-navy/15 bg-ivory/60 text-navy hover:bg-navy/10"
                  }`}
                >
                  {subj}
                </button>
              ))}
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
                <h3 className="mt-4 font-heading text-2xl font-bold">Message Delivered!</h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                  Thank you for contacting TOUR. Our editorial team will review your inquiry regarding <strong className="font-semibold">{subjectChip}</strong> and get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full border border-emerald-600 bg-white px-6 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                className="mt-8 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                    Your full name <span className="text-sapphire">*</span>
                  </label>
                  <div className="relative">
                    <FlaticonUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input 
                      id="name" 
                      required 
                      type="text" 
                      placeholder="Jane Doe" 
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 py-3.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy/40 focus:border-sapphire focus:bg-white focus:outline-none transition" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                    Email address <span className="text-sapphire">*</span>
                  </label>
                  <div className="relative">
                    <FlaticonMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input 
                      id="email" 
                      required 
                      type="email" 
                      placeholder="you@example.com" 
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 py-3.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy/40 focus:border-sapphire focus:bg-white focus:outline-none transition" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                    Subject Line
                  </label>
                  <div className="relative">
                    <FlaticonBook size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input 
                      id="subject" 
                      required 
                      type="text" 
                      value={subjectChip} 
                      onChange={(e) => setSubjectChip(e.target.value)}
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/50 py-3.5 pl-11 pr-4 text-sm text-navy focus:border-sapphire focus:bg-white focus:outline-none transition" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-[0.15em] text-navy/80 mb-2">
                    How can we help you? <span className="text-sapphire">*</span>
                  </label>
                  <textarea 
                    id="message" 
                    required 
                    rows={5} 
                    placeholder="Tell us about your paper, research question, or inquiry..." 
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/50 p-4 text-sm text-navy leading-relaxed placeholder:text-navy/40 focus:border-sapphire focus:bg-white focus:outline-none transition" 
                  />
                </div>

                <Button type="submit" className="w-full rounded-full bg-navy py-4 text-sm font-semibold text-white transition hover:bg-sapphire flex items-center justify-center gap-2 cursor-pointer">
                  <span>Send Message to TOUR</span> <FlaticonSend size={16} />
                </Button>
              </form>
            )}
          </motion.div>

          {/* RIGHT: VISUAL SHOWCASE & DETAILS (5 COLS) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Visual Image Showcase Card */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-navy/15 bg-navy p-6 md:p-8 text-white min-h-[260px] flex flex-col justify-end">
              <Image
                src="/research-discovery.jpg"
                alt="Research discovery and collaboration"
                fill
                className="object-cover opacity-30 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
              
              <div className="relative z-10">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Research Support
                </span>
                <h3 className="mt-3 font-heading text-2xl font-bold text-white">
                  Empowering Student Research Across Africa.
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/75">
                  TOUR provides open access, peer mentoring, and publication guidance for aspiring young researchers.
                </p>
              </div>
            </div>

            {/* Direct Contact & Response Info */}
            <div className="rounded-3xl border-2 border-navy/15 bg-white p-6">
              <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                <FlaticonShieldCheck size={18} className="text-sapphire" /> Direct Email Desk
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-navy/65">
                Prefer sending a direct email? Write to us directly at our open desk:
              </p>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-navy/15 bg-ivory/60 px-4 py-3">
                <span className="text-xs font-mono font-bold text-navy">support@tour-research.org</span>
                <a 
                  href="mailto:support@tour-research.org" 
                  className="rounded-full bg-sapphire/10 px-3 py-1 text-[11px] font-bold text-sapphire hover:bg-sapphire hover:text-white transition"
                >
                  Write Email
                </a>
              </div>
            </div>

            {/* Expandable FAQs Card */}
            <div className="rounded-3xl border-2 border-navy/15 bg-white p-6">
              <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2 mb-4">
                <FlaticonIdea size={18} className="text-sapphire" /> Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="rounded-2xl border border-navy/10 bg-ivory/40 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-navy hover:bg-navy/5 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <FlaticonChevronDown 
                        size={14} 
                        className={`transition-transform duration-300 text-navy/50 ${openFaq === idx ? "rotate-180" : ""}`} 
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 text-xs leading-relaxed text-navy/70 border-t border-navy/5 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
