import { NextResponse } from 'next/server';
import { orchestrateAskFlow } from '@/lib/ai/orchestrator';
import { DomainError } from '@/domain/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract IP for rate limiting (enforced inside orchestrateAskFlow)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const result = await orchestrateAskFlow(body, ip);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DomainError) {
      // Map domain errors to standard HTTP status codes
      const status = error.code === 'INVALID_REQUEST' ? 400 :
                     error.code === 'UNSAFE_REQUEST' ? 403 : 
                     error.code === 'RATE_LIMITED' ? 429 : 500;
      
      return NextResponse.json({
        error: error.code,
        message: error.message,
        details: error.details
      }, { status });
    }
    
    // Log unexpected errors securely (no stack trace to client)
    console.error(JSON.stringify({ operation: 'ask_api', errorCategory: 'server_error' }));
    return NextResponse.json({
      error: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred.'
    }, { status: 500 });
  }
}
