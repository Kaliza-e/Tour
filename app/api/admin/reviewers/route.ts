import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    const user = session?.user as { role?: string } | undefined;
    if (user?.role !== "ADMIN") return NextResponse.json({ error: "Admin access required." }, { status: 403 });

    const reviewers = await prisma.user.findMany({
        where: { role: "REVIEWER" },
        select: { id: true, name: true, email: true },
        orderBy: { name: "asc" },
    });
    return NextResponse.json(reviewers);
}
