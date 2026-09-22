import { z } from 'zod';

export const CitationSchema = z.object({
  citationId: z.string().uuid(),
  evidenceId: z.string().uuid(),
  sourceId: z.string().uuid(),
  locationMarker: z.string().max(200).optional(), // e.g. "Page 5, Section 2"
  displayLabel: z.string().min(1).max(200),
});

export type Citation = z.infer<typeof CitationSchema>;
