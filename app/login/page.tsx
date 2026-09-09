"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, FlaskConical, Loader2, Lock, Mail } from "lucide-react";

import { TourLogo } from "@/components/tour-logo";

// ---------------------------------------------------------------------------
// Role → destination (mirrors lib/auth.ts roleHome — kept client-side so
// the page can redirect immediately after signIn resolves).
// ---------------------------------------------------------------------------

function roleHome(role: string | undefined | null): string {
  if (role === "ADMIN" || role === "REVIEWER") return "/admin/submissions";
  return "/researcher"; // STUDENT, MENTOR, unknown
}

// ---------------------------------------------------------------------------
// Inner form — needs useSearchParams so wrapped in Suspense by parent
// ---------------------------------------------------------------------------

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Show a success banner if the user just registered but auto-login failed
  const justRegistered = searchParams.get("registered") === "1";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("The email or password is incorrect. Please try again.");
      setSubmitting(false);
      return;
    }

    // Determine destination:
    // 1. callbackUrl set by middleware (user tried to access a protected page)
    // 2. Role-based home — fetch session to get role
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.startsWith("/")) {
      router.push(callbackUrl);
      router.refresh();
      return;
    }

    // Fetch the new session to read role
    const sessionRes = await fetch("/api/auth/session");
    const session = (await sessionRes.json()) as {
      user?: { role?: string };
    } | null;
    const destination = roleHome(session?.user?.role);
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-0 py-0 sm:px-6 sm:py-6">

      {/* ══════════════════════════════════════════════
          LEFT — brand panel (hidden on mobile)
      ══════════════════════════════════════════════ */}
      <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-none bg-white shadow-none sm:min-h-[calc(100vh-3rem)] lg:flex-row lg:rounded-[2rem] lg:shadow-[0_24px_70px_rgba(20,35,70,0.16)]">
      <div className="relative hidden flex-col justify-between bg-navy px-12 py-14 lg:flex lg:w-[42%] xl:w-[38%]">

        {/* Logo */}
        <TourLogo
          priority
          imageClassName="h-11 w-auto"
          className="relative z-10"
        />

        {/* Hero copy */}
        <div className="relative z-10 flex-1 pt-24">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            Welcome back
          </p>
          <h1 className="mt-4 max-w-md font-heading text-4xl font-bold leading-tight text-white xl:text-5xl">
            Welcome back.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/65">
            Sign in to manage your research, submissions, and reviewer feedback.
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-white/30">
          © {new Date().getFullYear()} TOUR — The Open Undergraduate Research platform
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT — form panel
      ══════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-5 py-12 sm:px-8 md:px-12 lg:overflow-y-auto lg:px-14 xl:px-20">

        {/* Mobile logo */}
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
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          {/* Heading */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
              TOUR account
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
              Sign in
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/60">
              Don&apos;t have an account?{" "}
              <Link
                href="/join"
                className="font-semibold text-sapphire underline-offset-2 hover:underline"
              >
                Join TOUR for free
              </Link>
            </p>
          </div>

          {/* Form card */}
          <div className="mt-8 border-t border-navy/10 pt-7">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}
              <label className="block text-sm font-semibold text-navy">
                Email address
                <div className="relative mt-2">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-navy/10 bg-ivory py-3 pl-10 pr-4 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block text-sm font-semibold text-navy">
                Password
                <div className="relative mt-2">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full rounded-xl border border-navy/10 bg-ivory py-3 pl-10 pr-11 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-navy/35 hover:text-navy/60"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>

              {/* Just-registered success banner */}
              {justRegistered && !error && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  <span className="mt-0.5 shrink-0">✓</span>
                  Account created! Sign in below to continue.
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <span className="mt-0.5 shrink-0">⚠</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3.5 text-sm font-semibold text-white transition hover:bg-sapphire disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in to TOUR"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-navy/10" />
              <span className="text-xs text-navy/35">or</span>
              <span className="h-px flex-1 bg-navy/10" />
            </div>

            {/* Alt CTA */}
            <div className="mt-5 text-center text-sm text-navy/55">
              New to TOUR?{" "}
              <Link
                href="/join"
                className="font-semibold text-sapphire underline-offset-2 hover:underline"
              >
                Create a free account
              </Link>
            </div>
          </div>

          {/* Roles hint */}
          <div className="mt-6 rounded-2xl border border-navy/8 bg-white/60 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-navy/55">
              <FlaskConical className="h-3.5 w-3.5 text-sapphire" />
              Where will you land after sign-in?
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-navy/50">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sapphire/60" />
                <strong className="text-navy/70">Student / Researcher</strong> → Research Dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <strong className="text-navy/70">Reviewer</strong> → Review Queue
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                <strong className="text-navy/70">Admin</strong> → Admin Panel
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export — Suspense required because LoginForm uses useSearchParams
// ---------------------------------------------------------------------------

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ivory">
          <Loader2 className="h-8 w-8 animate-spin text-sapphire/50" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
