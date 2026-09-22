import { DomainError } from '@/domain/errors';

// A basic defense-in-depth sanitization approach
export function checkPromptInjection(input: string): void {
  const suspiciousPatterns = [
    /ignore previous instructions/i,
    /reveal system prompt/i,
    /you are now a/i,
    /system instructions/i,
    /bypassing constraints/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      throw new DomainError('UNSAFE_REQUEST', 'Suspicious input detected that may violate safety policies.');
    }
  }
}

export function sanitizeInput(input: string): string {
  // basic stripping of control characters
  return input.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
}
