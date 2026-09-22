'use client';

import React from 'react';
import { ComparisonSummary, Difference } from '@/domain/documents/comparison';

interface Props {
  comparison: ComparisonSummary;
}

function DiffText({ difference }: { difference: Difference }) {
  // If we have a detailed word-level diff
  if (difference.textDiff && Array.isArray(difference.textDiff)) {
    return (
      <div className="text-sm font-mono whitespace-pre-wrap">
        {difference.textDiff.map((part: { value: string; added?: boolean; removed?: boolean }, i: number) => {
          if (part.added) return <span key={i} className="bg-green-100 text-green-800 px-1 rounded">{part.value}</span>;
          if (part.removed) return <span key={i} className="bg-red-100 text-red-800 px-1 rounded line-through">{part.value}</span>;
          return <span key={i} className="text-neutral-600">{part.value}</span>;
        })}
      </div>
    );
  }

  // Fallback for simple addition/removal
  if (difference.changeType === 'ADDED') {
    return (
      <div className="text-sm font-mono whitespace-pre-wrap bg-green-50 text-green-800 p-2 rounded">
        {difference.afterText}
      </div>
    );
  }
  
  if (difference.changeType === 'REMOVED') {
    return (
      <div className="text-sm font-mono whitespace-pre-wrap bg-red-50 text-red-800 p-2 rounded line-through">
        {difference.beforeText}
      </div>
    );
  }

  return null;
}

export function ComparisonViewer({ comparison }: Props) {
  if (comparison.differences.length === 0 || comparison.overallSummary === 'No substantive differences detected.') {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No differences</h3>
        <p className="text-neutral-500">{comparison.overallSummary}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-2 border-b border-neutral-200 pb-2">Comparison Summary</h2>
        <p className="text-neutral-800 leading-relaxed">{comparison.overallSummary}</p>
      </section>

      <div className="space-y-6">
        {comparison.differences.filter(d => d.changeType !== 'UNCHANGED').map((diff, idx) => (
          <article key={diff.differenceId} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <header className="border-b border-neutral-200 bg-neutral-50 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-neutral-900">Change #{idx + 1}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border
                  ${diff.changeType === 'ADDED' ? 'bg-green-50 text-green-900 border-green-200' : 
                    diff.changeType === 'REMOVED' ? 'bg-red-50 text-red-900 border-red-200' : 
                    diff.changeType === 'MOVED' ? 'bg-neutral-100 text-neutral-900 border-neutral-300' :
                    'bg-yellow-50 text-yellow-900 border-yellow-200'}`}>
                  {diff.changeType}
                </span>
                {diff.isMaterial && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border bg-red-50 text-accent border-red-200" aria-label="Review recommended">
                    Review Recommended
                  </span>
                )}
              </div>
            </header>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Explanation</h3>
                <div className="p-4 bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-md text-base leading-relaxed">
                  {diff.summary}
                </div>
              </section>

              <section className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Textual Difference</h3>
                <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 text-base">
                  <DiffText difference={diff} />
                </div>
              </section>

              {/* Side-by-side original texts for reference */}
              {diff.changeType !== 'ADDED' && diff.changeType !== 'REMOVED' && (
                <>
                  <section>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">Document A (Original)</h3>
                    <div className="text-base text-neutral-800 bg-neutral-50 p-4 rounded-md border border-neutral-200 h-full leading-relaxed">
                      {diff.beforeText}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">Document B (Modified)</h3>
                    <div className="text-base text-neutral-800 bg-neutral-50 p-4 rounded-md border border-neutral-200 h-full leading-relaxed">
                      {diff.afterText}
                    </div>
                  </section>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
