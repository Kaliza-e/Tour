"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FlaticonArrowLeft,
  FlaticonBook,
  FlaticonChevronDown,
  FlaticonEye,
  FlaticonFlask,
  FlaticonGraduation,
  FlaticonMail,
  FlaticonShieldCheck,
  FlaticonUser,
} from "@/components/flaticons";
import { TourLogo } from "@/components/tour-logo";

function roleHome(role: string): string {
  if (role === "ADMIN" || role === "REVIEWER") return "/admin/submissions";
  return "/researcher";
}

const ROLE_OPTIONS = [
  {
    value: "STUDENT",
    icon: <FlaticonFlask size={20} />,
    title: "Student Researcher",
    desc: "I want to conduct research, write papers, and get published on TOUR.",
    color: "border-sapphire/40 bg-sapphire/5 text-sapphire",
    selectedColor: "border-sapphire bg-sapphire text-white",
  },
  {
    value: "MENTOR",
    icon: <FlaticonBook size={20} />,
    title: "Mentor / Educator",
    desc: "I guide student researchers and support their academic development.",
    color: "border-violet-300 bg-violet-50/60 text-violet-700",
    selectedColor: "border-violet-600 bg-violet-600 text-white",
  },
] as const;

type Step = 1 | 2;

export default function JoinPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<"STUDENT" | "MENTOR">("STUDENT");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    gradeLevel: "",
    bio: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canProceed =
    form.name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.password.length >= 6;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canProceed) return;
    setSubmitting(true);
    setError("");

    try {
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          school: form.school.trim() || undefined,
          gradeLevel: form.gradeLevel.trim() || undefined,
          bio: form.bio.trim() || undefined,
          role,
          researchInterests: [],
        }),
      });

      const regData = (await regRes.json()) as { error?: string };
      if (!regRes.ok) {
        throw new Error(regData.error ?? "Unable to create your account.");
      }

      const signInResult = await signIn("credentials", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login?registered=1");
        return;
      }

      router.push(roleHome(role));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-0 py-0 sm:px-6 sm:py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-none border-2 border-navy/15 bg-white sm:min-h-[calc(100vh-3rem)] lg:flex-row lg:rounded-3xl"
      >
        <div className="flex flex-1 flex-col items-center justify-center bg-white px-5 py-12 sm:px-8 md:px-12 lg:overflow-y-auto lg:px-14 xl:px-20">
          <TourLogo
            priority
            imageClassName="h-10 w-auto"
            className="mb-8 lg:hidden"
          />

          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-navy/55 transition-colors hover:text-navy"
            >
              <FlaticonArrowLeft size={16} /> Back to home
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
                Registration
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-sapphire underline-offset-2 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2" aria-label={`Step ${step} of 2`}>
              {([1, 2] as Step[]).map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${s === step
                    ? "w-6 bg-sapphire"
                    : s < step
                      ? "w-4 bg-sapphire/40"
                      : "w-4 bg-navy/15"
                    }`}
                />
              ))}
              <span className="ml-1 text-xs text-navy/40">Step {step} of 2</span>
            </div>

            {step === 1 && (
              <form
                onSubmit={(e) => { e.preventDefault(); if (canProceed) setStep(2); }}
                noValidate
                className="mt-6 border-t border-navy/10 pt-6"
              >
                <fieldset>
                  <legend className="text-sm font-semibold text-navy">
                    I am joining as a…
                  </legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {ROLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition cursor-pointer ${role === opt.value ? opt.selectedColor : `${opt.color} hover:opacity-90`
                          }`}
                      >
                        <div className="flex items-center gap-2 font-semibold text-sm">
                          {opt.icon}
                          {opt.title}
                        </div>
                        <p className={`text-xs leading-relaxed ${role === opt.value ? "opacity-80" : "opacity-70"
                          }`}>
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 space-y-4">
                  <label className="block text-sm font-semibold text-navy">
                    Full name <span className="text-sapphire">*</span>
                    <div className="relative mt-2">
                      <FlaticonUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                      <input
                        required
                        minLength={2}
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        autoComplete="name"
                        placeholder="Jane Doe"
                        className="w-full rounded-2xl border border-navy/15 bg-ivory py-3.5 pl-10 pr-4 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-semibold text-navy">
                    Email address <span className="text-sapphire">*</span>
                    <div className="relative mt-2">
                      <FlaticonMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-navy/15 bg-ivory py-3.5 pl-10 pr-4 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-semibold text-navy">
                    Password <span className="text-sapphire">*</span>
                    <div className="relative mt-2">
                      <FlaticonShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                      <input
                        required
                        minLength={6}
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        className="w-full rounded-2xl border border-navy/15 bg-ivory py-3.5 pl-10 pr-11 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-navy/35 hover:text-navy/60 cursor-pointer"
                      >
                        <FlaticonEye size={16} />
                      </button>
                    </div>
                    {form.password.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${form.password.length >= 10
                              ? "bg-emerald-500"
                              : form.password.length >= 6
                                ? i < 2 ? "bg-amber-400" : "bg-navy/15"
                                : i < 1 ? "bg-amber-400" : "bg-navy/15"
                              }`}
                          />
                        ))}
                        <span className="text-[10px] text-navy/45">
                          {form.password.length >= 10
                            ? "Strong"
                            : form.password.length >= 6
                              ? "Good"
                              : "Weak"}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!canProceed}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy py-3.5 text-sm font-semibold text-white transition hover:bg-sapphire disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <span>Continue</span>
                  <FlaticonChevronDown size={16} className="-rotate-90" />
                </button>
              </form>
            )}

            {step === 2 && (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-6 border-t border-navy/10 pt-6"
              >
                <p className="text-sm text-navy/55">
                  Tell us a bit about yourself — this helps personalize your experience.
                  You can update these later.
                </p>

                <div className="mt-5 space-y-4">
                  <label className="block text-sm font-semibold text-navy">
                    School or institution
                    <div className="relative mt-2">
                      <FlaticonGraduation size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                      <input
                        value={form.school}
                        onChange={(e) => update("school", e.target.value)}
                        autoComplete="organization"
                        placeholder="e.g. Rwanda Coding Academy"
                        className="w-full rounded-2xl border border-navy/15 bg-ivory py-3.5 pl-10 pr-4 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-semibold text-navy">
                    Academic level
                    <div className="relative mt-2">
                      <FlaticonChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                      <select
                        value={form.gradeLevel}
                        onChange={(e) => update("gradeLevel", e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-navy/15 bg-ivory py-3.5 pl-4 pr-10 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                      >
                        <option value="">Select your level</option>
                        <option>Secondary school / High school</option>
                        <option>Undergraduate (Year 1–2)</option>
                        <option>Undergraduate (Year 3–4)</option>
                        <option>Postgraduate / Masters</option>
                        <option>PhD / Doctoral</option>
                        <option>Educator / Mentor</option>
                        <option>Independent researcher</option>
                      </select>
                    </div>
                  </label>

                  <label className="block text-sm font-semibold text-navy">
                    Short bio (optional)
                    <textarea
                      rows={3}
                      value={form.bio}
                      onChange={(e) => update("bio", e.target.value)}
                      placeholder="A sentence or two about your research interests…"
                      className="mt-2 w-full rounded-2xl border border-navy/15 bg-ivory px-4 py-3 text-sm font-normal leading-relaxed outline-none transition focus:border-sapphire focus:bg-white"
                    />
                  </label>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-navy/10 bg-ivory/60 px-4 py-3">
                  <FlaticonFlask size={16} className="mt-0.5 shrink-0 text-sapphire" />
                  <div>
                    <p className="text-xs font-semibold text-navy">
                      After joining, you&apos;ll be taken to your{" "}
                      {role === "MENTOR" ? "researcher" : "research"} dashboard
                    </p>
                    <p className="mt-0.5 text-xs text-navy/50">
                      You can start a new research project right away.
                    </p>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  >
                    <span className="mt-0.5 shrink-0">⚠</span>
                    {error}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); }}
                    className="flex-1 rounded-full border border-navy/15 py-3.5 text-sm font-semibold text-navy hover:bg-ivory cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-navy py-3.5 text-sm font-semibold text-white transition hover:bg-sapphire disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? "Creating account…" : "Create Account"}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-navy/40">
                  By joining you agree to TOUR&apos;s submission guidelines and
                  community standards.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT — brand image panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-navy px-12 py-14 lg:flex lg:w-[42%] xl:w-[38%]">
          <Image
            src="/about-mission.jpg"
            alt="Students collaborating on research"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/70 to-navy/40" />

          <TourLogo
            priority
            imageClassName="h-11 w-auto"
            className="relative z-10"
          />

          <div className="relative z-10 flex-1 pt-24">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-champagne">
              Start your journey
            </p>
            <h1 className="mt-4 max-w-md font-heading text-4xl font-bold leading-tight text-white xl:text-5xl">
              Start with a question.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/80">
              Create an account to plan research, submit your work, and receive feedback from expert mentors.
            </p>

            <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                After joining
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire/80 text-white">
                  <FlaticonFlask size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Research Dashboard
                  </p>
                  <p className="text-xs text-white/60">
                    Track projects · Tasks · Notes · References
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/50">
            © {new Date().getFullYear()} TOUR — The Open Undergraduate Research platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}

