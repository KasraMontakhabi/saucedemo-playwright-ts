import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import Header from '../../pages/Header';
import InventoryPage from '../../pages/InventoryPage';
import CartPage from '../../pages/CartPage';

const data = JSON.parse(JSON.stringify(require('../../data/testData.json')));


test.describe('@regression REGRESSION: Inventory & Cart', () => {
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
    // button on PDP should now be "Remove"
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
});