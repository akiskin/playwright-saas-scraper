import express from 'express';
import { Browser, chromium, firefox, webkit } from 'playwright';

import ControlAPI from './apis/control';
import ScrapeAPI from './apis/scrape';
import { destroyOldContexts, triggerExpiredContextsCleanup } from './helper';
import { Context } from './types';

declare global {
  var availableContexts: Context[];
  var chrome: Browser;
  var firefox: Browser;
  var webkit: Browser;
}

global.availableContexts = [];
global.chrome = await chromium.launch();
global.firefox = await firefox.launch();
global.webkit = await webkit.launch();

const app = express();
const PORT = 7777;
app.use(express.json());

ControlAPI(app);
ScrapeAPI(app);


//Temporary, unnecessary routes
app.get('/', (req,res) => res.send('Scraper v0.1'));

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    triggerExpiredContextsCleanup();
});