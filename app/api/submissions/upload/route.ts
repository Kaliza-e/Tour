import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to upload a file." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose a PDF or DOCX file." }, { status: 400 });
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "Only PDF and DOCX files are supported." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Files must be 10 MB or smaller." }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
    const isZipDocument = bytes[0] === 0x50 && bytes[1] === 0x4b;
    const isLegacyWord = bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
    const validSignature = file.type === "application/pdf" ? isPdf : file.type === "application/msword" ? isLegacyWord : isZipDocument;
    if (!validSignature) {
      return NextResponse.json({ error: "The file content does not match its declared document type." }, { status: 400 });
    }

    const extension = path.extname(file.name).toLowerCase() || ".pdf";
    const storedName = `${randomUUID()}${extension}`;
    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, storedName), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({
      fileName: file.name,
      fileType: file.type,
      fileUrl: `/uploads/${storedName}`,
    });
  } catch (error) {
    console.error("Failed to upload submission file", error);
    return NextResponse.json({ error: "Unable to upload the file right now." }, { status: 500 });
  }
}
