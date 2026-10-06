# Claude Notes — pero (formerly withCare)

## Project
Marketing website for the **pero** caregiver app.

---

## Workflow: Codex codes, Claude orchestrates

For anything beyond a trivial one-file fix, this repo uses Codex CLI as the implementer with Claude scoping, dispatching, verifying, reviewing, and owning all git/GitHub actions. **Use the `codex-task` skill (`.claude/skills/codex-task/SKILL.md`) for the full checklist** — issue → branch → task prompt → `codex exec -s workspace-write` (no `--approve-for-me`) → independent test verification → review → PR → merge. Repo-wide conventions Codex should already know live in `AGENTS.md` at repo root — keep that file current when conventions change, rather than re-explaining them in every task prompt.

Key things not to relearn the hard way:
- `codex exec -s workspace-write -C <path> "<prompt>"` (no `--approve-for-me`, no `--dangerously-bypass-*`) runs cleanly under this harness's auto-mode classifier. Adding `--approve-for-me` gets the whole call denied outright.
- `gh pr merge` into `main` also trips the auto-mode classifier (as does anything else that changes shared/remote state) — that's expected, not a bug; get the user's approval rather than working around it.
- Always independently re-run tests (`npx vitest run`) rather than trusting Codex's own "tests pass" claim, and diff against the known pre-existing failure baseline (see "Known issues" in `HANDOVER.md`) rather than expecting a fully clean suite.

---

## Current state (updated 2026-10-06)

### Working on the P0 queue

The GitHub Project board **"Pero Website" (#7)** is the source of truth. 79 issues open, 34 marked P0 — which means P0 currently carries little signal and is worth re-triaging.

Full working plan, including sequence and rationale: https://claude.ai/code/artifact/2413f764-ad25-45dd-9270-d8edd392e084

### ✅ Verification is now trustworthy (#60, #61, #65 — PR #87)

Before this, nothing could be verified. `npm run lint` failed on a malformed config name so **no PR had ever had static analysis**; `tsc --noEmit` buried real errors under thousands of missing-globals; and `redirects.test.tsx` failed to *collect*, contributing zero failures and staying invisible in every tally.

- ESLint config repaired; cosmetic rules (Tailwind ordering/shorthand, unescaped entities) disabled so the ~50 remaining findings are real
- `tsconfig.json` has `"types": ["vitest/globals"]`
- CI at `.github/workflows/ci.yml`: a **required gate** (lint, `test:ci`, build) plus an **informational** job (full suite, typecheck) that never blocks
- Known-failing files are quarantined by name in `vitest.config.ts`. The gate runs everything else. **A file leaves quarantine when its tests are rewritten against behaviour — never by being repaired in place.**

### ✅ Email delivery is live (#16, #24, #25, #31, #92)

Resend is wired up and **confirmed working in production**.

- `src/lib/email/resend.ts` — lazy client, two purpose-specific senders
- `joinpero.com` verified in Resend; `RESEND_API_KEY` set in Vercel
- Contact → `hello@joinpero.com` → forwarded to the owner, `Reply-To` set to the submitter
- **A 200 means Resend accepted the message. Nothing else returns 200.** Missing key → 503, provider failure → 502, both advising the visitor to email directly. Never fake success.

### ✅ Security (#18 — PR #89)

`next` 14.0.4 → **14.2.35**, closing a critical SSRF advisory against Server Actions — `src/lib/actions/waitlist.ts` is a Server Action handling personal data. **24 advisories remain**; two criticals have no fix in the 14.x line. Tracked in **#90**.

### ✅ Privacy

- Raw PII no longer logged by the form routes (#31); route tests guard against regression
- The newsletter widget no longer sends the submitted email's domain to Plausible (#92)
- The free-text "biggest caregiving challenge" field is **gone** (#97) — it could capture health information about a third party, the person being cared for. The waitlist form now shows name (optional), email, role and consent. **Note the full stored record is larger than the visible form**: `submitWaitlistForm()` also captures the requester IP (`x-forwarded-for`/`x-real-ip`) and user agent, and `WaitlistEntry` persists both. Any privacy statement must account for those. **Do not reintroduce free-text fields here.**

### 🔴 The waitlist is still broken (#2) — highest-value open item

`src/lib/storage/waitlist-adapter.ts`:

- `DATABASE_URL` set **and** `NODE_ENV === 'production'` → `PostgresWaitlistStorage`, every method throws. Both conditions are required (`waitlist-adapter.ts:112`)
- unset → writes `data/waitlist.json` on an **ephemeral serverless filesystem**, then **redirects to the success page**. Signups are silently lost.

Plan agreed, written up on #2: **Resend Audiences with custom `properties`**. Blocked on an SDK upgrade (2.1.0 → 6.x — `properties` does not exist in 2.1.0) and on an Audience being created.

### 🔴 Open decisions only the owner can make

- **Should `/press` exist?** (#86) It is a `permanent: true` 308 to `/partners` with a complete page unreachable behind it. Blocks the domain/crawl cluster (#1, #19, #35).
- **Next 15+ migration** (#90) — check `next-contentlayer` compatibility first; it declares Next 12/13 support only.

### 🔧 Known traps

- **`npm run lint` hangs** if stdin is left open. Always `npm run lint < /dev/null`. Same for anything invoking `next lint`.
- **`public/sitemap.xml` is a generated artifact tracked in git** (#88). Every local `npm run build` dirties it — `git checkout -- public/sitemap.xml` before committing.
- **The test baseline in `AGENTS.md` goes stale constantly** — four hand-corrections in four PRs (#94). Update it in the same PR that changes test counts.
- **`git merge-base --is-ancestor` reports squash-merged branches as unmerged.** Check PR state instead before deleting branches.
- `src/app/api/og/route.tsx` — OG image still uses old dark-slate branding (#37).
