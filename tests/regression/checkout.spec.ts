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

  test('missing checkout info shows errors and blocks continue', async ({ page }) => {
  const header = new Header(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await inventory.addProductToCart(data.firstProductName);
  await header.goToCart();
  await cart.checkout();

  await checkout.continue();
  await expect(checkout.errorBanner).toBeVisible();
  await expect(checkout.errorBanner).toContainText('First Name is required');

  await checkout.firstNameInput.fill(data.testFirstName);
  await checkout.continue();
  await expect(checkout.errorBanner).toBeVisible();
  await expect(checkout.errorBanner).toContainText('Last Name is required');

  await checkout.lastNameInput.fill(data.testLastName);
  await checkout.continue();
  await expect(checkout.errorBanner).toBeVisible();
  await expect(checkout.errorBanner).toContainText('Postal Code is required');
});

test.only('complete order shows Thank you page & Back Home returns to inventory', async ({ page }) => {
  const header = new Header(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  // Add a deterministic item
  await inventory.addProductToCart(data.secondProductName);
  await header.goToCart();
  await cart.checkout();

  await checkout.enterCheckoutInformation(data.testFirstName, data.testLastName, data.testZipCode);

  const pay = await checkout.getPaymentInfo();
  const ship = await checkout.getShippingInfo();
  expect(pay).toMatch(/Sauce\s*Card/i);        
  expect(ship).toMatch(/Free Pony Express Delivery!/i);

  // Finish → Thank you
  await checkout.finishCheckout();
  await expect(checkout.completionMessage).toBeVisible();

  // Back Home → inventory
  await checkout.backToHome();
  await expect(page).toHaveURL(/.*inventory\.html/);
});

test('removing item before checkout updates overview item total', async ({ page }) => {
  const header = new Header(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  // Add two known items
  const p1 = await inventory.getProductPrice(data.firstProductName);
  const p2 = await inventory.getProductPrice(data.secondProductName);
  await inventory.addProductToCart(data.firstProductName);
  await inventory.addProductToCart(data.secondProductName);

  // Remove one from cart
  await header.goToCart();
  await cart.removeProductFromCart(data.secondProductName);

  await cart.checkout();
  await checkout.enterCheckoutInformation(data.testFirstName, data.testLastName, data.testZipCode);

  const itemTotal = await checkout.getItemTotalAmount();
  expect(Math.abs(itemTotal - p1)).toBeLessThan(0.01);
});
});
