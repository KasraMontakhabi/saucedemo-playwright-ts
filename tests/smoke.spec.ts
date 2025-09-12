import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import Header from '../pages/Header';

const data = {
    username: 'standard_user',
    lockedOutUser: 'locked_out_user',
    password: 'secret_sauce',
    testFirstName: 'John',
    testLastName: 'Doe',
    testZipCode: '12345',
    firstProductName: 'Sauce Labs Fleece Jacket',
    secondProductName: 'Sauce Labs Backpack',
    thirdProductName: 'Sauce Labs Onesie',
    sortOption: 'Name (Z to A)',
};

test.describe('@smoke SMOKE: Login', () => {
    test('login succeeds with standard_user', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goTo();
        await login.login(data.username, data.password);

        await expect(page).toHaveURL(/.*inventory\.html/);
        await expect(page.getByTestId('shopping-cart-link')).toBeVisible();
    });

    test('locked_out_user is blocked (error banner)', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goTo();
        await login.login(data.lockedOutUser, data.password);

        await login.waitForErrorVisible();
        await expect(login.getErrorButton()).toBeVisible();
        await expect(login.errorContainer).toContainText('locked out');
    });
});

test.describe('@smoke SMOKE: Authenticated flows', () => {
    test.beforeEach(async ({ page }) => {
        const login = new LoginPage(page);
        await login.goTo();
        await login.login(data.username, data.password);
        await expect(page).toHaveURL(/.*inventory\.html/);
    });

    test('add & remove single item from cart', async ({ page }) => {
        const header = new Header(page);
        const cart = new CartPage(page);
        const inventory = new InventoryPage(page);

        await inventory.addProductToCart(data.secondProductName);

        const badge = page.getByTestId('shopping-cart-badge');
        await expect(badge).toHaveText('1');

        // Go to cart and verify item
        await header.goToCart();
        await expect(page).toHaveURL(/.*cart\.html/);
        const count = await cart.getItemsCount();
        expect(count).toBe(1);
        expect(await cart.getProductInCart(data.secondProductName)).toContain(data.secondProductName);

        // Remove item and verify empty
        await cart.removeProductFromCart(data.secondProductName);
        const countAfterRemovingItem = await cart.getItemsCount();
        expect(countAfterRemovingItem).toBe(0);
        await expect(badge).not.toBeVisible();
    });

    
});


