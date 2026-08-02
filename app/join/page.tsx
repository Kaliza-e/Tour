"use client";

import { Users, Mail, ShieldCheck, HeartHandshake, Award, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  { title: "Student Research Writer", desc: "Formulate questions, conduct lit reviews, and publish peer-reviewed papers.", badge: "Core Academic" },
  { title: "Peer Reviewer", desc: "Review incoming student paper submissions for methodology & ethical rigor.", badge: "Senior Student / Postdoc" },
  { title: "Chapter Leader", desc: "Establish a TOUR Science & Research Club at your high school or university.", badge: "Leadership" },
  { title: "Technical & Design Contributor", desc: "Help build open-source scientific tools and visual infographics.", badge: "Tech & Creative" },
];

export default function JoinPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <HeartHandshake className="h-4 w-4" /> Join The Global Movement
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy">
            Volunteer & Become a Member
          </h1>
          <p className="text-navy/70 leading-relaxed">
            TOUR is a student-led platform built by students, for students. Join over 2,400 young researchers across 40 countries contributing to scientific literacy and open knowledge.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((r, idx) => (
            <div key={idx} className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-1 text-xs font-bold text-sapphire">
                  {r.badge}
                </span>
                <h3 className="font-heading text-2xl font-bold text-navy">{r.title}</h3>
                <p className="text-sm text-navy/70 leading-relaxed">{r.desc}</p>
              </div>

              <div className="pt-4 border-t border-navy/5 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Earn Verified Hours
                </span>
                <Button variant="secondary" className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-5">
                  Apply for Role
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form Card */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-navy/10 bg-white p-8 shadow-soft space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-heading text-2xl font-bold text-navy">Volunteer Application Form</h3>
            <p className="text-xs text-navy/60">Fill out your details to join the TOUR volunteer ecosystem and track hours.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Maya Lin" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Email Address</label>
                <input type="email" placeholder="maya@school.edu" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-navy/80 mb-1">School / Institution</label>
                <input type="text" placeholder="e.g. Oakridge High School" className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Role Interested In</label>
                <select className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire">
                  <option>Student Research Writer</option>
                  <option>Peer Reviewer</option>
                  <option>Chapter Leader</option>
                  <option>Developer / Designer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Why do you want to join TOUR?</label>
              <textarea rows={3} placeholder="Share your academic passion or goals..." className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"></textarea>
            </div>

            <Button className="w-full rounded-full bg-navy hover:bg-sapphire text-ivory font-semibold py-3">
              Submit Volunteer Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
