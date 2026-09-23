import { AskRequest, AskRequestSchema } from '@/domain/requests/ask';
import { LegalAnswer } from '@/domain/legal/response';
import { DomainError } from '@/domain/errors';
import { checkPromptInjection, sanitizeInput } from '@/lib/security/prompt-injection';
import { InMemoryRetriever } from '@/lib/retrieval/in-memory-retriever';
import { MockLLMProvider } from '@/lib/ai/mock-provider';
import { validateOutput } from '@/lib/ai/output-validator';
import { rateLimiter } from '@/lib/security/rate-limit';

const retriever = new InMemoryRetriever();
const provider = new MockLLMProvider();

export async function orchestrateAskFlow(rawRequest: unknown, ip: string = 'global'): Promise<LegalAnswer> {
  rateLimiter.checkRateLimit(ip);

  const validationResult = AskRequestSchema.safeParse(rawRequest);
  if (!validationResult.success) {
    throw new DomainError('INVALID_REQUEST', 'Invalid request parameters.', { issues: validationResult.error.issues });
  }

  const request: AskRequest = validationResult.data;
  
  // Security
  const cleanQuestion = sanitizeInput(request.question);
  checkPromptInjection(cleanQuestion);
  if (request.context) {
    checkPromptInjection(request.context);
  }

  // Retrieval
  const evidence = await retriever.retrieve({
    question: cleanQuestion,
    jurisdiction: request.jurisdiction,
    context: request.context,
    documentIds: request.documentIds,
    maxResults: 5
  });

  // LLM Call
  const rawAnswer = await provider.generateLegalAnswer({
    question: cleanQuestion,
    jurisdiction: request.jurisdiction,
    context: request.context,
    evidence,
  });

  // Validation
  return validateOutput(rawAnswer, evidence);
}

import { documentStorage } from '@/lib/storage/in-memory-store';
import { DocumentSummary } from '@/domain/documents/document';

export async function orchestrateDocumentSummary(documentId: string, ip: string = 'global'): Promise<DocumentSummary> {
  rateLimiter.checkRateLimit(ip);

  const document = await documentStorage.getDocument(documentId);
  if (!document) {
    throw new DomainError('INVALID_DOCUMENT', 'Document not found.');
  }

  const chunks = await documentStorage.getChunksByDocument(documentId);
  if (chunks.length === 0) {
    throw new DomainError('PROCESSING_FAILED', 'Document has no text content to summarize.');
  }

  const fullText = chunks.map(c => c.text).join('\n\n');
  
  // LLM Call
  return await provider.generateDocumentSummary(fullText);
}
