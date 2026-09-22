'use client';

import { useState } from 'react';
import { AskForm } from '@/components/legal/AskForm';
import { AskResponse } from '@/components/legal/AskResponse';
import { AskRequest } from '@/domain/requests/ask';
import { LegalAnswer } from '@/domain/legal/response';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<LegalAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (request: AskRequest) => {
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

  const handleReset = () => {
    setResponse(null);
    setError(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-12 md:p-24 bg-white text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900">
      <div className="z-10 w-full max-w-3xl flex flex-col items-center justify-center font-sans">
        
        <div className="mb-8 w-full flex flex-col">
          <h1 className="text-2xl font-semibold mb-1 text-neutral-900">Ask LexFlow</h1>
          <p className="text-sm text-neutral-600">
            Ask questions about legal information and understand supporting source material.
          </p>
        </div>

        <div className="w-full bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm transition-all">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 border border-red-200 p-4 rounded-md text-sm">
              <span className="font-semibold block mb-1">Error</span>
              {error}
            </div>
          )}

          {!response && (
            <AskForm onSubmit={handleSubmit} isLoading={loading} />
          )}

          {response && !loading && (
            <div className="flex flex-col gap-6">
              <AskResponse response={response} />
              <div className="pt-6 border-t border-neutral-100 flex justify-center">
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-medium rounded-md transition-colors"
                >
                  Ask Another Question
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center text-xs text-neutral-400 max-w-xl">
          LexFlow provides legal information and navigation assistance, not legal advice. 
          For professional legal representation or specific legal advice, please consult a qualified attorney in your jurisdiction.
        </div>
      </div>
    </main>
  );
}
