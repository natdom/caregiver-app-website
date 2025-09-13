# Waitlist System Documentation

## Overview

The Support Network waitlist system is designed for high conversion rates, comprehensive accessibility, and detailed analytics. Built with React Server Actions, Zod validation, and extensive testing.

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
    └── waitlist-entries.json # Development storage (auto-created)
```

## Features

### ✅ Form Validation
- **Server-side validation** with Zod schemas
- **Real-time client validation** for better UX
- **Comprehensive error handling** with field-specific messages
- **Character limits** (500 chars for challenge field)

### ✅ User Segmentation
- **Role-based tracking**: Family Caregiver, Healthcare Professional, Investor/Funder, Other
- **Optional challenge field** for user insights
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
| `role` | Radio | Yes | One of: caregiver, professional, funder, other |
| `challenge` | Textarea | No | Max 500 characters |
| `consent` | Checkbox | Yes | Must be checked |

## Storage System

### Development (File-based)
```bash
# Data stored in local JSON file
data/waitlist-entries.json

# View submissions
cat data/waitlist-entries.json

# Check entry count
jq length data/waitlist-entries.json
```

### Production (PostgreSQL-ready)
The storage adapter in `src/lib/storage/waitlist-adapter.ts` includes interfaces for PostgreSQL implementation:

```typescript
interface WaitlistEntry {
  id: string
  email: string
  name?: string
  role: 'caregiver' | 'professional' | 'funder' | 'other'
  challenge?: string
  consent: boolean
  submittedAt: Date
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
- [ ] 500+ chars in challenge → Field limited to 500
- [ ] Unchecked consent → Prevents submission
- [ ] Valid submission → Redirects to success page

**Accessibility:**
- [ ] Tab navigation through all form elements
- [ ] Arrow key navigation in role radio group
- [ ] Screen reader announces form status changes
- [ ] Form errors announced via ARIA-live
- [ ] Submit with Enter key works

**Data Storage:**
- [ ] Form submission creates `data/waitlist-entries.json`
- [ ] Entry includes all form data and timestamp
- [ ] Duplicate emails are prevented

## Analytics Events

### Tracked Events
```javascript
// Form submission with segmentation
analytics.waitlistSubmit(role, hasName, hasChallenge)

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
DATABASE_URL=postgresql://... # For production storage
```

### Database Setup (Production)
```sql
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('caregiver', 'professional', 'funder', 'other')),
  challenge TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX idx_waitlist_role ON waitlist_entries(role);
CREATE INDEX idx_waitlist_submitted_at ON waitlist_entries(submitted_at);
```

### Implementation Steps
1. **Update storage adapter** in `src/lib/storage/waitlist-adapter.ts`
2. **Add database connection** logic
3. **Test production storage** with staging environment
4. **Monitor form submissions** via Plausible analytics

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
- **User feedback** from challenge field responses
- **Conversion funnel** analysis

---

**🎯 Goal**: Convert visitors into engaged waitlist members who will become early users and advocates for Support Network.