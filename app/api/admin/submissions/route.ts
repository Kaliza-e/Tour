import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ReviewDecision, SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { unlink } from "fs/promises";
import path from "path";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifySubmissionAuthor } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
    submissionId: z.string().min(1),
    decision: z.nativeEnum(ReviewDecision).optional(),
    action: z.enum(["REVIEW", "PUBLISH", "ASSIGN"]).default("REVIEW"),
    feedback: z.string().max(10000).optional(),
    reviewerId: z.string().optional(),
    publicationTitle: z.string().optional(),
    publicationCategory: z.string().optional(),
    publicationSummary: z.string().optional(),
    publicationCoverImage: z.string().optional(),
    publicationAuthorBio: z.string().optional(),
    publicationDate: z.string().refine((value) => !value || !Number.isNaN(Date.parse(value)), "Invalid publication date.").optional(),
});

const deleteSchema = z.object({
    submissionId: z.string().min(1),
});

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id || !["ADMIN", "REVIEWER"].includes(user.role || "")) {
        return null;
    }

    return user;
}

const statusForDecision: Record<ReviewDecision, SubmissionStatus> = {
    APPROVE: "APPROVED",
    REQUEST_REVISION: "REVISION_REQUESTED",
    REJECT: "REJECTED",
};

export async function GET() {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    try {
        const submissions = await prisma.submission.findMany({
            where: admin.role === "REVIEWER" ? { assignedReviewerId: admin.id } : undefined,
            include: {
                user: { select: { id: true, name: true, email: true } },
                authors: true,
                reviews: {
                    include: { reviewer: { select: { name: true, email: true } } },
                    orderBy: { createdAt: "desc" },
                },
                statusHistory: { orderBy: { createdAt: "desc" } },
                publication: true,
                assignedReviewer: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Failed to load admin submissions", error);
        return NextResponse.json({ error: "Unable to load submissions." }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    try {
        const parsed = reviewSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid review data." },
                { status: 400 }
            );
        }

        const { submissionId, decision, action, feedback } = parsed.data;

        if (action === "ASSIGN") {
            if (admin.role !== "ADMIN") return NextResponse.json({ error: "Only admins can assign reviewers." }, { status: 403 });
            if (!parsed.data.reviewerId) return NextResponse.json({ error: "Select a reviewer." }, { status: 400 });
            const reviewer = await prisma.user.findFirst({ where: { id: parsed.data.reviewerId, role: "REVIEWER" } });
            if (!reviewer) return NextResponse.json({ error: "Reviewer not found." }, { status: 404 });
            const current = await prisma.submission.findUnique({ where: { id: submissionId }, select: { status: true } });
            if (!current) return NextResponse.json({ error: "Submission not found." }, { status: 404 });
            if (!["SUBMITTED", "RESUBMITTED", "REVISION_REQUESTED"].includes(current.status)) {
                return NextResponse.json({ error: "This submission cannot be assigned in its current state." }, { status: 409 });
            }
            const submission = await prisma.submission.update({ where: { id: submissionId }, data: { assignedReviewerId: reviewer.id, status: "UNDER_REVIEW" }, include: { assignedReviewer: { select: { id: true, name: true, email: true } } } });
            const author = await prisma.submission.findUnique({ where: { id: submissionId }, select: { userId: true } });
            if (author) await notifySubmissionAuthor(author.userId, "UNDER_REVIEW");
            return NextResponse.json({ success: true, submission });
        }

        if (action === "PUBLISH") {
            if (admin.role !== "ADMIN") {
                return NextResponse.json({ error: "Only admins can publish research." }, { status: 403 });
            }
            const published = await prisma.$transaction(async (tx) => {
                const current = await tx.submission.findUnique({
                    where: { id: submissionId },
                    include: { authors: true, publication: true },
                });

                if (!current) throw new Error("Submission not found.");
                if (current.status !== "APPROVED") throw new Error("Only approved submissions can be published.");

                const publication = await tx.publication.upsert({
                    where: { submissionId },
                    update: {
                        title: parsed.data.publicationTitle?.trim() || current.publicationTitle || current.title,
                        category: parsed.data.publicationCategory?.trim() || current.publicationCategory || current.category,
                        abstract: current.abstract,
                        summary: parsed.data.publicationSummary?.trim() || current.publicationSummary || current.description,
                        content: current.methodology,
                        keywords: current.keywords,
                        references: current.references,
                        coverImage: parsed.data.publicationCoverImage?.trim() || current.publicationCoverImage,
                        authorBio: parsed.data.publicationAuthorBio?.trim() || current.publicationAuthorBio || current.authorBio,
                        publicationDate: parsed.data.publicationDate ? new Date(parsed.data.publicationDate) : current.publicationDate || new Date(),
                    },
                    create: {
                        submissionId,
                        title: parsed.data.publicationTitle?.trim() || current.publicationTitle || current.title,
                        category: parsed.data.publicationCategory?.trim() || current.publicationCategory || current.category,
                        abstract: current.abstract,
                        summary: parsed.data.publicationSummary?.trim() || current.publicationSummary || current.description,
                        content: current.methodology,
                        keywords: current.keywords,
                        references: current.references,
                        coverImage: parsed.data.publicationCoverImage?.trim() || current.publicationCoverImage,
                        authorBio: parsed.data.publicationAuthorBio?.trim() || current.publicationAuthorBio || current.authorBio,
                        publicationDate: parsed.data.publicationDate ? new Date(parsed.data.publicationDate) : current.publicationDate || new Date(),
                        authors: {
                            create: current.authors.map((author) => ({
                                userId: author.userId,
                                name: author.fullName,
                                institution: author.institution,
                                bio: author.bio,
                            })),
                        },
                    },
                });

                await tx.submission.update({ where: { id: submissionId }, data: { status: "PUBLISHED" } });
                await tx.submissionStatusHistory.create({
                    data: {
                        submissionId,
                        previousStatus: current.status,
                        newStatus: "PUBLISHED",
                        changedBy: admin.id,
                        note: feedback?.trim() || "Publication approved and published.",
                    },
                });

                return { publication, userId: current.userId };
            });

            await notifySubmissionAuthor(published.userId, "PUBLISHED", `/publications/${published.publication.id}`);
            return NextResponse.json({ success: true, publication: published.publication });
        }

        if (!decision) {
            return NextResponse.json({ error: "A review decision is required." }, { status: 400 });
        }

        const nextStatus = statusForDecision[decision];

        let currentUserId = "";
        const submission = await prisma.$transaction(async (tx) => {
            const current = await tx.submission.findUnique({
                where: { id: submissionId },
                select: { id: true, status: true, userId: true, assignedReviewerId: true },
            });

            if (!current) {
                throw new Error("Submission not found.");
            }
            currentUserId = current.userId;
            if (admin.role === "REVIEWER" && current.assignedReviewerId !== admin.id) {
                throw new Error("This submission is not assigned to you.");
            }
            if (!["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED"].includes(current.status)) {
                throw new Error("This submission is not available for review in its current state.");
            }

            await tx.review.create({
                data: {
                    submissionId,
                    reviewerId: admin.id as string,
                    decision,
                    feedback: feedback?.trim() || null,
                },
            });

            await tx.submission.update({
                where: { id: submissionId },
                data: { status: nextStatus },
            });

            await tx.submissionStatusHistory.create({
                data: {
                    submissionId,
                    previousStatus: current.status,
                    newStatus: nextStatus,
                    changedBy: admin.id,
                    note: feedback?.trim() || `Review decision: ${decision}`,
                },
            });

            return tx.submission.findUnique({
                where: { id: submissionId },
                include: { authors: true, reviews: { orderBy: { createdAt: "desc" } } },
            });
        });

        await notifySubmissionAuthor(currentUserId, nextStatus === "REVISION_REQUESTED" ? "REVISION_REQUESTED" : nextStatus === "APPROVED" ? "APPROVED" : "UNDER_REVIEW");

        return NextResponse.json({ success: true, submission });
    } catch (error) {
        console.error("Failed to review submission", error);
        const message = error instanceof Error ? error.message : "Unable to save review.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    if (admin.role !== "ADMIN") {
        return NextResponse.json({ error: "Only admins can delete submissions." }, { status: 403 });
    }

    try {
        const parsed = deleteSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ error: "A valid submission is required." }, { status: 400 });
        }

        const submission = await prisma.submission.findUnique({
            where: { id: parsed.data.submissionId },
            select: { id: true, fileUrl: true },
        });

        if (!submission) {
            return NextResponse.json({ error: "Submission not found." }, { status: 404 });
        }

        await prisma.submission.delete({ where: { id: submission.id } });

        if (submission.fileUrl?.startsWith("/uploads/")) {
            try {
                await unlink(path.join(process.cwd(), "public", submission.fileUrl));
            } catch (fileError) {
                console.warn("Submission deleted, but its upload could not be removed", fileError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete submission", error);
        return NextResponse.json({ error: "Unable to delete submission." }, { status: 500 });
    }
}
