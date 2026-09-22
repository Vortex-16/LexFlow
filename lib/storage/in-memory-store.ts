import { IDocumentStorage } from './document-store';
import { DocumentMetadata } from '@/domain/documents/document';
import { Chunk } from '@/domain/documents/chunk';

export class InMemoryDocumentStorage implements IDocumentStorage {
  private documents: Map<string, DocumentMetadata> = new Map();
  private chunks: Map<string, Chunk[]> = new Map();

  async saveDocument(metadata: DocumentMetadata): Promise<void> {
    this.documents.set(metadata.documentId, metadata);
  }

  async getDocument(documentId: string): Promise<DocumentMetadata | null> {
    return this.documents.get(documentId) || null;
  }

  async listDocuments(): Promise<DocumentMetadata[]> {
    return Array.from(this.documents.values());
  }

  async saveChunks(chunks: Chunk[]): Promise<void> {
    if (chunks.length === 0) return;
    const documentId = chunks[0].documentId;
    const existing = this.chunks.get(documentId) || [];
    this.chunks.set(documentId, [...existing, ...chunks]);
  }

  async getChunksByDocument(documentId: string): Promise<Chunk[]> {
    return this.chunks.get(documentId) || [];
  }

  async deleteDocument(documentId: string): Promise<void> {
    this.documents.delete(documentId);
    this.chunks.delete(documentId);
  }
}

const globalForStorage = globalThis as unknown as {
  documentStorage: InMemoryDocumentStorage | undefined;
};

export const documentStorage = globalForStorage.documentStorage || new InMemoryDocumentStorage();

if (process.env.NODE_ENV !== 'production') {
  globalForStorage.documentStorage = documentStorage;
}
