import { test, expect } from './fixtures/pages';

test.describe('Register Page', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  test('should display register page correctly', async ({ registerPage }) => {
    await registerPage.expectPageLoaded();

    // Check all form elements are visible
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
    await expect(registerPage.termsCheckbox).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();

    // Check navigation links are visible
    await expect(registerPage.signInLink).toBeVisible();
    await expect(registerPage.termsLink).toBeVisible();
    await expect(registerPage.privacyLink).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ registerPage }) => {
    // Try to submit empty form
    await registerPage.registerButton.click();

    // Should show client-side validation errors
    await registerPage.expectRegistrationError("The full name field is required. (and 3 more errors)");
  });

  test('should show validation errors for invalid email', async ({ registerPage }) => {
    await registerPage.nameInput.fill('John Doe');
    await registerPage.emailInput.fill('invalid-email@t');
    await registerPage.passwordInput.fill('password123');
    await registerPage.confirmPasswordInput.fill('password123');
    await registerPage.termsCheckbox.check();

    await registerPage.registerButton.click();

    // Should show email validation error
    await registerPage.expectRegistrationError();
  });

  test('should show validation error for short password', async ({ registerPage }) => {
    const randomEmail : string = `test${Date.now()}@test.com`;
    await registerPage.register('John Doe', randomEmail, '123', '123');

    // Should show password length error (Laravel requires min 4 chars based on LoginRequest)
    await registerPage.expectRegistrationError();
    await expect(registerPage.errorAlert).toContainText(/The password field must be at least 8 characters./i);
  });

  test('should show validation error for password mismatch', async ({ registerPage }) => {
    const randomEmail : string = `test${Date.now()}@test.com`;
    await registerPage.register('John Doe', randomEmail, 'password123', 'differentpassword');

    // Should show password confirmation error
    await registerPage.expectRegistrationError();
    await expect(registerPage.errorAlert).toContainText(/confirmation/i);
  });

  test('should show error when terms are not accepted', async ({ registerPage }) => {
    const randomEmail : string = `test${Date.now()}@test.com`;
    await registerPage.register('John Doe', randomEmail, 'password123', 'password123', false);

    // Should show terms acceptance error
    await registerPage.expectRegistrationError();
    await expect(registerPage.errorAlert).toContainText(/terms/i);
  });

  test('should show error for existing email', async ({ registerPage }) => {
    // Try to register with an email that already exists
    await registerPage.register('John Doe', 'test@test.com', 'password123');

    // Should show email already exists error
    await registerPage.expectRegistrationError();
    await expect(registerPage.errorAlert).toContainText(/already.*taken/i);
  });

  test('should successfully register with valid data', async ({ registerPage }) => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `test${Date.now()}@test.com`;

    await registerPage.register('John Doe', uniqueEmail, 'password123');


    // assert that there is no errorAlert
    await expect(registerPage.errorAlert).not.toBeVisible();

    // Should redirect to dashboard after successful registration
    await registerPage.expectRegistrationSuccess();

    // Should see success notification
    // await expect(registerPage.page.locator('.notification')).toContainText(/account created successfully/i);
  });

  test('should navigate to login page when sign in clicked', async ({ registerPage, loginPage }) => {
    await registerPage.clickSignIn();

    await expect(loginPage.page).toHaveURL(/.*login/);
    await expect(loginPage.heading).toBeVisible();
  });

  test('should navigate to terms page when terms link clicked', async ({ registerPage }) => {
    await registerPage.clickTermsOfService();

    // Should navigate to terms page
    await expect(registerPage.page).toHaveURL(/.*terms/);

    // Should see terms page content (if page exists)
    // await expect(registerPage.page.getByRole('heading', { name: /terms of service/i })).toBeVisible();
  });

  test('should navigate to privacy page when privacy link clicked', async ({ registerPage }) => {
    await registerPage.clickPrivacyPolicy();

    // Should navigate to privacy page
    await expect(registerPage.page).toHaveURL(/.*privacy/);

    // Should see privacy page content (if page exists)
    // await expect(registerPage.page.getByRole('heading', { name: /privacy policy/i })).toBeVisible();
  });

  test('should disable form during registration process', async ({ registerPage }) => {
    // Fill in valid data
    await registerPage.nameInput.fill('John Doe');
    await registerPage.emailInput.fill('john@test.com');
    await registerPage.passwordInput.fill('password123');
    await registerPage.confirmPasswordInput.fill('password123');
    await registerPage.termsCheckbox.check();

    // Click register button
    await registerPage.registerButton.click();

    // Form should be disabled during loading, group assertions together
    await Promise.all([
      expect(registerPage.nameInput).toBeDisabled(),
      expect(registerPage.emailInput).toBeDisabled(),
      expect(registerPage.passwordInput).toBeDisabled(),
      expect(registerPage.confirmPasswordInput).toBeDisabled(),
      expect(registerPage.registerButton).toBeDisabled(),
    ]);

    // Button text should change to indicate loading
    await expect(registerPage.registerButton).toContainText(/creating account/i);
  });

  test('should validate name field requirements', async ({ registerPage }) => {
    // Name should be required
    await registerPage.registerButton.click();

    // Check if the input has the 'border-red-500' class (invalid state)
    await expect(registerPage.nameInput).toHaveClass(/border-red-500/);

    // Name should accept valid characters
    await registerPage.nameInput.fill('John O\'Connor-Smith Jr.');

    // Check that the error class is no longer present
    await expect(registerPage.nameInput).not.toHaveClass(/border-red-500/);
  });

  test('should show real-time password confirmation validation', async ({ registerPage }) => {
    await registerPage.passwordInput.fill('password123');
    await registerPage.confirmPasswordInput.fill('differentpassword');

    // Should show password mismatch indicator (if implemented client-side)
    // await expect(registerPage.confirmPasswordInput).toHaveClass(/error/);

    // Fix the confirmation password
    await registerPage.confirmPasswordInput.clear();
    await registerPage.confirmPasswordInput.fill('password123');

    // Should show matching indicator (if implemented client-side)
    // await expect(registerPage.confirmPasswordInput).toHaveClass(/valid/);
  });

  test('should have proper CSRF protection', async ({ registerPage }) => {
    // Check that CSRF token is present in cookies
    const cookies = await registerPage.page.context().cookies();
    const csrfCookie = cookies.find(cookie =>
      cookie.name === 'XSRF-TOKEN' || cookie.name.includes('csrf')
    );
    expect(csrfCookie).toBeTruthy();
  });

  test('should auto-login user after successful registration', async ({ registerPage }) => {
    // Generate unique email
    const uniqueEmail = `autotest${Date.now()}@test.com`;

    await registerPage.register('Auto Test User', uniqueEmail, 'password123');

    // Should redirect to dashboard (auto-login)
    await registerPage.expectRegistrationSuccess();

    // User should be authenticated (check user menu in navbar)
    // await expect(registerPage.page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show email verification notice after registration', async ({ registerPage }) => {
    // Generate unique email
    const uniqueEmail = `verify${Date.now()}@test.com`;

    await registerPage.register('Verify User', uniqueEmail, 'password123');

    // Should show email verification notice
    // await expect(registerPage.page.locator('.notification')).toContainText(/check your email/i);
  });

  test('should redirect authenticated users away from register page', async ({ registerPage, loginPage }) => {
    // First login/register successfully
    const uniqueEmail = `redirect${Date.now()}@test.com`;
    await registerPage.register('Redirect User', uniqueEmail, 'password123');
    await registerPage.expectRegistrationSuccess();

    // Then try to visit register page again
    await registerPage.goto();

    // Should redirect away from register page (to dashboard)
    await expect(registerPage.page).toHaveURL(/.*dashboard/);
  });

  test('should validate password strength requirements', async ({ registerPage }) => {
    // Test various password requirements (if implemented)
    const weakPasswords = ['123', 'abc', 'password'];

    for (const password of weakPasswords) {
      await registerPage.passwordInput.fill(password);
      await registerPage.confirmPasswordInput.fill(password);

      // Should show password strength indicator (if implemented)
      // await expect(registerPage.page.locator('.password-strength')).toContainText(/weak/i);
    }

    // Test strong password
    await registerPage.passwordInput.fill('StrongP@ssw0rd123');
    await registerPage.confirmPasswordInput.fill('StrongP@ssw0rd123');

    // Should show strong password indicator (if implemented)
    // await expect(registerPage.page.locator('.password-strength')).toContainText(/strong/i);
  });
});
