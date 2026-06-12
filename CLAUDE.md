# Claude Notes — pero (formerly withCare)

## Project
Marketing website for the **pero** caregiver app.

---

## Current state (updated 2026-06-12)

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
