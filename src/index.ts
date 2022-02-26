import {executeLogic, checkProvider} from "./logic";
import * as puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://nature.com');


    //Check if any cookie provider is active
    let providerElement = await page.evaluate(checkProvider);
    console.log(providerElement);

    if (!providerElement) {
        let logicElement = await page.evaluate(executeLogic);
        console.log(logicElement);
    }

    await page.waitForTimeout(5000);

    await browser.close();
})();