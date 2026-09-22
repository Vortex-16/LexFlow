import { DocumentMetadata } from '@/domain/documents/document';
import { Chunk } from '@/domain/documents/chunk';

export interface IDocumentStorage {
  saveDocument(metadata: DocumentMetadata): Promise<void>;
  getDocument(documentId: string): Promise<DocumentMetadata | null>;
  listDocuments(): Promise<DocumentMetadata[]>;
  saveChunks(chunks: Chunk[]): Promise<void>;
  getChunksByDocument(documentId: string): Promise<Chunk[]>;
  deleteDocument(documentId: string): Promise<void>;
}
