"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  FileEdit,
  GraduationCap,
  ShieldCheck,
  Compass,
  PenTool,
  Clock,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourLogo } from "@/components/tour-logo";

const curatedTopics = [
  {
    id: "topic-1",
    category: "Environmental Science",
    title: "Microplastic Bioaccumulation in Urban Freshwater Reservoirs",
    prompt: "How do low-density polyethylene (LDPE) microplastics bioaccumulate in local freshwater benthic organisms across varying rainfall runoff levels?",
    hypothesis: "Freshwater gastropods situated downstream of high-density stormwater outflows exhibit significantly higher digestive tissue microplastic concentrations than upstream baseline controls.",
    methodology: "Field water and specimen sampling, Nile Red fluorometric microscopy, ANOVA tissue retention analysis.",
    badge: "High Impact",
  },
  {
    id: "topic-2",
    category: "Computer Science & AI",
    title: "Edge-Optimized Neural Networks for Real-Time Wildfire Perimeter Prediction",
    prompt: "Can lightweight CNN architectures be deployed on low-cost drone microcontrollers to accurately project wildfire propagation fronts?",
    hypothesis: "Quantized U-Net models operating on embedded micro-UAVs can achieve >92% IoU boundary fidelity while consuming under 5W power.",
    methodology: "Multispectral infrared satellite dataset training, 8-bit model quantization, UAV simulation bench testing.",
    badge: "Trending",
  },
  {
    id: "topic-3",
    category: "Psychology & Cognitive Science",
    title: "Circadian Dysregulation and Declarative Memory Consolidation in Adolescents",
    prompt: "What is the quantifiable impact of blue-spectrum screen exposure prior to REM sleep on overnight factual recall test performance in high schoolers?",
    hypothesis: "Adolescents with >60 minutes of unmitigated blue light prior to sleep onset experience a 25% reduction in REM cycle duration and a statistically significant drop in paired-associate recall.",
    methodology: "Double-blind observational cohort study, sleep journal & wearable actigraphy, morning memory battery.",
    badge: "Cognitive",
  },
  {
    id: "topic-4",
    category: "Biotechnology & Medicine",
    title: "Natural Polyphenol Synergism against Antibiotic-Resistant Biofilms",
    prompt: "Do plant-derived polyphenols enhance the efficacy of conventional beta-lactam antibiotics against resistant bacterial biofilms?",
    hypothesis: "Green tea epigallocatechin gallate (EGCG) disrupts EPS matrix integrity, restoring ampicillin sensitivity in non-pathogenic biofilm assays.",
    methodology: "Microtiter plate crystal violet biofilm quantification, minimum inhibitory concentration (MIC) assays.",
    badge: "Biomedical",
  },
  {
    id: "topic-5",
    category: "Physics & Renewable Energy",
    title: "Perovskite-Silicon Tandem Solar Cell Degradation under Thermal Stress",
    prompt: "How can 2D passivation layers extend the operational lifespan of high-efficiency perovskite photovoltaic tandem cells?",
    hypothesis: "A fluorinated alkylammonium 2D capping layer reduces ion migration and moisture penetration, maintaining >90% initial efficiency after 500 thermal cycles.",
    methodology: "Solar simulator IV curve characterization, XRD structural degradation analysis, impedance spectroscopy.",
    badge: "Clean Energy",
  },
];

export default function StudentWriterApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: User Account & Profile
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    gradeLevel: "High School (Grades 9-12)",
    bio: "",
    researchInterests: ["Environmental Science", "Biology"],
  });

  // Step 2: Topic Choice
  const [topicMode, setTopicMode] = useState<"curated" | "custom">("curated");
  const [selectedCuratedId, setSelectedCuratedId] = useState<string>("topic-1");
  const [customTopic, setCustomTopic] = useState({
    title: "",
    category: "Environmental Science",
    researchGoal: "",
    hypothesis: "",
    methodology: "",
  });

  // Step 3: Ethics & Commitments
  const [commitments, setCommitments] = useState({
    originalWork: false,
    aiEthics: false,
    peerReviewPolicy: false,
    volunteerTrack: true,
  });

  const availableInterests = [
    "Environmental Science",
    "Computer Science & AI",
    "Psychology",
    "Biotechnology & Medicine",
    "Physics & Energy",
    "Marine Biology",
    "Social Sciences",
    "Public Health",
  ];

  const handleToggleInterest = (interest: string) => {
    setAccountForm((prev) => {
      const exists = prev.researchInterests.includes(interest);
      if (exists) {
        return { ...prev, researchInterests: prev.researchInterests.filter((i) => i !== interest) };
      } else {
        return { ...prev, researchInterests: [...prev.researchInterests, interest] };
      }
    });
  };

  const getSelectedTopicData = () => {
    if (topicMode === "curated") {
      const found = curatedTopics.find((t) => t.id === selectedCuratedId) || curatedTopics[0];
      return {
        title: found.title,
        researchGoal: found.prompt,
        hypothesis: found.hypothesis,
        category: found.category,
      };
    }
    return {
      title: customTopic.title || "Untitled Research Investigation",
      researchGoal: customTopic.researchGoal || "Explore student-led research hypothesis",
      hypothesis: customTopic.hypothesis || "To be formulated",
      category: customTopic.category,
    };
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const activeTopic = getSelectedTopicData();

      const payload = {
        name: accountForm.name,
        email: accountForm.email,
        password: accountForm.password,
        school: accountForm.school,
        gradeLevel: accountForm.gradeLevel,
        bio: accountForm.bio,
        researchInterests: accountForm.researchInterests,
        role: "STUDENT",
        initialTopic: activeTopic,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete writer registration");
      }

      // Automatically sign in the user
      await signIn("credentials", {
        email: accountForm.email,
        password: accountForm.password,
        redirect: false,
      });

      // Advance to success launch screen
      setStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred during registration";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour max-w-4xl space-y-8">
        {/* Navigation Breadcrumb / Step Indicator */}
        <div className="flex items-center justify-between border-b border-navy/10 pb-4">
          <Link
            href="/join"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/70 hover:text-navy transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Join Portal
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-sapphire">
            <span className="h-2 w-2 rounded-full bg-sapphire animate-pulse"></span>
            Student Research Writer Track
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/60 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-sapphire">
            <GraduationCap className="h-3.5 w-3.5" /> Researcher Application & Onboarding
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-navy">
            Become a Student Research Writer
          </h1>
          <p className="text-sm text-navy/70 leading-relaxed">
            Apply to join TOUR’s global cohort of young scientists. Choose an inquiry or bring your own idea, write in our dedicated Research Notebook, and publish peer-reviewed papers with verified volunteer hours.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
          {[
            { num: 1, label: "1. Account & Profile" },
            { num: 2, label: "2. Choose Topic" },
            { num: 3, label: "3. Ethics & Pledge" },
            { num: 4, label: "4. Launch Workspace" },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center justify-center p-3 rounded-2xl border text-center transition ${
                step === s.num
                  ? "border-navy bg-navy text-ivory shadow-sm font-bold"
                  : step > s.num
                  ? "border-emerald-600/30 bg-emerald-50 text-emerald-800"
                  : "border-navy/10 bg-white/60 text-navy/50"
              }`}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-800 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage("")} className="text-red-500 hover:text-red-900">
              ✕
            </button>
          </div>
        )}

        {/* Wizard Main Card */}
        <div className="rounded-3xl border border-navy/10 bg-white p-8 md:p-10 shadow-card space-y-8">
          {/* ═══════════════════════════════════════════════════════════════
              STEP 1: ACCOUNT CREATION & ACADEMIC PROFILE
             ═══════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-heading text-2xl font-bold text-navy">
                  Step 1: Your Academic Researcher Profile
                </h3>
                <p className="text-xs text-navy/60">
                  Create your TOUR account. This profile will be attached to your published papers and verified volunteer hour certificates.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    placeholder="e.g. maya@school.edu"
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    Password (min 6 characters) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={accountForm.password}
                    onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                    School / University / Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={accountForm.school}
                    onChange={(e) => setAccountForm({ ...accountForm, school: e.target.value })}
                    placeholder="e.g. Oakridge High School"
                    className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                  Grade Level / Academic Stage
                </label>
                <select
                  value={accountForm.gradeLevel}
                  onChange={(e) => setAccountForm({ ...accountForm, gradeLevel: e.target.value })}
                  className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                >
                  <option>Middle School (Grades 6-8)</option>
                  <option>High School (Grades 9-12)</option>
                  <option>Undergraduate Student</option>
                  <option>Independent Youth Scholar</option>
                </select>
              </div>

              {/* Research Interests Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                  Select Your Research Interests (Pick at least 1)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => {
                    const isSelected = accountForm.researchInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleInterest(interest)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-sapphire text-ivory shadow-sm"
                            : "border border-navy/15 bg-ivory/40 text-navy hover:bg-champagne/60"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                  Short Academic Bio / What motivates you to write research?
                </label>
                <textarea
                  rows={3}
                  value={accountForm.bio}
                  onChange={(e) => setAccountForm({ ...accountForm, bio: e.target.value })}
                  placeholder="e.g. I am passionate about environmental ecology and love using data to understand how urban rivers recover from microplastic pollution..."
                  className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4 border-t border-navy/10">
                <Button
                  type="button"
                  disabled={!accountForm.name || !accountForm.email || accountForm.password.length < 6}
                  onClick={() => setStep(2)}
                  className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs font-bold px-8 py-3 flex items-center gap-2"
                >
                  Continue to Topic Selection <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              STEP 2: RESEARCH TOPIC SELECTION / PROPOSAL
             ═══════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-heading text-2xl font-bold text-navy">
                    Step 2: Choose Your Research Paper Topic
                  </h3>
                  <p className="text-xs text-navy/60">
                    Select one of our curated high-impact research questions or propose your own original inquiry.
                  </p>
                </div>

                {/* Toggle Mode */}
                <div className="flex rounded-full border border-navy/15 bg-ivory p-1 text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setTopicMode("curated")}
                    className={`rounded-full px-4 py-1.5 transition ${
                      topicMode === "curated" ? "bg-navy text-ivory shadow-sm" : "text-navy/70 hover:text-navy"
                    }`}
                  >
                    Curated Topics
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopicMode("custom")}
                    className={`rounded-full px-4 py-1.5 transition ${
                      topicMode === "custom" ? "bg-navy text-ivory shadow-sm" : "text-navy/70 hover:text-navy"
                    }`}
                  >
                    Custom Proposal
                  </button>
                </div>
              </div>

              {/* CURATED TOPICS MODE */}
              {topicMode === "curated" && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-sapphire uppercase tracking-wider">
                    Recommended Questions & Guided Research Projects
                  </p>

                  <div className="grid gap-4">
                    {curatedTopics.map((topic) => {
                      const isSelected = selectedCuratedId === topic.id;
                      return (
                        <div
                          key={topic.id}
                          onClick={() => setSelectedCuratedId(topic.id)}
                          className={`rounded-3xl border p-6 cursor-pointer transition space-y-3 ${
                            isSelected
                              ? "border-sapphire bg-sapphire/5 ring-2 ring-sapphire/30 shadow-soft"
                              : "border-navy/10 bg-white hover:bg-ivory/40 hover:border-navy/20"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-sapphire/10 border border-sapphire/20 px-3 py-0.5 text-[11px] font-bold text-sapphire">
                                {topic.category}
                              </span>
                              <span className="rounded-full bg-champagne text-navy px-2.5 py-0.5 text-[10px] font-bold">
                                {topic.badge}
                              </span>
                            </div>
                            <div
                              className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                isSelected ? "border-sapphire bg-sapphire text-ivory" : "border-navy/20"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                          </div>

                          <h4 className="font-heading text-lg font-bold text-navy">{topic.title}</h4>
                          <p className="text-xs text-navy/80 leading-relaxed font-medium">
                            <strong className="text-navy">Research Question:</strong> “{topic.prompt}”
                          </p>

                          <div className="rounded-2xl bg-ivory/60 p-3 space-y-1 text-xs text-navy/70 border border-navy/5">
                            <p>
                              <strong className="text-navy">Suggested Hypothesis:</strong> {topic.hypothesis}
                            </p>
                            <p>
                              <strong className="text-navy">Suggested Methods:</strong> {topic.methodology}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CUSTOM TOPIC MODE */}
              {topicMode === "custom" && (
                <div className="space-y-4 rounded-3xl border border-navy/10 bg-ivory/40 p-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-sapphire uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4" /> Propose Your Own Scientific Investigation
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                      Working Paper Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customTopic.title}
                      onChange={(e) => setCustomTopic({ ...customTopic, title: e.target.value })}
                      placeholder="e.g. Impact of Urban Green Canopies on Local Microclimates"
                      className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                      Academic Category
                    </label>
                    <select
                      value={customTopic.category}
                      onChange={(e) => setCustomTopic({ ...customTopic, category: e.target.value })}
                      className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    >
                      <option>Environmental Science</option>
                      <option>Computer Science & AI</option>
                      <option>Psychology & Cognitive Science</option>
                      <option>Biotechnology & Medicine</option>
                      <option>Physics & Renewable Energy</option>
                      <option>Biology & Marine Life</option>
                      <option>Social & Economic Sciences</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                      Core Research Question / Goal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={customTopic.researchGoal}
                      onChange={(e) => setCustomTopic({ ...customTopic, researchGoal: e.target.value })}
                      placeholder="What specific inquiry or problem will your paper address?"
                      className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/80">
                      Initial Hypothesis (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={customTopic.hypothesis}
                      onChange={(e) => setCustomTopic({ ...customTopic, hypothesis: e.target.value })}
                      placeholder="What is your testable hypothesis or anticipated finding?"
                      className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex justify-between pt-4 border-t border-navy/10">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={topicMode === "custom" && (!customTopic.title || !customTopic.researchGoal)}
                  className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs font-bold px-8 py-3 flex items-center gap-2"
                >
                  Proceed to Ethics & Pledge <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              STEP 3: ETHICS & RESEARCHER COMMITMENT
             ═══════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-heading text-2xl font-bold text-navy">
                  Step 3: Student Researcher Code of Ethics & Pledge
                </h3>
                <p className="text-xs text-navy/60">
                  TOUR upholds rigorous standards of youth scientific integrity and transparency.
                </p>
              </div>

              <div className="rounded-2xl border border-sapphire/20 bg-champagne/30 p-6 space-y-4 text-xs text-navy/85 leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-sapphire text-sm">
                  <ShieldCheck className="h-5 w-5" /> The TOUR Academic Pledge
                </div>
                <p>
                  As a registered Student Research Writer on TOUR, you agree to formulate hypotheses in good faith, cite all references accurately, conduct authentic experiments/simulations, and respect peer reviewer feedback.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 rounded-2xl border border-navy/10 p-4 cursor-pointer hover:bg-ivory/50 transition">
                  <input
                    type="checkbox"
                    checked={commitments.originalWork}
                    onChange={(e) => setCommitments({ ...commitments, originalWork: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-navy/20 text-sapphire focus:ring-sapphire"
                  />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-navy">Original Authorship & Non-Plagiarism</p>
                    <p className="text-navy/65">
                      I certify that all submissions will be my own authentic intellectual work and that external sources will be cited in standard academic format (APA/MLA/IEEE).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-navy/10 p-4 cursor-pointer hover:bg-ivory/50 transition">
                  <input
                    type="checkbox"
                    checked={commitments.aiEthics}
                    onChange={(e) => setCommitments({ ...commitments, aiEthics: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-navy/20 text-sapphire focus:ring-sapphire"
                  />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-navy">Ethical AI Usage Policy</p>
                    <p className="text-navy/65">
                      I understand AI tools on TOUR are permitted solely for grammar suggestions, literature search, and hypothesis brainstorming—not for automated manuscript generation.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-navy/10 p-4 cursor-pointer hover:bg-ivory/50 transition">
                  <input
                    type="checkbox"
                    checked={commitments.peerReviewPolicy}
                    onChange={(e) => setCommitments({ ...commitments, peerReviewPolicy: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-navy/20 text-sapphire focus:ring-sapphire"
                  />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-navy">Double-Blind Peer Review Participation</p>
                    <p className="text-navy/65">
                      I agree to submit my paper to the TOUR editorial board and constructively revise drafts in accordance with reviewer comments prior to final publication.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-navy/10 p-4 cursor-pointer hover:bg-ivory/50 transition">
                  <input
                    type="checkbox"
                    checked={commitments.volunteerTrack}
                    onChange={(e) => setCommitments({ ...commitments, volunteerTrack: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-navy/20 text-sapphire focus:ring-sapphire"
                  />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-navy">Verified Volunteer Hours Tracking</p>
                    <p className="text-navy/65">
                      Enroll me in the Verified Community Service Hours program to log research and writing hours for official graduation, NHS, or university certificates.
                    </p>
                  </div>
                </label>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between pt-4 border-t border-navy/10">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(2)}
                  className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
                <Button
                  type="button"
                  disabled={!commitments.originalWork || !commitments.aiEthics || !commitments.peerReviewPolicy || isSubmitting}
                  onClick={handleSubmitApplication}
                  className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-ivory text-xs font-bold px-8 py-3 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    "Creating Account & Workspace..."
                  ) : (
                    <>
                      Complete Application & Open Notebook <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              STEP 4: APPLICATION SUCCESS & LAUNCH
             ═══════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="text-center py-6 space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-soft animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="font-heading text-2xl font-semibold text-navy">
                  Welcome to TOUR, {accountForm.name}!
                </h2>
                <p className="text-xs text-navy/70 leading-relaxed">
                  Your Student Research Writer account is active and your first research project has been initialized in your private Notebook workspace.
                </p>
              </div>

              <div className="rounded-3xl border border-navy/10 bg-ivory/50 p-6 text-left max-w-lg mx-auto space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-sapphire uppercase">Initialized Project</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-bold text-[10px]">
                    Workspace Ready
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-navy">
                  {getSelectedTopicData().title}
                </h4>
                <p className="text-xs text-navy/70 line-clamp-2">
                  {getSelectedTopicData().researchGoal}
                </p>
                <div className="flex gap-4 pt-2 text-[11px] text-navy/60 border-t border-navy/10">
                  <span>Author: {accountForm.name}</span>
                  <span>School: {accountForm.school}</span>
                  <span>Category: {getSelectedTopicData().category}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link href="/workspace/notebook">
                  <Button className="w-full sm:w-auto rounded-full bg-navy hover:bg-sapphire text-ivory text-xs font-bold px-8 py-3.5 flex items-center gap-2">
                    <PenTool className="h-4 w-4" /> Open Research Notebook Editor
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs font-bold px-8 py-3.5 flex items-center gap-2"
                  >
                    <Layers className="h-4 w-4" /> Go to Writer Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
