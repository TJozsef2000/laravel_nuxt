import { test, expect } from './fixtures/pages';

test.describe('Homepage', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should display correct title and main content', async ({ homePage, page }) => {
    await homePage.expectPageLoaded();
    await homePage.expectHeroContent();
  });

  test('should display all navigation links', async ({ homePage }) => {
    await homePage.expectNavigationVisible();
  });

  test('should navigate to login page when sign in clicked', async ({ homePage, loginPage }) => {
    await homePage.clickSignIn();
    await expect(loginPage.page).toHaveURL(/.*login/);

    // Verify the login page loaded correctly using page object
    await expect(loginPage.heading).toBeVisible();
  });

  test('should navigate to register page when sign up clicked', async ({ homePage, registerPage }) => {
    await homePage.clickSignUp();
    await expect(registerPage.page).toHaveURL(/.*register/);

    // Verify the register page loaded correctly using page object
    await expect(registerPage.heading).toBeVisible();
  });
});
