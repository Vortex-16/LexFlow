import { z } from 'zod';

export const ChangeTypeSchema = z.enum(['ADDED', 'REMOVED', 'MODIFIED', 'MOVED', 'UNCHANGED']);
export type ChangeType = z.infer<typeof ChangeTypeSchema>;

export const DifferenceSchema = z.object({
  differenceId: z.string().uuid(),
  changeType: ChangeTypeSchema,
  sectionAId: z.string().uuid().optional(),
  sectionBId: z.string().uuid().optional(),
  beforeText: z.string().optional(),
  afterText: z.string().optional(),
  textDiff: z.any().optional(), // Can store the word-level diff markup or array
  summary: z.string().max(1000),
  isMaterial: z.boolean(),
  evidenceAId: z.string().uuid().optional(),
  evidenceBId: z.string().uuid().optional(),
});

export type Difference = z.infer<typeof DifferenceSchema>;

export const ComparisonSummarySchema = z.object({
  comparisonId: z.string().uuid(),
  documentAId: z.string().uuid(),
  documentBId: z.string().uuid(),
  differences: z.array(DifferenceSchema).max(100),
  overallSummary: z.string().max(5000),
});

export type ComparisonSummary = z.infer<typeof ComparisonSummarySchema>;
