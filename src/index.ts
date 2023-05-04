import { config } from 'dotenv';
import { getTariffs } from './scraper';

config();

(async () => {
    const { gas, energy } = await getTariffs({
        username: process.env.BUDGET_THUIS_EMAIL as string,
        password: process.env.BUDGET_THUIS_PASS as string
    });

    console.log(`Energy price: ${new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 6 }).format(energy)}`);
    console.log(`Gas price: ${new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 6 }).format(gas)}`);
})()