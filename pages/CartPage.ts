import { Locator, Page } from "@playwright/test";

class CartPage {

    cartItem: Locator;
    continueShoppingButton: Locator;
    checkoutButton: Locator;

    constructor(public page: Page) {
        this.cartItem = page.getByTestId('inventory-item');
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async getProductInCart(productName: string) {
        return await this.cartItem.filter({ hasText: productName }).first().innerText();
    }

    async getProductPrice(productName: string) {
        return await this.cartItem.filter({ hasText: productName })
        .first()
        .getByTestId('inventory-item-price')
        .innerText();
    }

    async getProductQuantity(productName: string) {
        return await this.cartItem.filter({ hasText: productName })
        .first()
        .getByTestId('item-quantity')
        .textContent();
    }

    async removeProductFromCart(productName: string) {
        await this.cartItem.filter({ hasText: productName })
        .first()
        .getByRole('button', { name: 'Remove' })
        .click();
    }

    async getItemsCount() {
        return await this.cartItem.count();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}

export default CartPage;