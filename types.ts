import { BrowserContext, Page } from "playwright"
import Logger from "./logger"

export interface Context {
    id: string
    contextRef: BrowserContext
    pageRef: Page
    created: Date
    scraper: string
    logger: Logger
  }