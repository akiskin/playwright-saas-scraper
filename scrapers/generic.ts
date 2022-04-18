import { BrowserContext, Page } from "playwright";
import Logger from "../logger";
import { Context } from "../types";

export interface Scraper {
    init(): Promise<{context: BrowserContext, page: Page}>;
    setContext(context: Context): void;

    enableLogger(logger: Logger): void;
    log(text: string, data: any): void;

    login(inputs: any): any;
    extractAccounts(inputs?: any): any;
    logout(inputs?: any): any;
}