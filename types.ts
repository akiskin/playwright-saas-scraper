import { BrowserContext, Page } from "playwright"
import Logger from "./logger"

export interface Context {
    id: string

    // Lock to be acquired/released within each API call using the context instance
    // to prevent similtaneous commands send to the same page / browser context.
    // See acquireContextLock() and releaseContextLock()
    locked: boolean

    // Business logic-related fields
    contextRef: BrowserContext
    pageRef: Page
    created: Date
    lastUsed: Date
    scraper: string
    logger: Logger
}