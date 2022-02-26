import {checkProvider} from "../src/logic";
import * as puppeteer from 'puppeteer';

let page = null;
let browser = null;

beforeEach(async () => {
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();
});

test("Test OneTrust on menshealth.com", async () => {
    await page.goto('https://www.menshealth.com');
    let providerElement = await page.evaluate(checkProvider);
    expect(providerElement).toBe("#onetrust-accept-btn-handler");
    await browser.close();
});



