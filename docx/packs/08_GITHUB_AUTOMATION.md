# GitHub Automation Specification

The submission is constrained to one branch and a repository under 10 MB. Automation should actively protect those constraints.

## 1. Required workflows

### `.github/workflows/ci.yml`

Run on push and pull request events when applicable.

Checks:

1. install dependencies with lockfile,
2. format check,
3. lint,
4. typecheck,
5. unit tests,
6. integration tests,
7. build.

Keep the workflow deterministic and fail fast on broken fundamentals.

### `.github/workflows/security.yml`

Run:

- dependency audit,
- secret scanning if available,
- static analysis when lightweight,
- unsafe pattern checks.

### `.github/workflows/repo-guard.yml`

Run:

- repository size guard,
- branch guard,
- forbidden-file scan,
- large binary scan.

## 2. Repository size guard

Create `scripts/check-repo-size.mjs`.

It should:

- calculate git-tracked file size,
- ignore `.git` internals,
- fail when tracked content reaches a conservative threshold below 10 MB,
- report the top largest tracked files.

Use a threshold such as 8 MB to leave margin for submission overhead.

## 3. Branch guard

Create `scripts/check-branch.mjs`.

It should fail when the current branch is not `main` in the submission workflow.

Do not write a workflow that creates branches automatically.

## 4. Forbidden content guard

Fail CI when obvious submission hazards are detected:

- `.env`
- private keys
- credential dumps
- giant binaries
- generated build folders
- local IDE caches
- node_modules

The check should be precise enough to avoid false positives on documentation examples.

## 5. Git automation behavior

The coding agent should:

- work on `main`,
- make small commits,
- run checks before committing,
- push only when the repository is in a verified state,
- avoid force-pushes.

## 6. Suggested package scripts

```json
{
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "build": "next build",
  "check:repo-size": "node scripts/check-repo-size.mjs",
  "check:branch": "node scripts/check-branch.mjs",
  "check:security": "node scripts/check-security.mjs"
}
```

Adjust commands to the actual framework/tool versions in the repository.

## 7. Commit checkpoints

Recommended checkpoints:

1. `chore: bootstrap project`
2. `feat: add core legal question flow`
3. `feat: add grounded document analysis`
4. `feat: add document comparison`
5. `test: add safety and citation coverage`
6. `ci: add repository guards`
7. `docs: finalize submission readme`
