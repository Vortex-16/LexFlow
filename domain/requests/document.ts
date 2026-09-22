import { z } from 'zod';

export const DocumentUploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().regex(/^(application\/pdf|text\/plain|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
});

export type DocumentUploadRequest = z.infer<typeof DocumentUploadRequestSchema>;
