import { z } from 'zod';
import { JurisdictionSchema } from '../legal/jurisdiction';

export const AskRequestSchema = z.object({
  question: z.string().min(5).max(1000),
  jurisdiction: JurisdictionSchema.optional(),
  context: z.string().max(5000).optional(),
  documentIds: z.array(z.string().uuid()).max(5).optional(),
  sessionId: z.string().uuid().optional(),
}).strict();

export type AskRequest = z.infer<typeof AskRequestSchema>;
