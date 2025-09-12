import { expect, Locator, Page } from '@playwright/test';

class LoginPage {

    username: Locator;
    password: Locator;
    loginButton: Locator;
    errorContainer: Locator;
    errorButton: Locator;

    constructor(public page: Page) {
        this.username = page.getByPlaceholder('Username');
        this.password = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorContainer = this.page.getByTestId('error');     
        this.errorButton = this.page.getByTestId('error-button');
    }

    async goTo() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async waitForErrorVisible() {
        await expect(this.errorContainer).toBeVisible();  
    }
    async getErrorText() {
        return (await this.errorContainer.textContent())?.trim();
    }

    getErrorButton() {
        return this.errorButton;
    }

}

export default LoginPage;