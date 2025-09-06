import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly heroHeading: Locator
  readonly signInLink: Locator
  readonly signUpLink: Locator
  readonly getStartedLink: Locator

  constructor(page: Page) {
    this.page = page
    // Use data-testid or semantic selectors instead of CSS classes
    this.heroHeading = page.getByRole('heading', {
      level: 1,
      name: /welcome to our platform/i
    });
    // Target specific links in the hero section to avoid navbar conflicts
    this.signInLink = page.locator('[href="/login"]').filter({ hasText: /sign in/i }).last()
    this.signUpLink = page.locator('[href="/register"]').filter({ hasText: /get started/i })
    this.getStartedLink = page.locator('[href="/register"]').filter({ hasText: /get started/i })
  }

  async goto() {
    await this.page.goto('/')
    // Wait for hydration to complete in Nuxt 3
    await this.page.waitForLoadState('networkidle')
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle('Laravel Nuxt Authentication')
    await expect(this.heroHeading).toBeVisible()
  }

  async expectHeroContent() {
    await expect(this.heroHeading).toHaveText(/welcome to our platform/i)
  }

  async expectNavigationVisible() {
    await expect(this.signInLink).toBeVisible()
    await expect(this.getStartedLink).toBeVisible()
    // Note: signUpLink and getStartedLink are the same button
  }

  async clickSignIn() {
    await this.signInLink.click()
  }

  async clickSignUp() {
    // The "Get Started" button actually goes to register page
    await this.getStartedLink.click()
  }
}
