import { Scraper } from './scrapers/generic';
import { Context } from './types'

export const loadScraperRuntime = async (scraperName: string): Promise<Scraper> => {
    switch (scraperName) {
        case 'qantasff':
            return new (await import('./scrapers/qantasff')).default;
        case 'nab': 
            return new (await import('./scrapers/nab')).default;
        default:
            throw "Unknown scraper";
      }
}


export const destroyContext = async (context: Context): Promise<void> => {
    const globalContextListIndex = global.availableContexts.indexOf(context);
    if (globalContextListIndex < 0) {
        return;
    }

    // Destroy page + browser context
    try {
        await context.pageRef.close();
        await context.contextRef.close();
    } catch {

    }

    // Remove references
    global.availableContexts.splice(globalContextListIndex, 1);
}

export const destroyOldContexts = async (): Promise<number> => {

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 1);

    let destroyed = 0;

    // Find all old contexts, then go one by one:
    // - destroy (close) pages and browser contexts
    // - remove references to this context from global and local lists
    // This is needed to protect us from overwriting global list (imagine a new context has been added while we are running this function).
    // Otherwise we would need to use middleware to prevent any calls that may lead to context list modification while running this function.

    const oldContexts = global.availableContexts.filter(context => context.lastUsed < cutoffDate);

    for (let index = 0; index < oldContexts.length; index++) {

        let element: Context|null = oldContexts[index];

        await destroyContext(element);

        // Remove local references
        delete oldContexts[index];
        element = null;

        destroyed++;
    }

    return destroyed;
}

export const triggerExpiredContextsCleanup = () => {
    console.log(new Date(), ' Cleaning up expired contexts...');
    destroyOldContexts().then(() => setTimeout(() => triggerExpiredContextsCleanup(), 600000)); // every 10 mins
}