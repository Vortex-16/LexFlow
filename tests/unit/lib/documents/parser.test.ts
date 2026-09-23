// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { PdfParser } from '../../../../lib/documents/parser';

describe('PdfParser', () => {
  it('extracts text from a real PDF', async () => {
    const pdfPath = path.join(import.meta.dirname, '../../../fixtures/sample.pdf');
    const buffer = fs.readFileSync(pdfPath);
    const parser = new PdfParser();
    const result = await parser.parse(buffer);

    expect(result.text).toContain('Notice period is thirty days.');
  });
});
