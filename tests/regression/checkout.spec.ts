import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header';
import InventoryPage from '../../pages/InventoryPage';
import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import data from '../../data/testData.json';



test.describe('@regression REGRESSION: Checkout summary math', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('overview totals = sum(items) + tax', async ({ page }) => {
    const header = new Header(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // choose two deterministic items
    const p1 = await inventory.getProductPrice(data.firstProductName);
    await inventory.addProductToCart(data.firstProductName);
    console.log('Price 1:', p1);

    const p2 = await inventory.getProductPrice(data.secondProductName);
    await inventory.addProductToCart(data.secondProductName);
    console.log('Price 2:', p2);

    await header.goToCart();
    await cart.checkout();

    await checkout.enterCheckoutInformation(data.testFirstName, data.testLastName, data.testZipCode);

    const itemTotal = await checkout.getItemTotalAmount();
    const tax = await checkout.getTaxAmount();
    console.log('Tax:', tax);
    const total = await checkout.getTotalAmount();
    console.log('Total:', total);

    // itemTotal should equal p1 + p2 (allow tiny rounding drift)
    expect(Math.abs(itemTotal - (p1 + p2))).toBeLessThan(0.01);

    // total should equal itemTotal + tax
    expect(Math.abs(total - (itemTotal + tax))).toBeLessThan(0.01);
  });
});
