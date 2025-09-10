import { Locator, Page } from "@playwright/test";

class InventoryPage {

    products: Locator;
    addToCartButton: Locator;
    itemPrice: Locator;
    itemName: Locator;

    constructor(public page: Page) {
        this.products = page.getByTestId('inventory-item');
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.itemName = page.getByTestId('inventory-item-name');
        this.itemPrice = page.getByTestId('inventory-item-price');
    }

    async addProductToCart(productName: string) {
        await this.products.filter({ hasText: productName })
        .first()
        .filter({ has: this.addToCartButton })
        .click();
    }

    async getProductPrice(productName: string){
        return await this.products.filter({ hasText: productName })
        .first()
        .filter({ has: this.itemPrice })
        .innerText();
    }
}
export default InventoryPage;