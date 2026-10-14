import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string })?.role;

    if (!session || (role !== "ADMIN" && role !== "REVIEWER")) {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const questionId = params.id;
    const body = await req.json().catch(() => ({}));
    const { action, reason } = body;

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { error: "Invalid action. Must be APPROVE or REJECT." },
        { status: 400 }
      );
    }

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        moderationStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
        moderationReason: reason || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Question successfully ${action === "APPROVE" ? "approved" : "rejected"}.`,
      question,
    });
  } catch (error) {
    console.error("POST /api/admin/questions/:id/moderate error:", error);
    return NextResponse.json(
      { error: "Failed to update moderation status." },
      { status: 500 }
    );
  }
}
