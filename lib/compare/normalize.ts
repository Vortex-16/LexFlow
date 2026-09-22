/**
 * Normalizes text for comparison.
 * Standardizes line endings and whitespace without destroying meaningful characters,
 * numbers, dates, or punctuation.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    // Standardize line endings to LF
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Collapse multiple spaces/tabs into a single space
    .replace(/[ \t]+/g, ' ')
    // Remove whitespace from empty lines
    .replace(/\n[ \t]+\n/g, '\n\n')
    // Collapse more than 2 consecutive newlines into exactly 2
    .replace(/\n{3,}/g, '\n\n')
    // Trim leading/trailing whitespace
    .trim();
}
