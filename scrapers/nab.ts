import { UnknownError, WrongCredentials } from "../errors";
import { ENTRY_TYPE } from "../logger";
import BaseScraper from "./base";
import { Scraper } from './generic';

class Nab extends BaseScraper implements Scraper {

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


        await this.page.goto('https://ib.nab.com.au/nabib/index.jsp?browser=correct');
        this.log('Login page loaded screenshot', await this.page.screenshot(), ENTRY_TYPE.PNG);

        await this.page.fill('input#userid', username);
        await this.page.fill('input#password', password);

        await this.page.click('button#loginBtn');

        const myAccountsLocator = this.page.locator('div#myAccounts');
        try {
            await myAccountsLocator.waitFor({timeout: 5000});
        } catch {
            // Probably haven't logged in properly or blocked
            const errorLocator = this.page.locator('#formErrorNotificationMessage');
            try {
                await errorLocator.waitFor({timeout: 1000});
            } catch {
                //Something else?
                throw new UnknownError('Could not login');
            }

            const errorText = await errorLocator.first().innerText();
            throw new WrongCredentials(errorText);
        } finally {
            this.log('Login page loaded screenshot', await this.page.screenshot(), ENTRY_TYPE.PNG)
        }

        return {}; // No extra data is returned for NAB
    }

    async extractAccounts(inputs?: any) {

        const returnData = [];

        const accountRows = this.page.locator('table.traditional-account-table tr');
        const count = await accountRows.count()

        for (let i = 0; i < count; ++i) {
            const row = accountRows.nth(i);


            const accountNameLocator = row.locator('div.account-nickname');
            try {
                await accountNameLocator.waitFor({timeout: 1000});
            } catch {
                continue;
            }

            const accountName = await accountNameLocator.first().innerText();

            let accountNumber: string = '';
            const accountNumberLocator = row.locator('div.account-number');
            try {
                await accountNumberLocator.waitFor({timeout: 1000});
                accountNumber = await accountNumberLocator.first().innerText();
            } catch {
                accountNumber = 'N/A';
            }

            returnData.push({
                name: accountName.trim(),
                number: accountName.trim(),
            });

        }

        return returnData;
    }

    async logout(inputs?: any): Promise<any> {
        await this.page.click('button#logoutButton');
        this.log('After logout screenshot', await this.page.screenshot(), ENTRY_TYPE.PNG)
    }

}



export default Nab;