import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { buildSubmissionCode, createSubmissionStatusHistory, normalizeResearchType } from "@/lib/submission";
import { notifySubmissionAuthor } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  researchType: z.string().optional().default("RESEARCH_ARTICLE"),
  keywords: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  methodology: z.string().optional(),
  references: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
  isDraft: z.boolean().optional().default(false),
  isTermsAccepted: z.boolean().optional().default(true),
  fullName: z.string().optional(),
  email: z.string().optional(),
  institution: z.string().optional(),
  country: z.string().optional(),
  academicLevel: z.string().optional(),
  coAuthors: z.array(z.string()).optional().default([]),
});

const patchSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  title: z.string().optional(),
  abstract: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  methodology: z.string().optional(),
  references: z.string().optional(),
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  fileType: z.string().optional(),
  isSubmit: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;

    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        publication: true,
        authors: true,
        fileRecords: true,
        versions: { orderBy: { versionNumber: "desc" }, select: { id: true, versionNumber: true, fileName: true, createdAt: true } },
        assignedReviewer: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Failed to load submissions", error);
    return NextResponse.json({ error: "Unable to load submissions right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: "You must be logged in to create research." }, { status: 401 });
    }

    // Fetch user info for autofill
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, school: true, location: true },
    });

    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid submission data" }, { status: 400 });
    }

    const {
      title,
      abstract,
      category,
      researchType,
      keywords,
      description,
      methodology,
      references,
      fileUrl,
      fileName,
      fileType,
      isDraft,
      isTermsAccepted,
      coAuthors,
    } = parsed.data;

    const authorName = parsed.data.fullName || dbUser?.name || session?.user?.name || "Researcher";
    const authorEmail = parsed.data.email || dbUser?.email || session?.user?.email || "";
    const authorInstitution = parsed.data.institution || dbUser?.school || null;
    const authorCountry = parsed.data.country || dbUser?.location || null;

    const initialStatus = isDraft ? "DRAFT" : "SUBMITTED";

    const submission = await prisma.submission.create({
      data: {
        submissionId: buildSubmissionCode(),
        userId,
        title,
        abstract: abstract || title,
        category,
        researchType: normalizeResearchType(researchType),
        keywords: keywords || [],
        description: description || null,
        methodology: methodology || null,
        references: references || null,
        supportingLinks: [],
        authorBio: null,
        institution: authorInstitution,
        country: authorCountry,
        academicLevel: parsed.data.academicLevel || null,
        coAuthors: coAuthors || [],
        email: authorEmail,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        status: initialStatus,
        isTermsAccepted: isTermsAccepted ?? true,
        submittedAt: isDraft ? null : new Date(),
        authors: {
          create: {
            fullName: authorName,
            email: authorEmail,
            institution: authorInstitution,
            country: authorCountry,
            userId,
          },
        },
        ...(fileUrl
          ? {
              fileRecords: {
                create: {
                  filename: fileUrl.split("/").pop() || "submission-file",
                  originalName: fileName || "submission-file",
                  mimeType: fileType || "application/octet-stream",
                  size: 0,
                  url: fileUrl,
                },
              },
            }
          : {}),
      },
      include: {
        authors: true,
        reviews: { orderBy: { createdAt: "desc" } },
      },
    });

    await prisma.submissionVersion.create({
      data: {
        submissionId: submission.id,
        versionNumber: 1,
        title: submission.title,
        abstract: submission.abstract,
        description: submission.description,
        methodology: submission.methodology,
        references: submission.references,
        fileUrl: submission.fileUrl,
        fileName: submission.fileName,
        fileType: submission.fileType,
        createdById: userId,
      },
    });

    await createSubmissionStatusHistory(
      submission.id,
      null,
      submission.status,
      userId,
      isDraft ? "Research draft saved." : "Research submitted for review."
    );

    if (!isDraft) {
      await notifySubmissionAuthor(userId, "RECEIVED");
    }

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("Failed to create submission", error);
    return NextResponse.json({ error: "Unable to save your research right now." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid update data." }, { status: 400 });
    }

    const current = await prisma.submission.findFirst({
      where: { id: parsed.data.submissionId, userId },
      select: { id: true, status: true, title: true, abstract: true, category: true, fileUrl: true, fileName: true, fileType: true },
    });
    if (!current) return NextResponse.json({ error: "Research record not found." }, { status: 404 });

    const { isSubmit, title, abstract, category, description, methodology, references, fileUrl, fileName, fileType } = parsed.data;

    let nextStatus = current.status;
    if (isSubmit) {
      if (current.status === "REVISION_REQUESTED") {
        nextStatus = "RESUBMITTED";
      } else {
        nextStatus = "SUBMITTED";
      }
    }

    const updatedSubmission = await prisma.$transaction(async (tx) => {
      const updated = await tx.submission.update({
        where: { id: current.id },
        data: {
          title: title ?? current.title,
          abstract: abstract ?? current.abstract,
          category: category ?? current.category,
          description: description !== undefined ? description : undefined,
          methodology: methodology !== undefined ? methodology : undefined,
          references: references !== undefined ? references : undefined,
          fileUrl: fileUrl !== undefined ? fileUrl : current.fileUrl,
          fileName: fileName !== undefined ? fileName : current.fileName,
          fileType: fileType !== undefined ? fileType : current.fileType,
          status: nextStatus,
          submittedAt: isSubmit ? new Date() : undefined,
        },
        include: { reviews: { orderBy: { createdAt: "desc" } }, authors: true, publication: true },
      });

      if (isSubmit) {
        const latestVersion = await tx.submissionVersion.aggregate({
          where: { submissionId: current.id },
          _max: { versionNumber: true },
        });
        await tx.submissionVersion.create({
          data: {
            submissionId: current.id,
            versionNumber: (latestVersion._max.versionNumber || 0) + 1,
            title: updated.title,
            abstract: updated.abstract,
            description: updated.description,
            methodology: updated.methodology,
            references: updated.references,
            fileUrl: updated.fileUrl,
            fileName: updated.fileName,
            fileType: updated.fileType,
            createdById: userId,
          },
        });

        await tx.submissionStatusHistory.create({
          data: {
            submissionId: current.id,
            previousStatus: current.status,
            newStatus: nextStatus,
            changedBy: userId,
            note: "Author submitted research for review.",
          },
        });
      }

      return updated;
    }, { maxWait: 15000, timeout: 30000 });

    if (isSubmit) {
      await notifySubmissionAuthor(userId, "RECEIVED");
    }

    return NextResponse.json({ success: true, submission: updatedSubmission });
  } catch (error) {
    console.error("Failed to update submission", error);
    return NextResponse.json({ error: "Unable to update research right now." }, { status: 500 });
  }
}
