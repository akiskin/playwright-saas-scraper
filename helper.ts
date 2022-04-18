import { Scraper } from './scrapers/generic';

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