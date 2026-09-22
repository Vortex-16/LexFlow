import { z } from 'zod';
import { JurisdictionSchema } from './jurisdiction';

export const SourceTypeSchema = z.enum(['LEGISLATION', 'CASE_LAW', 'CONTRACT', 'SECONDARY_SOURCE', 'USER_DOCUMENT', 'OTHER']);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const SourceSchema = z.object({
  sourceId: z.string().uuid(),
  type: SourceTypeSchema,
  title: z.string().min(1).max(500),
  origin: z.string().max(200),
  url: z.string().url().max(1000).optional(),
  jurisdiction: JurisdictionSchema.optional(),
  publishedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Source = z.infer<typeof SourceSchema>;
