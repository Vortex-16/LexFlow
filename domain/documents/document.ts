import { z } from 'zod';

export const ProcessingStatusSchema = z.enum(['UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'REJECTED']);
export type ProcessingStatus = z.infer<typeof ProcessingStatusSchema>;

export const DocumentMetadataSchema = z.object({
  documentId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  mimeType: z.string().max(100),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024), // Max 10MB
  status: ProcessingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;

export const DocumentSummarySchema = z.object({
  summary: z.string(),
  checklist: z.array(z.string()),
  riskLevel: z.enum(['Low', 'Medium', 'High']).optional(),
  questionsForLawyer: z.array(z.string()).optional(),
});

export type DocumentSummary = z.infer<typeof DocumentSummarySchema>;
