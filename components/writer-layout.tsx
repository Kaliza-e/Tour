"use client";

import { WriterSidebar } from "@/components/writer-sidebar";

export function WriterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-ivory/30">
      <WriterSidebar />
      <div className="flex-1 overflow-y-auto min-w-0">{children}</div>
    </div>
  );
}
