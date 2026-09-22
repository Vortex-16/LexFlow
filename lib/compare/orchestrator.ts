import { Difference, ComparisonSummary } from '@/domain/documents/comparison';
import { ILLMProvider } from '@/lib/ai/provider';
import { v4 as uuidv4 } from 'uuid';

export class ComparisonOrchestrator {
  constructor(private provider: ILLMProvider) {}

  /**
   * Enriches deterministic differences with semantic explanations from the LLM.
   * Modifies the input differences in-place or returns a new array.
   */
  /**
   * The semantic layer is constrained to explain differences detected by the deterministic comparison engine.
   * It cannot introduce new textual differences or hallucinate document content.
   */
  async explainDifferences(differences: Difference[]): Promise<Difference[]> {
    const enriched = [...differences];
    
    // We only want to explain material differences or actual changes
    for (let i = 0; i < enriched.length; i++) {
      const diff = enriched[i];
      if (diff.changeType !== 'UNCHANGED') {
        try {
          const explanation = await this.provider.explainDifference({
            changeType: diff.changeType,
            beforeText: diff.beforeText,
            afterText: diff.afterText,
          });
          
          diff.summary = explanation;
        } catch {
          console.error(JSON.stringify({ operation: 'explainDifference', errorCategory: 'llm_failure' }));
          diff.summary = 'Failed to generate semantic explanation for this difference.';
        }
      } else {
        diff.summary = 'No textual differences were detected in the compared content.';
      }
    }
    
    return enriched;
  }

  /**
   * Generates the final ComparisonSummary.
   */
  generateComparisonSummary(documentAId: string, documentBId: string, differences: Difference[]): ComparisonSummary {
    const changedCount = differences.filter(d => d.changeType !== 'UNCHANGED').length;
    
    return {
      comparisonId: uuidv4(),
      documentAId,
      documentBId,
      differences,
      overallSummary: changedCount === 0 
        ? 'No substantive differences detected.'
        : `Found ${changedCount} difference(s) between the documents.`,
    };
  }
}
