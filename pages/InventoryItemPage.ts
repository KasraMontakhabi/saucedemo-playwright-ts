import { Locator, Page } from "@playwright/test";

class InventoryItemPage {

    addToCartButton: Locator;
    itemPrice: Locator;
    itemName: Locator;

    constructor(public page: Page) {
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.itemName = page.getByTestId('inventory-item-name');
        this.itemPrice = page.getByTestId('inventory-item-price');
    }

    async addProductToCart() {
        await this.addToCartButton.click();
    }

    async getProductPrice(){
        return parseFloat((await this.itemPrice.innerText()).replace('$', '').trim());
    }
    
    async getProductName(){
        return (await this.itemName.innerText()).trim();
    }

}
export default InventoryItemPage;