import { z } from 'zod';

export const RiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const RiskSchema = z.object({
  level: RiskLevelSchema,
  category: z.string().max(100),
  reason: z.string().max(500),
  escalationRequirement: z.string().max(500).optional(),
});

export type Risk = z.infer<typeof RiskSchema>;
