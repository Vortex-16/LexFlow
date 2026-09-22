import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessor } from '@/lib/documents/processor';
import { DomainError } from '@/domain/errors';

const processor = new DocumentProcessor();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { rateLimiter } = await import('@/lib/security/rate-limit');
    rateLimiter.checkRateLimit(ip);

    if (!file) {
      return NextResponse.json({
        code: 'INVALID_REQUEST',
        message: 'No file provided.'
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process document
    const metadata = await processor.process(buffer, file.name, file.type, file.size);
    
    return NextResponse.json(metadata, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      const status = error.code === 'DOCUMENT_TOO_LARGE' ? 413 : 
                     error.code === 'RATE_LIMITED' ? 429 : 400;
      return NextResponse.json({
        code: error.code,
        message: error.message,
      }, { status });
    }
    
    console.error(JSON.stringify({ operation: 'document_api', errorCategory: 'server_error' }));
    return NextResponse.json({
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred during document processing.'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { documentStorage } = await import('@/lib/storage/in-memory-store');
    const docs = await documentStorage.listDocuments();
    return NextResponse.json(docs, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to list documents' }, { status: 500 });
  }
}
