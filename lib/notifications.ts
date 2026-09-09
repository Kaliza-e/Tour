import { prisma } from "@/lib/prisma";

export type NotificationEvent =
    | "RECEIVED"
    | "UNDER_REVIEW"
    | "REVISION_REQUESTED"
    | "APPROVED"
    | "PUBLISHED";

// ---------------------------------------------------------------------------
// In-app notification messages
// ---------------------------------------------------------------------------

const inAppMessages: Record<NotificationEvent, string> = {
    RECEIVED:
        "Your TOUR research submission has been received and is awaiting review.",
    UNDER_REVIEW: "Your TOUR research submission is now under review.",
    REVISION_REQUESTED:
        "The TOUR team has requested revisions to your submission.",
    APPROVED:
        "Congratulations! Your research has been approved for publication on TOUR.",
    PUBLISHED: "Your research is now published on TOUR.",
};

// ---------------------------------------------------------------------------
// Email content (subject + plain-text body)
// Replace the body strings with HTML templates once an email provider
// is connected — the shape of this object does not change.
// ---------------------------------------------------------------------------

interface EmailContent {
    subject: string;
    body: string;
}

const emailContent: Record<NotificationEvent, EmailContent> = {
    RECEIVED: {
        subject: "TOUR — Research Submission Received",
        body: `Thank you for submitting your work to TOUR.

Your submission has been received and is now awaiting review by our team. We will notify you as soon as a reviewer has been assigned.

If you have any questions, please reply to this email.

— The TOUR Team`,
    },
    UNDER_REVIEW: {
        subject: "TOUR — Your Submission Is Under Review",
        body: `Good news — your submission is now under review by the TOUR team.

Our reviewers will evaluate your work for originality, clarity, research quality, and alignment with TOUR's mission. We will be in touch with feedback or a decision soon.

— The TOUR Team`,
    },
    REVISION_REQUESTED: {
        subject: "TOUR — Revision Requested for Your Submission",
        body: `The TOUR review team has reviewed your submission and would like you to make some revisions before it can be considered for publication.

Please log in to your TOUR account to read the reviewer's feedback and submit your revised work.

— The TOUR Team`,
    },
    APPROVED: {
        subject: "TOUR — Your Research Has Been Approved",
        body: `Congratulations! Your research submission has been approved for publication on TOUR.

Our team will publish your work on the TOUR platform shortly. You will receive another notification with a link to your published article once it goes live.

— The TOUR Team`,
    },
    PUBLISHED: {
        subject: "TOUR — Your Research Is Now Published",
        body: `Your research is now live on TOUR and available for the world to read.

Log in to your TOUR account to see your published article, share it with others, and view reader engagement.

— The TOUR Team`,
    },
};

// ---------------------------------------------------------------------------
// Email dispatcher
// Checks NOTIFICATION_EMAIL_PROVIDER and routes to the right sender.
// New providers: add a case here and implement a thin sender function.
// ---------------------------------------------------------------------------

async function dispatchEmail(
    toEmail: string,
    content: EmailContent,
    userId: string,
    event: NotificationEvent
): Promise<void> {
    const provider = process.env.NOTIFICATION_EMAIL_PROVIDER ?? "none";

    // Map NotificationEvent → EmailEvent enum string for the DB log
    const emailEventMap: Record<NotificationEvent, string> = {
        RECEIVED: "SUBMISSION_RECEIVED",
        UNDER_REVIEW: "SUBMISSION_UNDER_REVIEW",
        REVISION_REQUESTED: "REVISION_REQUESTED",
        APPROVED: "SUBMISSION_APPROVED",
        PUBLISHED: "SUBMISSION_PUBLISHED",
    };

    const emailEvent = emailEventMap[event] as
        | "SUBMISSION_RECEIVED"
        | "SUBMISSION_UNDER_REVIEW"
        | "REVISION_REQUESTED"
        | "SUBMISSION_APPROVED"
        | "SUBMISSION_PUBLISHED";

    if (provider === "none" || !toEmail) {
        // Log as SKIPPED so we know notifications exist but email is not configured
        await prisma.emailNotificationLog.create({
            data: {
                userId,
                toEmail: toEmail || "unknown",
                subject: content.subject,
                body: content.body,
                event: emailEvent,
                status: "SKIPPED",
                provider: "none",
            },
        });
        return;
    }

    // --- console provider (development / testing) ---------------------------
    if (provider === "console") {
        console.info(`
╔══════════════════════════════════════════════════════════
║  TOUR EMAIL NOTIFICATION [${event}]
║  To:      ${toEmail}
║  Subject: ${content.subject}
╠══════════════════════════════════════════════════════════
${content.body
                .split("\n")
                .map((line) => `║  ${line}`)
                .join("\n")}
╚══════════════════════════════════════════════════════════
`);
        await prisma.emailNotificationLog.create({
            data: {
                userId,
                toEmail,
                subject: content.subject,
                body: content.body,
                event: emailEvent,
                status: "SENT",
                provider: "console",
                sentAt: new Date(),
            },
        });
        return;
    }

    // --- Resend provider (connect by setting RESEND_API_KEY) ----------------
    if (provider === "resend") {
        const apiKey = process.env.RESEND_API_KEY;
        const fromAddress =
            process.env.NOTIFICATION_FROM_EMAIL ?? "TOUR <noreply@tourresearch.org>";

        if (!apiKey) {
            console.error(
                "[TOUR notifications] NOTIFICATION_EMAIL_PROVIDER=resend but RESEND_API_KEY is not set."
            );
            await prisma.emailNotificationLog.create({
                data: {
                    userId,
                    toEmail,
                    subject: content.subject,
                    body: content.body,
                    event: emailEvent,
                    status: "FAILED",
                    provider: "resend",
                    error: "RESEND_API_KEY is not configured.",
                },
            });
            return;
        }

        try {
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: fromAddress,
                    to: [toEmail],
                    subject: content.subject,
                    text: content.body,
                }),
            });

            const result = (await response.json()) as { id?: string; message?: string };

            if (!response.ok) {
                throw new Error(result.message ?? `HTTP ${response.status}`);
            }

            await prisma.emailNotificationLog.create({
                data: {
                    userId,
                    toEmail,
                    subject: content.subject,
                    body: content.body,
                    event: emailEvent,
                    status: "SENT",
                    provider: "resend",
                    providerRef: result.id ?? null,
                    sentAt: new Date(),
                },
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown error";
            console.error(`[TOUR notifications] Resend delivery failed: ${message}`);
            await prisma.emailNotificationLog.create({
                data: {
                    userId,
                    toEmail,
                    subject: content.subject,
                    body: content.body,
                    event: emailEvent,
                    status: "FAILED",
                    provider: "resend",
                    error: message,
                },
            });
        }
        return;
    }

    // --- SendGrid provider (connect by setting SENDGRID_API_KEY) ------------
    if (provider === "sendgrid") {
        const apiKey = process.env.SENDGRID_API_KEY;
        const fromAddress =
            process.env.NOTIFICATION_FROM_EMAIL ?? "noreply@tourresearch.org";

        if (!apiKey) {
            console.error(
                "[TOUR notifications] NOTIFICATION_EMAIL_PROVIDER=sendgrid but SENDGRID_API_KEY is not set."
            );
            await prisma.emailNotificationLog.create({
                data: {
                    userId,
                    toEmail,
                    subject: content.subject,
                    body: content.body,
                    event: emailEvent,
                    status: "FAILED",
                    provider: "sendgrid",
                    error: "SENDGRID_API_KEY is not configured.",
                },
            });
            return;
        }

        try {
            const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    personalizations: [{ to: [{ email: toEmail }] }],
                    from: { email: fromAddress, name: "TOUR" },
                    subject: content.subject,
                    content: [{ type: "text/plain", value: content.body }],
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            const messageId = response.headers.get("x-message-id") ?? undefined;

            await prisma.emailNotificationLog.create({
                data: {
                    userId,
                    toEmail,
                    subject: content.subject,
                    body: content.body,
                    event: emailEvent,
                    status: "SENT",
                    provider: "sendgrid",
                    providerRef: messageId ?? null,
                    sentAt: new Date(),
                },
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown error";
            console.error(
                `[TOUR notifications] SendGrid delivery failed: ${message}`
            );
            await prisma.emailNotificationLog.create({
                data: {
                    userId,
                    toEmail,
                    subject: content.subject,
                    body: content.body,
                    event: emailEvent,
                    status: "FAILED",
                    provider: "sendgrid",
                    error: message,
                },
            });
        }
        return;
    }

    // Unknown provider — log and skip
    console.warn(
        `[TOUR notifications] Unknown NOTIFICATION_EMAIL_PROVIDER="${provider}". Skipping email.`
    );
    await prisma.emailNotificationLog.create({
        data: {
            userId,
            toEmail,
            subject: content.subject,
            body: content.body,
            event: emailEvent,
            status: "SKIPPED",
            provider,
            error: `Unknown provider: ${provider}`,
        },
    });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Creates an in-app notification AND attempts to send an email.
 * Safe to call from any server-side context — never throws.
 */
export async function notifySubmissionAuthor(
    userId: string,
    event: NotificationEvent,
    link = "/dashboard"
): Promise<void> {
    try {
        // 1. In-app notification (always written)
        await prisma.notification.create({
            data: {
                userId,
                message: inAppMessages[event],
                link,
            },
        });

        // 2. Email notification (best-effort)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });

        if (user?.email) {
            await dispatchEmail(
                user.email,
                emailContent[event],
                userId,
                event
            );
        }
    } catch (error) {
        // Never block the main workflow because of a notification failure
        console.error("[TOUR notifications] notifySubmissionAuthor failed:", error);
    }
}
