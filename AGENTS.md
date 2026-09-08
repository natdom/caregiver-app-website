# Agent notes — pero (caregiver-app-website)

This file is read by Codex (and any other agent that honors `AGENTS.md`) when it works in this repo. It's the repo-wide context so individual task prompts don't have to restate it. For the human-facing project overview, see `HANDOVER.md`; for Claude-specific workflow notes, see `CLAUDE.md`.

## What this is

Marketing website for **pero**, a pre-launch caregiver support app. Next.js 14 (App Router), Tailwind, Contentlayer (MDX), Vitest + Testing Library.

## Ground rules for agents working here

- **Never touch git.** Don't `git commit`, `git push`, create branches, or open/merge PRs. The orchestrating Claude session owns all git and GitHub state changes. Just edit files and run local commands (tests, typecheck, dev server) inside the working tree you're given.
- **Stay in scope.** Only touch the files named in your task. If you find a real bug or gap outside that scope, report it in your final summary instead of fixing it silently.
- **Never fabricate a passing result.** If a test or command fails and you can't fix it within scope, say so plainly in your final summary rather than declaring done.
- **Match existing conventions over introducing new ones.** This repo has established patterns for nearly everything (see below) — find and mirror them before inventing a new approach.

## Conventions to reuse

- **UI primitives**: `src/components/ui/*` — shadcn/ui-style wrappers over Radix primitives (see `button.tsx`, `toast.tsx`, `dialog.tsx`). Add new primitives here in the same style (`forwardRef`, `cn()` from `@/lib/utils`, `cva` for variants) rather than hand-rolling one-off components.
- **Icons**: always plain `<img>` tags for `public/icons/*.png`, never `next/image` (avoids optimisation cache staleness). `next/image` is fine for `PeroLogo` and other non-icon images.
- **Analytics**: Plausible via `window.plausible(event, { props })`, guarded by `typeof window !== 'undefined' && window.plausible`. Each feature area has its own scoped module (`src/lib/assessment/analytics.ts`, `src/lib/splash/analytics.ts`) with a closed string-literal union of event names — follow that pattern for new features rather than editing the older generic `src/lib/analytics.ts`.
- **Client-side first-visit / localStorage gating**: see `src/components/welcome-splash.tsx` for the pattern (guard reads/writes in try/catch, hydration-safe mount check).
- **Color palette**: coral (primary), teal (accent), sage (supporting), neutral (text/backgrounds) — defined in `tailwind.config.ts`. Don't introduce new brand colors without being asked.
- **Testing**: Vitest + `@testing-library/react`, config at `vitest.config.ts`, global mocks in `src/test/setup.ts` (next/navigation, next/image, matchMedia, ResizeObserver already mocked — don't re-mock them). Look at `src/components/__tests__/hero.test.tsx` and `src/components/__tests__/waitlist-form.test.tsx` for the house style: `describe`/`it` grouped by concern, `vi.mock()` for module mocks, `userEvent` for interactions.

## Commands

```bash
npm run dev -- -p 3000     # dev server
npx vitest run              # full test suite, single pass (npm run test is WATCH MODE — don't use it non-interactively)
npx vitest run <path>       # a single test file
npx tsc --noEmit             # typecheck
npm run lint                 # eslint
```

## Known pre-existing issues — do not try to fix these unless your task is specifically about them

- **~66 pre-existing failing tests** across `partners` page/metadata tests, `hero.test.tsx`, `navigation.test.tsx`, `newsletter-inline.test.tsx`, `topic-filter.test.tsx`, `use-scroll-tracking.test.tsx`, `feature-flags.test.ts`, `topic-utils.test.ts`. These fail identically on `main` regardless of any feature branch — confirmed by diffing `npx vitest run` output with/without unrelated changes. When asked to verify "no regressions," compare your failure count/list against this baseline, not against zero.
- **`npx tsc --noEmit` errors on every `*.test.ts(x)` file** (`Cannot find name 'describe'/'it'/'expect'/'vi'`) — `tsconfig.json` doesn't include Vitest's global types even though `vitest.config.ts` sets `globals: true`. Tests still run fine under Vitest itself. Not worth fixing as a side effect of an unrelated task.
- **`npm run lint` fails outright**: `Failed to load config "@typescript-eslint/recommended"`. Pre-existing, unrelated to feature work.

## Definition of done, by default

Unless a task says otherwise, before reporting a task complete:
1. The specific test file(s) for your change pass: `npx vitest run <path>`
2. The full suite shows no *new* failures beyond the known baseline above: `npx vitest run`
3. Your diff is limited to the files named in the task
