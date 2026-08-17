"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FileText,
  Bookmark,
  Award,
  Clock,
  ShieldCheck,
  MessageSquare,
  Users,
  BellRing,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  PenTool,
  Download,
  ExternalLink,
  ArrowRight,
  Plus,
  Compass,
  Layers,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardData {
  user: {
    name: string;
    email: string;
    school: string;
    gradeLevel: string;
    role: string;
    bio: string;
    researchInterests: string[];
  };
  stats: {
    publishedCount: number;
    inProgressCount: number;
    volunteerHours: number;
    peerReviewsCompleted: number;
    totalReads: number;
  };
  projects: Array<{
    id: string;
    title: string;
    category: string;
    stage: string;
    progress: number;
    wordCount: number;
    targetWords: number;
    updatedAt: string;
    hypothesis: string;
    goal: string;
  }>;
  recentHours: Array<{
    id: string;
    task: string;
    hours: number;
    date: string;
    status: string;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issueDate: string;
    category: string;
    code: string;
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<
    "overview" | "notebooks" | "questions" | "community" | "hours" | "certificates"
  >("overview");

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Hour Log Modal state
  const [showHourModal, setShowHourModal] = useState(false);
  const [hourForm, setHourForm] = useState({ task: "", hours: 2.0, category: "Manuscript Writing" });
  const [isLoggingHour, setIsLoggingHour] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/user/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [session]);

  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingHour(true);
    try {
      const res = await fetch("/api/user/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hourForm),
      });
      if (res.ok) {
        const newLog = await res.json();
        if (data) {
          setData({
            ...data,
            stats: { ...data.stats, volunteerHours: data.stats.volunteerHours + Number(hourForm.hours) },
            recentHours: [newLog, ...data.recentHours],
          });
        }
        setShowHourModal(false);
        setHourForm({ task: "", hours: 2.0, category: "Manuscript Writing" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingHour(false);
    }
  };

  const displayName = session?.user?.name || data?.user?.name || "Amara Okonjo";
  const displayEmail = session?.user?.email || data?.user?.email || "amara@tour.dev";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="py-6 sm:py-10 bg-ivory/40 min-h-screen">
      <div className="container-tour space-y-6 sm:space-y-8">
        {/* Profile Card Header */}
        <div className="rounded-3xl border border-navy/10 bg-white p-5 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full bg-navy text-ivory font-heading font-extrabold text-lg sm:text-2xl flex items-center justify-center border-2 sm:border-4 border-champagne shadow-sm shrink-0">
              {initials}
            </div>
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-lg sm:text-2xl font-bold text-navy truncate">{displayName}</h1>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5">
                  Active Scholar
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-sapphire">
                Student Research Writer • Verified Volunteer Track
              </p>
              <p className="text-[11px] sm:text-xs text-navy/60 truncate">
                {data?.user?.school || "Oakridge High School"} • {displayEmail}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full md:w-auto">
            <Link href="/workspace/notebook" className="flex-1 sm:flex-initial">
              <Button className="w-full sm:w-auto rounded-full bg-navy hover:bg-sapphire text-ivory text-xs px-4 sm:px-5 flex items-center justify-center gap-1.5 shadow-sm">
                <PenTool className="h-3.5 w-3.5" /> Open Notebook
              </Button>
            </Link>
            <Link href="/submit" className="flex-1 sm:flex-initial">
              <Button
                variant="secondary"
                className="w-full sm:w-auto rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-4"
              >
                Submit Paper
              </Button>
            </Link>
            {session && (
              <button
                onClick={() => signOut()}
                className="rounded-full p-2 text-navy/60 hover:bg-red-50 hover:text-red-600 transition ml-auto md:ml-0"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 border-b border-navy/10 pb-3 overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setTab("overview")}
            className={`whitespace-nowrap rounded-full px-5 py-2 transition ${
              tab === "overview" ? "bg-navy text-ivory font-bold shadow-sm" : "text-navy/70 hover:bg-navy/5"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("notebooks")}
            className={`whitespace-nowrap rounded-full px-5 py-2 transition ${
              tab === "notebooks" ? "bg-navy text-ivory font-bold shadow-sm" : "text-navy/70 hover:bg-navy/5"
            }`}
          >
            My Research & Notebooks ({data?.projects?.length || 2})
          </button>
          <button
            onClick={() => setTab("questions")}
            className={`whitespace-nowrap rounded-full px-5 py-2 transition ${
              tab === "questions" ? "bg-navy text-ivory font-bold shadow-sm" : "text-navy/70 hover:bg-navy/5"
            }`}
          >
            Topic Inquiries
          </button>
          <button
            onClick={() => setTab("hours")}
            className={`whitespace-nowrap rounded-full px-5 py-2 transition ${
              tab === "hours" ? "bg-navy text-ivory font-bold shadow-sm" : "text-navy/70 hover:bg-navy/5"
            }`}
          >
            Volunteer Hours ({data?.stats?.volunteerHours || 38.5}h)
          </button>
          <button
            onClick={() => setTab("certificates")}
            className={`whitespace-nowrap rounded-full px-5 py-2 transition ${
              tab === "certificates" ? "bg-navy text-ivory font-bold shadow-sm" : "text-navy/70 hover:bg-navy/5"
            }`}
          >
            Certificates ({data?.certificates?.length || 3})
          </button>
          <button
            onClick={() => setTab("community")}
            className={`whitespace-nowrap rounded-full px-5 py-2 transition ${
              tab === "community" ? "bg-navy text-ivory font-bold shadow-sm" : "text-navy/70 hover:bg-navy/5"
            }`}
          >
            Peer Community
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW
           ═══════════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Quick Action Prompt */}
            <div className="rounded-3xl border border-sapphire/20 bg-gradient-to-r from-sapphire/10 to-champagne/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-sapphire" />
                  <h3 className="font-heading text-lg font-bold text-navy">
                    Ready to continue writing your manuscript?
                  </h3>
                </div>
                <p className="text-xs text-navy/70 max-w-lg leading-relaxed">
                  Your draft <strong>“Microplastic Accumulation in Freshwater Gastropods”</strong> is at 78% completion. Jump into the editor to add references and finalize the discussion.
                </p>
              </div>
              <Link href="/workspace/notebook">
                <Button className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-6 py-2.5 shrink-0 shadow-sm flex items-center gap-1.5">
                  <PenTool className="h-3.5 w-3.5" /> Continue in Notebook
                </Button>
              </Link>
            </div>

            {/* Top Stat Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-navy">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-navy/70">Published Papers</span>
                  <FileText className="h-5 w-5 text-sapphire" />
                </div>
                <p className="font-heading text-3xl font-extrabold text-navy">
                  {data?.stats?.publishedCount ?? 2}
                </p>
                <p className="text-[11px] text-navy/60">{data?.stats?.totalReads ?? 3420} total reads worldwide</p>
              </div>

              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-navy">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-navy/70">Volunteer Hours</span>
                  <Clock className="h-5 w-5 text-sapphire" />
                </div>
                <p className="font-heading text-3xl font-extrabold text-navy">
                  {data?.stats?.volunteerHours ?? 38.5}h
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified by Editorial Board
                </p>
              </div>

              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-navy">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-navy/70">Active Notebooks</span>
                  <PenTool className="h-5 w-5 text-sapphire" />
                </div>
                <p className="font-heading text-3xl font-extrabold text-navy">
                  {data?.projects?.length ?? 2}
                </p>
                <p className="text-[11px] text-sapphire font-semibold">1 ready for peer review</p>
              </div>

              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-navy">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-navy/70">Peer Reviews</span>
                  <ShieldCheck className="h-5 w-5 text-sapphire" />
                </div>
                <p className="font-heading text-3xl font-extrabold text-navy">
                  {data?.stats?.peerReviewsCompleted ?? 14}
                </p>
                <p className="text-[11px] text-navy/60">100% on-time completion</p>
              </div>
            </div>

            {/* Active Projects Preview in Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-navy">Active Research Projects</h3>
                <Link href="/join/writer">
                  <Button variant="secondary" size="sm" className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-4 flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> Start New Topic
                  </Button>
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {(data?.projects || []).map((proj) => (
                  <div key={proj.id} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card hover:shadow-soft transition space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-0.5 text-[11px] font-bold text-sapphire">
                          {proj.category}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          Stage: {proj.stage} ({proj.progress}%)
                        </span>
                      </div>

                      <h4 className="font-heading text-lg font-bold text-navy">{proj.title}</h4>
                      <p className="text-xs text-navy/70 line-clamp-2 leading-relaxed">
                        {proj.hypothesis || proj.goal}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-navy/5">
                      <div className="h-2 w-full rounded-full bg-ivory overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sapphire"
                          style={{ width: `${proj.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy/50">{proj.wordCount} words written</span>
                        <Link href="/workspace/notebook">
                          <Button size="sm" className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-4">
                            Open in Notebook →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 2: MY RESEARCH & NOTEBOOKS
           ═══════════════════════════════════════════════════════════════ */}
        {tab === "notebooks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-navy">Research Projects & Notebooks</h3>
                <p className="text-xs text-navy/60">Manage all your active student investigations, manuscripts, and data logs.</p>
              </div>
              <Link href="/join/writer">
                <Button className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-5 flex items-center gap-1.5 shadow-sm">
                  <PlusCircle className="h-4 w-4" /> Propose New Topic
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {(data?.projects || []).map((p) => (
                <div key={p.id} className="rounded-3xl border border-navy/10 bg-white p-6 md:p-8 shadow-card space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-sapphire/10 px-3 py-0.5 text-xs font-bold text-sapphire">
                          {p.category}
                        </span>
                        <span className="text-xs text-navy/50 font-medium">Updated recently</span>
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-navy">{p.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href="/workspace/notebook">
                        <Button className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-5 flex items-center gap-1.5">
                          <PenTool className="h-3.5 w-3.5" /> Launch Notebook Editor
                        </Button>
                      </Link>
                      <Link href="/submit">
                        <Button variant="secondary" className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-4">
                          Submit
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 text-xs bg-ivory/40 p-4 rounded-2xl border border-navy/5">
                    <div>
                      <p className="font-bold text-navy uppercase text-[10px]">Research Goal / Inquiry</p>
                      <p className="text-navy/70 mt-0.5">{p.goal}</p>
                    </div>
                    <div>
                      <p className="font-bold text-navy uppercase text-[10px]">Hypothesis</p>
                      <p className="text-navy/70 mt-0.5">{p.hypothesis}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-navy/60">
                      Progress: <strong>{p.progress}%</strong> • Stage: <strong>{p.stage}</strong>
                    </span>
                    <span className="text-navy/60">
                      Draft volume: <strong>{p.wordCount}</strong> / {p.targetWords} words
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-ivory overflow-hidden">
                    <div className="h-full rounded-full bg-sapphire" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 3: TOPIC INQUIRIES
           ═══════════════════════════════════════════════════════════════ */}
        {tab === "questions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-navy">Research Questions Hub</h3>
                <p className="text-xs text-navy/60">Questions you have posted or bookmarked to research.</p>
              </div>
              <Link href="/questions">
                <Button className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-5 flex items-center gap-1.5">
                  <Compass className="h-4 w-4" /> Explore Global Question Hub
                </Button>
              </Link>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-2xl bg-champagne/30 space-y-2 border border-sapphire/10">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sapphire uppercase text-[10px]">Adopted Topic</span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 text-[10px]">
                      Research In Progress
                    </span>
                  </div>
                  <h4 className="font-bold text-navy text-sm">
                    How do microplastics bioaccumulate in local freshwater benthic organisms across varying rainfall runoff levels?
                  </h4>
                  <p className="text-navy/70 leading-relaxed">
                    Formulating double-blind study measuring Nile Red fluorescence in urban watershed Physella acuta specimens.
                  </p>
                  <div className="flex justify-between items-center pt-2 text-[11px] text-navy/50 border-t border-navy/10">
                    <span>Initiated by you</span>
                    <Link href="/workspace/notebook" className="font-bold text-sapphire hover:underline">
                      Open Notebook →
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-navy/10 bg-ivory/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-navy/60 uppercase text-[10px]">Saved Question</span>
                    <span className="text-sapphire font-bold">12 Answers</span>
                  </div>
                  <h4 className="font-bold text-navy text-sm">
                    Can lightweight U-Net variants run real-time wildfire boundary detection on drone microcontrollers?
                  </h4>
                  <p className="text-navy/70 leading-relaxed">
                    Benchmarking 8-bit quantized models on embedded hardware using satellite multispectral feeds.
                  </p>
                  <div className="flex justify-between items-center pt-2 text-[11px] text-navy/50 border-t border-navy/10">
                    <span>Bookmarked for future paper</span>
                    <Link href="/join/writer" className="font-bold text-sapphire hover:underline">
                      Start Paper on this Topic →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 4: VOLUNTEER HOURS TRACKER
           ═══════════════════════════════════════════════════════════════ */}
        {tab === "hours" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-navy">Verified Volunteer Hours Log</h3>
                <p className="text-xs text-navy/60">
                  Track hours spent writing, conducting literature reviews, and peer-reviewing student papers.
                </p>
              </div>
              <Button
                onClick={() => setShowHourModal(true)}
                className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-5 flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="h-4 w-4" /> Log Research Hours
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-1">
                <span className="text-xs text-navy/60 font-semibold uppercase">Total Approved Hours</span>
                <p className="font-heading text-3xl font-extrabold text-emerald-700">34.5h</p>
                <p className="text-[11px] text-emerald-800">Eligible for signed official certificate</p>
              </div>
              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-1">
                <span className="text-xs text-navy/60 font-semibold uppercase">Pending Verification</span>
                <p className="font-heading text-3xl font-extrabold text-amber-700">4.0h</p>
                <p className="text-[11px] text-navy/50">Under review by Editorial Board</p>
              </div>
              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-1">
                <span className="text-xs text-navy/60 font-semibold uppercase">Next Milestone</span>
                <p className="font-heading text-3xl font-extrabold text-navy">50.0h</p>
                <p className="text-[11px] text-sapphire font-semibold">11.5 hours to Gold Scholar Honor</p>
              </div>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
              <h4 className="font-heading font-bold text-sm text-navy">Recent Activity Log</h4>
              <div className="divide-y divide-navy/10 text-xs">
                {(data?.recentHours || []).map((h) => (
                  <div key={h.id} className="py-3.5 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="font-bold text-navy text-sm">{h.task}</p>
                      <p className="text-navy/50">{h.date} • Verified Volunteer Service</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-navy text-sm">{h.hours} Hours</p>
                      <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 5: CERTIFICATES & RECOGNITION
           ═══════════════════════════════════════════════════════════════ */}
        {tab === "certificates" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-bold text-navy">Verified Diplomas & Certificates</h3>
              <p className="text-xs text-navy/60">
                Official signed certificates for your academic portfolio and university admissions.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {(data?.certificates || []).map((c) => (
                <div key={c.id} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card hover:shadow-soft transition space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-10 w-10 rounded-2xl bg-champagne/80 flex items-center justify-center text-sapphire">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sapphire">{c.category}</span>
                      <h4 className="font-heading text-lg font-bold text-navy">{c.title}</h4>
                    </div>
                    <p className="text-xs text-navy/60">
                      Issued: {c.issueDate} • Verification Code: <code className="text-navy font-mono text-[10px]">{c.code}</code>
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => alert(`Downloading official PDF for certificate ${c.code}`)}
                    className="w-full rounded-full bg-navy text-ivory hover:bg-sapphire text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Verified PDF
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 6: COMMUNITY
           ═══════════════════════════════════════════════════════════════ */}
        {tab === "community" && (
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-navy">Academic Peer Cohorts & Workshops</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-sapphire/20 p-2 text-sapphire">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-heading font-bold text-navy">Your Research Groups</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-ivory/60 hover:bg-champagne/30 transition cursor-pointer">
                    <div>
                      <p className="font-bold text-navy">Environmental Ecology Cohort</p>
                      <p className="text-navy/50">42 active student writers</p>
                    </div>
                    <span className="text-sapphire font-bold text-[11px]">Active</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-ivory/60 hover:bg-champagne/30 transition cursor-pointer">
                    <div>
                      <p className="font-bold text-navy">Statistical Analysis & Nile Red Protocols</p>
                      <p className="text-navy/50">128 members</p>
                    </div>
                    <span className="text-sapphire font-bold text-[11px]">Active</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-sapphire/20 p-2 text-sapphire">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h4 className="font-heading font-bold text-navy">Live Youth Workshops</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl border border-navy/10 space-y-1">
                    <p className="font-bold text-navy">Scientific Writing: Structuring Results & ANOVA</p>
                    <p className="text-navy/60">August 24, 2026 • 5:00 PM GMT • Online Session</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-navy/10 space-y-1">
                    <p className="font-bold text-navy">Peer Reviewer Masterclass: Spotting AI Artifacts</p>
                    <p className="text-navy/60">August 28, 2026 • 6:00 PM GMT • Zoom Workshop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Hours Modal */}
      {showHourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-navy/10 bg-white p-8 shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-navy/10 pb-4">
              <h3 className="font-heading font-bold text-xl text-navy">Log Volunteer Research Hours</h3>
              <button onClick={() => setShowHourModal(false)} className="text-navy/50 hover:text-navy">✕</button>
            </div>

            <form onSubmit={handleLogHours} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-navy/80">Research Task / Activity</label>
                <input
                  type="text"
                  required
                  value={hourForm.task}
                  onChange={(e) => setHourForm({ ...hourForm, task: e.target.value })}
                  placeholder="e.g. Statistical data analysis & writing results"
                  className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-navy/80">Hours Spent</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="20"
                    required
                    value={hourForm.hours}
                    onChange={(e) => setHourForm({ ...hourForm, hours: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-navy/80">Category</label>
                  <select
                    value={hourForm.category}
                    onChange={(e) => setHourForm({ ...hourForm, category: e.target.value })}
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  >
                    <option>Manuscript Writing</option>
                    <option>Literature Review</option>
                    <option>Experimentation</option>
                    <option>Peer Review</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-navy/10">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowHourModal(false)}
                  className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoggingHour || !hourForm.task}
                  className="rounded-full bg-navy text-ivory hover:bg-sapphire text-xs px-6 font-bold"
                >
                  {isLoggingHour ? "Logging..." : "Submit for Verification"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
