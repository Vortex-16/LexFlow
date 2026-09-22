'use client';

import React, { useState, useRef } from 'react';
import { DocumentMetadata } from '@/domain/documents/document';

interface Props {
  onUploadSuccess: (doc: DocumentMetadata) => void;
}

export default function DocumentUploader({ onUploadSuccess }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side validation
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedTypes = ['text/plain', 'text/markdown', 'application/pdf'];
    if (!allowedTypes.includes(file.type) && !['.txt', '.md', '.pdf'].some(ext => file.name.toLowerCase().endsWith(ext))) {
      setError('Unsupported file type. Please upload a .txt, .md, or .pdf file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      onUploadSuccess(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Explain My Document</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-900 rounded-md text-sm border border-red-200" role="alert">
          {error}
        </div>
      )}

      <label className="relative block border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-neutral-500 focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-neutral-900 transition-all cursor-pointer">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
          disabled={isUploading}
          aria-disabled={isUploading}
        />
        <div className="space-y-2 pointer-events-none">
          <div className="text-neutral-900 font-medium" aria-live="polite">
            {isUploading ? 'Uploading and processing...' : 'Click to select or drag a file here'}
          </div>
          <div className="text-sm text-neutral-600">
            Supported formats: PDF, TXT, MD. Max 10MB.
          </div>
        </div>
      </label>
    </section>
  );
}
