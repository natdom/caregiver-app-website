# Support Network Marketing Website

A modern, accessible marketing website for Support Network - a caregiving support community. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd caregiver-app-website
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=localhost
   RESEND_API_KEY=your_resend_api_key
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Tech Stack

### Core Framework
- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### UI Components
- **Radix UI** primitives with **shadcn/ui** components
- **Lucide React** for icons
- **next-themes** for dark mode support

### Content Management
- **Contentlayer** for MDX content processing
- **MDX** for rich content pages

### Forms & Validation
- **React Hook Form** for form handling
- **Zod** for schema validation
- **Resend** for email sending (stub implementation)

### SEO & Analytics
- **next/metadata** for SEO optimization
- **@vercel/og** for dynamic OG image generation
- **Plausible Analytics** (privacy-first)
- **next-sitemap** for sitemap generation

### Development Tools
- **ESLint** + **Prettier** for code quality
- **Husky** + **lint-staged** for git hooks
- **Vitest** + **Testing Library** for testing

## 📁 Project Structure

```
caregiver-app-website/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (legal)/         # Legal pages (privacy, terms, accessibility)
│   │   ├── api/             # API routes
│   │   └── docs/            # Documentation pages
│   ├── components/          # React components
│   │   └── ui/              # shadcn/ui base components
│   ├── lib/                 # Utilities and configurations
│   └── test/                # Test setup and utilities
├── content/                 # MDX content files
│   ├── pages/               # Legal and static pages
│   └── resources/           # Blog/resource articles
├── public/                  # Static assets
└── scripts/                 # Utility scripts
```

## 📝 Content Management

### Adding Resources

1. Create a new MDX file in `content/resources/`:
   ```mdx
   ---
   title: "Your Resource Title"
   excerpt: "Brief description of the resource"
   publishedAt: "2024-01-15"
   author: "Author Name"
   authorRole: "Author credentials"
   topics: ["Topic1", "Topic2"]
   readingTime: 5
   featured: false
   cover: "https://image-url.jpg"
   coverAlt: "Image description"
   ---

   Your content here...
   ```

2. The new resource will automatically appear on `/resources`

### Updating Static Pages

Legal and static pages are in `content/pages/`:
- `privacy.mdx` - Privacy Policy
- `terms.mdx` - Terms of Service  
- `accessibility.mdx` - Accessibility Statement

### Content Style Guide

#### Writing Guidelines
- **Use inclusive language** - "person with autism" not "autistic person"
- **Be concise** - Caregivers are busy; respect their time
- **Avoid clinical jargon** - Use plain language or define terms
- **Lead with empathy** - Acknowledge challenges before offering solutions
- **Be specific** - Provide actionable advice with examples

#### Content Checklist
- [ ] **Headings** follow logical hierarchy (H1 → H2 → H3)
- [ ] **Links** have descriptive text (not "click here")
- [ ] **Images** include meaningful alt text
- [ ] **Content** is scannable with bullets/numbered lists
- [ ] **Language** is inclusive and supportive

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
   RESEND_API_KEY=your_resend_api_key
   ```
3. **Deploy** - automatic on every push to main branch

### Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format
```

## 📧 Form Submissions

### Development
Forms currently log to console. To enable email sending:

1. **Get Resend API key** from [resend.com](https://resend.com)
2. **Add to environment variables**:
   ```
   RESEND_API_KEY=re_your_api_key
   ```
3. **Update API routes** in `src/app/api/contact/route.ts`

### Exporting Submissions

Run the export script to download form submissions as CSV:
```bash
npm run export-submissions
```

Files are saved to `exports/` directory.

## 🔍 SEO & Analytics

### Analytics Setup
1. **Create Plausible account** at [plausible.io](https://plausible.io)
2. **Add your domain** to Plausible
3. **Set environment variable**:
   ```
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
   ```

### Custom Events
The site tracks these events:
- `waitlist_submit` - Newsletter signups
- `resource_read` - Resource article views
- `contact_submit` - Contact form submissions

## 🎨 Customization

### Design Tokens
Main design tokens in `tailwind.config.ts`:
- **Colors**: Sky (primary), Emerald (accent), Slate (neutral)
- **Typography**: Inter (body), Plus Jakarta Sans (headings)
- **Spacing**: 4pt scale (4, 8, 12, 16, 24, etc.)

### Component Library
Visit `/docs/design-system` to see all components and design tokens.

## ♿ Accessibility

This site aims for **WCAG 2.2 AA compliance**:
- **Semantic HTML** structure
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** color ratios
- **Focus indicators** for interactive elements
- **Alternative text** for images

### Testing Accessibility
```bash
# Install axe CLI
npm install -g @axe-core/cli

# Run accessibility audit
axe http://localhost:3000
```

## 🤝 Contributing

### Development Workflow
1. **Create feature branch**: `git checkout -b feature/new-feature`
2. **Make changes** with tests
3. **Run quality checks**: `npm run lint && npm run typecheck && npm test`
4. **Create pull request**

### Code Style
- **TypeScript** for all new code
- **Functional components** with hooks
- **shadcn/ui** components for consistent UI
- **Tailwind CSS** for styling (no custom CSS unless necessary)

## 📋 Production Readiness Checklist

### Required for Launch
- [ ] **Analytics** - Set up Plausible account and tracking
- [ ] **Email** - Configure Resend or alternative email service
- [ ] **Domain** - Update NEXT_PUBLIC_SITE_URL in environment
- [ ] **Content** - Review all copy for brand voice and accuracy
- [ ] **Forms** - Test contact and newsletter form submissions
- [ ] **Performance** - Verify Lighthouse scores ≥95 on mobile
- [ ] **Accessibility** - Run axe audit and fix any issues

### Optional Enhancements
- [ ] **Newsletter Provider** - Integrate Mailchimp/ConvertKit
- [ ] **CRM Integration** - Connect form submissions to HubSpot/etc
- [ ] **Advanced Analytics** - Set up conversion funnel tracking
- [ ] **Social Media** - Add Open Graph images and Twitter cards
- [ ] **SSL Certificate** - Ensure HTTPS redirect is working
- [ ] **Monitoring** - Set up uptime monitoring and error tracking

## 📞 Support

### Getting Help
- **Documentation Issues**: Check this README and `/docs/design-system`
- **Development Questions**: Review code comments and component props
- **Content Updates**: See "Content Management" section above

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Contentlayer Issues
```bash
# Clear Contentlayer cache  
rm -rf .contentlayer
npm run build
```

#### TypeScript Errors
```bash
# Regenerate types
npm run typecheck
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the caregiving community**