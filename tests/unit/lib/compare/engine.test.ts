import { describe, it, expect } from 'vitest';
import { compareChunks } from '@/lib/compare/engine';
import { Chunk } from '@/domain/documents/chunk';

describe('compareChunks engine', () => {
  it('detects UNCHANGED', () => {
    const chunkA: Chunk = { chunkId: '1', documentId: 'A', chunkIndex: 0, text: 'This is a test.' };
    const chunkB: Chunk = { chunkId: '2', documentId: 'B', chunkIndex: 0, text: 'This is a test.' };
    
    const diffs = compareChunks([chunkA], [chunkB]);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].changeType).toBe('UNCHANGED');
  });

  it('detects MODIFIED and flags material changes', () => {
    const chunkA: Chunk = { chunkId: '1', documentId: 'A', chunkIndex: 0, text: 'Notice period is 30 days.' };
    const chunkB: Chunk = { chunkId: '2', documentId: 'B', chunkIndex: 0, text: 'Notice period is 60 days.' };
    
    const diffs = compareChunks([chunkA], [chunkB]);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].changeType).toBe('MODIFIED');
    expect(diffs[0].isMaterial).toBe(true); // 30 changed to 60
  });

  it('detects ADDED and REMOVED', () => {
    const chunkA: Chunk = { chunkId: '1', documentId: 'A', chunkIndex: 0, text: 'Only in A.' };
    const chunkB: Chunk = { chunkId: '2', documentId: 'B', chunkIndex: 0, text: 'Only in B.' };
    
    const diffs = compareChunks([chunkA], [chunkB]);
    
    const removed = diffs.find(d => d.changeType === 'REMOVED');
    const added = diffs.find(d => d.changeType === 'ADDED');
    
    expect(removed).toBeDefined();
    expect(added).toBeDefined();
  });
});
