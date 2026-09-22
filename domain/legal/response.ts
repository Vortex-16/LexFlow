import { z } from 'zod';
import { CitationSchema } from './citation';
import { EvidenceSchema } from './evidence';
import { RiskSchema } from './risk';

import { ClaimSchema } from './claims';

export const LegalAnswerSchema = z.object({
  answer: z.string().max(5000),
  explanation: z.string().max(10000),
  citations: z.array(CitationSchema).max(50),
  claims: z.array(ClaimSchema).max(50).optional(),
  evidence: z.array(EvidenceSchema).max(50),
  assumptions: z.array(z.string().max(500)).max(20),
  missingContext: z.array(z.string().max(500)).max(20),
  uncertainties: z.array(z.string().max(500)).max(20),
  nextSteps: z.array(z.string().max(500)).max(10),
  risk: RiskSchema.optional(),
  escalation: z.string().max(1000).optional(),
});

export type LegalAnswer = z.infer<typeof LegalAnswerSchema>;
