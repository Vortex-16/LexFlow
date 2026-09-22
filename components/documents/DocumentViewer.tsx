'use client';

import React from 'react';
import { DocumentMetadata } from '@/domain/documents/document';

interface Props {
  document: DocumentMetadata | null;
}

export default function DocumentViewer({ document }: Props) {
  if (!document) {
    return (
      <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center text-neutral-500">
        No document selected
      </div>
    );
  }

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

      <div className="prose prose-sm max-w-none text-neutral-800">
        {document.status === 'READY' ? (
          <p>
            Document processed successfully. You can now ask questions about this document.
            <br/><br/>
            <em className="text-neutral-600">(Document content viewing and section breakdown will be fully implemented in a future phase. For now, the document is securely chunked and ready for Q&A.)</em>
          </p>
        ) : document.status === 'FAILED' ? (
          <p className="text-red-700 font-medium">Failed to process this document.</p>
        ) : (
          <p aria-live="polite">Processing...</p>
        )}
      </div>
    </section>
  );
}
