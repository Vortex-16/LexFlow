# Evaluation Scorecard

Use this before every submission attempt.

## High-impact checks

### Problem statement alignment
- Does the product clearly explain, compare, or navigate legal information?
- Is the AI useful rather than decorative?
- Are the main workflows demonstrable in under a few minutes?
- Are sources and evidence visible?

### Code quality
- Is the code modular?
- Are responsibilities separated?
- Are inputs/outputs validated?
- Are duplicated prompts and logic removed?

### Security
- Are secrets absent?
- Are uploads restricted?
- Is document text treated as untrusted input?
- Are authorization and rate limiting addressed?
- Is sensitive content excluded from normal logs?

## Medium-impact checks

### Efficiency
- Is retrieval filtered before model calls?
- Are duplicate model calls avoided?
- Are expensive operations server-side and controlled?
- Is document processing asynchronous where necessary?

### Testing
- Are critical functions covered?
- Are end-to-end workflows covered?
- Are safety and malformed-input tests included?

## Low-impact but required polish

### Accessibility
- Keyboard-only journey works.
- Focus is visible.
- Errors are understandable.
- Mobile layout is usable.

## Pre-submission hard gates

- public repository
- one branch only
- repository comfortably below 10 MB
- README complete
- code builds from a clean clone
- environment instructions work
- no secrets
- no unnecessary binaries
- main workflow demonstrable

## Reviewer-readiness questions

A reviewer should be able to answer “yes” to all of these after five minutes:

1. I understand who this product is for.
2. I understand what the AI actually does.
3. I can see where the evidence comes from.
4. I can tell what happens when evidence is insufficient.
5. The code structure looks maintainable.
6. The test strategy is credible.
7. The product is usable on a small screen.
