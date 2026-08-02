"use client";

import { useState } from "react";
import { User, FileText, Bookmark, Award, Clock, Bell, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [tab, setTab] = useState<"overview" | "research" | "hours" | "certificates">("overview");

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-8">
        {/* Profile Card */}
        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-navy text-ivory font-heading font-extrabold text-2xl flex items-center justify-center border-4 border-champagne">
              AM
            </div>
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-bold text-navy">Amara Okonjo</h1>
              <p className="text-xs font-semibold text-sapphire">Student Researcher & Peer Reviewer</p>
              <p className="text-xs text-navy/60">Oakridge High School • Class of 2027</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-5">
              Edit Portfolio
            </Button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 border-b border-navy/10 pb-3 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setTab("overview")}
            className={`rounded-full px-5 py-2 transition ${tab === "overview" ? "bg-navy text-ivory" : "text-navy/70 hover:bg-navy/5"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("research")}
            className={`rounded-full px-5 py-2 transition ${tab === "research" ? "bg-navy text-ivory" : "text-navy/70 hover:bg-navy/5"}`}
          >
            My Research & Drafts
          </button>
          <button
            onClick={() => setTab("hours")}
            className={`rounded-full px-5 py-2 transition ${tab === "hours" ? "bg-navy text-ivory" : "text-navy/70 hover:bg-navy/5"}`}
          >
            Volunteer Hours (38.5h)
          </button>
          <button
            onClick={() => setTab("certificates")}
            className={`rounded-full px-5 py-2 transition ${tab === "certificates" ? "bg-navy text-ivory" : "text-navy/70 hover:bg-navy/5"}`}
          >
            Certificates (3)
          </button>
        </div>

        {/* Tab Contents */}
        {tab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-navy">
                <span className="font-heading font-bold">Published Papers</span>
                <FileText className="h-5 w-5 text-sapphire" />
              </div>
              <p className="font-heading text-3xl font-extrabold text-navy">2</p>
              <p className="text-xs text-navy/60">3,420 total reads across TOUR</p>
            </div>
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-navy">
                <span className="font-heading font-bold">Volunteer Hours</span>
                <Clock className="h-5 w-5 text-sapphire" />
              </div>
              <p className="font-heading text-3xl font-extrabold text-navy">38.5h</p>
              <p className="text-xs text-emerald-700 font-semibold">Verified by Editorial Board</p>
            </div>
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-navy">
                <span className="font-heading font-bold">Peer Reviews</span>
                <ShieldCheck className="h-5 w-5 text-sapphire" />
              </div>
              <p className="font-heading text-3xl font-extrabold text-navy">14</p>
              <p className="text-xs text-navy/60">100% On-time completion</p>
            </div>
          </div>
        )}

        {tab === "research" && (
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-xl font-bold text-navy">My Submissions & Drafts</h3>
            <div className="divide-y divide-navy/10 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-navy text-sm">Microplastic Accumulation in Freshwater Snails</p>
                  <p className="text-navy/60">Published in Volume 3 • Environmental Science</p>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 font-bold">Published</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-navy text-sm">Neural Net Models for Local Rainfall Anomaly</p>
                  <p className="text-navy/60">Under Peer Review • Earth Science</p>
                </div>
                <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 font-bold">In Review</span>
              </div>
            </div>
          </div>
        )}

        {tab === "hours" && (
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-xl font-bold text-navy">Verified Volunteer Hours Log</h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-champagne/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-navy">Peer Review: Environmental Science Submissions</p>
                  <p className="text-navy/60">4.5 Hours • Verified by Dr. Hayes</p>
                </div>
                <span className="text-emerald-700 font-bold">Approved</span>
              </div>
              <div className="p-4 rounded-2xl bg-champagne/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-navy">Student Editor: Formatting Youth Abstracts</p>
                  <p className="text-navy/60">12.0 Hours • Verified by Editorial Board</p>
                </div>
                <span className="text-emerald-700 font-bold">Approved</span>
              </div>
            </div>
          </div>
        )}

        {tab === "certificates" && (
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-xl font-bold text-navy">Verified Certificates</h3>
            <p className="text-xs text-navy/60">Download official signed certificates for university applications.</p>
            <div className="grid gap-4 md:grid-cols-2 text-xs">
              <div className="p-4 rounded-2xl border border-navy/10 bg-ivory/50 space-y-2">
                <p className="font-bold text-navy">Certificate of Publication</p>
                <p className="text-navy/60">Issued Aug 2026 for Environmental Science Paper</p>
                <Button size="sm" className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs">Download PDF</Button>
              </div>
              <div className="p-4 rounded-2xl border border-navy/10 bg-ivory/50 space-y-2">
                <p className="font-bold text-navy">Certificate of Volunteer Hours (35+ hrs)</p>
                <p className="text-navy/60">Issued Jul 2026 for Editorial Service</p>
                <Button size="sm" className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs">Download PDF</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
