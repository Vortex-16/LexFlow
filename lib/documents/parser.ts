

export interface ParsedDocument {
  text: string;
  metadata: {
    pageCount?: number;
    title?: string;
    author?: string;
  };
}

export interface IDocumentParser {
  parse(buffer: Buffer, mimeType: string): Promise<ParsedDocument>;
}

export class TextParser implements IDocumentParser {
  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const text = buffer.toString('utf-8');
    return {
      text,
      metadata: {},
    };
  }
}

export class MarkdownParser implements IDocumentParser {
  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const text = buffer.toString('utf-8');
    return {
      text,
      metadata: {},
    };
  }
}

export class PdfParser implements IDocumentParser {
  async parse(buffer: Buffer): Promise<ParsedDocument> {
    try {
      // Require dynamically to avoid Next.js build errors related to DOMMatrix
      // Require directly to bypass module.parent debug execution in pdf-parse/index.js
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      // Pass Uint8Array to ensure PDFJS buffer compatibility across Node versions
      const uint8 = new Uint8Array(buffer);
      const data = await pdfParse(uint8);
      
      return {
        text: data.text,
        metadata: {
          pageCount: data.numpages,
          title: data.info?.Title,
          author: data.info?.Author,
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      // Graceful fallback for malformed or password-protected PDFs
      throw new Error(`PDF parsing failed: ${message}`);
    }
  }
}

export class DocumentParserFactory {
  static getParser(mimeType: string): IDocumentParser {
    switch (mimeType) {
      case 'text/plain':
        return new TextParser();
      case 'text/markdown':
        return new MarkdownParser();
      case 'application/pdf':
        return new PdfParser();
      default:
        throw new Error(`Unsupported mime type: ${mimeType}`);
    }
  }
}
