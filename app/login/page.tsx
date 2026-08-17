"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { TourLogo } from "@/components/tour-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-tour grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
        <aside className="hidden md:flex flex-col items-center justify-center rounded-3xl bg-navy p-12 text-center text-ivory shadow-card">
          <TourLogo variant="panel" imageClassName="h-12" className="mb-6" />
          <h2 className="text-2xl font-heading font-bold">Welcome back, Scholar</h2>
          <p className="mt-3 max-w-xs text-xs text-ivory/80 leading-relaxed">
            Log in to continue writing your research paper, tracking volunteer hours, and reviewing student submissions.
          </p>
        </aside>

        <main className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10 shadow-card space-y-6">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-bold text-navy">Scholar Login</h1>
              <p className="text-xs text-navy/55">Access your research notebook & dashboard.</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-12 w-full rounded-2xl border border-navy/15 bg-ivory/50 px-4 text-sm outline-none focus:ring-2 focus:ring-sapphire focus:bg-white"
                  placeholder="you@school.edu"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 h-12 w-full rounded-2xl border border-navy/15 bg-ivory/50 px-4 text-sm outline-none focus:ring-2 focus:ring-sapphire focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
              <Button className="w-full rounded-full bg-navy hover:bg-sapphire text-ivory font-bold py-3 text-xs" size="lg" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Log in to Workspace"}
              </Button>
            </form>

            <div className="pt-4 border-t border-navy/10 text-center space-y-2 text-xs text-navy/65">
              <p>
                New Student Research Writer?{" "}
                <Link href="/join/writer" className="font-bold text-sapphire hover:underline">
                  Apply & Start Writing →
                </Link>
              </p>
              <p>
                Want to explore the platform first?{" "}
                <Link href="/dashboard" className="font-medium text-navy/60 hover:underline">
                  Open Demo Dashboard
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
