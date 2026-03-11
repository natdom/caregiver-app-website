# Claude Notes — pero (formerly withCare)

## Project
Marketing website for the **pero** caregiver app.

---

## Rebrand: withCare → pero

### ✅ Done
- Logo PNGs replaced (`public/images/pero-logo.png`, `public/images/pero-logo-dark.png`)
- Logo component renamed to `src/components/pero-logo.tsx`, exports `PeroLogo`
- Imports updated in `navigation.tsx` and `footer.tsx`
- Old `withcare-logo.tsx` deleted
- Old `withcare-logo.png` / `withcare-logo-dark.png` deleted
- All brand name instances of `withCare` replaced with `pero` across `src/`, `content/`, and docs

### 🔧 Still needs attention

**1. Domain / email — waiting on domain change**
Email updated to `hello@pero.app` (temp until domain finalised). Still needs attention:
- `src/app/page.tsx` — `https://pero.app` URLs in JSON-LD structured data (update when domain confirmed)

**4. One test file**
- `src/components/__tests__/waitlist-form.test.tsx:273` — has lowercase `withcare` in a string matcher

**5. OG image**
- `src/app/api/og/route.tsx` — dynamically generated social share image still shows generic branding; update closer to launch
