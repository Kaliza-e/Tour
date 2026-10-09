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
      return NextResponse.redirect(fileUrl);
    }

    // Local file streaming with attachment header
    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json({ error: "PDF file does not exist on server" }, { status: 404 });
    }

    const fileStream = fs.readFileSync(absolutePath);

    return new Response(fileStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/papers/:id/download error:", error);
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 });
  }
}
