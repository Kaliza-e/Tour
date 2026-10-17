"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FlaticonUsers,
  FlaticonCheckCircle,
  FlaticonHeart,
  FlaticonBriefcase,
  FlaticonShieldCheck,
  FlaticonArrowRight,
  FlaticonUser,
  FlaticonMail,
  FlaticonStar,
  FlaticonBook,
} from "@/components/flaticons";
import { AlertCircle, Check, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { PastelLightbulbAccent } from "@/components/pastel-lightbulb-accent";

const TEAM_OPTIONS = [
  {
    id: "Publishing & Editorial",
    label: "Publishing & Editorial",
    desc: "Reviewing, proofreading, and structuring student research papers and publications.",
  },
  {
    id: "Research & Review",
    label: "Research & Review",
    desc: "Facilitating research inquiries, guiding student methodologies, and academic review.",
  },
  {
    id: "Design & Visuals",
    label: "Design & Visuals",
    desc: "Creating website visuals, publication layouts, infographics, and brand materials.",
  },
  {
    id: "Content & Social Media",
    label: "Content & Social Media",
    desc: "Drafting scientific insights, youth research spotlights, and social storytelling.",
  },
  {
    id: "Community & Outreach",
    label: "Community & Outreach",
    desc: "Engaging student researchers, academic clubs, schools, and partner networks.",
  },
  {
    id: "Technology & Web",
    label: "Technology & Web",
    desc: "Building and improving the Tour web platform, research tools, and user experience.",
  },
  {
    id: "Chapters & Expansion",
    label: "Chapters & Expansion",
    desc: "Coordinating local school and university chapters across different regions.",
  },
  {
    id: "Other",
    label: "Other",
    desc: "Bringing specialized skills or cross-functional contributions to Tour.",
  },
];

const STUDY_LEVELS = [
  "Middle school",
  "High school",
  "Gap year",
  "Undergraduate",
  "Graduate",
];

const COMMITMENT_OPTIONS = [
  { value: "1-3", label: "1–3 hours / week", desc: "Light ongoing contribution" },
  { value: "3-5", label: "3–5 hours / week", desc: "Core active contributor" },
  { value: "5-9", label: "5–9 hours / week", desc: "High engagement & leadership" },
  { value: "9+", label: "9+ hours / week", desc: "Major initiative lead" },
];

export default function JoinTeamPage() {
  const { data: session } = useSession();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [levelOfStudy, setLevelOfStudy] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [whyJoin, setWhyJoin] = useState("");
  const [skills, setSkills] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("3-5");
  const [project, setProject] = useState("");
  const [proudOfLink, setProudOfLink] = useState("");
  const [anythingElse, setAnythingElse] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Autofill if user is logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) {
        setFullName((prev) => prev || session.user.name || "");
      }
      if (session.user.email) {
        setEmail((prev) => prev || session.user.email || "");
      }
    }
  }, [session]);

  const toggleTeam = (teamId: string) => {
    setErrors((prev) => ({ ...prev, teams: "" }));
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams((prev) => prev.filter((t) => t !== teamId));
    } else {
      if (selectedTeams.length >= 2) {
        setErrors((prev) => ({
          ...prev,
          teams: "You can select up to two teams only. Deselect one first to switch.",
        }));
        return;
      }
      setSelectedTeams((prev) => [...prev, teamId]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name.";
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!country.trim() || country.trim().length < 2) {
      errs.country = "Please enter your country.";
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      errs.age = "Please enter a valid age (10 or above).";
    }

    if (!levelOfStudy) {
      errs.levelOfStudy = "Please select your current level of study.";
    }

    if (selectedTeams.length === 0) {
      errs.teams = "Please select at least one team you'd like to join.";
    } else if (selectedTeams.length > 2) {
      errs.teams = "Please select up to two teams only.";
    }

    if (!whyJoin.trim() || whyJoin.trim().length < 15) {
      errs.whyJoin = "Please tell us why you want to join Tour (at least 15 characters).";
    }

    if (!skills.trim() || skills.trim().length < 10) {
      errs.skills = "Please share your skills or strengths (at least 10 characters).";
    }

    if (!hoursPerWeek) {
      errs.hoursPerWeek = "Please select your weekly commitment.";
    }

    if (!project.trim() || project.trim().length < 20) {
      errs.project = "Please describe a project or initiative with your role (at least 20 characters).";
    }

    if (proudOfLink.trim() && !/^https?:\/\/.+/i.test(proudOfLink.trim())) {
      errs.proudOfLink = "Link must start with http:// or https://";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        document.getElementById(`field-${firstErrorKey}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/team-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          country: country.trim(),
          age: parseInt(age, 10),
          levelOfStudy,
          teams: selectedTeams,
          whyJoin: whyJoin.trim(),
          skills: skills.trim(),
          hoursPerWeek,
          project: project.trim(),
          proudOfLink: proudOfLink.trim() || undefined,
          anythingElse: anythingElse.trim() || undefined,
          website_hp: honeypot, // Honeypot field
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application. Please check your information.");
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 md:py-20">
      <div className="container-tour max-w-4xl space-y-12">
        {/* HEADER SECTION */}
        <div className="relative">
          <PastelLightbulbAccent variant="hero" className="-top-8 sm:-top-12 md:-top-14" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/25 bg-sapphire/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              <FlaticonUsers size={16} /> Tour Team Application
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight">
              Join the Tour Team
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-navy/75 font-light">
              Tour is entirely student-led. We bring together passionate youth researchers, writers, editors,
              designers, and technologists to make research and knowledge accessible to young minds everywhere.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-navy/60">
              <span className="inline-flex items-center gap-1.5">
                <FlaticonCheckCircle size={16} className="text-sapphire" /> Volunteer Hour Certificates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FlaticonCheckCircle size={16} className="text-sapphire" /> Student Leadership & Impact
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FlaticonCheckCircle size={16} className="text-sapphire" /> Global Collaborative Community
              </span>
            </div>
          </motion.div>
        </div>

        {/* THANK YOU / SUCCESS STATE */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[36px] border-2 border-sapphire/30 bg-white p-8 sm:p-12 text-center shadow-xl space-y-6"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-sapphire/10 text-sapphire border border-sapphire/20">
              <FlaticonCheckCircle size={44} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sapphire">
                Application Received
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
                Thank you for applying, {fullName}!
              </h2>
              <p className="max-w-lg mx-auto text-sm sm:text-base text-navy/70 leading-relaxed font-light">
                We have received your application for{" "}
                <span className="font-semibold text-navy">
                  {selectedTeams.join(" and ")}
                </span>
                . Our leadership team reviews every submission carefully and will reach out to you at{" "}
                <span className="font-semibold text-navy">{email}</span>.
              </p>
            </div>

            <div className="rounded-2xl border border-navy/10 bg-ivory/50 p-6 max-w-lg mx-auto text-left space-y-3">
              <h4 className="font-heading text-sm font-bold text-navy">What happens next?</h4>
              <ul className="text-xs text-navy/75 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sapphire">1.</span>
                  <span>We review your interests, background, and project experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sapphire">2.</span>
                  <span>You will receive an email update with next steps or team onboarding details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sapphire">3.</span>
                  <span>While you wait, explore the Question Hub or start writing in your Notebook!</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-sapphire transition shadow-md"
              >
                <span>Explore Question Hub</span>
                <FlaticonArrowRight size={16} />
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-navy hover:bg-ivory transition"
              >
                <span>Volunteer Guidelines</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* MAIN APPLICATION FORM */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[36px] border-2 border-navy/15 bg-white p-6 sm:p-10 md:p-12 shadow-xl space-y-8"
          >
            {/* MANDATORY AI NOTICE */}
            <div className="rounded-2xl border-2 border-sapphire/30 bg-champagne/40 p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
              <FlaticonShieldCheck size={22} className="text-sapphire shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-navy">Authenticity Commitment</p>
                <p className="text-xs sm:text-sm text-navy/75 mt-1 leading-relaxed">
                  Please write your answers yourself. AI may be used only for spelling or grammar checks,
                  not as the writer. We want to know your genuine voice, thought process, and perspective.
                </p>
              </div>
            </div>

            {serverError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-xs sm:text-sm text-red-700">
                <AlertCircle size={18} className="shrink-0 text-red-600" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Honeypot field for bot spam */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Leave this empty</label>
                <input
                  type="text"
                  id="website_hp"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="space-y-4">
                <div className="border-b border-navy/10 pb-2">
                  <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                    <FlaticonUser size={18} className="text-sapphire" /> Personal Details
                  </h3>
                  <p className="text-xs text-navy/60">Tell us who you are and where you are studying.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div id="field-fullName">
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Amara Okafor"
                      aria-required="true"
                      className={`mt-1.5 h-11 w-full rounded-xl border bg-ivory/30 px-4 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.fullName
                          ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div id="field-email">
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. amara@example.com"
                      aria-required="true"
                      className={`mt-1.5 h-11 w-full rounded-xl border bg-ivory/30 px-4 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.email
                          ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div id="field-country">
                    <label
                      htmlFor="country"
                      className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                    >
                      Country of Residence <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Canada, Egypt, United Kingdom"
                      aria-required="true"
                      className={`mt-1.5 h-11 w-full rounded-xl border bg-ivory/30 px-4 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.country
                          ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.country}</p>
                    )}
                  </div>

                  <div id="field-age">
                    <label
                      htmlFor="age"
                      className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                    >
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="age"
                      type="number"
                      min={10}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 17"
                      aria-required="true"
                      className={`mt-1.5 h-11 w-full rounded-xl border bg-ivory/30 px-4 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.age
                          ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.age && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.age}</p>
                    )}
                  </div>
                </div>

                <div id="field-levelOfStudy">
                  <label
                    htmlFor="levelOfStudy"
                    className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                  >
                    Level of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="levelOfStudy"
                    value={levelOfStudy}
                    onChange={(e) => setLevelOfStudy(e.target.value)}
                    aria-required="true"
                    className={`mt-1.5 h-11 w-full rounded-xl border bg-ivory/30 px-4 text-sm text-navy focus:outline-none transition ${
                      errors.levelOfStudy
                        ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                        : "border-navy/20 focus:border-sapphire"
                    }`}
                  >
                    <option value="">Select your study level...</option>
                    {STUDY_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  {errors.levelOfStudy && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.levelOfStudy}</p>
                  )}
                </div>
              </div>

              {/* SECTION 2: TEAMS SELECTION */}
              <div id="field-teams" className="space-y-4">
                <div className="border-b border-navy/10 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                      <FlaticonUsers size={18} className="text-sapphire" /> Tour Teams (Select Up to Two){" "}
                      <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-navy/60">
                      Choose 1 or 2 teams where you would like to contribute.
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedTeams.length === 2
                        ? "bg-sapphire text-white"
                        : selectedTeams.length === 1
                        ? "bg-sapphire/15 text-sapphire"
                        : "bg-navy/10 text-navy/60"
                    }`}
                  >
                    {selectedTeams.length} / 2 selected
                  </span>
                </div>

                {errors.teams && (
                  <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {errors.teams}
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  {TEAM_OPTIONS.map((team) => {
                    const isSelected = selectedTeams.includes(team.id);
                    return (
                      <button
                        type="button"
                        key={team.id}
                        onClick={() => toggleTeam(team.id)}
                        className={`rounded-2xl border p-4 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "border-navy bg-navy text-white shadow-md"
                            : "border-navy/15 bg-ivory/20 hover:border-navy/40 hover:bg-ivory/50 text-navy"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-sm font-bold">{team.label}</span>
                            <div
                              className={`h-5 w-5 rounded-md flex items-center justify-center border transition ${
                                isSelected
                                  ? "border-white bg-white text-navy"
                                  : "border-navy/30 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={14} className="stroke-[3]" />}
                            </div>
                          </div>
                          <p
                            className={`mt-2 text-xs leading-relaxed ${
                              isSelected ? "text-ivory/80" : "text-navy/70"
                            }`}
                          >
                            {team.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: MOTIVATION & SKILLS */}
              <div className="space-y-4">
                <div className="border-b border-navy/10 pb-2">
                  <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                    <FlaticonStar size={18} className="text-sapphire" /> Background & Motivation
                  </h3>
                  <p className="text-xs text-navy/60">Share your reasons for applying and your strengths.</p>
                </div>

                <div id="field-whyJoin">
                  <label
                    htmlFor="whyJoin"
                    className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                  >
                    Why do you want to join Tour? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-navy/55 mb-1.5">
                    What draws you to Tour's mission of youth-led academic research and knowledge-sharing?
                  </p>
                  <textarea
                    id="whyJoin"
                    rows={4}
                    value={whyJoin}
                    onChange={(e) => setWhyJoin(e.target.value)}
                    placeholder="Tell us what motivates you..."
                    aria-required="true"
                    className={`w-full rounded-xl border bg-ivory/30 p-3.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                      errors.whyJoin
                        ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                        : "border-navy/20 focus:border-sapphire"
                    }`}
                  />
                  {errors.whyJoin && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.whyJoin}</p>
                  )}
                </div>

                <div id="field-skills">
                  <label
                    htmlFor="skills"
                    className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                  >
                    Skills or Strengths <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-navy/55 mb-1.5">
                    e.g. academic writing, peer reviewing, graphic design (Figma/Canva), social media, coding, organization.
                  </p>
                  <textarea
                    id="skills"
                    rows={3}
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="List relevant strengths, tools, and experiences..."
                    aria-required="true"
                    className={`w-full rounded-xl border bg-ivory/30 p-3.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                      errors.skills
                        ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                        : "border-navy/20 focus:border-sapphire"
                    }`}
                  />
                  {errors.skills && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.skills}</p>
                  )}
                </div>

                <div id="field-hoursPerWeek">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    Hours Per Week <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-navy/55 mb-2">
                    How much time can you consistently commit each week?
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-4">
                    {COMMITMENT_OPTIONS.map((opt) => {
                      const isSelected = hoursPerWeek === opt.value;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setHoursPerWeek(opt.value)}
                          className={`rounded-xl border p-3 text-center transition cursor-pointer ${
                            isSelected
                              ? "border-navy bg-navy text-white shadow-sm"
                              : "border-navy/15 bg-ivory/20 hover:border-navy/40 text-navy"
                          }`}
                        >
                          <div className="font-heading text-xs sm:text-sm font-bold">{opt.label}</div>
                          <div
                            className={`mt-1 text-[11px] ${
                              isSelected ? "text-ivory/80" : "text-navy/60"
                            }`}
                          >
                            {opt.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.hoursPerWeek && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.hoursPerWeek}</p>
                  )}
                </div>

                <div id="field-project">
                  <label
                    htmlFor="project"
                    className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                  >
                    A Project Showing Initiative, Responsibility, or Teamwork & Your Role{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-navy/55 mb-1.5">
                    Share an example from school, a club, extracurricular work, or personal project where you took initiative or worked with others.
                  </p>
                  <textarea
                    id="project"
                    rows={4}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Describe the context, your specific responsibilities, challenges overcome, and the outcome..."
                    aria-required="true"
                    className={`w-full rounded-xl border bg-ivory/30 p-3.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                      errors.project
                        ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                        : "border-navy/20 focus:border-sapphire"
                    }`}
                  />
                  {errors.project && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.project}</p>
                  )}
                </div>
              </div>

              {/* SECTION 4: OPTIONAL SHOWCASE & NOTES */}
              <div className="space-y-4">
                <div className="border-b border-navy/10 pb-2">
                  <h3 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
                    <FlaticonBriefcase size={18} className="text-sapphire" /> Portfolio & Additional Notes
                  </h3>
                  <p className="text-xs text-navy/60">Optional links or details to support your application.</p>
                </div>

                <div id="field-proudOfLink">
                  <label
                    htmlFor="proudOfLink"
                    className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                  >
                    Something You're Proud Of (Optional Link)
                  </label>
                  <p className="text-xs text-navy/55 mb-1.5">
                    A research essay, article, portfolio, design link, GitHub repo, or project you created.
                  </p>
                  <input
                    id="proudOfLink"
                    type="url"
                    value={proudOfLink}
                    onChange={(e) => setProudOfLink(e.target.value)}
                    placeholder="https://..."
                    className={`h-11 w-full rounded-xl border bg-ivory/30 px-4 text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                      errors.proudOfLink
                        ? "border-red-500 focus:border-red-600 ring-1 ring-red-500"
                        : "border-navy/20 focus:border-sapphire"
                    }`}
                  />
                  {errors.proudOfLink && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.proudOfLink}</p>
                  )}
                </div>

                <div id="field-anythingElse">
                  <label
                    htmlFor="anythingElse"
                    className="block text-xs font-bold uppercase tracking-wider text-navy/80"
                  >
                    Anything Else? (Optional)
                  </label>
                  <textarea
                    id="anythingElse"
                    rows={3}
                    value={anythingElse}
                    onChange={(e) => setAnythingElse(e.target.value)}
                    placeholder="Any questions, ideas for Tour, or other details you'd like us to know..."
                    className="w-full rounded-xl border border-navy/20 bg-ivory/30 p-3.5 text-sm text-navy placeholder:text-navy/30 focus:border-sapphire focus:outline-none transition"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON & DISCLAIMER */}
              <div className="pt-4 border-t border-navy/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-navy/60 text-center sm:text-left leading-relaxed">
                  By submitting, you certify that all responses are your own original work.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-3.5 text-sm font-semibold text-white hover:bg-sapphire active:scale-[0.98] transition shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <FlaticonArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
