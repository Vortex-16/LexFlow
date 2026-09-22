'use client';

import React, { useEffect, useState } from 'react';
import { DocumentMetadata } from '@/domain/documents/document';

interface Props {
  label: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  excludeId?: string | null;
}

export function DocumentSelector({ label, selectedId, onSelect }: Props) {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then((data: DocumentMetadata[]) => {
        // Only show READY documents
        setDocuments(data.filter(d => d.status === 'READY'));
        setLoading(false);
      })
      .catch(() => {

        setLoading(false);
      });
  }, []);

  const selectId = `selector-${label.replace(/\s+/g, '-').toLowerCase()}`;

  if (loading) {
    return <div className="animate-pulse h-10 bg-neutral-200 rounded w-full"></div>;
  }

  if (documents.length === 0) {
    return (
      <div className="w-full">
        <label htmlFor={selectId} className="block text-sm font-medium text-neutral-900 mb-1">{label}</label>
        <select id={selectId} disabled className="w-full border-neutral-300 rounded-md shadow-sm focus-visible:ring p-2 border bg-neutral-50 text-neutral-500">
          <option>No available documents</option>
        </select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label htmlFor={selectId} className="block text-sm font-medium text-neutral-900 mb-1">{label}</label>
      <select 
        id={selectId}
        className="w-full border-neutral-300 rounded-md shadow-sm focus-visible:ring p-2 border text-neutral-900"
        value={selectedId || ''}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="" disabled>Select a document...</option>
        {documents.map(doc => {
          return (
            <option key={doc.documentId} value={doc.documentId}>
              {doc.filename} ({(doc.sizeBytes / 1024).toFixed(1)} KB)
            </option>
          );
        })}
      </select>
    </div>
  );
}
