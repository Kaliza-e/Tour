"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-ivory py-16 md:py-20">
      <div className="container-tour grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">
            <Mail className="h-4 w-4" /> Contact Tour
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Get in touch about research, publishing, or volunteering.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy/70">
            We welcome questions from students, educators, volunteers, and partners who want to support young research and learning.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-800">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <h2 className="mt-3 font-heading text-xl font-bold">Message sent</h2>
              <p className="mt-2 text-sm">Thanks for reaching out. The Tour team will review your message and respond as soon as possible.</p>
            </div>
          ) : (
            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-navy/80">
                  Your name
                </label>
                <input id="name" required type="text" placeholder="Your name" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sapphire" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-navy/80">
                  Email address
                </label>
                <input id="email" required type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sapphire" />
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-navy/80">
                  Subject
                </label>
                <input id="subject" required type="text" placeholder="Research, publishing, or volunteer inquiry" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sapphire" />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-navy/80">
                  Message
                </label>
                <textarea id="message" required rows={5} placeholder="Tell us how we can help." className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sapphire" />
              </div>
              <Button type="submit" className="w-full rounded-full bg-navy text-ivory hover:bg-sapphire">
                <Send className="h-4 w-4" /> Send message
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sapphire/10 text-sapphire">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">What to include</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-navy/70">
              <li>• Your name, school, and age range if relevant</li>
              <li>• The kind of question, project, or support you need</li>
              <li>• Whether you are reaching out as a student, volunteer, or partner</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card">
            <h2 className="font-heading text-2xl font-bold text-navy">Before you reach out</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy/70">
              Tour is built for students who are curious, learning, and ready to begin their research journey. If you are looking to publish student work, volunteer, or support learning, the form above is the best first step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
