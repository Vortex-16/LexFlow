import { v4 as uuidv4 } from 'uuid';
import { Chunk } from '@/domain/documents/chunk';
import { Difference } from '@/domain/documents/comparison';
import { alignChunks } from './alignment';
import { diffWords } from 'diff';
import { normalizeText } from './normalize';

/**
 * Heuristically detects if a change might be material.
 * Looks for numbers, amounts, percentages, and common obligation keywords.
 */
function detectMaterialChange(before: string, after: string): boolean {
  // Very simplistic check for demonstration: 
  // If digits changed, or keywords like "shall", "may", "must", "days", "months", "$", "%" appear/disappear.
  const regex = /(\d+|shall|may|must|days|months|years|%|\$|₹|€|£|prohibited|permitted)/i;
  
  const beforeTokens = before.match(new RegExp(regex, 'g')) || [];
  const afterTokens = after.match(new RegExp(regex, 'g')) || [];
  
  // If the count or presence of these tokens differs, flag as material.
  // A robust implementation would do precise diff analysis on these tokens.
  const beforeStr = beforeTokens.join(' ').toLowerCase();
  const afterStr = afterTokens.join(' ').toLowerCase();
  
  return beforeStr !== afterStr;
}

export function compareChunks(chunksA: Chunk[], chunksB: Chunk[]): Difference[] {
  const aligned = alignChunks(chunksA, chunksB);
  const differences: Difference[] = [];

  for (const pair of aligned) {
    if (pair.status === 'MATCHED' && pair.chunkA && pair.chunkB) {
      // Check if they are actually identical in text
      const normA = normalizeText(pair.chunkA.text);
      const normB = normalizeText(pair.chunkB.text);
      
      if (normA === normB) {
        differences.push({
          differenceId: uuidv4(),
          changeType: 'UNCHANGED',
          sectionAId: pair.chunkA.chunkId,
          sectionBId: pair.chunkB.chunkId,
          beforeText: pair.chunkA.text,
          afterText: pair.chunkB.text,
          summary: 'Sections are identical.',
          isMaterial: false,
        });
      } else {
        // Find word-level differences
        const textDiff = diffWords(pair.chunkA.text, pair.chunkB.text);
        
        // Detect if material
        const isMaterial = detectMaterialChange(pair.chunkA.text, pair.chunkB.text);
        
        differences.push({
          differenceId: uuidv4(),
          changeType: 'MODIFIED',
          sectionAId: pair.chunkA.chunkId,
          sectionBId: pair.chunkB.chunkId,
          beforeText: pair.chunkA.text,
          afterText: pair.chunkB.text,
          textDiff,
          summary: isMaterial ? 'Potential material change detected.' : 'Text was modified.',
          isMaterial,
        });
      }
    } else if (pair.status === 'ADDED' && pair.chunkB) {
      differences.push({
        differenceId: uuidv4(),
        changeType: 'ADDED',
        sectionBId: pair.chunkB.chunkId,
        afterText: pair.chunkB.text,
        summary: 'Section was added.',
        isMaterial: detectMaterialChange('', pair.chunkB.text), // High likelihood of being material
      });
    } else if (pair.status === 'REMOVED' && pair.chunkA) {
      differences.push({
        differenceId: uuidv4(),
        changeType: 'REMOVED',
        sectionAId: pair.chunkA.chunkId,
        beforeText: pair.chunkA.text,
        summary: 'Section was removed.',
        isMaterial: detectMaterialChange(pair.chunkA.text, ''),
      });
    } else if (pair.status === 'MOVED' && pair.chunkA && pair.chunkB) {
      // It's MOVED, but might also be MODIFIED. We can calculate word diff too.
      const normA = normalizeText(pair.chunkA.text);
      const normB = normalizeText(pair.chunkB.text);
      const isModified = normA !== normB;
      const textDiff = isModified ? diffWords(pair.chunkA.text, pair.chunkB.text) : undefined;
      const isMaterial = detectMaterialChange(pair.chunkA.text, pair.chunkB.text);
      
      differences.push({
        differenceId: uuidv4(),
        changeType: 'MOVED',
        sectionAId: pair.chunkA.chunkId,
        sectionBId: pair.chunkB.chunkId,
        beforeText: pair.chunkA.text,
        afterText: pair.chunkB.text,
        textDiff,
        summary: isModified ? 'Section was moved and modified.' : 'Section was moved.',
        isMaterial,
      });
    }
  }

  return differences;
}
