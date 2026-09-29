"use client";

import { Suspense } from "react";
import ResearcherDashboardPage from "@/app/researcher/page";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-ivory text-sm text-navy/50">Loading dashboard…</div>}>
      <ResearcherDashboardPage />
    </Suspense>
  );
}
