'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DocumentSelector } from '@/components/compare/DocumentSelector';
import { ComparisonSummary } from '@/domain/documents/comparison';

const ComparisonViewer = dynamic(
  () => import('@/components/compare/ComparisonViewer').then(mod => ({ default: mod.ComparisonViewer })),
  { loading: () => <div className="animate-pulse bg-neutral-100 h-40 rounded-lg" /> }
);

export default function ComparePage() {
  const [docAId, setDocAId] = useState<string | null>(null);
  const [docBId, setDocBId] = useState<string | null>(null);
  
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ComparisonSummary | null>(null);

  const handleCompare = async () => {
    if (!docAId || !docBId) return;
    
    setComparing(true);
    setError(null);
    setComparison(null);
    
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentAId: docAId,
          documentBId: docBId,
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Comparison failed');
      }
      
      setComparison(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Compare Documents</h1>
        <p className="text-neutral-600">Select two documents to identify structural, textual, and semantic differences.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DocumentSelector 
            label="Document A (Original)" 
            selectedId={docAId} 
            onSelect={setDocAId} 
          />
          <DocumentSelector 
            label="Document B (Modified)" 
            selectedId={docBId} 
            onSelect={setDocBId} 
          />
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={handleCompare}
            disabled={!docAId || !docBId || comparing}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            {comparing ? 'Comparing...' : 'Compare'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-8 border border-red-200" role="alert">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {comparison && (
        <div className="mt-8">
          <ComparisonViewer comparison={comparison} />
        </div>
      )}
    </div>
  );
}
