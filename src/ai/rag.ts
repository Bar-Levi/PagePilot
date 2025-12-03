"use server";

import { extractTextFromFile, processBusinessContext } from "@/lib/document-processor";

export interface DocChunk {
  id: string;
  docId: string; // which uploaded doc it belongs to
  businessId?: string; // or some key that connects it to the BusinessInput
  content: string; // plain text chunk
  metadata?: Record<string, any>;
}

// In-memory storage for now (replace with real vector store later)
const chunkStore: Map<string, DocChunk[]> = new Map();

/**
 * Chunk text into pieces of 300-800 tokens (roughly 200-500 words)
 */
function chunkText(text: string, chunkSize: number = 500): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  
  return chunks;
}

/**
 * Index business documents
 * For now, we store chunks in memory. Later, replace with vector store.
 */
export async function indexBusinessDocs(
  businessKey: string,
  docs: Buffer[] | string[] | File[]
): Promise<void> {
  const chunks: DocChunk[] = [];
  
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    let text: string;
    
    if (doc instanceof File) {
      text = await extractTextFromFile(doc);
    } else if (Buffer.isBuffer(doc)) {
      // Assume it's a PDF buffer - would need proper parsing
      text = doc.toString("utf-8");
    } else {
      text = doc;
    }
    
    const textChunks = chunkText(text);
    
    textChunks.forEach((chunk, index) => {
      chunks.push({
        id: `${businessKey}-doc-${i}-chunk-${index}`,
        docId: `${businessKey}-doc-${i}`,
        businessId: businessKey,
        content: chunk,
        metadata: {
          chunkIndex: index,
          totalChunks: textChunks.length,
        },
      });
    });
  }
  
  // Store chunks (in production, use vector store with embeddings)
  chunkStore.set(businessKey, chunks);
}

/**
 * Retrieve business context using simple text matching
 * In production, this would use vector similarity search
 */
export async function retrieveBusinessContext(
  businessKey: string,
  query: string,
  topK: number = 5
): Promise<DocChunk[]> {
  const chunks = chunkStore.get(businessKey) || [];
  
  if (chunks.length === 0) {
    return [];
  }
  
  // Simple keyword matching (replace with vector search)
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  const scoredChunks = chunks.map((chunk) => {
    const contentLower = chunk.content.toLowerCase();
    let score = 0;
    
    queryWords.forEach((word) => {
      if (contentLower.includes(word)) {
        score += 1;
      }
    });
    
    return { chunk, score };
  });
  
  // Sort by score and return top K
  scoredChunks.sort((a, b) => b.score - a.score);
  
  return scoredChunks.slice(0, topK).map((item) => item.chunk);
}

/**
 * Helper to process and index files from the business context upload
 */
export async function processAndIndexFiles(
  businessKey: string,
  textContent: string,
  files: File[]
): Promise<void> {
  // If we have files, process them
  if (files && files.length > 0) {
    // Process files using existing processor
    const processedText = await processBusinessContext(textContent, files);
    
    // Index as a single document
    await indexBusinessDocs(businessKey, [processedText]);
  } else if (textContent && textContent.trim()) {
    // If only text content, index it directly
    await indexBusinessDocs(businessKey, [textContent]);
  }
}

