import { Locator, Page } from "@playwright/test";

class InventoryPage {
    products: Locator;
    itemPrice: Locator;
    itemName: Locator;

    constructor(public page: Page) {
        this.products = page.getByTestId('inventory-item');
        this.itemName = page.getByTestId('inventory-item-name');
        this.itemPrice = page.getByTestId('inventory-item-price');
    }

    async addProductToCart(productName: string) {
        await this.products
            .filter({ hasText: productName })
            .first()
            .getByRole('button', { name: 'Add to cart' })
            .click();
    }

    async getProductPrice(productName: string) {
        const text = await this.products
            .filter({ hasText: productName })
            .first()
            .getByTestId('inventory-item-price')
            .innerText();

        return text.replace('$', '').trim();
    }

    async removeProductFromCart(productName: string) {
        await this.products
            .filter({ hasText: productName })
            .first()
            .getByRole('button', { name: 'Remove' })
            .click();
    }

    async goToProductDetails(productName: string) {
        await this.products
            .filter({ hasText: productName })
            .first()
            .getByTestId('inventory-item-name')
            .click();
    }
}

export default InventoryPage;
