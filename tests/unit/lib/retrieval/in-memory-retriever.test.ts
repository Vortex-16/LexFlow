import { describe, it, expect } from 'vitest';
import { InMemoryRetriever } from '@/lib/retrieval/in-memory-retriever';

describe('In-Memory Retriever', () => {
  it('should retrieve relevant chunks based on keyword matching', async () => {
    const retriever = new InMemoryRetriever();
    const results = await retriever.retrieve({ question: 'How much notice for tenant?' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].excerpt).toContain('notice');
  });

  it('should filter by jurisdiction', async () => {
    const retriever = new InMemoryRetriever();
    const results = await retriever.retrieve({ 
      question: 'tenant notice',
      jurisdiction: { country: 'US' } // NZ source should be excluded
    });
    // For 'US', the NZ source should be excluded. The contract source might remain if it matches.
    expect(results.every(r => r.sourceId !== 'src-100')).toBe(true);
  });
});
