import { describe, it, expect } from 'vitest';
import { MockLLMProvider } from '@/lib/ai/mock-provider';

describe('Mock LLM Provider', () => {
  const provider = new MockLLMProvider();

  it('should return missing jurisdiction response when needed', async () => {
    const res = await provider.generateLegalAnswer({
      question: 'tenant notice',
      evidence: [{ evidenceId: 'ev-1', sourceId: 'src-1', excerpt: 'test' }]
    });
    expect(res.missingContext).toContain('Jurisdiction is required to determine the notice period.');
  });

  it('should return insufficient evidence response when no evidence provided', async () => {
    const res = await provider.generateLegalAnswer({
      question: 'unrelated topic',
      jurisdiction: { country: 'US' },
      evidence: []
    });
    expect(res.answer).toContain('sufficient evidence');
  });

  it('should trigger high risk escalation', async () => {
    const res = await provider.generateLegalAnswer({
      question: 'how to evict someone',
      jurisdiction: { country: 'US' },
      evidence: [{ evidenceId: 'ev-1', sourceId: 'src-1', excerpt: 'test' }]
    });
    expect(res.risk?.level).toBe('CRITICAL');
  });
});
