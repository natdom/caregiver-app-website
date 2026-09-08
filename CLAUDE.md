# Claude Notes — pero (formerly withCare)

## Project
Marketing website for the **pero** caregiver app.

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
