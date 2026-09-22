import { z } from 'zod';

export const JurisdictionSchema = z.object({
  country: z.string().min(1).max(100),
  stateOrRegion: z.string().max(100).optional(),
  locality: z.string().max(100).optional(),
});

export type Jurisdiction = z.infer<typeof JurisdictionSchema>;
