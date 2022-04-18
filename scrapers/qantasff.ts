import { ENTRY_TYPE } from "../logger";
import BaseScraper from "./base";
import { Scraper } from './generic';

class QantasFF extends BaseScraper implements Scraper {

    async init() {
        const context = await global.webkit.newContext({
            ignoreHTTPSErrors: true,
            locale: 'en-AU',
            permissions: ['geolocation']
        });
        const page = await context.newPage();
        await page.setViewportSize({ width: 1600, height: 900 });

        return {context, page};
    }

    async login(inputs: any) {

        const username = inputs.username;
        const password = inputs.password;
        const lastname = inputs.lastname;

        
        await this.page.goto('https://www.qantas.com/au/en/frequent-flyer/log-in.html');
        await this.page.waitForTimeout(5000);

        this.log('Login page loaded screenshot', await this.page.screenshot(), ENTRY_TYPE.PNG);
        
        
        await this.page.fill('#form-member-id-login-menu-frequent-flyer', username);
        await this.page.fill('#form-member-surname-login-menu-frequent-flyer', lastname);
        await this.page.fill('#form-member-pin-login-menu-frequent-flyer', password);
        await this.page.click('main button.ql-login-submit-button');
        await this.page.waitForTimeout(5000);


        let mfaPagePresent = false;
        const verificationSubmitButton = this.page.locator('button.ql-login-submit-button');
        try {
            await verificationSubmitButton.waitFor({timeout: 1000});
            mfaPagePresent = true;
        } catch {
            mfaPagePresent = false;
        }


        this.log('Login page loaded screenshot', await this.page.screenshot(), ENTRY_TYPE.PNG);

        if (mfaPagePresent) {
            return {mfa: true};
        }


        return {};
    }

    async extractAccounts(inputs?: any): Promise<any> {

        const screenshot = await this.page.screenshot();

        return screenshot;
    }

}

export default QantasFF;