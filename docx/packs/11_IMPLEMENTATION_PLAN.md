# Implementation Plan

Build in this order. Do not start with visual polish.

## Phase 0 — Repository bootstrap

Deliver:

- Next.js/TypeScript foundation or preserve existing stack,
- lint/typecheck/test/build scripts,
- `.env.example`,
- clear README skeleton,
- base UI shell,
- CI workflow.

Gate: clean build and CI green.

## Phase 1 — Domain contracts

Implement:

- request types,
- answer schema,
- citation schema,
- risk classification,
- jurisdiction/context model,
- document metadata types.

Gate: unit tests for the domain layer.

## Phase 2 — Core Ask flow

Implement:

- question UI,
- context controls,
- server endpoint/use case,
- source retrieval abstraction,
- LLM adapter,
- structured answer generation,
- citation validation.

Gate: question -> grounded answer -> evidence.

## Phase 3 — Document intelligence

Implement:

- safe upload,
- parser,
- page/section metadata,
- chunking,
- document Q&A,
- in-document search.

Gate: document -> clause question -> evidence location.

## Phase 4 — Comparison

Implement:

- dual document ingestion,
- section alignment,
- diff classification,
- material difference summary,
- evidence links.

Gate: two known fixture documents produce predictable differences.

## Phase 5 — Safety + hardening

Implement:

- prompt injection defenses,
- file abuse defenses,
- authorization,
- rate limiting,
- safe logging,
- error boundaries,
- source freshness display.

Gate: security test suite passes.

## Phase 6 — Accessibility + polish

Implement:

- keyboard navigation,
- semantic structure,
- mobile layouts,
- accessible dialogs,
- reduced motion,
- focused visual refinement.

Gate: primary flows work without a mouse.

## Phase 7 — Submission hardening

Run:

- clean install,
- test,
- build,
- repository-size guard,
- branch guard,
- secret scan,
- final README review.

Gate: evaluator-ready public repository.
