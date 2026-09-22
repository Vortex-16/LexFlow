import { Chunk } from '@/domain/documents/chunk';
import { Source } from '@/domain/legal/source';

export const mockSources: Source[] = [
  {
    sourceId: '33333333-3333-4333-a333-333333333333',
    title: 'Residential Tenancies Act 1986',
    type: 'LEGISLATION',
    url: 'https://www.legislation.govt.nz/act/public/1986/0120/latest/DLM94278.html',
    jurisdiction: { country: 'NZ' },
    origin: 'New Zealand Government',
    publishedAt: '1986-12-18T00:00:00Z',
  },
  {
    sourceId: '44444444-4444-4444-a444-444444444444',
    title: 'Standard Tenancy Agreement',
    type: 'CONTRACT',
    origin: 'LexFlow System',
    publishedAt: '2023-01-01T00:00:00Z',
  }
];

export const mockChunks: Chunk[] = [
  {
    chunkId: '55555555-5555-4555-a555-555555555555',
    documentId: '11111111-1111-4111-a111-111111111111',
    text: 'Section 51(1)(a): A landlord must give at least 90 days\' notice to terminate a periodic tenancy. Notice must be in writing.',
    chunkIndex: 0,
    sourceLocation: 'Section 51(1)(a)'
  },
  {
    chunkId: '66666666-6666-4666-a666-666666666666',
    documentId: '22222222-2222-4222-a222-222222222222',
    text: 'Clause 4.2: The tenant shall pay rent in advance on the 1st of every month. Failure to pay may result in a 14-day notice to remedy.',
    chunkIndex: 0,
    sourceLocation: 'Clause 4.2'
  }
];
