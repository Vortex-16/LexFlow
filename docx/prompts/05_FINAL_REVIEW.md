# Prompt 05 — Final Evaluator Review

Act as a hostile but fair code evaluator.

Review the repository against:
- code quality,
- security,
- efficiency,
- testing,
- accessibility,
- problem-statement alignment.

Do not rewrite the project wholesale.

First inspect the repository and identify the top concrete issues likely to reduce evaluation quality. Then fix the highest-value issues in descending order.

Run:
- lint,
- typecheck,
- tests,
- e2e tests when available,
- production build,
- repo size guard,
- branch guard,
- secret/security checks.

Finally verify:
- public-ready README,
- one branch only,
- repo under the required size,
- no credentials,
- no debug artifacts,
- main demo path is reliable.
