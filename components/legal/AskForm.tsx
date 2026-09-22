'use client';

import { useState } from 'react';
import { AskRequest } from '@/domain/requests/ask';

interface AskFormProps {
  onSubmit: (request: AskRequest) => Promise<void>;
  isLoading: boolean;
  defaultDocumentIds?: string[];
}

export function AskForm({ onSubmit, isLoading, defaultDocumentIds = [] }: AskFormProps) {
  const [question, setQuestion] = useState('');
  const [country, setCountry] = useState('');
  const [documentIds] = useState<string[]>(defaultDocumentIds);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const request: AskRequest = {
      question: question.trim(),
      documentIds,
    };

    if (country.trim()) {
      request.jurisdiction = { country: country.trim() };
    }

    await onSubmit(request);
  };

  const setExample = (q: string, c: string = '') => {
    setQuestion(q);
    setCountry(c);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div role="status" aria-live="polite" className="sr-only">
          {isLoading ? 'Processing your question...' : ''}
        </div>
        
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-neutral-900 mb-1">
            What is your legal question? <span className="text-accent" aria-hidden="true">*</span>
            <span className="sr-only">Required</span>
          </label>
          <textarea
            id="question"
            name="question"
            rows={4}
            className="w-full p-3 border border-neutral-300 rounded-md focus-visible:ring outline-none resize-y text-neutral-900"
            placeholder="e.g. How much notice does a landlord need to give to terminate a tenancy?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            maxLength={1000}
            required
            aria-required="true"
          />
          <div className="text-right text-xs text-neutral-500 mt-1">
            {question.length}/1000
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-neutral-900 mb-1">
            Jurisdiction / Country <span className="text-neutral-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            className="w-full p-2 border border-neutral-300 rounded-md focus-visible:ring outline-none text-neutral-900"
            placeholder="e.g. NZ, US, UK"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          aria-disabled={isLoading || !question.trim()}
          className="self-start sm:self-end px-6 py-2 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 focus-visible:ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Ask Question'}
        </button>
      </form>

      {!question && !isLoading && (
        <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 uppercase font-semibold tracking-wider">Example Questions</p>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setExample('How many days notice must a landlord give to terminate a periodic tenancy?', 'NZ')}
              className="text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors text-left"
            >
              Notice period for periodic tenancy (NZ)
            </button>
            <button 
              onClick={() => setExample('My landlord is trying to evict me today without notice. What do I do?', 'US')}
              className="text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors text-left"
            >
              Emergency eviction (High Risk)
            </button>
            <button 
              onClick={() => setExample('How many days notice to terminate a tenancy?')}
              className="text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors text-left"
            >
              Notice period (Missing Jurisdiction)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
