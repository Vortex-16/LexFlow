import { describe, it, expect } from 'vitest';
import { validateOutput } from '@/lib/ai/output-validator';
import { DomainError } from '@/domain/errors';
import { v4 as uuidv4 } from 'uuid';

describe('Output Validator', () => {
  it('should pass valid output with correct citations', () => {
    const evidenceId = uuidv4();
    const sourceId = uuidv4();
    const rawOutput = {
      answer: 'Yes',
      explanation: 'Because.',
      citations: [{ citationId: uuidv4(), evidenceId, sourceId, displayLabel: 'Sec 1' }],
      evidence: [{ evidenceId, sourceId, excerpt: 'test' }],
      assumptions: [], missingContext: [], uncertainties: [], nextSteps: []
    };

    const evidence = [{ evidenceId, sourceId, excerpt: 'test' }];
    const validated = validateOutput(rawOutput, evidence);
    expect(validated.answer).toBe('Yes');
  });

  it('should throw DomainError on invalid citation mapping', () => {
    const validEvidenceId = uuidv4();
    const invalidEvidenceId = uuidv4(); // Not in provided evidence
    const sourceId = uuidv4();

    const rawOutput = {
      answer: 'Yes',
      explanation: 'Because.',
      citations: [{ citationId: uuidv4(), evidenceId: invalidEvidenceId, sourceId, displayLabel: 'Sec 1' }],
      evidence: [{ evidenceId: validEvidenceId, sourceId, excerpt: 'test' }],
      assumptions: [], missingContext: [], uncertainties: [], nextSteps: []
    };

    const evidence = [{ evidenceId: validEvidenceId, sourceId, excerpt: 'test' }];
    expect(() => validateOutput(rawOutput, evidence)).toThrow(DomainError);
  });
});
