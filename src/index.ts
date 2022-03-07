import {executeLogic, checkProvider} from "./logic";
import * as puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://reuters.com');

    //Check all iframes and inject logic if it's likely to contain a pop-up
    const closeIframe = async () => {

        //Only allow iframes with specific keywords and not the main frame
        const isValidFrame = (frame) => {
            let url = frame.url();
            return frame.frameId !== 0 &&
                (url.includes("consent") ||
                url.includes("privacy") ||
                url.includes("permission"));
        };

        //Find a valid iframe
        let iframe = await page.frames().find(isValidFrame);

        //Inject logic into a valid iframe
        if (iframe) {
            iframe.evaluate(executeLogic).then(iframeElement => {
                console.log("Iframe", iframeElement);
            });
        }
    };

    //Inject logic into any valid iframes that are attached later
    page.once("frameattached", () => {
        closeIframe();
    });

    //Inject logic into iframe if available
    await closeIframe();

    //Check if any cookie provider is active
    let providerElement = await page.evaluate(checkProvider);
    console.log("Provider", providerElement);

    //Execute main logic if no provider is available
    if (!providerElement) {
        page.evaluate(executeLogic).then(logicElement => {
            console.log("Logic", logicElement);
        });

    }

    await page.waitForTimeout(120000);

    await browser.close();
})();