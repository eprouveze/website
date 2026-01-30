import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login')

    // Should show login form or redirect to auth provider
    await expect(page.locator('body')).toBeVisible()
  })

  test('login form has email input', async ({ page }) => {
    await page.goto('/login')

    // Look for email input (magic link flow)
    const emailInput = page.getByRole('textbox', { name: /email/i })
      .or(page.locator('input[type="email"]'))
      .first()

    await expect(emailInput).toBeVisible()
  })

  test('login form validates email', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.getByRole('textbox', { name: /email/i })
      .or(page.locator('input[type="email"]'))
      .first()

    // Enter invalid email
    await emailInput.fill('invalid-email')

    // Try to submit
    const submitButton = page.getByRole('button', { name: /sign in|continue|submit/i }).first()
    if (await submitButton.isVisible()) {
      await submitButton.click()

      // Should show validation error or browser validation
      // The form should not submit with invalid email
      await expect(page).toHaveURL(/login/)
    }
  })

  test('protected routes redirect to login', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL(/login|auth/)
  })

  test('protected API routes return 401', async ({ page }) => {
    const response = await page.request.post('/api/test-voice', {
      data: {
        message: 'Test',
        context: 'email',
        includeComparison: false,
      },
    })

    expect(response.status()).toBe(401)
  })
})

test.describe('Auth Callback', () => {
  test('callback page handles success', async ({ page }) => {
    // Auth callback should exist and handle redirects
    const response = await page.goto('/auth/callback')
    expect(response?.status()).toBe(200)
  })
})
