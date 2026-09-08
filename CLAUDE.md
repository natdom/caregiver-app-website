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

## Current state (updated 2026-09-07)

### ✅ First-visit welcome splash
- `src/components/welcome-splash.tsx` — modal shown once per browser on first homepage visit, gated by `localStorage['pero_splash_seen']`
- Offers a choice: "Take the assessment →" (`/assessment`) or "Browse the site" (dismiss)
- Built on a new Radix Dialog primitive, `src/components/ui/dialog.tsx` (shadcn-style, matches `ui/toast.tsx` conventions) — reuse this for any future modal needs rather than adding another dialog implementation
- Analytics: `src/lib/splash/analytics.ts` (`splash_shown`, `splash_assessment_clicked`, `splash_browse_clicked`, `splash_dismissed`)
- Tests: `src/components/__tests__/welcome-splash.test.tsx`
- Mounted only in `src/app/page.tsx` (homepage), not the root layout — keeps it homepage-only by construction
- Tracking issue: [#12](https://github.com/natdom/caregiver-app-website/issues/12) (closed), shipped in PR #14

### ✅ Rebrand complete
- Logo: new pero logos (light + dark, transparent bg) in `public/images/`
- Logo component: `src/components/pero-logo.tsx` — switches light/dark per theme
- All `withCare` brand text → `pero` across entire codebase
- Email: `hello@joinpero.com` everywhere
- URLs: `https://www.joinpero.com` throughout (domain confirmed)
- Theme: system auto (follows OS light/dark preference)

### ✅ Icons
- All clay icons in `public/icons/` re-cropped with tight alpha-threshold bounds
- Centred correctly, consistent visual size
- Rendered via plain `<img>` tags (not `next/image`) to avoid optimisation cache issues
- Feature grid (`feature-grid.tsx`): `h-24 w-24 object-contain`
- About page: `h-20 w-20 object-contain`
- Explore quick-access: `h-16 w-16 object-contain`

### 🔧 Still needs attention
- `src/app/api/og/route.tsx` — OG social share image, update closer to launch
