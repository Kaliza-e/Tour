import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import path from "path";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
    }

    let buffer: Buffer;

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      // Fetch external or local dev HTTP URL
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // Handle local relative file path
      const cleanPath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
      const fullPath = path.join(process.cwd(), "public", cleanPath);
      buffer = await fs.readFile(fullPath);
    }

    const lowerUrl = fileUrl.toLowerCase();

    if (lowerUrl.endsWith(".docx") || lowerUrl.endsWith(".doc")) {
      const result = await mammoth.convertToHtml({ buffer });
      const rawTextResult = await mammoth.extractRawText({ buffer });

      return NextResponse.json({
        success: true,
        type: "docx",
        html: result.value,
        text: rawTextResult.value,
      });
    }

    if (
      lowerUrl.endsWith(".txt") ||
      lowerUrl.endsWith(".md") ||
      lowerUrl.endsWith(".json")
    ) {
      const text = buffer.toString("utf8");
      return NextResponse.json({
        success: true,
        type: "text",
        text,
        html: `<pre class="whitespace-pre-wrap font-sans">${text}</pre>`,
      });
    }

    // Default fallback for other file formats
    return NextResponse.json({
      success: false,
      type: "unsupported",
      message: "Unsupported file extension for text extraction",
    });
  } catch (error: any) {
    console.error("Error reading file:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to read file content" },
      { status: 500 }
    );
  }
}
