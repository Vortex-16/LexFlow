import { describe, it, expect } from 'vitest';
import { AskRequestSchema } from '@/domain/requests/ask';

describe('Domain: Requests', () => {
  it('should validate a valid AskRequest', () => {
    const valid = {
      question: 'What is the governing law?',
      jurisdiction: { country: 'UK' }
    };
    expect(() => AskRequestSchema.parse(valid)).not.toThrow();
  });

  it('should reject an empty question', () => {
    const invalid = {
      question: '',
      jurisdiction: { country: 'UK' }
    };
    expect(() => AskRequestSchema.parse(invalid)).toThrow();
  });

  it('should reject excessive question length', () => {
    const invalid = {
      question: 'a'.repeat(1001),
      jurisdiction: { country: 'UK' }
    };
    expect(() => AskRequestSchema.parse(invalid)).toThrow();
  });
});
