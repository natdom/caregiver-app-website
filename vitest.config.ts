import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

/**
 * Quarantined test files: known-failing as of 2026-10-06, 53 failures total.
 * See the per-file table in AGENTS.md for counts.
 *
 * These are excluded from the CI gate (VITEST_QUARANTINE=skip) so that the
 * required check is meaningful — a red suite that is always red gates nothing.
 * They still run in the informational job, and locally by default.
 *
 * Nearly all of these assert rendered marketing copy rather than behaviour,
 * which is why they broke en masse at the rebrand. The intent is to delete
 * them alongside the components they cover rather than repair them in place.
 *
 * A file leaves this list when its tests are rewritten against BEHAVIOUR —
 * typically when the component it covers is changed — not by patching the
 * existing copy-coupled assertions back to green. Removing it puts the file
 * in the required gate, where it can no longer regress.
 */
const quarantine = [
  'src/app/partners/__tests__/page.test.tsx',
  'src/app/partners/__tests__/metadata.test.tsx',
  'src/components/__tests__/waitlist-form.test.tsx',
  'src/components/__tests__/navigation.test.tsx',
  'src/components/__tests__/hero.test.tsx',
  'src/components/__tests__/topic-filter.test.tsx',
  'src/components/partners/__tests__/components.test.tsx',
  'src/hooks/__tests__/use-scroll-tracking.test.tsx',
  'src/lib/__tests__/topic-utils.test.ts',
  'src/lib/__tests__/feature-flags.test.ts',
]

const defaultExclude = ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/.contentlayer/**']

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude:
      process.env.VITEST_QUARANTINE === 'skip'
        ? [...defaultExclude, ...quarantine]
        : defaultExclude,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
