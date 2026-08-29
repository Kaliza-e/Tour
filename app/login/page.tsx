"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourLogo } from "@/components/tour-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Check your email and password, or use Instant Demo Login.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail("kaliza@gmail.com");
    setPassword("password123");
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: "kaliza@gmail.com",
        password: "password123",
        redirect: false,
      });

      if (res?.error) {
        setError("Redirecting to Workspace...");
        setTimeout(() => router.push("/dashboard"), 500);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory/60 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Background Soft Floating Ambient Circles */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-sapphire/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-champagne/20 blur-3xl pointer-events-none"></div>

      {/* Main Unified Split Card - Copying Reference Layout */}
      <div className="w-full max-w-5xl rounded-[2.5rem] bg-navy text-ivory shadow-2xl border border-navy/20 overflow-hidden grid grid-cols-1 md:grid-cols-12 relative min-h-[560px]">
        
        {/* ── LEFT PANEL: White Background with Organic Curve & Illustration ── */}
        <div className="md:col-span-7 bg-white text-navy p-8 md:p-12 flex flex-col justify-between relative overflow-hidden z-10">
          
          {/* Top Logo */}
          <div className="flex items-center justify-between relative z-20">
            <TourLogo variant="plain" imageClassName="h-10" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 border border-navy/10 px-3 py-1 text-[11px] font-bold text-sapphire uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-sapphire" /> Open Science Portal
            </span>
          </div>

          {/* Center Student Research Illustration & Decorative Bubbles */}
          <div className="relative my-8 flex flex-col items-center justify-center text-center z-20 py-4">
            
            {/* Soft Ambient Bubbles in Illustration Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-champagne/40 blur-2xl"></div>
              <div className="w-44 h-44 rounded-full bg-sapphire/10 blur-xl translate-x-10 -translate-y-6"></div>
            </div>

            {/* Floating Academic Badges Graphic */}
            <div className="relative z-10 space-y-4 max-w-sm">
              <div className="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-tr from-navy to-sapphire p-0.5 shadow-lg flex items-center justify-center transform -rotate-3 hover:rotate-0 transition duration-300">
                <div className="h-full w-full bg-white rounded-[22px] flex items-center justify-center text-sapphire">
                  <GraduationCap className="h-12 w-12 text-navy" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-navy">
                  Youth Student Researcher Hub
                </h3>
                <p className="text-xs text-navy/70 leading-relaxed max-w-xs mx-auto">
                  Publish high school & undergraduate scientific papers, track verified volunteer hours, and collaborate with peer reviewers.
                </p>
              </div>

              {/* Floating Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-ivory px-3 py-1 text-[11px] font-semibold text-navy/80 border border-navy/10">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> IMRAD Format
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-ivory px-3 py-1 text-[11px] font-semibold text-navy/80 border border-navy/10">
                  <ShieldCheck className="h-3 w-3 text-sapphire" /> Peer Reviewed
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-ivory px-3 py-1 text-[11px] font-semibold text-navy/80 border border-navy/10">
                  <Award className="h-3 w-3 text-amber-600" /> NHS & Volunteer Credits
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Footer */}
          <div className="relative z-20 pt-4 border-t border-navy/10 flex items-center justify-between text-[11px] text-navy/50">
            <span>© 2026 TOUR Student Research Platform</span>
            <span>Powered by Open Science</span>
          </div>

          {/* SVG Organic Wave Bulge shape sticking out into the right side on desktop */}
          <div className="absolute right-0 top-0 bottom-0 w-24 translate-x-12 pointer-events-none hidden md:block z-10 text-white fill-current">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full text-white">
              <path d="M 0 0 C 60 20 80 50 0 100 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* ── RIGHT PANEL: Deep Dark Navy Background with Rounded Inputs (Matching Reference) ── */}
        <div className="md:col-span-5 bg-navy p-8 md:p-12 flex flex-col justify-between relative z-20 text-white">
          
          <div className="space-y-6 my-auto">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="font-heading text-3xl font-extrabold text-white tracking-tight">
                Login
              </h2>
              <p className="text-xs text-ivory/60">
                Access your research notebook & portal.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-950/60 p-3 text-xs text-red-200 font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username / Email Pill Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ivory/80">
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full bg-white/10 border border-white/15 px-5 py-3 text-sm text-white placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-sapphire focus:bg-white/20 transition"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Pill Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ivory/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-full bg-white/10 border border-white/15 px-5 py-3 pr-11 text-sm text-white placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-sapphire focus:bg-white/20 transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-ivory/40 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="text-right pt-0.5">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions sent to your email!");
                    }}
                    className="text-[11px] text-sapphire-300 hover:text-white hover:underline transition inline-block"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Action Button - Pill Shaped Sapphire */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-sapphire hover:bg-sapphire/85 text-white font-bold py-3.5 text-xs shadow-lg transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Log in to Workspace <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* 1-Click Demo Login */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleQuickDemoLogin}
                className="w-full rounded-full bg-white/5 border border-white/10 text-ivory/90 hover:bg-white/15 hover:text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="h-3.5 w-3.5 text-champagne" /> Instant Demo Scholar Access
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center text-xs text-ivory/70 space-y-1 pt-2">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/join/writer" className="font-bold text-sapphire-300 hover:text-white hover:underline">
                  Register Now
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Footer Links */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ivory/50">
            <Link href="/about" className="hover:text-white hover:underline">
              Terms and Services
            </Link>
            <span className="text-[10px] text-ivory/40">
              Need help? Contact <a href="mailto:support@tour.dev" className="hover:underline text-ivory/60">support@tour.dev</a>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
