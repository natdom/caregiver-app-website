# Waitlist System Documentation

> **Updated 2026-10-06:** the free-text "biggest caregiving challenge" field was removed in #97 — it could capture health information about a third party (the person being cared for) who never consented. References to it have been stripped from this document. Do not reintroduce free-text fields to this form.


## Overview

The pero waitlist system is designed for high conversion rates, comprehensive accessibility, and detailed analytics. Built with React Server Actions, Zod validation, and extensive testing.

## Architecture

### Core Components

```
src/
├── app/waitlist/
│   ├── page.tsx              # Main waitlist form page
│   └── success/
│       ├── page.tsx          # Success page with sharing
│       └── page-client.tsx   # Client-side analytics
├── components/
│   ├── waitlist-form.tsx     # Form component
│   └── __tests__/
│       └── waitlist-form.test.tsx  # 25 comprehensive tests
├── lib/
│   ├── actions/
│   │   └── waitlist.ts       # Server action for form handling
│   ├── storage/
│   │   └── waitlist-adapter.ts    # Storage abstraction layer
│   └── validations/
│       └── waitlist.ts       # Zod schema validation
└── data/
    └── waitlist.json         # Development storage (auto-created)
```

## Features

### ✅ Form Validation
- **Server-side validation** with Zod schemas
- **Real-time client validation** for better UX
- **Comprehensive error handling** with field-specific messages

### ✅ User Segmentation
- **Role-based tracking**: Family Caregiver, Healthcare Professional, Partner, Other
- **Analytics integration** with role data

### ✅ Accessibility (WCAG 2.2 AA)
- **ARIA-live announcements** for form status
- **Full keyboard navigation** support
- **Screen reader optimization** with proper labels
- **Focus management** throughout form flow
- **High contrast** color ratios

### ✅ Analytics & Tracking
- **Plausible integration** with custom events
- **Role-based segmentation** tracking
- **Social sharing analytics** on success page
- **Form abandonment** insights

### ✅ Success Experience
- **Dedicated success page** with clear next steps
- **Social sharing** for Twitter and LinkedIn
- **Resource recommendations** 
- **Email confirmation** messaging

## Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | Text | No | Optional string |
| `email` | Email | Yes | Valid email format |
| `role` | Radio | Yes | One of: caregiver, professional, partner, other |
| `consent` | Checkbox | Yes | Must be checked |

## Storage System

### Development (File-based)
```bash
# Data stored in local JSON file
data/waitlist.json

# View submissions
cat data/waitlist.json

# Check entry count
jq length data/waitlist.json
```

### Production (Resend contacts)
`createWaitlistStorage()` in `src/lib/storage/waitlist-adapter.ts` returns `ResendWaitlistStorage` whenever `RESEND_API_KEY` is set. It calls Resend's REST contacts API directly with `fetch` — not the `resend` npm package, which is pinned at 2.1.0 and has no support for contact `properties`.

Each new contact gets first-touch `source: 'waitlist'`; existing contacts retain their original
source. Waitlist membership is identified by `waitlist_consent_at`, alongside
`waitlist_consent_version` and `waitlist_role`. Entries are shaped as:

```typescript
interface WaitlistEntry {
  id: string
  email: string
  name?: string
  role: 'caregiver' | 'professional' | 'partner' | 'other'
  consent: boolean
  submittedAt: Date
  consentAt: Date
  consentVersion: string
}
```

## User Flow

### Primary Conversion Path
1. **Homepage** → "Join the waitlist" CTA
2. **Waitlist Form** → Complete form with validation
3. **Success Page** → Social sharing + next steps

### Entry Points
- Homepage hero CTA
- Navigation "Join waitlist" button  
- Direct URL: `/waitlist`
- Legacy redirect: `/newsletter` → `/waitlist`

## Testing

### Automated Tests (25 test cases)
```bash
# Run waitlist tests
npm test src/components/__tests__/waitlist-form.test.tsx
```

**Test Coverage:**
- Form structure and accessibility
- Validation (required fields, email format, character limits)
- User interactions (role selection, form submission)
- Keyboard navigation (tab order, arrow keys)
- ARIA-live announcements
- Loading states and error handling
- Form state preservation during errors

### Manual Testing Checklist

**Navigation:**
- [ ] Homepage hero CTA → `/waitlist`
- [ ] Nav button "Join waitlist" → `/waitlist`
- [ ] `/newsletter` redirects to `/waitlist`

**Form Validation:**
- [ ] Submit empty form → Shows all required field errors
- [ ] Invalid email → Shows email format error
- [ ] Unchecked consent → Prevents submission
- [ ] Valid submission → Redirects to success page

**Accessibility:**
- [ ] Tab navigation through all form elements
- [ ] Arrow key navigation in role radio group
- [ ] Screen reader announces form status changes
- [ ] Form errors announced via ARIA-live
- [ ] Submit with Enter key works

**Data Storage:**
- [ ] Form submission creates `data/waitlist.json`
- [ ] Entry includes all form data and timestamp
- [ ] Duplicate emails are prevented

## Analytics Events

### Tracked Events
```javascript
// Form submission with segmentation
analytics.waitlistSubmit(role, hasName)

// Social sharing clicks
analytics.pageView('twitter_share_click')
analytics.pageView('linkedin_share_click')
```

### Custom Dimensions
- **User Role**: Segment users by caregiver type
- **Form Completion**: Track optional field completion rates
- **Entry Point**: Track which CTA brought users to form

## Production Deployment

### Environment Variables
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
RESEND_API_KEY=re_...          # Must be a FULL-ACCESS key; sending-only keys cannot write contacts
RESEND_FROM=pero <hello@joinpero.com>
CONTACT_INBOX=hello@joinpero.com
```

With no `RESEND_API_KEY` set, `NODE_ENV=production` makes `createWaitlistStorage()` **throw** rather than fall back to the local file. That is deliberate: the serverless filesystem is ephemeral, so a file write there succeeds and then vanishes, which is how signups were silently lost before #2.

### Reading the signups

Resend's dashboard is the UI — there is no admin page in this app. Filter contacts by the
presence of `waitlist_consent_at` to identify waitlist signups.

`getAll()` and `count()` exist on the storage interface and are implemented, but **nothing in
the app calls them** — `getWaitlistCount()` is exported from `src/lib/actions/waitlist.ts` and
has no callers. Treat them as untested-in-production until something uses them.

### Required one-time Resend setup

Verified against the live API on 2026-10-06, both the hard way:

1. **The `RESEND_API_KEY` must be a full-access key.** A sending-only key returns
   `401 restricted_api_key` — "This API key is restricted to only send emails" — on every
   contact call. Sending-only is Resend's default when creating a key.
2. **The four custom properties must be created before any signup can be stored.** Resend does
   not create them on assignment; it rejects the request with
   `422 "One or more properties do not exist"`. Only `string` and `number` types exist, so the
   consent timestamp is stored as an ISO-8601 string.

```bash
KEY=re_your_full_access_key
for k in source waitlist_role waitlist_consent_at waitlist_consent_version; do
  curl -s -X POST 'https://api.resend.com/contact-properties' \
    -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
    -d "{\"key\":\"$k\",\"type\":\"string\"}"
done
```

Still unverified: whether the list endpoint returns `properties`, which `getAll()` filters on.
Nothing calls `getAll()` or `count()` yet, so this is latent rather than live.

## Performance

### Optimizations
- **Server-side validation** reduces client-side JavaScript
- **Progressive enhancement** - works without JavaScript
- **Optimistic UI updates** for better perceived performance
- **Proper caching** headers for static assets

### Lighthouse Scores (Target)
- Performance: ≥95
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Conversion Optimization

### Design Decisions
- **Single primary goal** - waitlist signup
- **Minimal friction** - only essential fields required
- **Social proof** - waitlist count display
- **Clear value proposition** - benefits of joining
- **Trust signals** - professional design and clear privacy

### A/B Testing Ready
- Form layout can be easily modified
- CTA text configurable via feature flags
- Analytics track conversion by user segment

## Support & Maintenance

### Common Issues
```bash
# Form not submitting
# Check: Server action is properly connected
# Fix: Verify useFormState implementation

# Data not saving
# Check: data/ directory exists and is writable
# Fix: mkdir -p data && chmod 755 data

# Validation errors not showing
# Check: Zod schema matches form fields
# Fix: Review schema in src/lib/validations/waitlist.ts
```

### Monitoring
- **Form submission rate** via Plausible
- **Error tracking** via server logs  
- **Conversion funnel** analysis

---

**🎯 Goal**: Convert visitors into engaged waitlist members who will become early users and advocates for pero.
