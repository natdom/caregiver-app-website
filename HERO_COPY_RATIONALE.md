# Hero Copy A/B Test Rationale

## Overview
We've implemented two testable variants for the hero section subheadline to optimize for conversions (waitlist/newsletter signups).

## Copy Variants

### Variant A: "Make caregiving lighter—practical guidance, real community, simple tools."
**Strategic Focus**: Benefit-driven with concrete value propositions
- **"Make caregiving lighter"** - Directly addresses the core emotional need (reducing burden)
- **"practical guidance, real community, simple tools"** - Three specific benefits that caregivers seek
- **Tone**: Solution-focused and actionable

**Target Audience**: Caregivers who are actively seeking resources and want to know exactly what they'll get

### Variant B: "Less searching. More support. Join a community built for caregivers."
**Strategic Focus**: Problem-solution with community invitation
- **"Less searching. More support."** - Addresses a key pain point (information overload) with parallel structure
- **"Join a community built for caregivers"** - Strong call-to-belonging with specificity
- **Tone**: Empathetic and community-focused

**Target Audience**: Caregivers who feel isolated and are looking for connection and belonging

## A/B Testing Strategy

### Success Metrics
- Primary: Newsletter/waitlist signup conversion rate
- Secondary: Time on page, scroll depth, CTA engagement

### Hypothesis
- **Variant A** may perform better with task-oriented caregivers who want practical solutions
- **Variant B** may resonate more with emotionally drained caregivers seeking community

### Implementation
- **Production Default**: Variant B - "Less searching. More support. Join a community built for caregivers."
- Environment variable override: `NEXT_PUBLIC_HERO_VARIANT=A` (to test variant A)
- Data attributes for analytics tracking (`data-testid="variant-a"` or `data-testid="variant-b"`)
- Both variants maintain identical CTA placement and accessibility features

### Decision Rationale
**Variant B was chosen for production** because:
- Addresses the core emotional need (feeling overwhelmed by information)
- Creates immediate sense of belonging and community
- More empathetic tone resonates with stressed caregivers
- Clear problem-solution structure is easy to understand

## UX Writing Principles Applied

### Clarity Over Cleverness
Both variants use plain language that caregivers can immediately understand without jargon or metaphors.

### Emotional Resonance
- Variant A: Focuses on relief and empowerment
- Variant B: Addresses isolation and belonging

### Action-Oriented
Both variants lead naturally to the primary CTA "Get early access" by establishing clear value propositions.

### Inclusive Language
Both variants use "caregivers" (not "caregiver") to acknowledge the diversity of caregiving situations and avoid assumptions.

## Accessibility Considerations
- Both variants maintain semantic heading hierarchy (h1 → p structure)
- Subheadline text remains descriptive enough for screen readers
- No decorative elements that could confuse assistive technology
- Clear, high-contrast text that supports readability

## Conversion Optimization Elements
1. **Single Primary CTA**: Eliminated decision paralysis by removing secondary "Explore resources" button
2. **Testimonial Integration**: Added social proof directly in hero to build trust
3. **Benefit-Focused Language**: Both variants immediately communicate value
4. **Reduced Cognitive Load**: Simplified messaging hierarchy

## Testing Recommendations
- Run test for minimum 2 weeks to account for weekly patterns in caregiving schedules
- Segment results by traffic source (social media vs. search vs. direct)
- Monitor qualitative feedback through support channels for language preferences
- Consider follow-up tests with hybrid approaches based on winning elements