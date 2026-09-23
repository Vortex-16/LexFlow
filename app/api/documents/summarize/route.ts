import { NextRequest, NextResponse } from 'next/server';
import { orchestrateDocumentSummary } from '@/lib/ai/orchestrator';
import { DomainError } from '@/domain/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body || !body.documentId || typeof body.documentId !== 'string') {
      return NextResponse.json({ message: 'Missing or invalid documentId.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'global';
    
    const summary = await orchestrateDocumentSummary(body.documentId, ip);
    
    return NextResponse.json(summary);
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      if (error.code === 'RATE_LIMITED') {
        return NextResponse.json({ message: error.message }, { status: 429 });
      }
      if (error.code === 'INVALID_DOCUMENT') {
        return NextResponse.json({ message: error.message }, { status: 404 });
      }
      return NextResponse.json({ message: error.message, details: error.details }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'An unexpected error occurred during summarization.' }, { status: 500 });
  }
}
