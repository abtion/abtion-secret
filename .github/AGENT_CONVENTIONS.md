# CI Autofix Agent Conventions

Applies to every commit and comment made by the CI autofix agent (`claude-autofixing-agent[bot]`).

## Commit prefix (Conventional Commits)

| Trigger | Prefix |
|---|---|
| Failing CI on default branch | `fix(ci):` |
| Failing CI on a PR — rubocop / erb-lint / eslint / stylelint / prettier | `fix(lint):` |
| Failing CI on a PR — rspec / jest | `fix(test):` |
| Failing CI on a PR — brakeman | `fix(security):` |
| Failing CI on a PR — assets:precompile | `fix(assets):` |
| Dependabot PR with broken CI | `chore(deps):` |
| Security advisory fix | `security(deps):` |
| Flaky spec stabilisation | `chore(test):` |

## Final response format

The workflow updates a single PR comment per run with the agent's outcome.
To make that comment useful, conclude your final response with a one-line
summary of what was broken and what was fixed. Example:

```
Updated FooSerializer to use ActiveRecord 7.2's new query syntax after the rails patch bump.
```

Do NOT post a PR comment yourself, do NOT include cost/turns/run-link
(the workflow appends those), and do NOT include "Verified: …" — the
workflow already verifies via the failing CI re-run.

## What agents must NOT do

- Post PR comments (the workflow owns the status comment)
- Modify `.github/workflows/*`
- Edit `Gemfile.lock` or `package-lock.json` directly (let bundler / npm
  regenerate them via the corresponding manifest change)
- Downgrade or revert a Dependabot update — fix the calling code instead
- Modify `db/schema.rb` without a matching migration in `db/migrate/`
- Touch `.env`, `.env.*`, or any credential files
- Force-push or rewrite history
- Auto-merge or approve any PR
- Create new branches
- Open PRs
