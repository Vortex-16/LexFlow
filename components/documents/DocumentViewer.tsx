'use client';

import React, { useState, useEffect } from 'react';
import { DocumentMetadata, DocumentSummary } from '@/domain/documents/document';

interface Props {
  document: DocumentMetadata | null;
}

export default function DocumentViewer({ document }: Props) {
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when a new document is uploaded
  useEffect(() => {
    setSummary(null);
    setError(null);
  }, [document?.documentId]);

  if (!document) {
    return (
      <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center text-neutral-500">
        No document selected
      </div>
    );
  }

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/documents/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.documentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to summarize document');
      setSummary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      <header className="border-b border-neutral-200 pb-4 mb-4 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1">{document.filename}</h2>
          <div className="text-sm text-neutral-600">
            {(document.sizeBytes / 1024).toFixed(1)} KB • {document.mimeType}
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${document.status === 'READY' ? 'bg-green-100 text-green-900 border border-green-200' : 
              document.status === 'FAILED' ? 'bg-red-100 text-red-900 border border-red-200' : 
              'bg-yellow-100 text-yellow-900 border border-yellow-200'}`}>
            {document.status}
          </span>
        </div>
      </header>

      <div className="text-neutral-800">
        {document.status === 'READY' ? (
          <div className="space-y-6">
            {!summary && !loading && (
              <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold mb-2">Simplify Complex Legal Terms</h3>
                <p className="text-neutral-600 mb-4 text-sm max-w-md mx-auto">
                  Generate a plain-language summary and an actionable checklist of key obligations and risks for this document.
                </p>
                <button
                  onClick={handleSummarize}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
                >
                  Simplify & Summarize Document
                </button>
                {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
              </div>
            )}

            {loading && (
              <div className="p-6 border border-neutral-200 rounded-lg animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-2 bg-neutral-200 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-neutral-200 rounded col-span-2"></div>
                      <div className="h-2 bg-neutral-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            {summary && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-blue-900">Plain-Language Summary</h3>
                    {summary.riskLevel && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                        summary.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                        summary.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {summary.riskLevel} Risk
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{summary.summary}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Actionable Checklist
                  </h3>
                  <ul className="space-y-2">
                    {summary.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-neutral-50 p-3 rounded border border-neutral-100">
                        <input type="checkbox" className="mt-1 flex-shrink-0 w-4 h-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500" />
                        <span className="text-sm text-neutral-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : document.status === 'FAILED' ? (
          <p className="text-red-700 font-medium p-4 bg-red-50 rounded-md border border-red-100">Failed to process this document.</p>
        ) : (
          <p className="p-4 text-neutral-500 animate-pulse" aria-live="polite">Processing...</p>
        )}
      </div>
    </section>
  );
}
