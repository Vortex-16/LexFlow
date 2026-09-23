import { describe, it, expect } from 'vitest';
import { MockLLMProvider } from '@/lib/ai/mock-provider';
import { DocumentSummarySchema } from '@/domain/documents/document';

describe('Document Summarization', () => {
  const provider = new MockLLMProvider();

  it('returns a valid DocumentSummary schema', async () => {
    const summary = await provider.generateDocumentSummary('This is a sample legal contract.');
    const result = DocumentSummarySchema.safeParse(summary);
    expect(result.success).toBe(true);
  });

  it('includes questionsForLawyer in the response', async () => {
    const summary = await provider.generateDocumentSummary('Standard terms.');
    expect(summary.questionsForLawyer).toBeDefined();
    expect(Array.isArray(summary.questionsForLawyer)).toBe(true);
    expect(summary.questionsForLawyer!.length).toBeGreaterThan(0);
  });

  it('detects high risk when text contains liability keywords', async () => {
    const summary = await provider.generateDocumentSummary('The party shall indemnify and hold harmless from any liability.');
    expect(summary.riskLevel).toBe('High');
  });

  it('assigns medium risk for standard text', async () => {
    const summary = await provider.generateDocumentSummary('The tenant agrees to pay rent on the first of each month.');
    expect(summary.riskLevel).toBe('Medium');
  });
});
