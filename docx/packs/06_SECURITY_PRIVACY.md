# Security & Privacy Requirements

## 1. Threat model

Assume attackers may attempt to:

- upload malicious files,
- inject instructions into documents,
- exfiltrate secrets,
- abuse the API for cost amplification,
- submit oversized payloads,
- exploit unsafe HTML/markdown rendering,
- access another user's document by guessing an ID,
- cause log leakage of private text.

## 2. Required controls

### Secrets

- Never commit API keys.
- Provide `.env.example` only.
- Read secrets server-side.
- Fail startup when required secrets are absent.
- Do not echo secrets in logs/errors.

### File uploads

- Allow-list extensions and MIME types.
- Enforce a hard file-size limit.
- Generate server-side identifiers.
- Store outside the public web root.
- Parse in a controlled server context.
- Reject executable content.
- Never trust the filename.

### Input handling

- Validate all JSON with Zod or equivalent.
- Sanitize rendered content.
- Do not inject raw HTML from uploaded documents.
- Do not use `dangerouslySetInnerHTML` unless content is sanitized and the need is documented.

### Authorization

Every document read/update/delete must verify ownership or authorized access.

### Rate limiting

Rate limit:

- question generation
- document uploads
- comparison jobs
- expensive model calls

### Logging

Logs should contain operational metadata, not raw legal documents.

Prefer:

`requestId, userIdHash, route, latency, status, model, tokenCount`

Avoid:

`fullDocumentText, fullUserQuestion, secretKey`

unless explicitly required for a local debug mode that never runs in production.

## 3. Privacy behavior

The UI should clearly explain:

- what is stored,
- how long documents are retained,
- whether content is sent to a model provider,
- how users can delete data.

Use the minimum retention period necessary for the MVP.

## 4. Abuse controls

Add basic protections against:

- oversized requests,
- repeated model calls,
- prompt injection,
- malicious file names,
- path traversal,
- SSRF through arbitrary source URLs,
- open redirects.

Do not allow the client to provide arbitrary backend URLs for fetching sources.

## 5. Security verification

Automate:

- secret scanning,
- dependency audit,
- type checking,
- linting,
- repository-size check,
- branch-rule check.
