import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await prisma.notificationPreference.findMany({
      where: { userId: session.user.id },
    }).catch(() => []);

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("GET /api/notifications/preferences error:", error);
    return NextResponse.json({ preferences: [] });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { type, enabled } = body;

    if (!type || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const preference = await prisma.notificationPreference.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type,
        },
      },
      update: { enabled },
      create: {
        userId: session.user.id,
        type,
        enabled,
      },
    });

    return NextResponse.json({ preference });
  } catch (error) {
    console.error("PUT /api/notifications/preferences error:", error);
    return NextResponse.json({ error: "Failed to update notification preferences" }, { status: 500 });
  }
}
