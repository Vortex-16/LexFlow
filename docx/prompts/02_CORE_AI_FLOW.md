# Prompt 02 — Core AI Flow

Implement the core legal-information question workflow from the project documents.

Requirements:
- validate user input,
- collect jurisdiction/context,
- retrieve evidence through an adapter,
- generate a strict structured answer,
- validate the model output with a schema,
- verify citations server-side,
- expose uncertainty and next steps,
- fail safely when evidence is insufficient.

Create deterministic tests for:
- known-answer retrieval,
- no-evidence request,
- ambiguous jurisdiction,
- malformed model output,
- fake citation IDs.

Do not add decorative UI. Keep the interface minimal and readable.
