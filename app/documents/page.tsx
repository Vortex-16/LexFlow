'use client';

import React, { useState } from 'react';
import DocumentUploader from '@/components/documents/DocumentUploader';
import DocumentViewer from '@/components/documents/DocumentViewer';
import { AskForm } from '@/components/legal/AskForm';
import { AskResponse } from '@/components/legal/AskResponse';
import { DocumentMetadata } from '@/domain/documents/document';
import { AskRequest } from '@/domain/requests/ask';
import { LegalAnswer } from '@/domain/legal/response';

export default function DocumentsPage() {
  const [document, setDocument] = useState<DocumentMetadata | null>(null);
  
  // Q&A State
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<LegalAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (doc: DocumentMetadata) => {
    setDocument(doc);
    setResponse(null);
    setError(null);
  };

  const handleAskSubmit = async (request: AskRequest) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'An error occurred while processing your request.');
      } else {
        setResponse(data as LegalAnswer);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAsk = () => {
    setResponse(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 min-h-screen">
      <div className="text-center mb-10 w-full flex flex-col items-center">
        <div className="h-10 w-10 bg-neutral-900 rounded-lg flex items-center justify-center mb-4 shadow-sm">
          <span className="text-white font-bold text-xl leading-none font-serif">L</span>
        </div>
        <h1 className="text-3xl font-semibold mb-2 tracking-tight">My Documents</h1>
        <p className="text-base text-neutral-500 max-w-lg">
          Upload a legal document to understand its contents and ask questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload and View */}
        <div className="space-y-8">
          <DocumentUploader onUploadSuccess={handleUploadSuccess} />
          <DocumentViewer document={document} />
        </div>

        {/* Right Column: Q&A */}
        <div>
          {document && document.status === 'READY' ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Ask About This Document</h2>
              
              {error && (
                <div className="mb-6 bg-red-50 text-red-600 border border-red-200 p-4 rounded-md text-sm">
                  <span className="font-semibold block mb-1">Error</span>
                  {error}
                </div>
              )}

              {!response && (
                <AskForm 
                  onSubmit={handleAskSubmit} 
                  isLoading={loading} 
                  defaultDocumentIds={[document.documentId]} 
                />
              )}

              {response && !loading && (
                <div className="flex flex-col gap-6">
                  <AskResponse response={response} />
                  <div className="pt-6 border-t border-neutral-100 flex justify-center">
                    <button 
                      onClick={handleResetAsk}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-medium rounded-md transition-colors"
                    >
                      Ask Another Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center text-neutral-500 h-full flex items-center justify-center min-h-[300px]">
              Upload a document to ask questions about it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
