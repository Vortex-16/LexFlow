# Codebase Structure

Use this structure unless the existing repository already has an equally clean organization.

```text
.
├── app/
│   ├── (marketing)/
│   ├── ask/
│   ├── documents/
│   ├── compare/
│   ├── history/
│   ├── settings/
│   ├── api/
│   │   ├── ask/
│   │   ├── documents/
│   │   ├── compare/
│   │   └── health/
│   ├── error.tsx
│   ├── loading.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── legal/
│   ├── document/
│   └── sources/
├── lib/
│   ├── ai/
│   │   ├── provider.ts
│   │   ├── schemas.ts
│   │   ├── prompts/
│   │   └── guardrails.ts
│   ├── retrieval/
│   │   ├── retrieve.ts
│   │   ├── rerank.ts
│   │   └── citations.ts
│   ├── documents/
│   │   ├── validate.ts
│   │   ├── extract.ts
│   │   ├── sections.ts
│   │   └── chunk.ts
│   ├── security/
│   │   ├── sanitize.ts
│   │   ├── rate-limit.ts
│   │   └── privacy.ts
│   └── config/
├── domain/
│   ├── legal/
│   ├── documents/
│   └── requests/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   └── fixtures/
├── scripts/
│   ├── validate-env.mjs
│   ├── check-repo-size.mjs
│   └── check-branch.mjs
├── public/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── security.yml
│       └── repo-guard.yml
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── .env.example
├── package.json
├── tsconfig.json
└── ...
```

## Naming rules

- Components: PascalCase.
- Functions/variables: camelCase.
- Files: kebab-case unless the framework requires otherwise.
- Types: PascalCase.
- Environment keys: `UPPER_SNAKE_CASE`.
- No ambiguous names such as `data`, `utils`, `helper` unless the module is genuinely generic.

## Boundary rules

- UI must not directly call the LLM provider.
- Domain code must not import React.
- Infrastructure adapters must implement interfaces defined by the application/domain layer.
- API routes must validate input before use-case execution.
- Secrets are server-side only.
- No client bundle access to private keys.

## Maintainability rules

- Prefer small modules.
- Avoid circular dependencies.
- Avoid duplicated prompts.
- Centralize schemas.
- Centralize safety rules.
- Keep provider-specific logic in adapters.
- Comment the “why”, not the obvious “what”.
