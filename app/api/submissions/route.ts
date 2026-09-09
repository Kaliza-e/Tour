import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { buildSubmissionCode, createSubmissionStatusHistory, normalizeResearchType } from "@/lib/submission";
import { notifySubmissionAuthor } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const submissionSchema = z.object({
    title: z.string().min(3),
    abstract: z.string().min(20),
    category: z.string().min(2),
    researchType: z.string().min(1),
    keywords: z.array(z.string()).default([]),
    description: z.string().optional(),
    methodology: z.string().optional(),
    references: z.string().optional(),
    supportingLinks: z.array(z.string()).default([]),
    authorBio: z.string().optional(),
    institution: z.string().optional(),
    country: z.string().optional(),
    academicLevel: z.string().optional(),
    coAuthors: z.array(z.string()).default([]),
    email: z.string().email(),
    fullName: z.string().min(2),
    fileUrl: z.string().startsWith("/uploads/").optional(),
    fileName: z.string().optional(),
    fileType: z.string().optional(),
    isTermsAccepted: z.boolean().refine((value) => value === true, {
        message: "You must agree to the submission terms before submitting.",
    }),
});

const resubmissionSchema = z.object({
    submissionId: z.string().min(1),
    title: z.string().min(3),
    abstract: z.string().min(20),
    description: z.string().optional(),
    methodology: z.string().optional(),
    references: z.string().optional(),
    fileName: z.string().optional(),
    fileUrl: z.string().startsWith("/uploads/").optional(),
    fileType: z.string().optional(),
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
            include: { reviews: { orderBy: { createdAt: "desc" } }, publication: true, authors: true, fileRecords: true, versions: { orderBy: { versionNumber: "desc" }, select: { id: true, versionNumber: true, fileName: true, createdAt: true } }, assignedReviewer: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
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
            return NextResponse.json({ error: "You must be logged in to submit research." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = submissionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid submission data" }, { status: 400 });
        }

        const submission = await prisma.submission.create({
            data: {
                submissionId: buildSubmissionCode(),
                userId,
                title: parsed.data.title,
                abstract: parsed.data.abstract,
                category: parsed.data.category,
                researchType: normalizeResearchType(parsed.data.researchType),
                keywords: parsed.data.keywords,
                description: parsed.data.description || null,
                methodology: parsed.data.methodology || null,
                references: parsed.data.references || null,
                supportingLinks: parsed.data.supportingLinks || [],
                authorBio: parsed.data.authorBio || null,
                institution: parsed.data.institution || null,
                country: parsed.data.country || null,
                academicLevel: parsed.data.academicLevel || null,
                coAuthors: parsed.data.coAuthors || [],
                email: parsed.data.email,
                fileUrl: parsed.data.fileUrl || null,
                fileName: parsed.data.fileName || null,
                fileType: parsed.data.fileType || null,
                status: "SUBMITTED",
                isTermsAccepted: parsed.data.isTermsAccepted,
                submittedAt: new Date(),
                authors: {
                    create: {
                        fullName: parsed.data.fullName,
                        email: parsed.data.email,
                        institution: parsed.data.institution || null,
                        country: parsed.data.country || null,
                        academicLevel: parsed.data.academicLevel || null,
                        bio: parsed.data.authorBio || null,
                        userId,
                    },
                },
                ...(parsed.data.fileUrl
                    ? {
                        fileRecords: {
                            create: {
                                filename: parsed.data.fileUrl.split("/").pop() || "submission-file",
                                originalName: parsed.data.fileName || "submission-file",
                                mimeType: parsed.data.fileType || "application/octet-stream",
                                size: 0,
                                url: parsed.data.fileUrl,
                            },
                        },
                    }
                    : {}),
            },
            include: {
                authors: true,
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
            "Submission created."
        );
        await notifySubmissionAuthor(userId, "RECEIVED");

        return NextResponse.json({ success: true, submission }, { status: 201 });
    } catch (error) {
        console.error("Failed to create submission", error);
        return NextResponse.json({ error: "Unable to submit your research right now." }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = (session?.user as { id?: string })?.id;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const parsed = resubmissionSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid revision data." }, { status: 400 });
        }

        const current = await prisma.submission.findFirst({
            where: { id: parsed.data.submissionId, userId },
            select: { id: true, status: true },
        });
        if (!current) return NextResponse.json({ error: "Submission not found." }, { status: 404 });
        if (current.status !== "REVISION_REQUESTED") {
            return NextResponse.json({ error: "This submission is not awaiting a revision." }, { status: 400 });
        }

        const submission = await prisma.$transaction(async (tx) => {
            const updated = await tx.submission.update({
                where: { id: current.id },
                data: {
                    title: parsed.data.title,
                    abstract: parsed.data.abstract,
                    description: parsed.data.description || null,
                    methodology: parsed.data.methodology || null,
                    references: parsed.data.references || null,
                    fileUrl: parsed.data.fileUrl || null,
                    fileName: parsed.data.fileName || null,
                    fileType: parsed.data.fileType || null,
                    status: "RESUBMITTED",
                    submittedAt: new Date(),
                },
                include: { reviews: true, authors: true, publication: true },
            });

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
                    newStatus: "RESUBMITTED",
                    changedBy: userId,
                    note: "Author submitted a revised version.",
                },
            });
            return updated;
        });

        return NextResponse.json({ success: true, submission });
    } catch (error) {
        console.error("Failed to resubmit submission", error);
        return NextResponse.json({ error: "Unable to submit the revision right now." }, { status: 500 });
    }
}
