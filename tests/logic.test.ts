import {checkProvider, executeLogic} from "../src/logic";
import * as puppeteer from 'puppeteer';

let page = null;
let browser = null;

//Always launch a new browser page before each test
beforeEach(async () => {
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();
});

async function closePopup(url) {
    await page.goto(url);

    //Check if any cookie provider is active
    let providerElement = await page.evaluate(checkProvider);

    console.log("Provider", providerElement);

    //Execute main logic if no provider is available
    if (!providerElement) {
        let logicElement = await page.evaluate(executeLogic);
        console.log("Logic", logicElement)
        return logicElement;
    } else {
        return providerElement;
    }
}

test("https://menshealth.com", async () => {
    let element = await closePopup("https://menshealth.com");
    expect(element).toContain("onetrust-accept-btn-handler");
    await browser.close();
});

test("https://www.skyscanner.net/", async () => {
    let element = await closePopup("https://www.skyscanner.net/");
    expect(element).toBe("<button type=\"button\" class=\"BpkButtonBase_bpk-button__MmJlN CookieBanner_CookieBanner__button__MDdhY CookieBanner_CookieBanner__accept-button__N2Y0Z\" id=\"acceptCookieButton\">OK</button>");
    await browser.close();
});



