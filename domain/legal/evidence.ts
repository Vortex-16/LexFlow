import { z } from 'zod';

export const EvidenceSchema = z.object({
  evidenceId: z.string().uuid(),
  sourceId: z.string().uuid(),
  documentReferenceId: z.string().uuid().optional(),
  sectionReferenceId: z.string().uuid().optional(),
  chunkReferenceId: z.string().uuid().optional(),
  excerpt: z.string().min(1).max(5000),
  relevanceScore: z.number().min(0).max(1).optional(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;
