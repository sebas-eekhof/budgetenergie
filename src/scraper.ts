import puppeteer from 'puppeteer';

function moneyToFloat(str: string): number {
    return parseFloat(str.replace('€ ', '').replace(',', '.'));
}

export async function getTariffs({ username, password }: { username: string, password: string }): Promise<{ gas: number, energy: number }> {
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto('https://mijn.budgetthuis.nl/energie/contracten');
    await page.waitForSelector('input[name="Username"]', { timeout: 5_000 });
    await page.waitForSelector('input[name="Password"]', { timeout: 5_000 });
    await page.waitForSelector('button[value="login"]', { timeout: 5_000 });
    await page.type('input[name="Username"]', username);
    await page.type('input[name="Password"]', password);
    await page.click('button[value="login"]');
    const stroomSelector = await page.waitForSelector('#contractEffectiveTariffs > div > div:nth-child(2) > div.right', { timeout: 5_000 });
    const gasSelector = await page.waitForSelector('#contractEffectiveTariffs > div > div:nth-child(3) > div.right', { timeout: 5_000 });
    if(!stroomSelector || !gasSelector) {
        try {
            await page.close();
            await browser.close();
        } catch(e) {}
        throw new Error('Something went wrong while looking for the gas/energy prices');
    }
    const energy = moneyToFloat(await stroomSelector.evaluate(el => el.textContent));
    const gas = moneyToFloat(await gasSelector.evaluate(el => el.textContent));
    await page.close();
    await browser.close();
    return {
        gas,
        energy
    }
}