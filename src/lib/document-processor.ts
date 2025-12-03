/**
 * Document Processor
 * Extracts text from various file formats (PDF, TXT, DOCX)
 */

export type ProcessedDocument = {
  filename: string;
  content: string;
  type: string;
  size: number;
};

/**
 * Extract text content from a file
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Plain text files
  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return await file.text();
  }

  // PDF files
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return await extractTextFromPDF(file);
  }

  // Word documents (DOCX)
  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return await extractTextFromDOCX(file);
  }

  // Markdown files
  if (fileType === "text/markdown" || fileName.endsWith(".md")) {
    return await file.text();
  }

  // JSON files
  if (fileType === "application/json" || fileName.endsWith(".json")) {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      return JSON.stringify(json, null, 2);
    } catch {
      return text;
    }
  }

  // HTML files - strip tags
  if (fileType === "text/html" || fileName.endsWith(".html")) {
    const html = await file.text();
    return stripHtmlTags(html);
  }

  // Fallback - try to read as text
  try {
    return await file.text();
  } catch {
    throw new Error(`Unsupported file type: ${fileType || fileName}`);
  }
}

/**
 * Extract text from PDF using pdf-parse
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { default: pdfParse } = await import("pdf-parse");
    const data = await pdfParse(Buffer.from(arrayBuffer));
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      "Failed to parse PDF file. Please try again or paste the content as text."
    );
  }
}

/**
 * Extract text from DOCX using mammoth
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error(
      "Failed to parse Word document. Please try again or paste the content as text."
    );
  }
}

/**
 * Strip HTML tags from text
 */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Process multiple files and combine their content
 */
export async function processBusinessContext(
  textContent: string,
  files: File[]
): Promise<string> {
  const parts: string[] = [];

  // Add manual text content
  if (textContent.trim()) {
    parts.push("=== Manual Input ===\n" + textContent.trim());
  }

  // Process each file
  for (const file of files) {
    try {
      const content = await extractTextFromFile(file);
      parts.push(`=== ${file.name} ===\n${content}`);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
      parts.push(
        `=== ${file.name} ===\n[Error: Could not extract content from this file]`
      );
    }
  }

  return parts.join("\n\n---\n\n");
}

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  const validTypes = [
    "text/plain",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/markdown",
    "application/json",
    "text/html",
  ];

  const validExtensions = [".txt", ".pdf", ".docx", ".md", ".json", ".html"];

  const fileName = file.name.toLowerCase();

  return (
    validTypes.includes(file.type) ||
    validExtensions.some((ext) => fileName.endsWith(ext))
  );
}

/**
 * Get file type label
 */
export function getFileTypeLabel(file: File): string {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) return "PDF";
  if (fileName.endsWith(".docx")) return "Word";
  if (fileName.endsWith(".txt")) return "Text";
  if (fileName.endsWith(".md")) return "Markdown";
  if (fileName.endsWith(".json")) return "JSON";
  if (fileName.endsWith(".html")) return "HTML";

  return "File";
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

