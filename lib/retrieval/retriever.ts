import { Evidence } from '@/domain/legal/evidence';
import { Jurisdiction } from '@/domain/legal/jurisdiction';

export interface RetrievalQuery {
  question: string;
  jurisdiction?: Jurisdiction;
  context?: string;
  documentIds?: string[];
  maxResults?: number;
}

export interface IRetriever {
  retrieve(query: RetrievalQuery): Promise<Evidence[]>;
}
