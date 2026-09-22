import { test, expect } from 'vitest';
import { DocumentProcessor } from '@/lib/documents/processor';
import { DomainError } from '@/domain/errors';

test('DocumentProcessor rejects path traversal filenames', async () => {
  const processor = new DocumentProcessor();
  const buffer = Buffer.from('test content');

  await expect(processor.process(buffer, '../../../etc/passwd.txt', 'text/plain', buffer.length))
    .rejects
    .toThrowError(new DomainError('INVALID_DOCUMENT', 'Invalid filename structure.'));

  await expect(processor.process(buffer, 'C:\\Windows\\System32\\cmd.txt', 'text/plain', buffer.length))
    .rejects
    .toThrowError(new DomainError('INVALID_DOCUMENT', 'Invalid filename structure.'));
});

test('DocumentProcessor rejects unsupported extensions', async () => {
  const processor = new DocumentProcessor();
  const buffer = Buffer.from('test content');

  await expect(processor.process(buffer, 'script.sh', 'text/plain', buffer.length))
    .rejects
    .toThrowError(new DomainError('UNSUPPORTED_DOCUMENT', 'File extension .sh is not supported.'));
});
