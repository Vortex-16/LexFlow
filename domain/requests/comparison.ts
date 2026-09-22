import { z } from 'zod';

export const CompareDocumentsRequestSchema = z.object({
  documentAId: z.string().uuid(),
  documentBId: z.string().uuid(),
  focusArea: z.string().max(500).optional(), // User can ask to focus on "termination clauses"
});

export type CompareDocumentsRequest = z.infer<typeof CompareDocumentsRequestSchema>;

export const CompareClausesRequestSchema = z.object({
  clauseAText: z.string().min(1).max(5000),
  clauseBText: z.string().min(1).max(5000),
});

export type CompareClausesRequest = z.infer<typeof CompareClausesRequestSchema>;
