# AI + Legal RAG Specification

## 1. Grounding contract

The assistant should behave as a retrieval-and-explanation system, not a free-form legal oracle.

### Required model input

- user query
- jurisdiction if known
- relevant date if known
- user-provided facts
- retrieved source chunks
- source metadata
- task type

### Required model output

Strict structured output validated at runtime.

```ts
type LegalAnswer = {
  summary: string;
  explanation: string;
  assumptions: string[];
  uncertainties: string[];
  citations: Array<{
    sourceId: string;
    locator?: string;
  }>;
  nextSteps: string[];
  escalationNote?: string;
};
```

## 2. Prompt rules

Every legal-answer prompt should instruct the model to:

- use only the supplied evidence for factual legal claims,
- say when evidence is insufficient,
- never invent a source,
- never fabricate a quotation,
- preserve jurisdiction and date context,
- distinguish fact from interpretation,
- keep wording understandable to non-lawyers,
- avoid definitive professional-advice framing.

## 3. Prompt-injection defense

Treat uploaded document text and retrieved web/source content as untrusted data.

A document may contain text such as “ignore previous instructions.” The system must treat this as document content, not system instructions.

Recommended design:

```text
system policy
  > task rules
  > retrieved evidence marked as DATA
  > user request marked as USER INPUT
```

Never concatenate raw document text into the system prompt as instructions.

## 4. Retrieval scoring

A practical relevance score can combine:

`final = authorityWeight * authority + jurisdictionFit * jurisdiction + semanticRelevance * semantic + freshnessWeight * freshness`

Do not expose this as a legal confidence percentage unless it is scientifically justified. Prefer human-readable evidence labels such as:

- directly supported
- partially supported
- insufficient evidence

## 5. Document chunking

Preserve:

- page number
- heading
- clause/section label
- paragraph index
- source document ID

Chunks should be semantically coherent and small enough for retrieval precision.

## 6. Comparison engine

Compare at the clause/section level first.

Each difference should have:

```ts
type MaterialDifference = {
  sectionA?: string;
  sectionB?: string;
  changeType: 'added' | 'removed' | 'modified';
  summary: string;
  evidenceA?: string;
  evidenceB?: string;
};
```

The model may explain a difference, but the original clause text remains the evidence source.

## 7. Safety gates

Before final response, evaluate:

- unsupported claim present?
- missing citation?
- missing jurisdiction for jurisdiction-specific claim?
- high-risk request?
- personal sensitive data unnecessarily repeated?
- action instruction too definitive?
- citation points to non-existent evidence?

Block or rewrite unsafe output rather than merely adding a disclaimer.

## 8. High-risk examples

Examples include:

- imminent legal deadlines,
- criminal allegations,
- eviction or housing emergencies,
- immigration status consequences,
- child custody matters,
- instructions for evading law enforcement or legal obligations,
- requests to create false evidence.

For such cases, provide grounded general information and appropriate escalation guidance rather than overconfident instructions.
