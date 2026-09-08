# pero — Handover Document

**Last updated:** September 2026  
**Repo:** `caregiver-app-website`  
**Live domain:** https://www.joinpero.com  
**Contact:** hello@joinpero.com

---

## What this is

Marketing website for **pero**, a caregiver support app that is pre-launch. The site's job is to:

1. Explain the product and build trust with caregivers
2. Collect waitlist signups
3. Attract partners and funders
4. Host a small resource library (10 articles, hand-curated)
5. Qualify caregivers via the journey assessment and funnel them into the waitlist

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS with custom palette (coral, teal, sage, neutral) |
| Components | Radix UI primitives + shadcn/ui patterns |
| Content | Contentlayer (MDX) — see note below |
| Fonts | Inter + Plus Jakarta Sans (Google Fonts) |
| Analytics | Plausible (script tag, no cookies) |
| Email | Resend (installed, **not yet configured**) |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Prettier + Husky pre-commit |
| Deployment | Vercel |

### Contentlayer note

Contentlayer is disabled for local dev (`next.config.js` wraps it in a comment) because it hangs on build locally. Vercel runs `contentlayer build && next build` via the `build` script and it works fine there. If local MDX preview is needed, uncomment the `withContentlayer` wrapper in `next.config.js` and be prepared for slow cold starts.

---

## Pages

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage with WelcomeSplash (first-visit modal), Hero, FeatureGrid, AssessmentCTA, FeaturedResources, TestimonialCarousel, FundingSnapshot, NewsletterInline |
| `/assessment` | `src/app/assessment/` | 16-question caregiving journey assessment — see section below |
| `/explore` | `src/app/explore/page.tsx` | Resource library with search and thematic sections |
| `/explore/[slug]` | `src/app/explore/[slug]/page.tsx` | Individual resource article (MDX via Contentlayer) |
| `/waitlist` | `src/app/waitlist/page.tsx` | Primary lead capture page |
| `/waitlist/success` | `src/app/waitlist/success/page.tsx` | Post-signup confirmation |
| `/partners` | `src/app/partners/page.tsx` | Partners and funders page |
| `/about` | `src/app/about/page.tsx` | About pero |
| `/contact` | `src/app/contact/page.tsx` | Contact form |
| `/newsletter` | `src/app/newsletter/page.tsx` | Newsletter signup standalone page |
| `/press` | redirect → `/partners` | Permanent 301 |
| `/privacy`, `/terms`, `/accessibility` | `src/app/(legal)/` | Legal pages |
| `/docs/design-system` | `src/app/docs/design-system/page.tsx` | Internal component reference |

---

## APIs

All API routes are under `src/app/api/`. None send real emails yet — see "What's not wired up" below.

### `POST /api/newsletter`
Accepts: `{ email, name?, role?, challenge?, source?, assessmentStage? }`  
What it does: validates with Zod, logs the subscription to the server console, returns 200.  
`source` defaults to `'website-newsletter'` if omitted; the assessment passes `'assessment'`.

### `POST /api/contact`
Accepts: `{ name, email, role, message }`  
What it does: validates, logs to console, returns 200.

### `GET /api/og`
Generates Open Graph social share images via `@vercel/og`. Runs on the edge runtime.  
Accepts `?title=` and `?subtitle=` query params. Used by all pages with custom OG images.  
**Note from CLAUDE.md:** the default OG image still uses old dark-background styling — update before launch.

---

## Data layer

### Waitlist (`src/lib/storage/waitlist-adapter.ts`)
Uses file-based storage in `data/waitlist.json` (gitignored). A `PostgresWaitlistStorage` stub exists for a future `DATABASE_URL` migration. The factory function `createWaitlistStorage()` will switch automatically if `DATABASE_URL` is set in production.

### Resources (Contentlayer)
MDX files live in `content/resources/`. The `src/lib/contentlayer-shim.ts` bridges the Contentlayer types for local dev when the plugin is disabled.

### Waitlist entries export
`npm run export-submissions` runs `scripts/export-submissions.ts` to export `data/waitlist.json` to CSV. Useful for manual mailouts before a real CRM is set up.

---

## The assessment (`/assessment`)

The biggest feature built to date. Full detail in the original plan; summary here for handover.

### How it works
- 16 questions (A–E options each), presented one at a time
- **Stage scoring** uses 12 questions (Q1,3,4,5,6,7,9,11,13,14,15,16); Q2, Q8, Q10, Q12 feed signals only — they measure emotional state, not caregiving stage
- Five stages: Getting Ready → Finding Your Footing → Holding It All Together → Managing Increasing Needs → Finding Your Next Chapter
- Optional Q0 (multi-select relationship context) personalises recommendations without affecting scoring
- Results show: stage, transitioning/mixed-picture callout, Strength + Something to Watch cards, support signal cards, 3 personalised resource recommendations
- Lead capture at the end is honest — no email is actually sent today

### Key files

| File | Purpose |
|---|---|
| `src/lib/assessment/types.ts` | All shared TypeScript types |
| `src/lib/assessment/scoring.ts` | Pure stage-scoring function + `isMixedPicture()` |
| `src/lib/assessment/signals.ts` | Support signal detection (5 signals) |
| `src/lib/assessment/recommendations.ts` | Recommendation selection engine |
| `src/lib/assessment/analytics.ts` | Plausible event abstraction |
| `src/app/assessment/quiz-data.ts` | Questions, stage copy, recommendation pool (static content) |
| `src/app/assessment/assessment-client.tsx` | Full interactive React component (`'use client'`) |
| `src/app/assessment/page.tsx` | Server wrapper + SEO metadata |

### Tests
30 unit tests in `src/lib/assessment/__tests__/` covering scoring edge cases (tie-breaking, transition detection, mixed picture), signal triggers, and recommendation ranking. Run with `npm run test`.

---

## First-visit welcome splash (`WelcomeSplash`)

A modal shown once per browser on the first homepage visit, nudging new visitors toward the caregiving assessment while leaving them free to browse.

### How it works
- Gated by `localStorage['pero_splash_seen']` — set on any dismissal path, never shown again after
- Offers two choices: "Take the assessment →" (`/assessment`) or "Browse the site" (dismiss)
- Also dismissible via Escape, overlay click, or the close (X) button
- Mounted only in `src/app/page.tsx`, not the root layout — this is what keeps it homepage-only rather than site-wide
- Visual language matches the assessment's own intro screen (frosted-glass card, coral/teal gradient headline) so the two feel like one continuous moment

### Key files
| File | Purpose |
|---|---|
| `src/components/welcome-splash.tsx` | The component itself — open state, localStorage gating, dismissal handlers |
| `src/components/ui/dialog.tsx` | Radix Dialog primitive (shadcn-style, matches `ui/toast.tsx` conventions) — reuse this for any future modal, don't add a second dialog implementation |
| `src/lib/splash/analytics.ts` | Plausible event wrapper, mirrors `src/lib/assessment/analytics.ts` |
| `src/components/__tests__/welcome-splash.test.tsx` | 9 tests: first-visit gating, all four dismissal paths, analytics calls |

Tracking issue [#12](https://github.com/natdom/caregiver-app-website/issues/12) (closed), shipped in PR #14.

---

## Analytics

Plausible is the only analytics provider. It fires when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set — omitting it silences tracking entirely (useful in dev).

Custom events follow this pattern (from `src/components/analytics.tsx` + `src/lib/assessment/analytics.ts`):
```ts
(window as any).plausible('event_name', { props: { key: 'value' } })
```

Assessment events tracked: `assessment_started`, `assessment_completed` (with stage + transition info), `assessment_signup_cta_clicked`, `assessment_email_submitted`, `assessment_email_success`, `assessment_email_error`. Individual answer letters are **never** sent to analytics.

Splash events tracked (see `src/lib/splash/analytics.ts`): `splash_shown`, `splash_assessment_clicked`, `splash_browse_clicked`, `splash_dismissed`.

---

## Environment variables

Copy `.env.example` to `.env.local` to get started.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Set to `https://www.joinpero.com` in prod |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Omit to disable analytics |
| `RESEND_API_KEY` | No (yet) | Installed, needs config to send real emails |
| `MAILCHIMP_API_KEY` / `MAILCHIMP_SERVER_PREFIX` / `MAILCHIMP_AUDIENCE_ID` | No (yet) | Alternative to Resend for newsletter |
| `CONVERTKIT_API_KEY` / `CONVERTKIT_FORM_ID` | No (yet) | Second alternative |
| `DATABASE_URL` | No (yet) | When set in production, switches waitlist to Postgres |
| `NEXT_PUBLIC_HERO_VARIANT` | No | `'A'` or `'B'`; defaults to B |

---

## What's not wired up

These are the most important gaps before launch:

1. **Email sending** — `RESEND_API_KEY` is unset. Both `/api/newsletter` and `/api/contact` log to console only. Wire up Resend (already installed as a dependency) with:
   - A welcome email for newsletter/assessment signups
   - A notification email to `hello@joinpero.com` for contact form submissions

2. **Newsletter list** — submissions are not added to any CRM or marketing list. Options already in the env file: Resend Audiences, Mailchimp, ConvertKit.

3. **Waitlist persistence** — currently file-based (`data/waitlist.json`). Fine for low volume, but needs a database before any meaningful launch traffic. The Postgres adapter stub is ready in `waitlist-adapter.ts`.

4. **OG image** — `src/app/api/og/route.tsx` uses old dark-slate styling, not pero's coral/teal brand. Update before any PR or social sharing matters.

5. **Assessment stage-specific emails** — architecture is ready (the `assessmentStage` field is now passed through to the newsletter API), but the actual email template and trigger don't exist yet.

---

## Dev commands

```bash
npm run dev -- -p 3000     # start dev server (use port 3000 to match local config)
npm run build              # contentlayer + next build (matches Vercel)
npm run test               # vitest in watch mode — use `npx vitest run` for a single pass (e.g. in CI or before a PR)
npm run typecheck          # tsc --noEmit
npm run lint               # ESLint
npm run export-submissions # export waitlist.json to CSV
```

### Known issues (pre-existing, not caused by recent work)
- **~66 failing tests** across `partners` page/metadata tests, `hero.test.tsx`, `navigation.test.tsx`, `newsletter-inline.test.tsx`, `topic-filter.test.tsx`, `use-scroll-tracking.test.tsx`, `feature-flags.test.ts`, and `topic-utils.test.ts` — confirmed present on `main` independent of the welcome-splash work (verified 2026-09 by diffing `npx vitest run` output with/without that branch). Content/assertions appear to have drifted from the components. Needs a dedicated pass.
- **`npm run typecheck` errors in every `*.test.ts(x)` file** (`Cannot find name 'describe'/'it'/'expect'/'vi'`) — `vitest.config.ts` sets `globals: true` so tests run fine under Vitest itself, but `tsconfig.json` doesn't include Vitest's global types, so `tsc --noEmit` flags them anyway. Cosmetic (doesn't affect `npm run build` or `npm run test`), but noisy.
- **`npm run lint` fails outright**: `Failed to load config "@typescript-eslint/recommended"` — `.eslintrc.json` references a config package that isn't resolving. Needs a dependency fix before lint is usable again.

---

## Brand / design notes

- **Palette:** coral (primary), teal (positive/success), sage (supporting), neutral (text/backgrounds)
- **Logos:** `public/images/pero-logo.png` (light mode) + `public/images/pero-logo-dark.png` (dark mode). Rendered via `src/components/pero-logo.tsx`.
- **Icons:** `public/icons/*.png` — clay-style, tight alpha-cropped. Always use plain `<img>` tags, not `next/image`, to avoid optimisation cache stale issues.
- **Dark mode:** system auto, via `next-themes`. All components have `dark:` variants.
- **Tone:** warm, non-clinical, non-diagnostic. The assessment deliberately uses observational language ("Right now, it sounds like you're…") rather than labels.

---

## Repo history (abbreviated)

```
8c27788  Add first-visit welcome splash directing new visitors to the assessment (#14)
b0aa0ef  Add caregiving journey assessment
f1776f3  Update domain to joinpero.com and add featured resources banner
9362e78  Rebrand withCare → pero and polish icons/logos
2fdff4d  Add custom clay-style icons throughout the site
364362f  Improve explore page UX for caregiver audience
8cf844c  Change URL from /resources to /explore
```
