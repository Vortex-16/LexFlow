import { describe, it, expect } from 'vitest';
import { alignChunks } from '@/lib/compare/alignment';
import { Chunk } from '@/domain/documents/chunk';

describe('alignChunks', () => {
  it('aligns identical chunks', () => {
    const chunksA: Chunk[] = [{ chunkId: '1', documentId: 'a', text: 'hello world', chunkIndex: 0 }];
    const chunksB: Chunk[] = [{ chunkId: '2', documentId: 'b', text: 'hello world', chunkIndex: 0 }];
    
    const aligned = alignChunks(chunksA, chunksB);
    expect(aligned).toHaveLength(1);
    expect(aligned[0].status).toBe('MATCHED');
    expect(aligned[0].chunkA?.chunkId).toBe('1');
    expect(aligned[0].chunkB?.chunkId).toBe('2');
  });

  it('detects moves', () => {
    const chunksA: Chunk[] = [
      { chunkId: '1', documentId: 'a', text: 'section one', chunkIndex: 0 },
      { chunkId: '2', documentId: 'a', text: 'section two', chunkIndex: 1 }
    ];
    const chunksB: Chunk[] = [
      { chunkId: '3', documentId: 'b', text: 'section two', chunkIndex: 0 },
      { chunkId: '4', documentId: 'b', text: 'section one', chunkIndex: 1 }
    ];
    
    const aligned = alignChunks(chunksA, chunksB);
    // Myers diff will match one of them, and leave the other as added/removed.
    // Our MOVED logic will pick up the added/removed one.
    const moved = aligned.filter(a => a.status === 'MOVED');
    expect(moved.length).toBeGreaterThan(0);
  });
});
