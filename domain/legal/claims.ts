import { z } from 'zod';

export const SupportStatusSchema = z.enum(['SUPPORTED', 'PARTIALLY_SUPPORTED', 'UNSUPPORTED']);
export type SupportStatus = z.infer<typeof SupportStatusSchema>;

export const ClaimSchema = z.object({
  claimId: z.string().uuid(),
  text: z.string().min(1).max(2000),
  evidenceIds: z.array(z.string().uuid()).max(10),
  supportStatus: SupportStatusSchema,
});

export type Claim = z.infer<typeof ClaimSchema>;
