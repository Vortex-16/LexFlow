# Product Requirements — LexFlow

## 1. Problem

Legal information is often difficult to understand because it uses formal language, depends on jurisdiction and facts, and is distributed across lengthy documents and official sources.

## 2. Product goal

Reduce the effort needed for a non-lawyer to understand what a legal document or legal-information source says, what context matters, where the relevant evidence is, and what reasonable next step is available.

## 3. Target user

A non-lawyer person who may be:

- reading an agreement,
- comparing two versions of a document,
- trying to understand a legal term or rule,
- looking for the relevant section of a document,
- deciding whether more context or professional help is needed.

## 4. MVP capabilities

### A. Ask Legal

User enters a question plus optional jurisdiction and date.

The system should:

- identify the legal topic,
- detect missing context that changes the answer,
- retrieve relevant sources,
- generate a concise explanation,
- show citations,
- show “what could change this answer,”
- show a safe next step.

### B. Explain My Document

User uploads a document.

The system should:

- validate file type and size,
- extract text safely,
- preserve page/section references where possible,
- detect headings/clauses,
- let the user ask questions about the document,
- return answers linked to the relevant clause/page.

### C. Compare Documents

User provides two documents or two text blocks.

The system should:

- align likely matching sections,
- summarize material differences,
- identify additions/removals/changed obligations,
- show evidence for each difference,
- avoid presenting a similarity score as a legal conclusion.

### D. Navigate

The user should be able to search within a document by:

- keyword,
- clause/heading,
- natural-language question.

## 5. Smart decision logic

The application should classify each request using deterministic checks plus model classification:

1. Is this a document question or general legal-information question?
2. Is jurisdiction known?
3. Is date/time sensitivity relevant?
4. Is the requested action high risk?
5. Is evidence available?
6. Is the user asking for interpretation, factual lookup, comparison, or action?
7. Can the system answer from available evidence?

The system should ask a targeted follow-up question only when the missing information materially changes the result.

## 6. Response contract

Every substantive AI answer should be structured roughly as:

- `summary`
- `what_the_source_says`
- `why_it_matters`
- `important_assumptions`
- `jurisdiction`
- `effective_date_or_source_date`
- `citations[]`
- `uncertainty[]`
- `next_steps[]`
- `escalation_note` when appropriate

## 7. Explicit non-goals

The MVP is not:

- a replacement for a lawyer,
- an automated filing service,
- a representation service,
- a guarantee of legal outcome,
- a system that invents missing evidence,
- a fully autonomous legal-decision engine.

## 8. Acceptance criteria

A feature is accepted only when it has:

- a defined user outcome,
- validation rules,
- error states,
- unit coverage for core logic,
- at least one integration/e2e path where applicable,
- accessibility checks for the main UI,
- documentation,
- explicit security handling.
