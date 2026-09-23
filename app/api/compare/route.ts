import { NextResponse } from 'next/server';
import { z } from 'zod';
import { documentStorage } from '@/lib/storage/in-memory-store';
import { compareChunks } from '@/lib/compare/engine';
import { ComparisonOrchestrator } from '@/lib/compare/orchestrator';
import { MockLLMProvider } from '@/lib/ai/mock-provider';

// Hardcoded for development, should use a factory in production
const orchestrator = new ComparisonOrchestrator(new MockLLMProvider());

const CompareRequestSchema = z.object({
  documentAId: z.string().uuid(),
  documentBId: z.string().uuid(),
  sectionAId: z.string().uuid().optional(),
  sectionBId: z.string().uuid().optional(),
}).strict();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { rateLimiter } = await import('@/lib/security/rate-limit');
    rateLimiter.checkRateLimit(ip);
    
    const parsed = CompareRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }
    
    const { documentAId, documentBId, sectionAId, sectionBId } = parsed.data;

    if (documentAId === documentBId) {
      return NextResponse.json({
        comparisonId: 'same-document',
        documentAId,
        documentBId,
        differences: [],
        overallSummary: 'No substantive differences detected.',
      });
    }

    const docA = await documentStorage.getDocument(documentAId);
    const docB = await documentStorage.getDocument(documentBId);

    if (!docA || !docB) {
      return NextResponse.json({ error: 'One or both documents not found' }, { status: 404 });
    }

    if (docA.status !== 'READY' || docB.status !== 'READY') {
      return NextResponse.json({ error: 'Both documents must be in READY state to compare' }, { status: 400 });
    }

    let chunksA = await documentStorage.getChunksByDocument(documentAId);
    let chunksB = await documentStorage.getChunksByDocument(documentBId);

    // Clause comparison scoped to sections
    if (sectionAId) {
      chunksA = chunksA.filter(c => c.sectionId === sectionAId);
      if (chunksA.length === 0) {
        return NextResponse.json({ error: 'sectionAId does not belong to documentAId or is empty' }, { status: 400 });
      }
    }

    if (sectionBId) {
      chunksB = chunksB.filter(c => c.sectionId === sectionBId);
      if (chunksB.length === 0) {
        return NextResponse.json({ error: 'sectionBId does not belong to documentBId or is empty' }, { status: 400 });
      }
    }

    // 1. Deterministic Engine
    const differences = compareChunks(chunksA, chunksB);

    // 2. Semantic Analysis
    const enrichedDifferences = await orchestrator.explainDifferences(differences);

    // 3. Generate Summary
    const summary = orchestrator.generateComparisonSummary(documentAId, documentBId, enrichedDifferences);

    return NextResponse.json(summary);
    
  } catch (err) {
    if (err instanceof Error && err.name === 'DomainError' && (err as { code?: string }).code === 'RATE_LIMITED') {
      return NextResponse.json({ error: 'RATE_LIMITED', message: err.message }, { status: 429 });
    }
    console.error(JSON.stringify({ operation: 'compare_api', errorCategory: 'server_error' }));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
