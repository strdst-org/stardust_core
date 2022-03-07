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
     * check if current node is allow button
     * @param node - the node which could be the accept button
     */
    function checkAllowButton(node) {
        //Options for accept button in different languages
        let possibleOptions = [
            'accept',
            'agree',
            'ok',
            'allow',
            'continue',
            'yes',
            'consent',
            'got',
            'happy',
            'okay',
            'close',
            'sounds',
            'understood',
            'promise', //english
            'einverstanden',
            'akzeptiere',
            'akzeptieren',
            'erlauben',
            'zulassen',
            'zustimmen',
            'ja',
            'stimme',
            'auswählen',
            'verstanden',
            'schliessen',
            'fortfahren', //german
            'aceptar',
            'acordar',
            'convenir',
            'aprobar',
            'consentir',
            'permitir',
            'acepto',
            'permito', //spanish
            "j'accepte",
            "j'autorise",
            'autoriser',
            'accepter', //french
            'accetto',
            'accettare',
            'permettere',
            'autorizzo',
            'permitto',
            'accetta', //italian
            'aceito', //portuguese
            'nõustun',
            'luba', //estonian
            'aksepterer', //norwegian
            'akceptovat', //czech
            'akkoord',
        ]; //Dutch

        //Check if node is visible
        let offset = node.offsetParent;

        if (node.getElementsByTagName) {
            if (node.getElementsByTagName('div').length < 1) {
                if (offset && !hasChildrenButtons(node)) {
                    if (!offset.isEqualNode(document.body)) {
                        let text = node.innerText;

                        if (isClickable(node)) {
                            text = text.toLowerCase();
                            text = text.replace(',', '');
                            text = text.replace('.', '');
                            text = text.replace('!', '');

                            //Split the text into it's words
                            text = text.split(/[\s&]+/);

                            if (text.length < 7) {
                                for (let option of possibleOptions) {
                                    if (text.includes(option)) {
                                        if (
                                            option === 'consent' &&
                                            !text.includes('i')
                                        ) {
                                            continue;
                                        }

                                        if (
                                            option === 'understood' &&
                                            !text.includes('i')
                                        ) {
                                            continue;
                                        }

                                        if (
                                            option === 'promise' &&
                                            !text.includes('i')
                                        ) {
                                            continue;
                                        }

                                        if (
                                            option === 'ja' &&
                                            !text.includes('ich')
                                        ) {
                                            continue;
                                        }

                                        if (
                                            option === 'got' &&
                                            !text.includes('it')
                                        ) {
                                            continue;
                                        }

                                        if (
                                            option === 'sounds' &&
                                            !text.includes('good')
                                        ) {
                                            continue;
                                        }

                                        if (option === 'close' && text.length > 2) {
                                            continue;
                                        }

                                        let yCoordinate =
                                            node.getBoundingClientRect().y;
                                        let xCoordinate =
                                            node.getBoundingClientRect().x;

                                        if (
                                            window.innerWidth >= xCoordinate &&
                                            window.innerHeight >= yCoordinate
                                        ) {
                                            let innerHTML =
                                                offset.innerHTML.toLowerCase();
                                            if (
                                                innerHTML.indexOf('cookie') !==
                                                -1 ||
                                                innerHTML.indexOf('gdpr') !== -1 ||
                                                innerHTML.indexOf('küpsiste') !==
                                                -1 ||
                                                innerHTML.indexOf('consent') !== -1
                                            ) {
                                                console.log(
                                                    'Found pop-up - standard way'
                                                );
                                                return true;
                                            } else {
                                                if (
                                                    offset.getElementsByTagName('*')
                                                        .length > 2
                                                ) {
                                                    if (
                                                        node.id !==
                                                        'wt-cli-privacy-save-btn'
                                                    ) {
                                                        offset =
                                                            offset.offsetParent;
                                                        if (offset) {
                                                            if (
                                                                offset.id !==
                                                                'container' &&
                                                                !offset.isEqualNode(
                                                                    document.body
                                                                )
                                                            ) {
                                                                if (
                                                                    offset.offsetWidth <
                                                                    window.innerWidth ||
                                                                    offset.offsetHeight <
                                                                    window.innerHeight
                                                                ) {
                                                                    innerHTML =
                                                                        offset.innerHTML.toLowerCase();
                                                                    if (
                                                                        innerHTML.indexOf(
                                                                            'cookie'
                                                                        ) !== -1 ||
                                                                        innerHTML.indexOf(
                                                                            'gdpr'
                                                                        ) !== -1 ||
                                                                        innerHTML.indexOf(
                                                                            'küpsiste'
                                                                        ) !== -1 ||
                                                                        innerHTML.indexOf(
                                                                            'consent'
                                                                        ) !== -1
                                                                    ) {
                                                                        console.log(
                                                                            'Found pop-up - advanced way'
                                                                        );
                                                                        return true;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    // Only resolve the promise if a pop-up has been closed
    return new Promise(resolve => {

        // Check if any child nodes of the given nodes is a pop-up button
        // Click and return the element if true and return false otherwise
        const isPopup = (node) => {
            let elements = node.getElementsByTagName("*");

            for (let element of elements) {
                if (checkAllowButton(element)) {
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

