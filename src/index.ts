import { config } from 'dotenv';
import puppeteer from 'puppeteer';

config();

(async () => {

    const moneyToFloat = (str: string): number => parseFloat(str.replace('€ ', '').replace(',', '.'))

    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto('https://mijn.budgetthuis.nl/energie/contracten');
    await page.waitForSelector('input[name="Username"]', { timeout: 5_000 });
    await page.waitForSelector('input[name="Password"]', { timeout: 5_000 });
    await page.waitForSelector('button[value="login"]', { timeout: 5_000 });
    await page.type('input[name="Username"]', process.env.BUDGET_THUIS_EMAIL as string);
    await page.type('input[name="Password"]', process.env.BUDGET_THUIS_PASS as string);
    await page.click('button[value="login"]');
    const stroomSelector = await page.waitForSelector('#contractEffectiveTariffs > div > div:nth-child(2) > div.right', { timeout: 5_000 });
    const gasSelector = await page.waitForSelector('#contractEffectiveTariffs > div > div:nth-child(3) > div.right', { timeout: 5_000 });
    if(!stroomSelector || !gasSelector) {
        console.log('Geen stroom/gas selector');
        return;
    }
    const stroomtarief = moneyToFloat(await stroomSelector.evaluate(el => el.textContent));
    const gastarief = moneyToFloat(await gasSelector.evaluate(el => el.textContent));
    await page.close();
    await browser.close();
    console.log({
        stroomtarief,
        gastarief
    })
})()