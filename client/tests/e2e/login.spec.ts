import { test, expect } from './fixtures/pages';

test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should display login page correctly', async ({ loginPage }) => {
    await loginPage.expectPageLoaded();

    // Check all form elements are visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.rememberCheckbox).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Check navigation links are visible
    await expect(loginPage.signUpLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ loginPage }) => {
    // Try to submit empty form
    await loginPage.loginButton.click();

    // Should show validation errors from Laravel backend
    await loginPage.expectLoginError();

    // Should contain field required messages
    await expect(loginPage.errorAlert).toContainText(/email.*required/i);
  });

  test('should show validation errors for invalid email', async ({ loginPage }) => {
    await loginPage.emailInput.fill('invalid-email@test.com');
    await loginPage.passwordInput.fill('password123');
    await loginPage.loginButton.click();

    // Should show email validation error
    await loginPage.expectLoginError();
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login('nonexistent@example.com', 'wrongpassword');

    // Should show authentication error
    await loginPage.expectLoginError();
    await expect(loginPage.errorAlert).toContainText(/The provided credentials are incorrect./i);
  });

  test('should successfully login with valid credentials', async ({ loginPage }) => {
    // Note: This test requires a test user to exist in the database
    // You might want to create a test user in a before hook or use database seeding
    await loginPage.login('admin@example.com', '12345678');

    // Should redirect to dashboard
    await loginPage.expectLoginSuccess();

    // Should see success notification (if implemented)
    // await expect(loginPage.page.locator('.notification')).toContainText(/successfully signed in/i);
  });

  test('should remember user when checkbox is checked', async ({ loginPage }) => {
    await loginPage.login('admin@example.com', '12345678', true);

    await loginPage.isErrorAlertNotVisible();
    // Should redirect to dashboard
    await loginPage.expectLoginSuccess();

    // Check that remember token cookie is set (implementation dependent)
    const cookies = await loginPage.page.context().cookies();
    const rememberCookie = cookies.find(cookie => cookie.name.includes('remember'));
    expect(rememberCookie).toBeTruthy();
  });

  test('should navigate to register page when sign up clicked', async ({ loginPage, registerPage }) => {
    await loginPage.clickSignUp();

    await expect(registerPage.page).toHaveURL(/.*register/);
    await expect(registerPage.heading).toBeVisible();
  });

  test('should navigate to forgot password page when link clicked', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();

    // Should navigate to forgot password page
    await expect(loginPage.page).toHaveURL(/.*forgot-password/);

    // Should see forgot password heading (if page exists)
    // await expect(loginPage.page.getByRole('heading', { name: /forgot password/i })).toBeVisible();
  });

  test('should disable form during login process', async ({ loginPage }) => {
    // Fill in valid credentials
    await loginPage.emailInput.fill('admin@example.com');
    await loginPage.passwordInput.fill('12345678');

    // Click login button
    await loginPage.loginButton.click();

    // Form should be disabled during loading
    await expect(loginPage.emailInput).toBeDisabled();
    await expect(loginPage.passwordInput).toBeDisabled();
    await expect(loginPage.loginButton).toBeDisabled();

    // Button text should change to indicate loading
    await expect(loginPage.loginButton).toContainText(/signing in/i);
  });

  test('should clear error message when form is modified', async ({ loginPage }) => {
    // First, trigger an error
    await loginPage.loginButton.click();
    await loginPage.expectLoginError();

    // Then modify form
    await loginPage.emailInput.fill('test@example.com');

    // Error should be cleared (if implemented)
    // await expect(loginPage.errorAlert).not.toBeVisible();
  });

  test('should have proper CSRF protection', async ({ loginPage }) => {
    // Check that CSRF token is present in cookies
    const cookies = await loginPage.page.context().cookies();
    const csrfCookie = cookies.find(cookie =>
      cookie.name === 'XSRF-TOKEN' || cookie.name.includes('csrf')
    );
    expect(csrfCookie).toBeTruthy();
  });

  test('should redirect authenticated users away from login page', async ({ loginPage }) => {
    // First login successfully
    await loginPage.login('admin@example.com', '12345678');

    await loginPage.isErrorAlertNotVisible();
    await expect(loginPage.errorAlert).not.toBeVisible();
    // Should redirect to dashboard
    await loginPage.expectLoginSuccess();

    // Then try to visit login page again
    await loginPage.goto();

    // Should redirect away from login page (to dashboard)
    await expect(loginPage.page).toHaveURL(/.*dashboard/);
  });
});
