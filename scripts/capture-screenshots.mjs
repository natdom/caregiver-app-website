import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const BASE_URL = 'https://caregiver-app-website.vercel.app';
const OUTPUT_DIR = './screenshots';

const pages = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/waitlist', name: 'waitlist' },
  { path: '/resources', name: 'resources' },
  { path: '/contact', name: 'contact' },
  { path: '/partners', name: 'partners' },
];

const colorSchemes = ['light', 'dark'];

async function captureScreenshots() {
  console.log('Starting screenshot capture...\n');

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Launch browser
  const browser = await chromium.launch();

  for (const scheme of colorSchemes) {
    console.log(`\nCapturing ${scheme} mode screenshots:`);

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      colorScheme: scheme,
    });

    const page = await context.newPage();

    for (const pageInfo of pages) {
      try {
        console.log(`  - ${pageInfo.name}...`);

        // Navigate to page
        await page.goto(`${BASE_URL}${pageInfo.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        // Wait a bit for any animations
        await page.waitForTimeout(1000);

        // Take screenshot
        const filename = `${pageInfo.name}-${scheme}.png`;
        await page.screenshot({
          path: join(OUTPUT_DIR, filename),
          fullPage: true,
        });

        console.log(`    ✓ Saved ${filename}`);
      } catch (error) {
        console.log(`    ✗ Error capturing ${pageInfo.name}: ${error.message}`);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n✅ Screenshots saved to ${OUTPUT_DIR}/`);
}

captureScreenshots().catch(console.error);
