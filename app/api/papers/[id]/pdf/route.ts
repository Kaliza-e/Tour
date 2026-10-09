import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paperId = params.id;

    // Find publication or submission
    const publication = await prisma.publication.findUnique({
      where: { id: paperId },
      include: {
        submission: {
          select: {
            fileUrl: true,
            fileName: true,
            status: true,
          },
        },
      },
    }).catch(() => null);

    let fileUrl = publication?.submission?.fileUrl;
    let fileName = publication?.submission?.fileName || "publication.pdf";

    if (!fileUrl) {
      // Check direct submission ID
      const submission = await prisma.submission.findUnique({
        where: { id: paperId },
        select: { fileUrl: true, fileName: true, status: true },
      }).catch(() => null);

      if (submission) {
        fileUrl = submission.fileUrl;
        fileName = submission.fileName || "submission.pdf";
      }
    }

    if (!fileUrl) {
      return NextResponse.json({ error: "PDF file not found" }, { status: 404 });
    }

    // Check if local file path or remote URL
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      // Redirect to secure CDN URL or fetch
      return NextResponse.redirect(fileUrl);
    }

    // Local file streaming
    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json({ error: "PDF document file does not exist" }, { status: 404 });
    }

    const fileStream = fs.readFileSync(absolutePath);

    return new Response(fileStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/papers/:id/pdf error:", error);
    return NextResponse.json({ error: "Failed to stream PDF viewer" }, { status: 500 });
  }
}
