import { Locator, Page } from "@playwright/test";

class Header {

    shoppingCartButton: Locator;
    menuButton: Locator;
    pageTitle: Locator;
    productSortDropdown: Locator;
    backToProductsButton: Locator;

    constructor(public page: Page) {
        this.shoppingCartButton = page.getByTestId('shopping-cart-link');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.pageTitle = page.getByText('Swag Labs');
        this.productSortDropdown = page.getByRole('combobox');
        this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
    }

    async goToCart() {
        await this.shoppingCartButton.click();
    }

    async openMenu() {
        await this.menuButton.click();
    }

    async getPageTitle() {
        return await this.pageTitle.innerText();
    }

    async getShoppingCartItemCount() {
        const badge = this.page.getByTestId('shopping-cart-badge');
        if (await badge.isVisible()) {
            return await badge.innerText();
        }
        return '0';
    }

    async sortProducts(sortOption: string) {
        await this.productSortDropdown.selectOption(sortOption);
    }

    async backToProducts() {
        await this.backToProductsButton.click();
    }

    async logout() {
        await this.openMenu();
        await this.page.getByRole('link', { name: 'Logout' }).click();
    }

}
export default Header;