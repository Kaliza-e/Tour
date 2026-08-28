import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const hourLogSchema = z.object({
  task: z.string().min(3),
  hours: z.number().min(0.25).max(100),
  date: z.string().optional(),
  category: z.string().default("Research & Writing"),
  notes: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({
    totalHours: 38.5,
    pendingHours: 4.0,
    approvedHours: 34.5,
    logs: [
      { id: "h1", task: "Literature Review on Microplastics in Gastropods", hours: 6.5, date: "2026-08-14", status: "VERIFIED", category: "Manuscript Writing" },
      { id: "h2", task: "Experimental Nile Red protocol design and testing", hours: 8.0, date: "2026-08-11", status: "VERIFIED", category: "Scientific Experimentation" },
      { id: "h3", task: "Peer Review on Computer Science Wildfire Paper", hours: 4.0, date: "2026-08-07", status: "VERIFIED", category: "Peer Review" },
      { id: "h4", task: "Writing Discussion & Limitations section", hours: 4.0, date: "2026-08-16", status: "PENDING", category: "Manuscript Writing" },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const parsed = hourLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid hour log data" }, { status: 400 });
    }

    const newLog = {
      id: "h-" + Date.now(),
      ...parsed.data,
      date: parsed.data.date || new Date().toISOString().split("T")[0],
      status: "PENDING",
      submittedBy: session?.user?.name || "Student Researcher",
    };

    return NextResponse.json(newLog, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
