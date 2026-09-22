# LexFlow — Legal Information & Document Navigator

## Problem

Legal information can be difficult to understand and navigate without professional assistance. LexFlow helps non-lawyers understand legal information, inspect document clauses, compare document versions, and find source evidence.

## Chosen vertical/persona

Everyday legal information and document navigation for non-lawyer users.

## Core capabilities

- **Grounded Legal-Information Q&A:** Ask questions about specific legal scenarios (e.g., landlord-tenant disputes, severance agreements) and get answers supported by cited legislation.
- **Document Explanation:** Upload contracts or policies (TXT, MD, PDF) to break them down into readable chunks.
- **Clause/Section Navigation:** Compare specific parts of documents and see how obligations change.
- **Document Comparison:** Select two documents to perform a deterministic difference check, paired with semantic AI explanations of the differences.
- **Visible Evidence and Citations:** Every AI claim is grounded in retrieved chunks of legal text. Fabrications are prevented by validating references before rendering.
- **Context and Uncertainty Handling:** The agent will ask for missing jurisdiction context rather than guessing.
- **Safe Escalation Guidance:** High-risk scenarios (e.g., emergency evictions, restraining orders) trigger clear disclaimers advising immediate professional legal help.

## Architecture

LexFlow follows a strict separation of concerns to ensure maintainability, testability, and safety:

- **UI Layer (Next.js App Router):** Server-side rendered components utilizing standard semantic HTML (`article`, `section`, `header`, `h2`) and native Tailwind CSS v4 variables for a professional, accessible design language.
- **API/Application Layer:** Strict Zod-validated endpoints (`/api/ask`, `/api/documents`, `/api/compare`) that handle rate limiting, input sanitization, and structured response routing.
- **Domain/Orchestration Layer:** Reusable TypeScript classes (`AskOrchestrator`, `ComparisonOrchestrator`, `DocumentProcessor`) that enforce business logic, validate citation correctness, and coordinate the RAG pipeline. No UI code exists here.
- **LLM/Retrieval/Storage Adapters:** Pluggable interfaces (`ILLMProvider`, `IRetriever`, `IDocumentStorage`) that abstract the actual vector database, GenAI API, and object storage. The MVP ships with an `InMemoryRetriever`, `InMemoryDocumentStorage`, and an `OpenAIProvider`.

## Safety

- **Source Grounding:** AI responses are strictly validated against a schema. Unverified citations are scrubbed.
- **Jurisdiction Awareness:** The system explicitly checks for context (e.g., California vs. New York) before answering.
- **Prompt Injection:** Hardened system prompts instruct the LLM to ignore overrides or "ignore previous instructions" payloads.
- **Privacy:** Process-local storage ensures uploaded documents are not permanently stored. Safe diagnostic logging is used (`operation`, `errorCode`), entirely avoiding the logging of PII, raw document text, or credentials.
- **Rate Limiting:** A lightweight in-memory sliding window protects against API abuse.
- **Safe Failure:** Deterministic errors are returned gracefully to the UI without exposing server stack traces. 

## Setup

1. clone repository: `git clone <repo>`
2. install dependencies: `npm install`
3. copy `.env.example` to `.env.local`
4. provide required provider configuration (e.g., `OPENAI_API_KEY=sk-...`)
5. run development server: `npm run dev`

## Testing

- **Vitest Unit & Integration**: Tests the domain logic, comparison engine, and orchestrators completely offline (`npm run test`).
- **Security Check**: Regression tests for path traversal, bad MIME types, oversized files, and prompt injection attempts.
- **Playwright E2E**: Fully automated UI testing of the entire user flow (`npx playwright test`).
- **Accessibility & Repo Guards**: Typechecking (`npm run typecheck`), linting (`npm run lint`), and `npm audit`.

## Assumptions

- **Mock Retrieval**: The current implementation retrieves static chunks based on keyword matching for the MVP. A real vector database would replace `InMemoryRetriever`.
- **In-Memory Storage**: Uploaded files disappear upon server restart. 
- **PDF Extraction**: A basic fallback parser is used. Complex nested layouts or scanned PDFs (OCR) are unsupported in this MVP.
- **Jurisdictions**: The static legal data provided only covers a handful of specific issues (e.g., CA/NY tenancy).

## Limitations

LexFlow provides general legal information and document navigation. It is **not a substitute for qualified legal advice** or legal representation. Always consult a certified attorney for material legal decisions.
