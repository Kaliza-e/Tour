import { prisma } from "@/lib/prisma";
import { SubmissionStatus, SubmissionResearchType } from "@prisma/client";

export const submissionStatuses = [
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "REVISION_REQUESTED",
    "RESUBMITTED",
    "APPROVED",
    "PUBLISHED",
    "REJECTED",
] as const;

export function toTitleCase(value: string) {
    return value
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildSubmissionCode() {
    const date = new Date();
    const y = date.getFullYear();
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `TOUR-${y}-${random}`;
}

export async function createSubmissionStatusHistory(
    submissionId: string,
    previousStatus: SubmissionStatus | null,
    newStatus: SubmissionStatus,
    changedBy?: string,
    note?: string
) {
    return prisma.submissionStatusHistory.create({
        data: {
            submissionId,
            previousStatus,
            newStatus,
            changedBy,
            note,
        },
    });
}

export function normalizeResearchType(value: string): SubmissionResearchType {
    const map: Record<string, SubmissionResearchType> = {
        "Research Article": "RESEARCH_ARTICLE",
        "Student Science Writing": "STUDENT_SCIENCE_WRITING",
        "Exploratory Essay": "EXPLORATORY_ESSAY",
        "Literature Review": "LITERATURE_REVIEW",
        "Research Project": "RESEARCH_PROJECT",
        "Experimental Study": "EXPERIMENTAL_STUDY",
        "Opinion / Reflection based on research": "OPINION_REFLECTION",
        Other: "OTHER",
    };

    return map[value] ?? "RESEARCH_ARTICLE";
}
