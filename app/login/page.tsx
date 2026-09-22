"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FlaticonArrowLeft, 
  FlaticonEye, 
  FlaticonFlask, 
  FlaticonMail, 
  FlaticonShieldCheck 
} from "@/components/flaticons";
import { TourLogo } from "@/components/tour-logo";

function roleHome(role: string | undefined | null): string {
  if (role === "ADMIN" || role === "REVIEWER") return "/admin/submissions";
  return "/researcher";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.startsWith("/")) {
      router.push(callbackUrl);
      router.refresh();
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = (await sessionRes.json()) as {
      user?: { role?: string };
    } | null;
    const destination = roleHome(session?.user?.role);
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-0 py-0 sm:px-6 sm:py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-none border-2 border-navy/15 bg-white sm:min-h-[calc(100vh-3rem)] lg:flex-row lg:rounded-3xl"
      >
        {/* LEFT — brand image panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-navy px-12 py-14 lg:flex lg:w-[45%] xl:w-[40%]">
          <Image
            src="/hero-students.jpg"
            alt="Students doing research"
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
              Welcome back
            </p>
            <h1 className="mt-4 max-w-md font-heading text-4xl font-bold leading-tight text-white xl:text-5xl">
              Welcome back to TOUR.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/80">
              Sign in to manage your research, submissions, notes, and reviewer feedback.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/50">
            © {new Date().getFullYear()} TOUR — The Open Undergraduate Research platform
          </p>
        </div>


        {/* RIGHT — form panel */}
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
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Sign in
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">
                Don&apos;t have an account?{" "}
                <Link
                  href="/join"
                  className="font-semibold text-sapphire underline-offset-2 hover:underline"
                >
                  Create a free account
                </Link>
              </p>
            </div>

            <div className="mt-8 border-t border-navy/10 pt-7">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <label className="block text-sm font-semibold text-navy">
                  Email address
                  <div className="relative mt-2">
                    <FlaticonMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-navy/15 bg-ivory py-3.5 pl-10 pr-4 text-sm font-normal outline-none transition focus:border-sapphire focus:bg-white"
                    />
                  </div>
                </label>

                <label className="block text-sm font-semibold text-navy">
                  Password
                  <div className="relative mt-2">
                    <FlaticonShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
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
                </label>

                {justRegistered && !error && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                  >
                    <span className="mt-0.5 shrink-0">✓</span>
                    Account created! Sign in below to continue.
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  >
                    <span className="mt-0.5 shrink-0">⚠</span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-navy py-3.5 text-sm font-semibold text-white transition hover:bg-sapphire disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Signing in…" : "Sign in to TOUR"}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-navy/10" />
                <span className="text-xs text-navy/35">or</span>
                <span className="h-px flex-1 bg-navy/10" />
              </div>

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
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ivory">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sapphire border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

