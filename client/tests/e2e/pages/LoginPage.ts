import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly heading: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly rememberCheckbox: Locator
  readonly loginButton: Locator
  readonly signUpLink: Locator
  readonly forgotPasswordLink: Locator
  readonly errorAlert: Locator

  constructor(page: Page) {
    this.page = page

    // Main elements
    this.heading = page.getByRole('heading', { name: /log in/i })
    this.emailInput = page.getByLabel(/email address/i)
    this.passwordInput = page.getByLabel(/password/i)
    this.rememberCheckbox = page.getByLabel(/remember me/i)
    this.loginButton = page.getByRole('button', { name: /log in/i })

    // Navigation links
    this.signUpLink = page.locator('main').getByRole('link', { name: /sign up/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot your password/i })

    // Error handling
    this.errorAlert = page.locator('div[role="alert"].text-red-700')
  }

  async goto() {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/log in/i)
    await expect(this.heading).toBeVisible()
  }

  async login(email: string, password: string, remember: boolean = false) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)

    if (remember) {
      await this.rememberCheckbox.check()
    }

    await this.loginButton.click()
  }

  async expectLoginSuccess() {
    // Should redirect to dashboard after successful login
    await expect(this.page).toHaveURL(/.*dashboard/)
  }

  async expectLoginError(errorMessage?: string) {
    await expect(this.errorAlert).toBeVisible()
    if (errorMessage) {
      await expect(this.errorAlert).toContainText(errorMessage)
    }
  }

  async clickSignUp() {
    await this.signUpLink.click()
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click()
  }
}
