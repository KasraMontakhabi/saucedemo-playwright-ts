import { Locator, Page } from "@playwright/test";

class CheckoutPage {

    firstNameInput: Locator;
    lastNameInput: Locator;
    postalCodeInput: Locator;
    continueButton: Locator;
    checkoutItem: Locator;
    paymentInfo: Locator;
    shippingInfo: Locator;
    itemTotalAmount: Locator;
    taxAmount: Locator;
    totalAmount: Locator;
    finishButton: Locator;
    errorBanner: Locator;
    completionMessage: Locator;
    backHomeButton: Locator;

    constructor(public page: Page) {
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.checkoutItem = page.getByTestId('cart-item');
        this.paymentInfo = page.getByTestId('payment-information');
        this.shippingInfo = page.getByTestId('shipping-information');
        this.itemTotalAmount = page.locator('.summary_subtotal_label');
        this.taxAmount = page.locator('.summary_tax_label');
        this.totalAmount = page.locator('.summary_total_label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.errorBanner = page.getByTestId('error');
        this.completionMessage = page.getByText('Thank you for your order!');
        this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    }

    async enterCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async continue() {
        await this.continueButton.click();
    }

    async getProductInCheckout(productName: string) {
        return await this.checkoutItem.filter({ hasText: productName }).first().innerText();
    }

    async getProductCount() {
        return await this.checkoutItem.count();
    }

    async getPaymentInfo() {
        return await this.paymentInfo.innerText();
    }

    async getShippingInfo() {
        return await this.shippingInfo.innerText();
    }

    async getItemTotalAmount() {
        const text = await this.itemTotalAmount.innerText();
        return parseFloat(text.replace('$', ''));
    }

    async getTaxAmount() {
        const text = await this.taxAmount.innerText();
        return parseFloat(text.replace('$', ''));
    }

    async getTotalAmount() {
        const text = await this.totalAmount.innerText();
        return parseFloat(text.replace('$', ''));
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async backToHome() {
        await this.backHomeButton.click();
    }

    async getErrorMessage() {
        return await this.errorBanner.innerText();
    }
    
}
export default CheckoutPage;