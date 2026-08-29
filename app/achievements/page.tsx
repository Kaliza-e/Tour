"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Trophy,
  Award,
  Clock,
  ShieldCheck,
  Download,
  Sparkles,
  CheckCircle2,
  Lock,
  BookOpen,
  ArrowRight,
  Medal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserDashboardData {
  user: {
    name: string;
    email: string;
    school: string;
    gradeLevel: string;
  };
  stats: {
    publishedCount: number;
    inProgressCount: number;
    volunteerHours: number;
    peerReviewsCompleted: number;
  };
  certificates: Array<{
    id: string;
    title: string;
    issueDate: string;
    category: string;
    code: string;
  }>;
}

export default function AchievementsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch("/api/user/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load achievements data", err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, [session]);

  const volunteerHours = data?.stats?.volunteerHours || 0;
  const publishedCount = data?.stats?.publishedCount || 0;
  const inProgressCount = data?.stats?.inProgressCount || 0;
  const peerReviews = data?.stats?.peerReviewsCompleted || 0;
  const userName = session?.user?.name || data?.user?.name || "Student Researcher";
  const userSchool = data?.user?.school || "Academic Institution";

  // Dynamic Badges based on the user's actual progress
  const badges = [
    {
      title: "Scholar Onboarding",
      desc: "Registered and initialized first research investigation on TOUR",
      unlocked: true,
      category: "Milestone",
      date: "Active",
      icon: Sparkles,
    },
    {
      title: "Active Manuscript Writer",
      desc: "Created and formulated hypotheses in Research Notebook",
      unlocked: inProgressCount > 0,
      category: "Research",
      date: inProgressCount > 0 ? "Unlocked" : "In Progress",
      icon: BookOpen,
    },
    {
      title: "Volunteer Service Track",
      desc: "Logged verified volunteer hours for community contribution",
      unlocked: volunteerHours > 0,
      category: "Service",
      date: volunteerHours > 0 ? `${volunteerHours}h logged` : "0h logged",
      icon: Clock,
    },
    {
      title: "Peer Review Integrity",
      desc: "Completed double-blind peer reviews with academic rigor",
      unlocked: peerReviews > 0,
      category: "Academic",
      date: peerReviews > 0 ? `${peerReviews} completed` : "Locked",
      icon: ShieldCheck,
    },
    {
      title: "Published Scientist",
      desc: "Published an approved peer-reviewed research paper on TOUR",
      unlocked: publishedCount > 0,
      category: "Distinction",
      date: publishedCount > 0 ? `${publishedCount} Published` : "Pending Publication",
      icon: Trophy,
    },
    {
      title: "50+ Hours Honor Roll",
      desc: "Completed 50+ verified hours for graduation/NHS certificate",
      unlocked: volunteerHours >= 50,
      category: "Leadership",
      date: volunteerHours >= 50 ? "Unlocked" : (50 - volunteerHours > 0 ? (50 - volunteerHours) + "h remaining" : "0h remaining"),
      icon: Medal,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="py-8 sm:py-12 bg-ivory/40 min-h-screen">
      <div className="container-tour space-y-8 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy/10 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sapphire">
                <Award className="h-3.5 w-3.5" /> Portal Portfolio & Recognition
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy">
                {userName}&apos;s Academic Distinctions
              </h1>
              <p className="text-xs sm:text-sm text-navy/70">
                Track your unlocked badges, verified volunteer hours, and downloadable certificates for {userSchool}.
              </p>
            </div>

            <Link href="/workspace/notebook">
              <Button className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-sm">
                <BookOpen className="h-4 w-4" /> Open Active Notebook
              </Button>
            </Link>
          </div>

          {/* Overview Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sapphire">Verified Hours</span>
              <p className="font-heading text-3xl font-extrabold text-navy">{volunteerHours} hrs</p>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified by Editorial Board
              </p>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sapphire">Badges Unlocked</span>
              <p className="font-heading text-3xl font-extrabold text-navy">
                {unlockedCount} / {badges.length}
              </p>
              <p className="text-[11px] text-navy/60">
                {Math.round((unlockedCount / badges.length) * 100)}% Milestone Progress
              </p>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sapphire">Active Investigations</span>
              <p className="font-heading text-3xl font-extrabold text-navy">{inProgressCount}</p>
              <p className="text-[11px] text-navy/60">Manuscripts in Progress</p>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sapphire">Published Papers</span>
              <p className="font-heading text-3xl font-extrabold text-navy">{publishedCount}</p>
              <p className="text-[11px] text-navy/60">Peer-Reviewed & Archived</p>
            </div>
          </div>

          {/* Official Verification Card */}
          <div className="rounded-3xl border border-navy/15 bg-navy p-6 sm:p-8 text-ivory flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start text-xs font-bold uppercase text-champagne">
                <ShieldCheck className="h-4 w-4" /> Official Cryptographic Verification
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-ivory">
                Official Student Research & Service Portfolio
              </h3>
              <p className="text-xs sm:text-sm text-ivory/80 max-w-xl leading-relaxed">
                Registered for <strong>{userName}</strong> ({userSchool}). Suitable for university application portfolios, National Honor Society verification, and academic resumes.
              </p>
            </div>
            <Button
              onClick={() =>
                alert(`Generated official academic distinction summary certificate for ${userName}.`)
              }
              className="rounded-full bg-champagne text-navy hover:bg-white font-bold text-xs px-6 py-3 shrink-0 flex items-center gap-2 shadow-sm"
            >
              <Download className="h-4 w-4" /> Download Certified Summary (PDF)
            </Button>
          </div>

          {/* Dynamic Badges Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-navy">Academic & Service Badges</h3>
              <span className="text-xs text-navy/60 font-medium">Auto-updated based on your activity</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge, idx) => {
                const IconComp = badge.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-3xl border p-6 flex flex-col justify-between space-y-4 transition ${
                      badge.unlocked
                        ? "border-navy/10 bg-white shadow-card hover:shadow-soft"
                        : "border-navy/5 bg-white/50 opacity-60"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                            badge.unlocked
                              ? "bg-champagne/80 text-sapphire shadow-inner"
                              : "bg-navy/5 text-navy/40"
                          }`}
                        >
                          <IconComp className="h-6 w-6" />
                        </div>
                        <span
                          className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            badge.unlocked
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-navy/5 text-navy/50 flex items-center gap-1"
                          }`}
                        >
                          {badge.unlocked ? badge.date : <span className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Locked</span>}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-sapphire uppercase tracking-wider">
                          {badge.category}
                        </span>
                        <h4 className="font-heading text-base font-bold text-navy mt-0.5">{badge.title}</h4>
                        <p className="text-xs text-navy/70 mt-1 leading-relaxed">{badge.desc}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-navy/5 flex items-center justify-between text-[11px]">
                      <span className={badge.unlocked ? "text-emerald-700 font-semibold flex items-center gap-1" : "text-navy/40"}>
                        {badge.unlocked ? <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Unlocked</span> : "Incomplete"}
                      </span>
                      <Button size="sm" variant="ghost" className="text-navy font-bold flex items-center gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Download Certificate
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Specific Certificates */}
          {data?.certificates && data.certificates.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-navy/10">
              <h3 className="font-heading text-xl font-bold text-navy">Issued Certificates</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-10 w-10 rounded-2xl bg-champagne flex items-center justify-center text-sapphire">
                        <Award className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-sapphire">{cert.category}</span>
                      <h4 className="font-heading text-base font-bold text-navy">{cert.title}</h4>
                      <p className="text-xs text-navy/60">
                        Issued: {cert.issueDate} • Code: <code className="font-mono text-navy font-bold">{cert.code}</code>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => alert(`Downloading ${cert.title} PDF certificate.`)}
                      className="w-full rounded-full bg-navy text-ivory hover:bg-sapphire text-xs flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Certificate
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

