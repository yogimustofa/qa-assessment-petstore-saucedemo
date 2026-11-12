// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');

/**
 * UI Scenario 1: Authentication & Login Validations
 */
test.describe('UI Scenario 1: Login Functionality', () => {

  test('LOGIN-001: [Positive] Successful login with valid standard user credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert redirection to inventory products page
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('LOGIN-002: [Negative] Attempt login with locked out user account', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('locked_out_user', 'secret_sauce');

    // Assert locked out error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('LOGIN-003: [Negative] Attempt login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'wrong_password_123');

    // Assert credentials mismatch error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('LOGIN-004: [Negative] Attempt login with empty username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.loginButton.click();

    // Assert required field error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

});
