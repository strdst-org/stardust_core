/*
 * @created 16/12/2020
 * @author Til Jordan
 * Copyright (c) 2021 Stardust Network OÜ
 * All rights reserved.
 */

/**
 * Find the pop-up button in the DOM and react to change in the DOM
 * @return - Promise that only resolves if a pop-up is closed
 */
export function executeLogic() {

    /**
     * Return true if a node is clickable
     * @param node - The node to be checked
     * @returns {boolean} - true if the node can be clicked
     */
    const isClickable = (node) => {
        if (
            node.tagName === 'BUTTON' ||
            node.tagName === 'DIV' ||
            node.tagName === 'SPAN' ||
            node.tagName === 'A'
        ) {
            return (
                node.className.includes('button') ||
                node.className.includes('btn') ||
                node.tagName === 'BUTTON' ||
                node.getAttribute('ng-click') != null ||
                node.onclick != null ||
                node.getAttribute('onclick') != null ||
                node.getAttribute('href') != null ||
                node.getAttribute('role') === 'button'
            );
        } else {
            return false;
        }
    }

    /**
     * Check if a node has any buttons as children
     * @param node
     * @returns {boolean}
     */
    const hasChildrenButtons = (node) => {
        return (
            node.getElementsByTagName('BUTTON').length > 0 ||
            node.getElementsByTagName('A').length > 0
        );
    }

    /**
     * Check if the node conforms with multiple rules about children, visibility and size
     * @param node - the node to be checked
     * @return boolean - return true if node has a valid structure
     */
    const isValidStructure = (node) => {
        return node.getElementsByTagName && // Node needs to have this function
                node.getElementsByTagName('div').length === 0 && // No divs as children as this element could be clicked
                node.offsetParent && // Node must be visible
                !hasChildrenButtons(node) && // Node should not have any buttons or links as children
                !node.offsetParent.isEqualNode(document.body) && // Immediate parent should not be the body
                isClickable(node) && // Node must be clickable
                window.innerWidth >= node.getBoundingClientRect().x && // Node's width should not exceed window
                window.innerHeight >= node.getBoundingClientRect().y; // Node's height should not exceed window
    }

    /**
     * Checks whether the node contains text which is common for a cookie pop-up button
     * @param node - The node to be checked
     * @return boolean - return true if the node contains a valid allow button text
     */
    const isValidText = (node) => {
        //Options for accept button in different languages
        let possibleOptions: Array<Array<string>> = [
            ['accept'],
            ['agree'],
            ['ok'],
            ['allow'],
            ['continue'],
            ['yes'],
            ['consent', 'i'],
            ['got', 'it'],
            ['happy'],
            ['okay'],
            ['close'],
            ['sounds', 'good'],
            ['understood', 'i'],
            ['promise', 'i'], //english
            ['einverstanden'],
            ['akzeptiere'],
            ['akzeptieren'],
            ['erlauben'],
            ['zulassen'],
            ['zustimmen'],
            ['ja', 'ich'],
            ['stimme'],
            ['auswählen'],
            ['verstanden'],
            ['schliessen'],
            ['fortfahren'], //german
            ['aceptar'],
            ['acordar'],
            ['convenir'],
            ['aprobar'],
            ['consentir'],
            ['permitir'],
            ['acepto'],
            ['permito'], //spanish
            ["j'accepte"],
            ["j'autorise"],
            ['autoriser'],
            ['accepter'], //french
            ['accetto'],
            ['accettare'],
            ['permettere'],
            ['autorizzo'],
            ['permitto'],
            ['accetta'], //italian
            ['aceito'], //portuguese
            ['nõustun'],
            ['luba'], //estonian
            ['aksepterer'], //norwegian
            ['akceptovat'], //czech
            ['akkoord'],
        ]; //Dutch

        // Text on the node
        let text = node.innerText;

        // Text pre-processing
        text = text.toLowerCase();
        text = text.replace(',', '');
        text = text.replace('.', '');
        text = text.replace('!', '');

        //Split the text into words
        let words = text.split(/[\s&]+/);

        // Check if the text contains any of the options and the number of words is less than seven
        return possibleOptions.some((option) => option.every((word) => words.includes(word))) &&
            words.length < 7;
    }

    /**
     * Check if the text surrounding the button is a valid pop-up by using common keywords
     * @param node - the node that might be the correct button
     * @return boolean - return true if all the criteria are met
     */
    const isValidPopupText = (node) => {

        //Check for keywords in the pop-up text
        const validKeyWords = (text) => {
            return text.includes("cookie") ||
                text.includes("gdpr") ||
                text.includes("küpsiste") || // Estonian word for cookie
                text.includes("consent");
        }

        return validKeyWords(node.offsetParent.innerHTML.toLowerCase()) || // Check for the immediate offset text
            (
                node.offsetParent.getElementsByTagName('*').length > 2 &&
                node.id !== 'wt-cli.privacy-save-btn' &&
                node.offsetParent.offsetParent &&
                node.offsetParent.offsetParent.id !== 'container' &&
                !node.offsetParent.offsetParent.isEqualNode(document.body) &&
                (
                    node.offsetParent.offsetParent.offsetWidth < window.innerWidth ||
                    node.offsetParent.offsetParent.offsetHeight < window.innerHeight
                ) &&

                validKeyWords(node.offsetParent.offsetParent.innerHTML.toLowerCase())
            )
    }

    /**
     * check if current node is the allow button
     * @param node - the node which could be the accept button
     * @return boolean - return true if the given node is the allow button to be pressed
     */
    const isAllowButton = (node) => {
        return isValidStructure(node) && isValidText(node) && isValidPopupText(node);
    }

    // Only resolve the promise if a pop-up has been closed
    return new Promise(resolve => {

        // Check if any child nodes of the given nodes is a pop-up button
        // Click and return the element if true and return false otherwise
        const isPopup = (node) => {
            let elements = node.getElementsByTagName("*");
            let array: Array<Element> = Array.from(elements);

            let shadowRoots = array.filter((element) => element.shadowRoot);

            let shadows = Array.from(shadowRoots.map((el) => el.shadowRoot.querySelectorAll("*"))).flat();
            array.push.apply(shadows);

            for (let element of elements) {
                if (isAllowButton(element)) {
                    element.click();
                    return element;
                }
            }

            return false;
        }

        // Observe every change in the DOM
        const config = { attributes: true, childList: true, subtree: true };

        // Use an observer to handle pop-ups which appear with a delay
        let observer = new MutationObserver(mutations => {

            for (let mutation of mutations) {

                // Check every node that was added
                mutation.addedNodes.forEach((node) => {
                    let el = isPopup(node);
                    if (el) {
                        let element = el as HTMLElement;
                        resolve(element.outerHTML); // Return a textual representation of the pop-up for testing
                    }
                });
            }
        });

        // Execute the main logic on the whole body once
        let el = isPopup(document.body);
        if (el) {
            let element = el as HTMLElement;
            resolve(element.outerHTML); // Return a textual representation of the pop-up for testing
        }

        // Observe the document body about any changes
        observer.observe(document.body, config);
    });
}

/**
 * Checks for any active cookie pop-up providers and closes them
 * @return - either the search term for the provider (id or class name) or null if no provider was found
 */
export function checkProvider() {

    let elementSelectors = ['#onetrust-accept-btn-handler', '#accept-recommended-btn-handler', '#truste-consent-button',
        '#CybotCookiebotDialogBodyButtonAccept', '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
        '#_evidon-banner-acceptbutton', '#sp-cc-accept', '#consent-accept-button', '#L2AGLb',
        '.accept-cookies-button', '.optanon-allow-all', '.CybotCookiebotDialogBodyButton',
        '.fc-cta-consent', '.cc-dismiss', '.cc-agree', '[data-control-name="ga-cookie.consent.accept.v3"]'
    ];

    //Click the corresponding element for hard-coded elements
    for (let selector of elementSelectors) {

        let element = document.querySelector(selector) as HTMLElement;

        //Check if element exists
        if (!element) {
            continue;
        }

        //Check if element is visible
        if (element.offsetParent === null) {
            continue;
        }

        //Click the element
        element.click();

        //Click button again with delay as some pop-ups have a delay
        setTimeout(function () {
            element.click();
        }, 1000);

        return selector;
    }

    return null;
}

