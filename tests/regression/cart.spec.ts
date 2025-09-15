import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header';
import InventoryPage from '../../pages/InventoryPage';
import CartPage from '../../pages/CartPage';
import data from '../../data/testData.json';


test.describe('@regression @cart REGRESSION: Inventory & Cart', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.login(data.username, data.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('cart state persists across product details navigation', async ({ page }) => {
    const header = new Header(page);
    const inventory = new InventoryPage(page);

    // add then open details
    await inventory.addProductToCart(data.thirdProductName);
    await inventory.goToProductDetails(data.thirdProductName); 

    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

    // back to products and verify badge still 1
    await header.backToProducts();
    const badge = await header.getShoppingCartItemCount();
    expect(badge).toBe('1');
  });

  test('remove from cart view updates count and empties properly', async ({ page }) => {
    const header = new Header(page);
    const cart = new CartPage(page);
    const inventory = new InventoryPage(page);

    await inventory.addProductToCart(data.secondProductName);
    await inventory.addProductToCart(data.firstProductName);
    await header.goToCart();

    expect(await cart.getItemsCount()).toBe(2);
    await cart.removeProductFromCart(data.secondProductName);
    expect(await cart.getItemsCount()).toBe(1);
    await cart.removeProductFromCart(data.firstProductName);
    expect(await cart.getItemsCount()).toBe(0);


    const badge = await header.getShoppingCartItemCount();
    expect(['0', null, ''].includes(badge)).toBeTruthy();
  });

  test('cart item price matches inventory card price', async ({ page }) => {
  const header = new Header(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  const priceOnList = await inventory.getProductPrice(data.firstProductName);
  await inventory.addProductToCart(data.firstProductName);

  await header.goToCart();
  const priceInCartText = await cart.getProductPrice(data.firstProductName);
  const priceInCart = Number(priceInCartText.replace('$', '').trim());

  expect(priceInCart).toBeCloseTo(priceOnList, 2);
});

test('Continue Shopping returns to inventory page', async ({ page }) => {
  const header = new Header(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addProductToCart(data.secondProductName);
  await header.goToCart();

  await cart.continueShopping();
  await expect(page).toHaveURL(/.*inventory\.html/);
});

test('remove from PDP updates cart badge and button -> Add to cart', async ({ page }) => {
  const header = new Header(page);
  const inventory = new InventoryPage(page);

  // add from list, open PDP
  await inventory.addProductToCart(data.thirdProductName);
  await inventory.goToProductDetails(data.thirdProductName);
  expect(await header.getShoppingCartItemCount()).toBe('1');

  await page.getByRole('button', { name: 'Remove' }).click();
  expect(await header.getShoppingCartItemCount()).toBe('0');

  // button should revert to Add to cart
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();

  await header.backToProducts();
  await expect(page).toHaveURL(/.*inventory\.html/);
});
});