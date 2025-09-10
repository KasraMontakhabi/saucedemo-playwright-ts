import {Page} from '@playwright/test'
import LoginPage from "./LoginPage";

class POManager {

    loginPage: LoginPage;

    constructor(public page: Page) {
        this.loginPage = new LoginPage(page);
    }

}
export default POManager;