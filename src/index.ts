import {executeLogic, checkProvider} from "./logic";
import * as puppeteer from 'puppeteer';
const { program } = require('commander');

//Check all iframes and inject logic if it's likely to contain a pop-up
const closeIframe = async (page) => {

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
        let iframeElement = await iframe.evaluate(executeLogic);
        console.log("Iframe", iframeElement);
        return iframeElement;
    } else {
        return null;
    }
};

const closePopupOnWebsite = async (url, timeout) => {

    //Launch new page in Puppeteer Chromium-based browser
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    //Go to the specified URL
    await page.goto(url);

    //Inject logic into any valid iframes that are attached later
    page.once("frameattached", () => {
        closeIframe(page);
    });

    //Inject logic into iframe if available
    await closeIframe(page);

    //Check if any cookie provider is active
    let providerElement = await page.evaluate(checkProvider);
    console.log("Provider", providerElement);

    //Execute main logic if no provider is available
    if (!providerElement) {
        page.evaluate(executeLogic).then(logicElement => {
            console.log("Logic", logicElement);
        });
    }

    //Keep website open for a specific timeout duration
    await page.waitForTimeout(timeout);

    //Close the browser window
    await browser.close();
};

//Provide a CLI description for the core library
program
    .name('npm run start --')
    .description('Stardust core library is the isolated logic for the Stardust Cookie Cutter which closes cookie' +
        ' pop-ups and applies the correct preference. The core library uses Puppeteer so the effects of the library ' +
        'can be seen without the full browser extension attached.')
    .version(process.env.npm_package_version, '-v, --version', 'Output the current core version');

//Specify the command line options
program
    .addOption(new program.Option('-u, --url <address>', 'The website URL to open and close the pop-up on')
        .default('https://www.stardustnetwork.com/contribute', 'Stardust contribution website'))
    .addOption(new program.Option('-t, --timeout <timeout>', 'The duration in ms to keep the browser window open')
        .default(5000, '5 seconds'))
    .parse();

const options = program.opts();
const url = options.url
const timeout = options.timeout;

closePopupOnWebsite(url, timeout);
