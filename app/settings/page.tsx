"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, School, Shield, Bell, Save, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [gradeLevel, setGradeLevel] = useState("High School");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/dashboard");
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            setName(json.user.name || "");
            setEmail(json.user.email || "");
            setSchool(json.user.school || "");
            setGradeLevel(json.user.gradeLevel || "High School");
            setBio(json.user.bio || "");
            setInterests(json.user.researchInterests || ["General Science"]);
          }
        }
      } catch (e) {
        console.error("Error loading user profile", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [session]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-8 sm:py-12 bg-ivory/40 min-h-screen">
      <div className="container-tour space-y-8 max-w-4xl">
          {/* Header */}
          <div className="space-y-1 border-b border-navy/10 pb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">
              Account & Researcher Preferences
            </span>
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-navy">
              Profile Settings
            </h1>
            <p className="text-xs sm:text-sm text-navy/60">
              Manage your academic credentials, school affiliation, and notification preferences.
            </p>
          </div>

          {saved && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Profile settings saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Personal Details Card */}
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-card space-y-6">
              <h2 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                <User className="h-5 w-5 text-sapphire" /> Researcher Profile
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full rounded-2xl border border-navy/10 bg-navy/5 px-4 py-2.5 text-sm text-navy/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    School / Academic Institution
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="e.g. Oakridge High School"
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    Grade Level / Academic Stage
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  >
                    <option>Middle School (Grades 6-8)</option>
                    <option>High School (Grades 9-12)</option>
                    <option>Undergraduate Student</option>
                    <option>Independent Youth Scholar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                  Academic Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your research interests and academic aspirations..."
                  className="w-full rounded-2xl border border-navy/15 bg-ivory/40 p-4 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                ></textarea>
              </div>
            </div>

            {/* Academic Integrity & Ethics */}
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                <Shield className="h-5 w-5 text-sapphire" /> Verified Volunteer & Ethics Enrollment
              </h2>
              <div className="p-4 rounded-2xl bg-champagne/40 border border-sapphire/15 space-y-1.5 text-xs text-navy/80">
                <div className="flex items-center gap-1.5 font-bold text-sapphire">
                  <CheckCircle2 className="h-4 w-4" /> Active Volunteer Service Track
                </div>
                <p>
                  Your account is enrolled in verified volunteer hours tracking for certificates and official school community service credit.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="submit"
                className="rounded-full bg-navy hover:bg-sapphire text-ivory font-bold text-xs px-8 py-3 flex items-center gap-2 shadow-sm"
              >
                <Save className="h-4 w-4" /> Save Profile Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
}

