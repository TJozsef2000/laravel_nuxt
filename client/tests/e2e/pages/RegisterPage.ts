import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test'

export class RegisterPage {
  readonly page: Page
  readonly heading: Locator
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly termsCheckbox: Locator
  readonly registerButton: Locator
  readonly signInLink: Locator
  readonly termsLink: Locator
  readonly privacyLink: Locator
  readonly errorAlert: Locator

  constructor(page: Page) {
    this.page = page

    // Main elements
    this.heading = page.getByRole('heading', { name: /create your account/i })
    this.nameInput = page.getByLabel(/full name/i)
    this.emailInput = page.getByLabel(/email address/i)
    this.passwordInput = page.getByLabel('Password *', { exact: true })
    this.confirmPasswordInput = page.getByLabel(/confirm password/i)
    this.termsCheckbox = page.getByLabel(/i agree to the terms and conditions/i)
    this.registerButton = page.getByRole('button', { name: /create account/i })

    // Navigation links
    this.signInLink = page.getByRole('link', { name: /sign in here/i })
    this.termsLink = page.getByRole('link', { name: /terms of service/i })
    this.privacyLink = page.getByRole('link', { name: /privacy policy/i })

    // Error handling
    this.errorAlert = page.locator('[role="alert"] p.text-sm.font-medium')
  }

  async goto() {
    await this.page.goto('/register')
    await this.page.waitForLoadState('networkidle')
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/create account/i)
    await expect(this.heading).toBeVisible()
  }

  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword?: string,
    acceptTerms: boolean = true
  ) {
    await this.nameInput.fill(name)
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.confirmPasswordInput.fill(confirmPassword || password)

    if (acceptTerms) {
      await this.termsCheckbox.check()
    }

    await this.registerButton.click()
  }

  async expectRegistrationSuccess() {
    // Should redirect to dashboard after successful registration
    await expect(this.page).toHaveURL(/.*dashboard/)
  }

  async expectRegistrationError(errorMessage?: string) {
    await expect(this.errorAlert).toBeVisible()
    if (errorMessage) {
      await expect(this.errorAlert).toContainText(errorMessage)
    }
  }

  async clickSignIn() {
    await this.signInLink.click()
  }

  async clickTermsOfService() {
    await this.termsLink.click()
  }

  async clickPrivacyPolicy() {
    await this.privacyLink.click()
  }
}
