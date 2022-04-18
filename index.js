import express from 'express';
import { chromium } from 'playwright';
const app = express();
const PORT = 8000;
app.get('/', (req, res) => res.send('Express + TypeScript Server'));
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
app.get('/1', async (req, res) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://whatsmyuseragent.org/');
    const screenshot = await page.screenshot();
    await browser.close();
    res.type('png');
    res.set('Content-disposition', 'attachment; filename=' + '123.png');
    res.send(screenshot);
});
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
