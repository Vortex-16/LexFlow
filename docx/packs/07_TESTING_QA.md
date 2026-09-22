# Testing & QA Strategy

Testing is a scoring dimension, not a final polish step.

## 1. Test pyramid

### Unit tests
Cover pure logic:

- input validation
- request classification
- jurisdiction checks
- chunking
- citation validation
- comparison alignment
- risk classification
- output normalization

### Integration tests
Cover:

- retrieval -> answer orchestration
- document upload -> extraction -> chunking
- comparison pipeline
- persistence boundaries
- model adapter contract

### E2E tests
Cover the main user journeys:

1. ask a legal question and inspect sources,
2. upload a document and ask about a clause,
3. compare two documents and open evidence,
4. hit an invalid upload and recover,
5. use keyboard navigation through the core flow.

## 2. Security test cases

At minimum:

- prompt injection embedded in document text
- malformed JSON
- invalid file MIME/type mismatch
- oversized upload
- path traversal filename
- XSS-like payload in extracted text
- unauthorized document access
- citation ID spoofing
- empty retrieval result
- model returning malformed structured output
- model returning fake citation IDs
- secret accidentally included in error text

## 3. Golden dataset

Create a small synthetic/legal-source fixture set that can be committed safely.

It should include:

- ordinary questions,
- ambiguous questions,
- questions with known answers in the fixture sources,
- questions with no supporting evidence,
- comparison pairs with added/removed/modified clauses,
- prompt-injection strings.

Do not commit confidential real-world legal documents.

## 4. Evaluation assertions

For every answer test, assert more than “HTTP 200”.

Assert:

- schema valid,
- citation IDs resolve,
- cited evidence exists,
- jurisdiction field is populated or marked unknown,
- no forbidden advice framing,
- uncertainty is surfaced when evidence is weak.

## 5. Performance tests

Measure:

- first meaningful render,
- retrieval latency,
- model latency,
- document parsing time,
- comparison time,
- total request duration.

Do not optimize blindly. Instrument first.

## 6. Definition of done

No major feature is complete until its tests are green locally and in GitHub Actions.
