"use client";

import Link from "next/link";
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
          {roles.map((r, idx) => {
            const isWriter = r.title === "Student Research Writer";
            return (
              <div key={idx} className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card space-y-4 flex flex-col justify-between hover:shadow-soft transition">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-1 text-xs font-bold text-sapphire">
                      {r.badge}
                    </span>
                    {isWriter && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Featured Track
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-navy">{r.title}</h3>
                  <p className="text-sm text-navy/70 leading-relaxed">{r.desc}</p>
                </div>

                <div className="pt-4 border-t border-navy/5 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Earn Verified Hours
                  </span>
                  {isWriter ? (
                    <Link href="/join/writer">
                      <Button className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-5 shadow-sm">
                        Apply & Start Writing →
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="secondary" className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-5">
                      Apply for Role
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Volunteer Info */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-heading text-3xl font-bold text-navy">Volunteer With Tour!</h2>
            <p className="text-navy/75 leading-relaxed max-w-2xl mx-auto">
              We recognize the time, effort, and commitment you invest in thinking, researching, and writing, and we truly value the work you contribute to supporting knowledge-sharing. And we want to appreciate it. You can receive volunteer hours for any work you complete for Tour. To apply for volunteer hours, please use the form below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-heading text-xl font-bold text-navy text-center">Ways to Earn Volunteer Hours</h3>
              <p className="text-xs text-navy/70 text-center">Any contribution to Tour is considered volunteer work, as it supports knowledge-sharing, helps learning, and creates opportunities for young students to engage in research.</p>
              <ul className="list-none space-y-2 text-sm text-navy/80">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> Writing and publishing research papers or essays</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> Opening chapters in your country or school</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> Creating Instagram posts or TikTok content</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> Designing graphic or visual content</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> Editing and reviewing submissions</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> Organizing educational initiatives or learning campaigns</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> Translation</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-heading text-xl font-bold text-navy text-center">Volunteer Recognition</h3>
              <p className="text-xs text-navy/70 text-center">To receive volunteer hours, contributors are asked to report the number of hours they spent working with Tour. We trust our contributors to report their hours honestly and responsibly.</p>
              <ul className="list-none space-y-2 text-sm text-navy/80">
                <li className="flex items-start gap-2"><Award className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> A digital volunteer certificate</li>
                <li className="flex items-start gap-2"><FileText className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> A record of volunteer hours (for school, NHS, or college applications)</li>
                <li className="flex items-start gap-2"><Users className="h-4 w-4 text-sapphire mt-0.5 shrink-0" /> A recommendation letter (for contributors who have worked consistently with Tour for at least two consecutive months)</li>
              </ul>
              
              <div className="mt-4 p-3 rounded-xl bg-champagne/40 border border-sapphire/10 text-xs text-navy/80">
                <strong>Note:</strong> Tour is not yet a registered 501(c)(3) organization. However, we are happy to provide verification or confirmation of participation for schools or clubs upon request.
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Card */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-navy/10 bg-white p-8 shadow-soft space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-heading text-2xl font-bold text-navy">Volunteer Application Form</h3>
            <p className="text-xs text-navy/60">Fill out your details to join the TOUR volunteer ecosystem and apply for hours.</p>
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
