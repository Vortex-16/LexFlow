import { LEGAL_ASSISTANT_SYSTEM_PROMPT } from './prompts/legal-assistant';
import { GenerateAnswerRequest } from './provider';

export function buildPrompt(request: GenerateAnswerRequest): { system: string, user: string } {
  const contextBlock = request.context ? `<USER_CONTEXT>\n${request.context}\n</USER_CONTEXT>\n` : '';
  const jurisdictionBlock = request.jurisdiction ? `<JURISDICTION>\nCountry: ${request.jurisdiction.country}\nState: ${request.jurisdiction.stateOrRegion || 'N/A'}\n</JURISDICTION>\n` : '';
  
  let evidenceBlock = '<DATA>\n';
  request.evidence.forEach((ev) => {
    evidenceBlock += `[Evidence ID: ${ev.evidenceId}]\nSource ID: ${ev.sourceId}\nExcerpt: ${ev.excerpt}\n\n`;
  });
  evidenceBlock += '</DATA>';

  const userPrompt = `
${contextBlock}
${jurisdictionBlock}
${evidenceBlock}

<USER_INPUT>
${request.question}
</USER_INPUT>
`;

  return {
    system: LEGAL_ASSISTANT_SYSTEM_PROMPT,
    user: userPrompt
  };
}
