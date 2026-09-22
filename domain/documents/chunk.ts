import { z } from 'zod';

export const ChunkSchema = z.object({
  chunkId: z.string().uuid(),
  documentId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  text: z.string().min(1).max(5000), // Max chunk size
  chunkIndex: z.number().int().nonnegative(),
  sourceLocation: z.string().max(200).optional(), // e.g. "Page 2, paragraph 4"
});

export type Chunk = z.infer<typeof ChunkSchema>;
