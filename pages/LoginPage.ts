import { Locator, Page } from '@playwright/test';

class LoginPage {

    username: Locator;
    password: Locator;
    loginButton: Locator;

    constructor(public page: Page) {
        this.username = page.getByPlaceholder('Username');
        this.password = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goTo() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

}

export default LoginPage;