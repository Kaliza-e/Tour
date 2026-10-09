import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionId = params.id;
    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const { reason } = body;

    if (!reason || typeof reason !== "string") {
      return NextResponse.json({ error: "Reason is required." }, { status: 400 });
    }

    await prisma.questionReport.create({
      data: {
        questionId,
        reporterId: userId,
        reason: reason.trim(),
      },
    });

    return NextResponse.json({ success: true, message: "Report submitted to moderators." });
  } catch (error) {
    console.error("POST /api/questions/:id/report error:", error);
    return NextResponse.json({ error: "Failed to report question" }, { status: 500 });
  }
}
