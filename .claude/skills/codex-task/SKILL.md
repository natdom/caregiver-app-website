---
name: codex-task
description: Dispatch a coding task on this repo to Codex CLI as the implementer, then independently verify, review, and land the resulting PR. Use whenever the user asks to have Codex build/fix something in caregiver-app-website, or says to use the "Codex codes, Claude orchestrates" workflow.
---

# Codex-codes, Claude-orchestrates workflow

This repo's standard workflow for anything beyond a trivial one-file fix: **Codex writes the code, Claude scopes the work, dispatches it, independently verifies it, reviews the diff, and owns every git/GitHub action.** Codex never touches git and is never trusted at its own word that something passes.

Full rationale and the empirical findings behind the specifics below live in memory (`auto-mode-blocks-shared-state-actions`, `pero-known-test-issues`) — this file is the actionable checklist.

## 0. Prerequisites (check once per session, not per task)

- `codex --version` resolves (installed at `/opt/homebrew/bin/codex` as of this writing).
- `codex doctor` shows a reachable, authenticated provider (ChatGPT auth has worked; don't re-run this every task, only if a dispatch fails with an auth-looking error).
- Repo-wide conventions for Codex live in `AGENTS.md` at repo root — keep it current; don't re-explain those conventions in every task prompt.

## 1. Scope the work as a GitHub issue

If there isn't already an issue, create one matching this repo's conventions (imperative title, `enhancement`/`bug` + a specific second label from `gh label list`, body sections `## Summary` → `## What to do` → optional `## Design notes` → `## Why it matters` → `## Notes` naming relevant files). Add it to the **"Pero Website"** project board (`gh project item-add 7 --owner natdom --url <issue-url>` — note this needs the `project` gh scope; if it fails with a missing-scope error, ask the user to run `gh auth refresh -s project` once).

Do this even for small tasks — it's what lets the GitHub Project board stay a true source of truth, and it's where the PR later says "Closes #N".

## 2. Read before you delegate

Before writing the Codex prompt, read the actual files involved yourself (component, its tests, anything it imports). Never delegate understanding — a prompt built from guesses produces a diff you can't meaningfully review later. This is also where you decide the concrete acceptance criteria Codex will be told to hit.

## 3. Branch

```bash
git checkout -b feature/<short-descriptive-name>
```

One branch per issue/PR, same as any other change to this repo.

## 4. Write a self-contained task prompt for Codex

Put it in a scratch file, not inline on the command line (easier to iterate, avoids shell-escaping pain). It must include:

- The issue link and its full acceptance criteria, restated (don't just say "see issue #N" — Codex can't fetch it without network access in the sandbox).
- Exact file paths to read first and exact file paths it's allowed to touch.
- "Do not run git commands of any kind — no commit, no branch, no push." (redundant with `AGENTS.md`, but worth restating for a task that's easy to over-scope).
- A concrete definition of done: which `npx vitest run ...` / `npx tsc --noEmit` invocations must pass, restated even though `AGENTS.md` covers the general case, so the prompt is self-contained.
- Instruction to report bugs found outside scope in its final summary rather than silently fixing them.

Reuse the shape of the prompt from the welcome-splash test-writing task (this session's transcript) as a template — it worked well once the sandbox flags were fixed (see step 5).

## 5. Dispatch to Codex

```bash
codex exec -s workspace-write -C "<absolute repo path>" - < task-prompt.txt
```

**Use exactly this flag combination.** Specifically:
- `-s workspace-write` (not `read-only`, not `danger-full-access`) — confined to the repo working tree, `/tmp`, and `$TMPDIR`. No network, no writes outside the sandbox.
- **Do not add `--approve-for-me`.** In this harness's auto mode, `codex exec -s workspace-write --approve-for-me` is denied outright by the permission classifier ("routes approval requests through automatic review" reads as an autonomous agent self-granting escalations, which the classifier flags regardless of how well-scoped the task is). Plain `-s workspace-write` with no approval flag defaults to `approval: never` and stays strictly inside the sandbox — confirmed empirically to run cleanly with no classifier block, for both file edits (`apply_patch`) and shell commands (`exec`).
- **Never add `--dangerously-bypass-approvals-and-sandbox`.** Not needed, and defeats the point of sandboxing an agent you're about to independently verify anyway.
- If a task genuinely needs something outside the sandbox (installing an npm package, hitting a real network resource), don't escalate Codex's flags — do that one step yourself, then hand control back to Codex for the rest, or just finish that part directly.

Capture the `session id` Codex prints — you'll need it to send follow-up feedback in step 8 without Codex losing context.

## 6. Independently verify — never trust Codex's self-report

Regardless of what Codex's final message claims:

```bash
npx vitest run <the specific new/changed test file>
npx vitest run                      # full suite
```

Compare the full-suite failure list against the known baseline in `AGENTS.md` / the `pero-known-test-issues` memory. A clean dispatch means: the new tests pass, and the full-suite failure count/list is unchanged from that baseline — not zero. If you're not sure whether a failure is new, `git stash` your branch's changes, re-run, compare, then `git stash pop` (this is exactly how the welcome-splash PR's regression check was done).

Also skim `npx tsc --noEmit` and `npm run lint` output for the changed files specifically — both have unrelated pre-existing failures repo-wide (see `AGENTS.md`), so don't expect a clean run overall, just no *new* errors in what changed.

## 7. Review the diff yourself

Treat Codex's diff like a PR from any other contributor — use the `code-review` skill (`medium` is usually enough) or a manual read. Look especially for: scope creep beyond the task, edge cases in event handlers (e.g. modified-click / keyboard paths — this is exactly the class of bug the review caught in the welcome-splash PR), and duplicated logic that should reuse an existing utility.

## 8. Iterate if the review finds something

- Small, obvious fix → make it yourself directly, note in the eventual PR/commit message that it was a review fix.
- Anything more substantive, or if you want Codex to own the full diff → send it back to the same session instead of starting fresh:
  ```bash
  codex exec resume <session-id> -s workspace-write -C "<repo path>" "Specific feedback here, referencing exact file/line."
  ```
  Re-run step 6 after any revision, from either path.

## 9. Commit, push, open the PR — Claude only

Codex's sandbox has no git/network access by design, so this is entirely Claude's job regardless:

```bash
git add <files>
git commit -m "$(cat <<'EOF'
<summary>

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
git push -u origin <branch>
gh pr create --title "<...>" --body "$(cat <<'EOF'
## Summary
...
Closes #N

## Test plan
- [x] npx vitest run <file> — N/N passing
- [x] npx vitest run (full suite) — no new regressions vs. baseline
...
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## 10. Merge

```bash
gh pr merge <n> --squash --delete-branch
```

**Expect this to trigger the auto-mode permission classifier** (a shared-state, hard-to-reverse action against `main`) — that's working as intended, not a bug to route around. Ask the user to approve the retry, or offer to let them run it themselves. Don't add flags to force past it.

## 11. Close the loop

- Confirm the issue auto-closed and the GitHub Project board item moved to "Done" (it has, both times this was tried — GitHub does this automatically off the "Closes #N" PR body).
- If the change introduces a new reusable pattern, a new known issue, or changes something documented in `HANDOVER.md`/`CLAUDE.md`, update those files in the same session (docs-only pushes to `main` have not triggered the classifier block in this repo).
- Consider whether anything learned this round belongs in memory (new conventions, new gotchas) — same bar as any other session.
