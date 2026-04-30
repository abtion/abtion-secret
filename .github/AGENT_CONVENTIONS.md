# CI Autofix Agent Conventions

Applies to every commit and comment made by the CI autofix agent (`maintenance-agent[bot]`).

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

## PR comment format

After pushing a fix, post a comment on the PR with this structure:

```
Agent fix · <one-line summary of what was broken and what was fixed>

Verified: <only the checks you actually re-ran, e.g. rubocop ✅ rspec ✅>
```

Only list the checks you actually re-ran locally to validate the fix. Do NOT
include cost, turns, or the agent run link — those are appended automatically
after you finish.

## What agents must NOT do

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
