/**
 * Page Object Model for SauceDemo Checkout Flow
 * (Step One: Info, Step Two: Overview, Complete)
 */
class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    
    // Step One: Your Information
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    
    // Step Two: Overview
    this.summaryInfo = page.locator('.summary_info');
    this.finishButton = page.locator('[data-test="finish"]');
    this.itemName = page.locator('.inventory_item_name');
    
    // Complete
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Fill personal information and click continue
   * @param {string} firstName 
   * @param {string} lastName 
   * @param {string} postalCode 
   */
  async fillInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getCompletionHeader() {
    return await this.completeHeader.textContent();
  }
}

module.exports = { CheckoutPage };
