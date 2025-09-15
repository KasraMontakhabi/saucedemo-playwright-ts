import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import InventoryPage from '../../pages/InventoryPage';
import Header from '../../pages/Header';
import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import data from '../../data/testData.json';

test.describe('@visual VISUAL: Baselines', () => {
  test('Login page (baseline before typing)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await expect(page).toHaveScreenshot('login-baseline.png', { animations: 'disabled' });
  });

  test('Inventory (default sort)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);

    const inventory = new InventoryPage(page);
    
    await expect(inventory.products.first()).toBeVisible();

    await expect(page).toHaveScreenshot('inventory-default.png', { animations: 'disabled' });
  });

  test('Product details (canonical product)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);

    const inventory = new InventoryPage(page);
    await inventory.goToProductDetails(data.secondProductName);

    const name = await inventory.getProductName(data.secondProductName);
    expect(name).toContain(data.secondProductName);

    await expect(page).toHaveScreenshot('product-details.png', { animations: 'disabled' });
  });

  test('Cart with 2 items', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);

    const inventory = new InventoryPage(page);
    const header = new Header(page);

    await inventory.addProductToCart(data.firstProductName);
    await inventory.addProductToCart(data.secondProductName);
    await header.goToCart();

    await expect(page).toHaveScreenshot('cart-2-items.png', { animations: 'disabled' });
  });

  test('Checkout: Information & Overview, then Confirmation', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);

    const inventory = new InventoryPage(page);
    const header = new Header(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addProductToCart(data.firstProductName);
    await inventory.addProductToCart(data.secondProductName);
    await header.goToCart();
    await cart.checkout();

    // Information page
    await expect(page).toHaveScreenshot('checkout-information.png', { animations: 'disabled' });

    await checkout.enterCheckoutInformation(
      data.testFirstName,
      data.testLastName,
      data.testZipCode
    );

    // Overview page
    await expect(page).toHaveScreenshot('checkout-overview.png', { animations: 'disabled' });

    await checkout.finishCheckout();

    // Confirmation page
    await expect(page).toHaveScreenshot('checkout-confirmation.png', { animations: 'disabled' });
  });
});
