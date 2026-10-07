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
- The free-text "biggest caregiving challenge" field is **gone** (#97) — it could capture health information about a third party, the person being cared for. The waitlist form now shows name (optional), email, role and consent. IP address and user-agent collection was **removed** in #2 — neither was disclosed in the privacy policy and neither had a current purpose (abuse prevention is #29's job and a rate limiter needs no per-record retention). The stored record includes name, email, role, consent, submission time, and explicit consent timestamp/version. **Do not reintroduce free-text fields, or IP/UA, here.**

### ✅ The waitlist now has a durable destination (#2)

`src/lib/storage/resend-waitlist-storage.ts` writes each signup to Resend as a contact, calling the **REST API directly with `fetch`** — deliberately not the `resend` npm package, which is pinned at 2.1.0 and has no `properties` support. This avoided a four-major SDK upgrade underneath the live sending flows.

Properties stored: first-touch `source: 'waitlist'` for newly created contacts, plus
`waitlist_role`, `waitlist_consent_at`, and `waitlist_consent_version`. Existing newsletter
contacts keep their source and join the waitlist through the three `waitlist_*` properties.

- `RESEND_API_KEY` set → `ResendWaitlistStorage`
- no key, not production → `FileWaitlistStorage` so local dev works offline
- **no key in production → throws.** This is the whole point: the old code fell through to a file write on an ephemeral serverless filesystem, succeeded, and redirected to the success page. Signups were silently lost.

**Setup done 2026-10-07:** a full-access `RESEND_API_KEY` is in Vercel and redeployed, and the four custom properties were created via `POST /contact-properties`. Both were required and both were discovered the hard way — sending-only keys return `401 restricted_api_key`, and unknown property keys fail the whole request with `422 "One or more properties do not exist"`. Only `string` and `number` property types exist.

**Properties are asymmetric** — writes take a flat map, reads return `{"key": {"value": v, "type": "string"}}`. `readProperty` in the storage module unwraps either shape; reuse it rather than writing a second one. The original tests asserted the flat shape and so confirmed the bug instead of catching it.

**Still unexercised:** no signup has gone through the real form on a deployed build. The create path has only run against mocked `fetch`.

Resend has **deprecated Audiences in favour of Segments** and the current contacts endpoints take no audience id, so `RESEND_AUDIENCE_ID` is gone from `.env.example`. `src/lib/email/resend.ts`'s newsletter path still reads it and still no-ops safely when unset — reworking that is separate.

`getAll()`/`count()` are implemented but have **no callers**; `getWaitlistCount()` is exported and unused. Also unverified: whether Resend's list endpoint returns `properties`, which `getAll()` filters on — tracked in #101, which touches the same code.

The newsletter path still reads the now-dead `RESEND_AUDIENCE_ID` and so adds signups to nothing, silently — **#101**.

### ✅ /press is retired (#86)

Decided 2026-10-05: press is not relevant — `/partners` covers that audience. `src/app/press/page.tsx` is deleted, `/press` is gone from both `src/app/sitemap.ts` and the tracked `public/sitemap.xml` artifact, and the never-fired `press_view` analytics event is removed. **The `permanent: true` 308 to `/partners` stays** — it costs nothing and catches any link that went out in outreach. This unblocks the domain/crawl cluster (#1, #19, #35).

### 🔴 Open decisions only the owner can make

- **Next 15+ migration** (#90) — check `next-contentlayer` compatibility first; it declares Next 12/13 support only.

### 🔧 Known traps

- **`npm run lint` hangs** if stdin is left open. Always `npm run lint < /dev/null`. Same for anything invoking `next lint`.
- **`public/sitemap.xml` is a generated artifact tracked in git** (#88). Every local `npm run build` dirties it — `git checkout -- public/sitemap.xml` before committing.
- **The test baseline in `AGENTS.md` goes stale constantly** — four hand-corrections in four PRs (#94). Update it in the same PR that changes test counts.
- **`git merge-base --is-ancestor` reports squash-merged branches as unmerged.** Check PR state instead before deleting branches.
- `src/app/api/og/route.tsx` — OG image still uses old dark-slate branding (#37).
