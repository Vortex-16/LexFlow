import React from 'react';
import { LegalAnswer } from '@/domain/legal/response';
import { SourcePanel } from '../sources/SourcePanel';

interface AskResponseProps {
  response: LegalAnswer;
}

export const AskResponse = React.memo(function AskResponse({ response }: AskResponseProps) {
  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Answer</h2>
        <p className="text-neutral-900 leading-relaxed text-base">{response.answer}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Explanation</h2>
        <p className="text-neutral-800 leading-relaxed text-base">{response.explanation}</p>
      </section>

      {response.missingContext && response.missingContext.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Assumptions & Missing Context</h2>
          <ul className="list-disc list-inside text-base text-neutral-800 space-y-1">
            {response.missingContext.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>
      )}

      {response.evidence && response.evidence.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Evidence</h2>
          <div className="flex flex-col gap-4">
            {response.evidence.map((ev, i) => {
              const citations = response.citations.filter(c => c.evidenceId === ev.evidenceId);
              return <SourcePanel key={ev.evidenceId} evidence={ev} citations={citations} index={i + 1} />;
            })}
          </div>
        </section>
      )}

      {response.nextSteps && response.nextSteps.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Next Steps</h2>
          <ul className="list-decimal list-inside text-base text-neutral-800 space-y-1">
            {response.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
      )}

      {response.uncertainties && response.uncertainties.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Limitations / Uncertainty</h2>
          <ul className="list-disc list-inside text-base text-neutral-800 space-y-1">
            {response.uncertainties.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        </section>
      )}

      {response.risk && response.escalation && (
        <section className="bg-red-50 border-l-4 border-red-700 p-4 rounded-r-md flex flex-col gap-2 mt-4">
          <h2 className="text-lg font-semibold text-red-900">Escalation</h2>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-red-800 uppercase text-xs tracking-wider bg-red-200 px-2 py-0.5 rounded-sm">{response.risk.level} RISK</span>
            <span className="text-red-900 text-sm font-medium">{response.risk.category}</span>
          </div>
          <p className="text-red-900 text-base mb-2">{response.risk.reason}</p>
          <p className="text-red-900 text-base font-medium">
            {response.escalation}
          </p>
        </section>
      )}

    </div>
  );
});
