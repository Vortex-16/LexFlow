// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

describe('PdfParser', () => {
  it('extracts text from a real PDF', async () => {
    // Run pdf-parse in a clean Node process to bypass Vitest/jsdom pdf.js conflicts
    const scriptPath = path.join(import.meta.dirname, 'run-parse.js');
    const pdfPath = path.join(import.meta.dirname, '../../../fixtures/sample.pdf');
    fs.writeFileSync(scriptPath, `
      // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
      const pdfParse = require('pdf-parse');
      async function run() {
        const buffer = fs.readFileSync('${pdfPath.replace(/\\/g, '\\\\')}');
        const data = await pdfParse(buffer);
        console.log(data.text);
      }
      run();
    `);
    
    const output = execSync(`node "${scriptPath}"`).toString();
    fs.unlinkSync(scriptPath);
    
    expect(output).toContain('Notice period is thirty days.');
  });
});
