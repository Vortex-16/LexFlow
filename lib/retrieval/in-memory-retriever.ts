import { IRetriever, RetrievalQuery } from './retriever';
import { Evidence } from '@/domain/legal/evidence';
import { mockChunks, mockSources } from './fixtures/legal-docs';
import { documentStorage } from '@/lib/storage/in-memory-store';

export class InMemoryRetriever implements IRetriever {
  async retrieve(query: RetrievalQuery): Promise<Evidence[]> {
    const results: Evidence[] = [];
    
    // Very naive lexical matching for demonstration purposes
    const qLower = query.question.toLowerCase();
    
    // 1. Static Domain Knowledge Retrieval (Mock)
    for (const chunk of mockChunks) {
      if (qLower.includes('tenant') || qLower.includes('landlord') || qLower.includes('notice') || qLower.includes('terminate')) {
        const sourceId = chunk.documentId === '11111111-1111-4111-a111-111111111111' ? '33333333-3333-4333-a333-333333333333' : '44444444-4444-4444-a444-444444444444';
        
        // Context/Jurisdiction filtering
        const source = mockSources.find(s => s.sourceId === sourceId);
        if (query.jurisdiction && source?.jurisdiction) {
          if (query.jurisdiction.country !== source.jurisdiction.country) {
            continue; // Skip sources that belong to a different jurisdiction
          }
        }

        results.push({
          evidenceId: chunk.chunkId,
          sourceId,
          chunkReferenceId: chunk.chunkId,
          excerpt: chunk.text,
          relevanceScore: 0.9,
        });
      }
    }

    // 2. Uploaded Document Retrieval
    if (query.documentIds && query.documentIds.length > 0) {
      for (const docId of query.documentIds) {
        const chunks = await documentStorage.getChunksByDocument(docId);
        for (const chunk of chunks) {
          // Naive matching for document chunks based on some overlap, 
          // or just return all chunks if it's a direct document question for simplicity in MVP
          // Let's do simple term matching for MVP
          const terms = qLower.split(/\s+/).filter(t => t.length > 3);
          const chunkLower = chunk.text.toLowerCase();
          const matches = terms.some(t => chunkLower.includes(t));
          
          if (matches || terms.length === 0) {
            results.push({
              evidenceId: chunk.chunkId,
              sourceId: `user-doc-${docId}`, // Dynamic source for user uploaded documents
              chunkReferenceId: chunk.chunkId,
              excerpt: chunk.text,
              relevanceScore: 0.85,
            });
          }
        }
      }
    }
    
    // Deduplicate and slice
    const uniqueResults = Array.from(new Map(results.map(item => [item.evidenceId, item])).values());
    
    return uniqueResults.slice(0, query.maxResults || 5);
  }
}

