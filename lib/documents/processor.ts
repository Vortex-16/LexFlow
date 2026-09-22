import { DocumentParserFactory } from './parser';
import { chunkText } from './chunker';
import { documentStorage } from '@/lib/storage/in-memory-store';
import { DocumentMetadata } from '@/domain/documents/document';
import { DomainError } from '@/domain/errors';
import { v4 as uuidv4 } from 'uuid';

export class DocumentProcessor {
  /**
   * Processes an uploaded document buffer.
   * Treats content as untrusted.
   */
  async process(buffer: Buffer, filename: string, mimeType: string, sizeBytes: number): Promise<DocumentMetadata> {
    // 1. Validation
    this.validate(filename, mimeType, sizeBytes);

    const documentId = uuidv4();
    const metadata: DocumentMetadata = {
      documentId,
      filename, // Already validated/sanitized somewhat conceptually
      mimeType,
      sizeBytes,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save initial state
    await documentStorage.saveDocument(metadata);

    try {
      // 2. Parser Selection
      const parser = DocumentParserFactory.getParser(mimeType);

      // 3. Parsing
      const parsed = await parser.parse(buffer, mimeType);

      if (!parsed.text || parsed.text.trim().length === 0) {
        throw new DomainError('INVALID_DOCUMENT', 'Document contains no extractable text.');
      }

      const MAX_EXTRACTED_TEXT_BYTES = 2 * 1024 * 1024; // 2MB limit
      if (Buffer.byteLength(parsed.text, 'utf8') > MAX_EXTRACTED_TEXT_BYTES) {
        throw new DomainError('DOCUMENT_TOO_LARGE', 'Extracted text exceeds the maximum allowed size.');
      }

      // 4. Chunking
      const chunks = chunkText(parsed.text, documentId);

      // 5. Persistence
      await documentStorage.saveChunks(chunks);

      // 6. Update Status
      metadata.status = 'READY';
      metadata.updatedAt = new Date().toISOString();
      await documentStorage.saveDocument(metadata);

      return metadata;
    } catch (error: unknown) {
      metadata.status = 'FAILED';
      metadata.updatedAt = new Date().toISOString();
      await documentStorage.saveDocument(metadata);

      if (error instanceof DomainError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DomainError('PROCESSING_FAILED', `Document processing failed: ${message}`);
    }
  }

  private validate(filename: string, mimeType: string, sizeBytes: number) {
    if (sizeBytes > 10 * 1024 * 1024) {
      throw new DomainError('DOCUMENT_TOO_LARGE', 'File size exceeds the 10MB limit.');
    }

    const allowedMimeTypes = ['text/plain', 'text/markdown', 'application/pdf'];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new DomainError('UNSUPPORTED_DOCUMENT', `Format ${mimeType} is not supported.`);
    }

    // Basic extension check for additional safety
    const ext = filename.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['txt', 'md', 'pdf'];
    if (!ext || !allowedExtensions.includes(ext)) {
      throw new DomainError('UNSUPPORTED_DOCUMENT', `File extension .${ext} is not supported.`);
    }

    // Path traversal check
    if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
      throw new DomainError('INVALID_DOCUMENT', 'Invalid filename structure.');
    }
    
    // In addition to throwing on invalid paths, we ensure it's just the basename
    // The processor will use the sanitized filename.
    filename = filename.replace(/^.*[\\\/]/, '');
  }
}
