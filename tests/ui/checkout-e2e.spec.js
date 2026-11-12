// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');

/**
 * UI Scenario 2: End-to-End Checkout Flow
 * Specific Target: 'Sauce Labs Onesie'
 */
test.describe('UI Scenario 2: End-to-End Checkout Flow', () => {

  test('CHECKOUT-001: Complete successful checkout for "Sauce Labs Onesie"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Open website & Authenticate
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

    // Step 4: Proceed to Checkout & Fill shipping info
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
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

  test('CHECKOUT-002: [Negative] Validation error when submitting empty checkout information', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.addOnesieToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Click continue without filling fields
    await checkoutPage.continueButton.click();

    // Assert validation error
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Error: First Name is required');
  });

});
