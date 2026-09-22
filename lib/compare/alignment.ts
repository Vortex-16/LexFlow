import { Chunk } from '@/domain/documents/chunk';
import { diffArrays } from 'diff';
import { normalizeText } from './normalize';

export interface AlignedChunkPair {
  chunkA?: Chunk;
  chunkB?: Chunk;
  status: 'MATCHED' | 'ADDED' | 'REMOVED' | 'MOVED';
}

/**
 * Calculates a simple Jaccard similarity between two text strings based on words.
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(normalizeText(text1).toLowerCase().split(/\s+/));
  const words2 = new Set(normalizeText(text2).toLowerCase().split(/\s+/));
  
  if (words1.size === 0 && words2.size === 0) return 1.0;
  
  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) intersection++;
  }
  
  const union = words1.size + words2.size - intersection;
  return intersection / union;
}

/**
 * Aligns two sets of chunks based on sequence and text similarity.
 * Uses Myers diff to find the longest common subsequence of similar chunks,
 * then attempts to find MOVED chunks among the additions and removals.
 */
export function alignChunks(chunksA: Chunk[], chunksB: Chunk[]): AlignedChunkPair[] {
  // We consider chunks "equal" for alignment if they are at least 60% similar.
  const similarityThreshold = 0.6;
  
  const changes = diffArrays(chunksA, chunksB, {
    comparator: (a: Chunk, b: Chunk) => calculateSimilarity(a.text, b.text) >= similarityThreshold
  });

  const aligned: AlignedChunkPair[] = [];
  const addedChunks: Chunk[] = [];
  const removedChunks: Chunk[] = [];

  // Group into aligned pairs
  let aIndex = 0;
  let bIndex = 0;
  
  for (const change of changes) {
    if (change.added) {
      for (const val of change.value) addedChunks.push(val);
      bIndex += change.value.length;
    } else if (change.removed) {
      for (const val of change.value) removedChunks.push(val);
      aIndex += change.value.length;
    } else {
      for (let i = 0; i < change.value.length; i++) {
        const chunkA = chunksA[aIndex + i];
        const chunkB = chunksB[bIndex + i];
        
        aligned.push({
          chunkA,
          chunkB,
          status: 'MATCHED'
        });
      }
      aIndex += change.value.length;
      bIndex += change.value.length;
    }
  }

  // Detect MOVED chunks from remaining added/removed
  const unhandledAdded = [...addedChunks];
  const unhandledRemoved = [...removedChunks];
  
  for (let i = 0; i < unhandledRemoved.length; i++) {
    const removed = unhandledRemoved[i];
    if (!removed) continue;
    
    // Find highest similarity match in added
    let bestMatchIdx = -1;
    let bestScore = 0;
    for (let j = 0; j < unhandledAdded.length; j++) {
      const added = unhandledAdded[j];
      if (!added) continue;
      const score = calculateSimilarity(removed.text, added.text);
      if (score > bestScore && score >= similarityThreshold) {
        bestScore = score;
        bestMatchIdx = j;
      }
    }
    
    if (bestMatchIdx !== -1) {
      const added = unhandledAdded[bestMatchIdx];
      aligned.push({ chunkA: removed, chunkB: added, status: 'MOVED' });
      unhandledRemoved[i] = undefined as unknown as Chunk;
      unhandledAdded[bestMatchIdx] = undefined as unknown as Chunk;
    }
  }
  
  // Remaining are true additions / removals
  for (const added of unhandledAdded.filter(Boolean)) {
    aligned.push({ chunkB: added, status: 'ADDED' });
  }
  
  for (const removed of unhandledRemoved.filter(Boolean)) {
    aligned.push({ chunkA: removed, status: 'REMOVED' });
  }

  return aligned;
}
