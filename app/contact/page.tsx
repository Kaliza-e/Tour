"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Who can publish research on TOUR?",
    a: "Any high school or early undergraduate student with an original research paper, review essay, or scientific hypothesis can submit. All submissions undergo double-blind peer review."
  },
  {
    q: "Is there any fee to publish or join?",
    a: "No! TOUR is 100% free and open-access. We believe cost should never be a barrier to scientific publishing or youth research."
  },
  {
    q: "How are volunteer hours verified?",
    a: "Volunteer hours spent editing papers, peer reviewing, or organizing chapter activities are logged in your user dashboard and verified by our editorial board with an official downloadable PDF certificate."
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <Mail className="h-4 w-4" /> Get in Touch
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-navy">
            Contact & Support
          </h1>
          <p className="text-navy/70 leading-relaxed">
            Have questions about paper submission guidelines, school partnerships, or mentorship? We are here to guide your journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card space-y-6">
            <h3 className="font-heading text-2xl font-bold text-navy">Send Us a Message</h3>
            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2 text-emerald-800">
                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-600" />
                <h4 className="font-heading font-bold text-lg">Message Delivered!</h4>
                <p className="text-xs">Thank you for reaching out. Our team usually responds within 24 hours.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div>
                  <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Your Name</label>
                  <input required type="text" placeholder="Sarah Chen" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Email Address</label>
                  <input required type="email" placeholder="sarah@example.com" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Subject</label>
                  <input required type="text" placeholder="Submission Inquiry / School Partnership" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Message</label>
                  <textarea required rows={4} placeholder="Type your message here..." className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"></textarea>
                </div>
                <Button type="submit" className="w-full rounded-full bg-navy hover:bg-sapphire text-ivory font-semibold py-3 flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            )}
          </div>

          {/* FAQ Accordion Section */}
          <div className="space-y-6">
            <h3 className="font-heading text-2xl font-bold text-navy flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-sapphire" /> Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
                  <h4 className="font-heading text-lg font-bold text-navy">{faq.q}</h4>
                  <p className="text-xs text-navy/70 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
