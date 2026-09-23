import { LegalAnswer } from '@/domain/legal/response';
import { Evidence } from '@/domain/legal/evidence';
import { Jurisdiction } from '@/domain/legal/jurisdiction';
import { DocumentSummary } from '@/domain/documents/document';

export interface GenerateAnswerRequest {
  question: string;
  jurisdiction?: Jurisdiction;
  context?: string;
  evidence: Evidence[];
}

export interface ExplainDifferenceRequest {
  beforeText?: string;
  afterText?: string;
  changeType: string;
}

export interface ILLMProvider {
  generateLegalAnswer(request: GenerateAnswerRequest): Promise<LegalAnswer>;
  explainDifference(request: ExplainDifferenceRequest): Promise<string>;
  generateDocumentSummary(text: string): Promise<DocumentSummary>;
}
