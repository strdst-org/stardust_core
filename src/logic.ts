/*
 * @created 16/12/2020
 * @author Til Jordan
 * Copyright (c) 2021 Stardust Network OÜ
 * All rights reserved.
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

    /**
     * Search through whole dom and click accept button
     * @param node - the starting node of the DOM - document.body
     * @param callback - function to know when a button has been clicked
     */
    function searchElements(node, callback) {
        if (checkAllowButton(node)) {
            node.click();
            setTimeout(function () {
                if (node.offsetParent) {
                    node.click();
                }
            }, 1000);
            callback(node.textContent);
            return;
        }
        //Check for shadow root as well
        let child = node.firstChild;

        if (!child) {
            node = node.shadowRoot;
        } else {
            node = child;
        }
        while (node) {
            searchElements(node, callback);
            node = node.nextSibling;
        }
    }

    searchElements(document.body, (node) => {
        return node;
    });
}

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

