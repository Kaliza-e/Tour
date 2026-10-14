import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_TEAMS = [
  "Publishing & Editorial",
  "Research & Review",
  "Design & Visuals",
  "Content & Social Media",
  "Community & Outreach",
  "Technology & Web",
  "Chapters & Expansion",
  "Other",
] as const;

const VALID_LEVELS = [
  "Middle school",
  "High school",
  "Gap year",
  "Undergraduate",
  "Graduate",
] as const;

const VALID_HOURS = ["1-3", "3-5", "5-9", "9+"] as const;

const teamApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  country: z.string().trim().min(2, "Country is required"),
  age: z.coerce.number().int().min(10, "Age must be at least 10").max(120, "Please enter a valid age"),
  levelOfStudy: z.enum(VALID_LEVELS, {
    errorMap: () => ({ message: "Please select your level of study" }),
  }),
  teams: z
    .array(z.string())
    .min(1, "Please select at least one team")
    .max(2, "You can select up to two teams only")
    .refine(
      (selected) => selected.every((t) => VALID_TEAMS.includes(t as any)),
      "One or more selected teams are invalid"
    ),
  whyJoin: z.string().trim().min(15, "Please tell us why you want to join Tour (at least 15 characters)"),
  skills: z.string().trim().min(10, "Please share your skills or strengths (at least 10 characters)"),
  hoursPerWeek: z.enum(VALID_HOURS, {
    errorMap: () => ({ message: "Please select your expected weekly commitment" }),
  }),
  project: z
    .string()
    .trim()
    .min(20, "Please describe a project or initiative with your role (at least 20 characters)"),
  proudOfLink: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
      message: "Please enter a valid URL starting with http:// or https://",
    }),
  anythingElse: z.string().trim().optional(),
  // Honeypot field for bot protection
  website_hp: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Honeypot check - bot caught
    if (body.website_hp && body.website_hp.trim().length > 0) {
      // Return 200 silently to confuse spam bots
      return NextResponse.json({ success: true, message: "Application received." });
    }

    // 2. Validate input schema
    const parseResult = teamApplicationSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        {
          error: firstIssue?.message || "Invalid application data.",
          field: firstIssue?.path[0],
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. Spam / Rate Limit check: max 2 submissions per email within 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSubmissionsCount = await prisma.teamApplication.count({
      where: {
        email: data.email.toLowerCase(),
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentSubmissionsCount >= 2) {
      return NextResponse.json(
        {
          error: "You have submitted recently. Please wait before submitting another application or check your email.",
        },
        { status: 429 }
      );
    }

    // 4. Check for logged in user to associate application
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || null;

    // 5. Save to database
    const application = await prisma.teamApplication.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        country: data.country,
        age: data.age,
        levelOfStudy: data.levelOfStudy,
        teams: data.teams,
        whyJoin: data.whyJoin,
        skills: data.skills,
        hoursPerWeek: data.hoursPerWeek,
        project: data.project,
        proudOfLink: data.proudOfLink || null,
        anythingElse: data.anythingElse || null,
        userId: userId,
        status: "PENDING",
      },
    });

    // 6. In-app notification if user is logged in
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          title: "Team Application Received",
          message: `Your application to join Tour (${data.teams.join(", ")}) was submitted successfully. Our team will review it and follow up with you.`,
          link: "/join-team",
          type: "APPLICATION",
        },
      }).catch(() => null);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your application has been received! We will be in touch soon.",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Team application submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your application. Please try again." },
      { status: 500 }
    );
  }
}
