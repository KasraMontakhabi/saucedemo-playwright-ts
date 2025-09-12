import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import Header from '../pages/Header';

const data = JSON.parse(JSON.stringify(require("../data/testData.json")));

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

        const shoppingCartBadgeCount = await header.getShoppingCartItemCount();
        expect(shoppingCartBadgeCount).toBe('1');

        await header.goToCart();
        await expect(page).toHaveURL(/.*cart\.html/);
        const count = await cart.getItemsCount();
        expect(count).toBe(1);
        expect(await cart.getProductInCart(data.secondProductName)).toContain(data.secondProductName);

        await cart.removeProductFromCart(data.secondProductName);
        const countAfterRemovingItem = await cart.getItemsCount();
        expect(countAfterRemovingItem).toBe(0);
    });

    test('basic checkout flow (1 item) completes and resets cart', async ({ page }) => {
        const header = new Header(page);
        const checkout = new CheckoutPage(page);
        const cart = new CartPage(page);
        const inventory = new InventoryPage(page);

        // Add product then go to cart
        await inventory.addProductToCart(data.firstProductName);
        await header.goToCart();
        await expect(page).toHaveURL(/.*cart\.html/);

        // Checkout → Info → Overview → Finish
        await cart.checkout();
        await checkout.enterCheckoutInformation(data.testFirstName, data.testLastName, data.testZipCode);

        // Overview assertions (item present; totals are displayed)
        const count = await cart.getItemsCount();
        expect(count).toBe(1);
        await expect(checkout.itemTotalAmount).toBeVisible();
        await expect(checkout.taxAmount).toBeVisible();
        await expect(checkout.totalAmount).toBeVisible();

        await checkout.finishCheckout();
        await expect(checkout.completionMessage).toBeVisible();

        // Back Home resets state; cart should be empty
        await checkout.backToHome();
        const shoppingCartBadgeCount = await header.getShoppingCartItemCount();
        expect(shoppingCartBadgeCount).toBe('0');
    });

    test('sort dropdown changes list order (Name Z→A)', async ({ page }) => {
        const header = new Header(page);
        const inventory = new InventoryPage(page);

        await header.sortProducts(data.sortOption); 

        // Assert first few names are in Z-A order
        const names = await inventory.itemName.allInnerTexts();
        const normalized = names.map((n) => n.trim());
        const sortedDesc = [...normalized].sort((a, b) =>
            b.localeCompare(a, undefined, { sensitivity: 'base' })
        );
        expect(normalized.slice(0, 5)).toEqual(sortedDesc.slice(0, 5));
    });

    test('logout ends session', async ({ page }) => {
        const header = new Header(page);

        await header.logout();

        await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);

        // Protected page blocked if visited directly
        await page.goto('https://www.saucedemo.com/inventory.html');
        await expect(page).not.toHaveURL(/.*inventory\.html/);
        await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
    });

    
});


