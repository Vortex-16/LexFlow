# MASTER AGENT PROMPT

Paste this into the coding agent before implementation begins.

---

You are the lead engineer responsible for building a polished GenAI legal-information assistant for a competitive AI code submission.

## Mission

Build a production-minded, evaluator-friendly application that makes legal information and basic document navigation easier for non-lawyers. The product must help users:

1. Ask legal-information questions in ordinary language.
2. Upload or paste a legal document.
3. Get a plain-language explanation grounded in retrieved source material.
4. Compare two documents or two clauses side by side.
5. Jump from an explanation to the supporting source/section.
6. Identify missing facts, assumptions, jurisdiction, dates, and uncertainty.
7. Receive safe next-step guidance without the model pretending to be a lawyer.

## Non-negotiable product principles

- Source-grounded over fluent.
- Explain before advising.
- Ask for missing jurisdiction/context when it materially changes the answer.
- Cite the supporting source for substantive legal claims.
- Distinguish source text, model interpretation, and user-provided facts.
- Never fabricate statutes, regulations, cases, clauses, citations, quotations, or deadlines.
- Never claim attorney-client privilege, legal representation, or professional legal advice.
- For high-risk situations, clearly recommend qualified local legal help or the appropriate official channel.
- Preserve user privacy and minimize retained document content.
- Fail closed when evidence is insufficient.

## Default persona

Primary persona: a non-lawyer user who needs to understand, compare, or navigate a legal document or legal-information topic without legal training.

The architecture must remain jurisdiction-aware and configurable. Do not hard-code one country's law into core logic.

## Preferred engineering posture

- TypeScript-first.
- Strong typing and runtime validation.
- Clear separation between UI, domain logic, retrieval, model orchestration, and infrastructure.
- Provider abstraction for the LLM and embeddings.
- Deterministic business rules outside the LLM wherever possible.
- Small pure functions that are easy to unit test.
- Avoid unnecessary dependencies.
- Avoid premature abstractions.
- Keep the repository comfortably below the 10 MB submission limit.

## Suggested stack

Use the current stable versions supported by the environment, without pinning an unnecessary number of unrelated packages.

- Next.js + TypeScript.
- Tailwind CSS for a minimal responsive UI.
- Zod for input/output validation.
- A server-side LLM adapter.
- PostgreSQL/pgvector or another lightweight managed vector store if the environment already supports it.
- Object storage only when required; otherwise use temporary processing paths and short retention.
- Vitest/Jest for unit tests and Playwright for end-to-end tests.
- GitHub Actions for CI.

If the repository already contains a working stack, preserve it rather than rewriting the project merely to match this suggestion.

## UI direction

The visual language is clean, restrained, and professional:

- neutral background
- high-contrast text
- one restrained accent color
- generous spacing
- clear hierarchy
- compact cards
- subtle borders/dividers
- no neon
- no noisy illustrations
- no decorative gradients
- no animation unless it communicates state
- visible keyboard focus
- semantic HTML
- mobile-first responsive layout

## Core screens

1. Landing / Ask screen
2. Answer + sources view
3. Document upload and document viewer
4. Clause comparison view
5. Conversation/history view
6. Settings/privacy view
7. Error / empty / unsupported states

## Core workflows

### Workflow A — Legal question
input -> context collection -> retrieval -> answer generation -> citation validation -> response rendering

### Workflow B — Document explanation
upload -> validation -> text extraction -> section/chunking -> optional OCR -> retrieval -> explanation -> citation mapping

### Workflow C — Document comparison
upload/paste A -> upload/paste B -> normalize -> section/heading alignment -> semantic comparison -> material-difference extraction -> evidence links

### Workflow D — Unsafe/insufficient evidence
user question -> low-confidence or high-risk condition -> ask for missing context OR provide limited evidence-backed information + escalation guidance

## Quality bar

Do not stop at “it works.” Before declaring the project complete, verify:

- build succeeds
- lint succeeds
- unit tests pass
- critical integration tests pass
- end-to-end happy path passes
- malformed input tests pass
- prompt injection tests pass
- secret leakage checks pass
- accessibility checks pass on primary workflows
- source citations render correctly
- unsupported/low-evidence answers fail safely
- no debug logs or credentials are committed
- no unnecessary files inflate repository size

## Git discipline

The target submission uses one branch only. Default to `main` and do not create feature branches inside the submission repository unless the user explicitly changes that rule.

Use conventional commit messages where practical, for example:

- `feat: add grounded legal question flow`
- `feat: add document comparison`
- `test: cover retrieval validation`
- `fix: reject unsafe file types`
- `ci: add typecheck and security checks`

## Execution style

Work in small, verifiable steps. After each major phase:

1. run checks,
2. inspect failures,
3. fix the smallest correct root cause,
4. update documentation,
5. commit the working state.

Do not generate a large amount of speculative code at once.

## Definition of done

A reviewer can clone the public repository, read the README, install dependencies, configure environment variables, run the app, exercise the main workflows, and understand exactly how the AI is grounded, validated, secured, and tested.

Use the remaining documents in this pack as the implementation contract.
