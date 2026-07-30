"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-tour grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
        <aside className="hidden md:flex flex-col items-center justify-center rounded-card bg-navy p-12 text-center text-ivory">
          <div className="mb-6 h-20 w-20 rounded-full bg-navy/20 grid place-items-center">
            <div className="h-12 w-12 rounded-full bg-ivory grid place-items-center text-navy font-heading font-bold">T</div>
          </div>
          <h2 className="text-2xl font-heading font-bold">Welcome back</h2>
          <p className="mt-3 max-w-xs text-sm text-ivory/80">Log in to continue your research.</p>
        </aside>

        <main className="flex items-center justify-center">
          <div className="w-full max-w-sm rounded-card bg-white p-8 shadow-card">
            <h1 className="font-heading text-2xl font-bold text-navy">Welcome back</h1>
            <p className="mt-2 text-sm text-navy/55">Log in to continue your research.</p>

            <form className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold text-navy/60">Email</label>
                <input
                  type="email"
                  className="mt-1.5 h-12 w-full rounded-2xl border border-navy/10 bg-ivory px-4 text-sm outline-none focus-visible:border-sapphire"
                  placeholder="you@school.edu"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-navy/60">Password</label>
                <input
                  type="password"
                  className="mt-1.5 h-12 w-full rounded-2xl border border-navy/10 bg-ivory px-4 text-sm outline-none focus-visible:border-sapphire"
                  placeholder="••••••••"
                />
              </div>
              <Button className="w-full" size="lg" type="submit">Log in</Button>
            </form>

            <p className="mt-6 text-center text-sm text-navy/55">
              New to Tour? {" "}
              <Link href="/join" className="font-semibold text-navy hover:text-sapphire">
                Join Tour
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
