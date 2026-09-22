import { z } from 'zod';

export const ErrorCodeSchema = z.enum([
  'INVALID_REQUEST',
  'INVALID_DOCUMENT',
  'UNSUPPORTED_DOCUMENT',
  'DOCUMENT_TOO_LARGE',
  'MISSING_JURISDICTION',
  'INSUFFICIENT_EVIDENCE',
  'UNSAFE_REQUEST',
  'PROCESSING_FAILED',
  'PROVIDER_UNAVAILABLE',
  'RATE_LIMITED',
  'INTERNAL_ERROR'
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export class DomainError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
