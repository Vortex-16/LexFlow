import { describe, it, expect } from 'vitest';
import { DocumentMetadataSchema } from '@/domain/documents/document';

describe('Domain: Documents', () => {
  it('should validate a valid Document', () => {
    const valid = {
      documentId: '123e4567-e89b-12d3-a456-426614174000',
      filename: 'contract.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1024,
      status: 'READY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(() => DocumentMetadataSchema.parse(valid)).not.toThrow();
  });

  it('should reject an invalid document state', () => {
    const invalid = {
      documentId: '123e4567-e89b-12d3-a456-426614174000',
      filename: 'contract.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1024,
      status: 'DONE', // Invalid state
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(() => DocumentMetadataSchema.parse(invalid)).toThrow();
  });
});
