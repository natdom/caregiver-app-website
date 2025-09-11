# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub** and connect repository to [Vercel](https://vercel.com)

2. **Set Environment Variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
   RESEND_API_KEY=your_resend_api_key
   ```

3. **Deploy** - automatic on every push to main branch

## Environment Setup

### Required Variables
- `NEXT_PUBLIC_SITE_URL` - Your production domain (e.g., https://support.network)

### Optional Variables  
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Your domain for Plausible analytics
- `RESEND_API_KEY` - For contact form email sending
- `MAILCHIMP_API_KEY` - For newsletter integration
- `CONVERTKIT_API_KEY` - Alternative newsletter provider

## Pre-Launch Checklist

### Technical
- [ ] Environment variables configured
- [ ] Domain configured and SSL working
- [ ] Analytics tracking verified
- [ ] Contact form sending emails
- [ ] All pages loading correctly
- [ ] Mobile responsiveness tested

### Content
- [ ] All copy reviewed and approved
- [ ] Resource articles published
- [ ] Legal pages updated with correct information
- [ ] Contact information accurate
- [ ] Social media links working

### Performance
- [ ] Lighthouse audit score ≥95 on mobile
- [ ] Images optimized and properly sized
- [ ] Core Web Vitals passing
- [ ] Page load times under 3 seconds

### Accessibility
- [ ] axe-core audit passing
- [ ] Keyboard navigation working
- [ ] Screen reader testing completed
- [ ] Color contrast ratios verified

## Post-Launch

### Monitor
- Set up uptime monitoring
- Check analytics data
- Monitor form submissions
- Review error logs

### Backup
- Export form submissions regularly
- Keep content backed up
- Document any custom changes

## Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Configure environment variables

### Railway
1. Connect GitHub repository  
2. Add environment variables
3. Deploy automatically on push

### Docker
Build and run with Docker:
```bash
docker build -t support-network-website .
docker run -p 3000:3000 support-network-website
```