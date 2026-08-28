import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  school: z.string().optional(),
  gradeLevel: z.string().optional(),
  bio: z.string().optional(),
  researchInterests: z.array(z.string()).default([]),
  role: z.enum(["STUDENT", "MENTOR"]).default("STUDENT"),
  // Optional project creation during registration
  initialTopic: z
    .object({
      title: z.string().min(3),
      researchGoal: z.string().min(5),
      hypothesis: z.string().optional(),
      category: z.string().default("Environmental Science"),
      questionId: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  // Rate limiting: 5 requests per minute per IP
  const clientId = getClientIdentifier(request);
  const rl = rateLimit(clientId, { windowMs: 60 * 1000, maxRequests: 5 });
  
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rl.resetTime - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        }
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid registration data" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      school,
      gradeLevel,
      bio,
      researchInterests,
      role,
      initialTopic,
    } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Find or create category if initial topic provided
    let categoryRecord = null;
    if (initialTopic?.category) {
      categoryRecord = await prisma.category.findFirst({
        where: {
          OR: [
            { name: { equals: initialTopic.category, mode: "insensitive" } },
            { slug: { equals: initialTopic.category.toLowerCase().replace(/\s+/g, "-") } },
          ],
        },
      });

      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({
          data: {
            name: initialTopic.category,
            slug: initialTopic.category.toLowerCase().replace(/\s+/g, "-"),
            description: `${initialTopic.category} research category`,
          },
        });
      }
    }

    const createdUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashedPassword,
        role,
        school: school || "High School",
        gradeLevel: gradeLevel || "Student Researcher",
        bio: bio || "Passionate student researcher exploring scientific inquiries on TOUR.",
        researchInterests: researchInterests.length > 0 ? researchInterests : ["General Science"],
        skills: ["Literature Review", "Scientific Method", "Academic Writing"],
        notifications: {
          create: {
            message: "Welcome to TOUR! Your Student Research Writer account is activated.",
            link: "/workspace/notebook",
          },
        },
      },
    });

    let initialProject = null;
    if (initialTopic && categoryRecord && createdUser) {
      initialProject = await prisma.researchProject.create({
        data: {
          title: initialTopic.title,
          researchGoal: initialTopic.researchGoal,
          hypothesis: initialTopic.hypothesis || null,
          categoryId: categoryRecord.id,
          ownerId: createdUser.id,
          questionId: initialTopic.questionId || null,
          stage: "WORKSPACE",
          progress: 15,
          notes: {
            create: {
              content: `Initial Research Topic setup: ${initialTopic.title}\nGoal: ${initialTopic.researchGoal}\nHypothesis: ${initialTopic.hypothesis || "To be formulated"}`,
            },
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account registered successfully!",
        user: {
          id: createdUser.id,
          name,
          email: email.toLowerCase(),
          role,
        },
        projectId: initialProject?.id || null,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/auth/register error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
