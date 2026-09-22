import { LegalAnswer, LegalAnswerSchema } from '@/domain/legal/response';
import { DomainError } from '@/domain/errors';
import { Evidence } from '@/domain/legal/evidence';

export function validateOutput(rawOutput: unknown, providedEvidence: Evidence[]): LegalAnswer {
  const result = LegalAnswerSchema.safeParse(rawOutput);
  if (!result.success) {
    throw new DomainError('PROCESSING_FAILED', 'Failed to parse AI response.', { issues: result.error.issues });
  }

  const answer = result.data;
  const evidenceIds = new Set(providedEvidence.map(e => e.evidenceId));

  // Citation validation: Check if all citations point to actual provided evidence
  for (const citation of answer.citations) {
    if (!evidenceIds.has(citation.evidenceId)) {
      throw new DomainError('PROCESSING_FAILED', `Invalid citation. Evidence ID ${citation.evidenceId} not found in retrieved context.`);
    }
  }

  // Claim validation: Check if all claim evidence references point to actual provided evidence
  if (answer.claims) {
    for (const claim of answer.claims) {
      if (claim.evidenceIds) {
        for (const id of claim.evidenceIds) {
          if (!evidenceIds.has(id)) {
            throw new DomainError('PROCESSING_FAILED', `Invalid claim evidence. Evidence ID ${id} not found in retrieved context.`);
          }
        }
      }
    }
  }

  return answer;
}
