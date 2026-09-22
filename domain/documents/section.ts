import { z } from 'zod';

export const SectionSchema = z.object({
  sectionId: z.string().uuid(),
  documentId: z.string().uuid(),
  heading: z.string().max(500),
  hierarchy: z.array(z.string().max(500)).max(10),
  pageNumber: z.number().int().positive().optional(),
});

export type Section = z.infer<typeof SectionSchema>;
