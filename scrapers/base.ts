import { BrowserContext, Page } from "playwright";
import Logger, { ENTRY_TYPE } from "../logger";
import { Scraper } from './generic';
import { Context } from '../types';

class BaseScraper implements Scraper {

    #context: BrowserContext;
    #page: Page;

    #logger: Logger = null; //private field

    async init() {
        const context = await global.chrome.newContext({
            ignoreHTTPSErrors: true,
            locale: 'en-AU',
            permissions: ['geolocation']
        });
        const page = await context.newPage();
        await page.setViewportSize({ width: 1600, height: 900 });

        return {context, page};
    }

    setContext(context: Context) {
        this.#context = context.contextRef;
        this.#page = context.pageRef;
    }

    get context() {
        return this.#context;
    }

    get page() {
        return this.#page;
    }

    enableLogger(logger: any) {
        this.#logger = logger
    }

    log(text: string, data: any, type: string = ENTRY_TYPE.TEXT) {
        if (!this.#logger) {
            return;
        }

        this.#logger.add(text, data, type)
    }

    async login(inputs: any) {

        return null;
    }

    async extractAccounts(inputs: any) {

        return null;
    }

    async logout(inputs: any) {

        return null;
    }

}



export default BaseScraper;