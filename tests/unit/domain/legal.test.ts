import { describe, it, expect } from 'vitest';
import { JurisdictionSchema } from '@/domain/legal/jurisdiction';
import { RiskSchema } from '@/domain/legal/risk';
import { ClaimSchema } from '@/domain/legal/claims';

describe('Domain: Legal', () => {
  it('should validate a valid Jurisdiction', () => {
    const valid = { country: 'US', stateOrRegion: 'CA' };
    expect(() => JurisdictionSchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid Risk Level', () => {
    const invalid = { level: 'SUPER_HIGH', category: 'General', reason: 'test' };
    expect(() => RiskSchema.parse(invalid)).toThrow();
  });

  it('should validate a valid Claim', () => {
    const valid = {
      claimId: '123e4567-e89b-12d3-a456-426614174000',
      text: 'The tenant has 30 days to vacate.',
      evidenceIds: ['123e4567-e89b-12d3-a456-426614174001'],
      supportStatus: 'SUPPORTED'
    };
    expect(() => ClaimSchema.parse(valid)).not.toThrow();
  });

  it('should reject unsupported claim shape', () => {
    const invalid = {
      claimId: '123e4567-e89b-12d3-a456-426614174000',
      text: 'Bad claim',
      evidenceIds: [],
      supportStatus: 'MAYBE' // Invalid status
    };
    expect(() => ClaimSchema.parse(invalid)).toThrow();
  });
});
