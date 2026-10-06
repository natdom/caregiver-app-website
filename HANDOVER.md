# pero — Handover Document

**Last updated:** October 2026  
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

All API routes are under `src/app/api/`. Contact and newsletter now deliver via Resend — see "What's not wired up" below for what still does not.

### `POST /api/newsletter`
Accepts: `{ email, name?, role?, source?, assessmentStage? }`  
What it does: validates with Zod, logs a redacted event (no PII), delivers a notification via Resend, returns 200 only if Resend accepted it. 503 if `RESEND_API_KEY` is unset, 502 if Resend fails.  
`source` defaults to `'website-newsletter'` if omitted; the assessment passes `'assessment'`.

### `POST /api/contact`
Accepts: `{ name, email, role, message }`  
What it does: validates, logs a redacted event (no PII), delivers to `hello@joinpero.com` via Resend with `Reply-To` set to the submitter. Returns 200 only on confirmed delivery; 503 unconfigured, 502 on provider failure.

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

1. **The waitlist loses signups in production** (#2) — the single most damaging open issue. `createWaitlistStorage()` picks `PostgresWaitlistStorage` when `DATABASE_URL` is set, and every method on it throws. With it unset, it writes `data/waitlist.json` on an **ephemeral serverless filesystem** and then **redirects to the success page** — so the signup is silently lost while the user is told it worked. Plan agreed on #2: Resend Audiences with custom `properties`. Blocked on an SDK upgrade (2.1.0 → 6.x) and an Audience being created.

2. **Newsletter list** — signups deliver a notification email but are not added to any marketing list. Set `RESEND_AUDIENCE_ID` and the existing code path adds them to a Resend audience; without it, that step is skipped silently.

3. **OG image** — `src/app/api/og/route.tsx` uses old dark-slate styling, not pero's coral/teal brand (#37). Update before social sharing matters.

4. **Assessment stage-specific emails** — `assessmentStage` is passed through to the newsletter API, but no template or trigger exists.

5. **The domain serves nothing** — `joinpero.com` has no A record and `www` CNAMEs to a Namecheap parking page, while `layout.tsx` and `seo.ts` emit `https://www.joinpero.com` canonicals. Anything crawled today points at a dead address. Separate from #1, which is about config pointing at the *wrong* domain.

### Already done (was listed here previously)

**Email sending works.** Resend is wired up, `joinpero.com` is verified, `RESEND_API_KEY` is set in Vercel, and delivery is confirmed end to end. Both routes return 200 only when Resend accepts the message — 503 unconfigured, 502 on provider failure. See #16, #24, #95.

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

- **53 failing tests across 10 files**, out of 193. The authoritative per-file breakdown lives in `AGENTS.md` — use that, not this list, and treat the per-file counts as the baseline rather than the aggregate. Nearly all of these assert rendered marketing copy rather than behaviour, which is why they broke together at the rebrand. **They are not being repaired in place**: when a component is rewritten, its tests are rewritten against behaviour and the file leaves the quarantine list in `vitest.config.ts`. `newsletter-inline.test.tsx` was the first to make that transition (#93).
- **`npm run lint` hangs** if stdin is left open — always `npm run lint < /dev/null`. The config itself was repaired in #87; the remaining ~50 findings are real (unused vars, a11y, explicit `any`), not config noise.
- **`npx tsc --noEmit` reports ~255 errors**, mostly missing Testing Library matcher types. The missing-globals noise was fixed in #87 by adding `"types": ["vitest/globals"]`. Typecheck runs in CI as **informational only** — promote it to the required gate once the remainder is cleaned up.
- **`public/sitemap.xml` is a generated artifact tracked in git** (#88) — every local `npm run build` rewrites its timestamps and dirties the tree. `git checkout -- public/sitemap.xml` before committing.
- **24 `next` advisories remain** after the 14.2.35 bump (#90), including two criticals with no fix in the 14.x line. Neither is assessed as high exposure here, but the migration is real work and `next-contentlayer` compatibility needs checking first.

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
