// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');

test.describe('SauceDemo UI Automation Suite', () => {

  test.describe('Scenario 1: Login Functionality', () => {
    test('UI-TC-001: Successful login with valid standard user credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');

      // Assert redirected to inventory page
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(inventoryPage.title).toHaveText('Products');
    });

    test('UI-TC-002: Failed login with locked out user', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate();
      await loginPage.login('locked_out_user', 'secret_sauce');

      // Assert error message displayed
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
    });

    test('UI-TC-003: Failed login with invalid password', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate();
      await loginPage.login('standard_user', 'wrong_password');

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    });
  });

  test.describe('Scenario 2: E2E Checkout Flow', () => {
    test('UI-TC-004: Complete E2E Checkout Flow for "Sauce Labs Onesie"', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      // Step 1: Open website & Login
      await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page).toHaveURL(/.*inventory.html/);

      // Step 2: Add item 'Sauce Labs Onesie' to Cart
      await inventoryPage.addOnesieToCart();
      await expect(inventoryPage.cartBadge).toHaveText('1');

      // Step 3: Go to Cart & Verify item presence
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.itemNames).toHaveText('Sauce Labs Onesie');

      // Step 4: Proceed to Checkout
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);

      // Fill Shipping Information
      await checkoutPage.fillInformation('Yogi', 'Mustofa', '12345');

      // Step 5: Checkout Overview & Finish
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      await expect(checkoutPage.title).toHaveText('Checkout: Overview');
      await expect(checkoutPage.itemName).toHaveText('Sauce Labs Onesie');
      await checkoutPage.finishCheckout();

      // Step 6: Ensure that Checkout process is completed
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkoutPage.completeText).toContainText('Your order has been dispatched');
    });
  });

});
