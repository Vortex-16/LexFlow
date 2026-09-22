import { Evidence } from '@/domain/legal/evidence';
import { Citation } from '@/domain/legal/citation';

interface SourcePanelProps {
  evidence: Evidence;
  citations: Citation[];
  index: number;
}

export function SourcePanel({ evidence, citations, index }: SourcePanelProps) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-200 flex justify-between items-center">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Source {index}</span>
        <span className="text-xs text-neutral-400 font-mono" title="Source ID">{evidence.sourceId.substring(0, 8)}...</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {citations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {citations.map((c, i) => (
              <span key={i} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
                {c.displayLabel}
              </span>
            ))}
          </div>
        )}
        <div className="relative pl-4 border-l-2 border-neutral-300">
          <p className="text-sm text-neutral-700 font-serif leading-relaxed italic">
            &quot;{evidence.excerpt}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
