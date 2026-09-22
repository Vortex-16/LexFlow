import { Chunk } from '@/domain/documents/chunk';
import { v4 as uuidv4 } from 'uuid';

/**
 * Splits text into paragraphs and normalizes them into chunks.
 * A very naive chunking strategy that preserves blank line boundaries.
 * In a real implementation, this would handle Markdown headings or legal section numbering.
 */
export function chunkText(text: string, documentId: string, maxChunkSize: number = 1500): Chunk[] {
  // Normalize line endings and split by double newlines to find paragraphs
  const rawParagraphs = text.replace(/\r\n/g, '\n').split(/\n\n+/);
  
  const chunks: Chunk[] = [];
  let currentChunkText = '';
  let chunkIndex = 0;

  for (const paragraph of rawParagraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    // If adding this paragraph exceeds max size and we already have content, push current and start new
    if (currentChunkText && currentChunkText.length + trimmed.length + 2 > maxChunkSize) {
      chunks.push({
        chunkId: uuidv4(),
        documentId,
        text: currentChunkText.trim(),
        chunkIndex: chunkIndex++,
      });
      currentChunkText = '';
    }

    currentChunkText += (currentChunkText ? '\n\n' : '') + trimmed;
    
    // If a single paragraph is longer than maxChunkSize, we just push it anyway
    // (a more robust chunker would split it into sentences)
    if (currentChunkText.length >= maxChunkSize) {
      chunks.push({
        chunkId: uuidv4(),
        documentId,
        text: currentChunkText.trim(),
        chunkIndex: chunkIndex++,
      });
      currentChunkText = '';
    }
  }

  // Push remainder
  if (currentChunkText.trim()) {
    chunks.push({
      chunkId: uuidv4(),
      documentId,
      text: currentChunkText.trim(),
      chunkIndex: chunkIndex++,
    });
  }

  return chunks;
}
