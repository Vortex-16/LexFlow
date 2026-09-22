import { describe, it, expect } from 'vitest';
import { normalizeText } from '@/lib/compare/normalize';

describe('normalizeText', () => {
  it('standardizes CRLF to LF', () => {
    expect(normalizeText('line 1\r\nline 2')).toBe('line 1\nline 2');
  });

  it('collapses repeated horizontal whitespace', () => {
    expect(normalizeText('word    word\t\tword')).toBe('word word word');
  });

  it('preserves numbers, dates, and percentages', () => {
    expect(normalizeText('The fee is $50,000 on 2024-01-01 at 5%')).toBe('The fee is $50,000 on 2024-01-01 at 5%');
  });

  it('preserves negations and obligation language', () => {
    expect(normalizeText('The party may not   disclose...')).toBe('The party may not disclose...');
  });

  it('preserves meaningful punctuation', () => {
    expect(normalizeText('(a) First item.\n(b) Second item.')).toBe('(a) First item.\n(b) Second item.');
  });
});
