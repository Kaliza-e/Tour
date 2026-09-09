import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const roleSchema = z.enum(["STUDENT", "MENTOR", "REVIEWER", "ADMIN"]);

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (user?.role !== "ADMIN") return null;
  return user;
}

// GET /api/admin/users — list all users with counts
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const roleValue = searchParams.get("role") ?? undefined;
  const role = roleValue ? roleSchema.safeParse(roleValue) : null;
  if (roleValue && !role?.success) {
    return NextResponse.json({ error: "Invalid role filter." }, { status: 400 });
  }
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const users = await prisma.user.findMany({
    where: {
      ...(role?.success ? { role: role.data } : {}),
      ...(query
        ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      school: true,
      createdAt: true,
      _count: {
        select: {
          submissions: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

// PATCH /api/admin/users — update a user's role
const updateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["STUDENT", "MENTOR", "REVIEWER", "ADMIN"]),
});

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 }
    );
  }

  // Prevent admins from removing their own admin role
  if (parsed.data.userId === admin.id && parsed.data.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You cannot change your own role." },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ success: true, user });
}

// DELETE /api/admin/users — remove a user account (admin only)
const deleteSchema = z.object({
  userId: z.string().min(1),
});

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const parsed = deleteSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "A valid user ID is required." }, { status: 400 });
    }

    if (parsed.data.userId === admin.id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: parsed.data.userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user", error);
    if (error instanceof Error && error.message.includes("ResearchProject_ownerId_fkey")) {
      return NextResponse.json(
        { error: "This user owns research projects and cannot be deleted until those projects are transferred or removed." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Unable to delete this user right now." }, { status: 500 });
  }
}
