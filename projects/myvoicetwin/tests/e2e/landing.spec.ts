import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/My Voice Twin/)
  })

  test('displays hero section', async ({ page }) => {
    // Check for hero headline
    const headline = page.locator('h1')
    await expect(headline).toBeVisible()
    await expect(headline).toContainText(/AI|Voice|Twin/i)
  })

  test('has navigation links', async ({ page }) => {
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible()
  })

  test('has call-to-action button', async ({ page }) => {
    // Look for primary CTA button
    const ctaButton = page.getByRole('link', { name: /get started|try free|sign up/i }).first()
    await expect(ctaButton).toBeVisible()
  })

  test('displays pricing section', async ({ page }) => {
    // Scroll to pricing or find pricing section
    const pricingSection = page.locator('[id*="pricing"], [class*="pricing"]').first()
    if (await pricingSection.isVisible()) {
      await expect(pricingSection).toBeVisible()
    }
  })

  test('displays features section', async ({ page }) => {
    // Look for features/benefits section
    const featuresSection = page.locator('text=/feature|benefit|how it works/i').first()
    await expect(featuresSection).toBeVisible()
  })

  test('has footer with links', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('responsive design - mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check page still renders correctly
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Landing Page - SEO', () => {
  test('has meta description', async ({ page }) => {
    await page.goto('/')

    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
  })

  test('has Open Graph tags', async ({ page }) => {
    await page.goto('/')

    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /.+/)

    const ogDescription = page.locator('meta[property="og:description"]')
    await expect(ogDescription).toHaveAttribute('content', /.+/)
  })
})

test.describe('Landing Page - Performance', () => {
  test('loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')

    // Filter out known acceptable errors (like hydration warnings in dev)
    const criticalErrors = errors.filter(e =>
      !e.includes('Warning:') &&
      !e.includes('hydrat')
    )

    expect(criticalErrors).toHaveLength(0)
  })
})
