/**
 * Page Object Model for SauceDemo Inventory / Products Page
 */
class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.addOnesieButton = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
    this.removeOnesieButton = page.locator('[data-test="remove-sauce-labs-onesie"]');
  }

  async addOnesieToCart() {
    await this.addOnesieButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getCartBadgeCount() {
    return await this.cartBadge.textContent();
  }
}

module.exports = { InventoryPage };
