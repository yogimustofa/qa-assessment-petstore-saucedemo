/**
 * Page Object Model for SauceDemo Shopping Cart Page
 */
class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }
}

module.exports = { CartPage };
