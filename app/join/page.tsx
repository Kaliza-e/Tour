"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JoinPage() {
  const [role, setRole] = useState<"student" | "company">("student");

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-tour grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
        <aside className="hidden md:flex flex-col items-center justify-center rounded-card bg-navy p-12 text-center text-ivory">
          <div className="mb-6 h-20 w-20 rounded-full bg-navy/20 grid place-items-center">
            <div className="h-12 w-12 rounded-full bg-ivory grid place-items-center text-navy font-heading font-bold">T</div>
          </div>
          <h2 className="text-2xl font-heading font-bold">Join Tour</h2>
          <p className="mt-3 max-w-xs text-sm text-ivory/80">Connect with peers and turn curiosity into publishable research.</p>
        </aside>

        <main className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-card bg-white p-8 shadow-card">
            <Link href="/" className="text-sm text-navy/60 hover:underline">← Back to Home</Link>

            <h1 className="mt-4 font-heading text-3xl font-bold text-navy">Create your account</h1>
            <p className="mt-2 text-sm text-navy/60">Join the Tour community</p>

            <div className="mt-6 flex w-full gap-3 rounded-full bg-ivory/60 p-1">
              <button
                onClick={() => setRole("student")}
                className={`flex-1 rounded-full py-2 text-sm font-medium ${role === "student" ? "bg-white text-navy shadow-card" : "text-navy/70"}`}
              >
                Student
              </button>
              <button
                onClick={() => setRole("company")}
                className={`flex-1 rounded-full py-2 text-sm font-medium ${role === "company" ? "bg-white text-navy shadow-card" : "text-navy/70"}`}
              >
                Company
              </button>
            </div>

            <form className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold text-navy/60">Full name</label>
                <input className="mt-1.5 h-12 w-full rounded-2xl border border-navy/10 bg-ivory px-4 text-sm outline-none focus-visible:border-sapphire" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="text-xs font-semibold text-navy/60">Email</label>
                <input type="email" className="mt-1.5 h-12 w-full rounded-2xl border border-navy/10 bg-ivory px-4 text-sm outline-none focus-visible:border-sapphire" placeholder="Enter your email" />
              </div>

              {role === "student" && (
                <div>
                  <label className="text-xs font-semibold text-navy/60">Cohort year</label>
                  <select className="mt-1.5 h-12 w-full rounded-2xl border border-navy/10 bg-ivory px-4 text-sm outline-none focus-visible:border-sapphire">
                    <option>2024</option>
                    <option>2025</option>
                    <option>2026</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-navy/60">Password</label>
                <input type="password" className="mt-1.5 h-12 w-full rounded-2xl border border-navy/10 bg-ivory px-4 text-sm outline-none focus-visible:border-sapphire" placeholder="Create password" />
              </div>

              <Button size="lg" className="mt-2">{role === "student" ? "Create student account" : "Create company account"}</Button>
            </form>

            <p className="mt-6 text-center text-sm text-navy/55">Already have an account? <Link href="/login" className="font-semibold text-navy hover:text-sapphire">Log in</Link></p>
          </div>
        </main>
      </div>
    </div>
  );
}
