# Rebrand: withCare → pero

## ✅ Done
- Logo PNGs replaced (`pero-logo.png`, `pero-logo-dark.png`)
- Logo component updated (`WithCareLogo` → `PeroLogo`)
- All brand name instances of `withCare` replaced with `pero` across src/, content/, and docs

---

## 🔧 Still needs attention

### 1. Domain / email — waiting on domain change
These are intentionally left as-is until the domain is moved from `withcare.app` to a new domain.

| File | What |
|------|------|
| `src/components/footer.tsx:103` | `hello@withcare.app` display + mailto link |
| `src/app/contact/page.tsx:118` | `hello@withcare.app` display + mailto link |
| `src/app/partners/page.tsx:138` | `hello@withcare.app` display + mailto link |
| `src/lib/seo.ts:119` | `email: 'hello@withcare.app'` in structured data |
| `src/app/page.tsx:14–41` | `https://withcare.app` URLs in JSON-LD structured data |

### 2. Logo component file rename (optional cleanup)
The logo component file is still named `withcare-logo.tsx`.
Navigation and footer still import from `@/components/withcare-logo`.
- Rename `src/components/withcare-logo.tsx` → `src/components/pero-logo.tsx`
- Update imports in `navigation.tsx` and `footer.tsx`

### 3. Old logo files (can delete when ready)
These are no longer referenced but still sitting in `public/images/`:
- `public/images/withcare-logo.png`
- `public/images/withcare-logo-dark.png`

### 4. One test file
`src/components/__tests__/waitlist-form.test.tsx:273` — has lowercase `withcare` in a string match.
Update to `pero` once the source text it tests is confirmed changed.

### 5. OG image (`/api/og`)
`src/app/api/og/route.tsx` — the dynamically generated Open Graph image still shows
a generic heart icon. Consider updating it to use the pero logo once the domain/hosting is finalized.
