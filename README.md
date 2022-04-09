# Stardust Cookie Cutter core
This repository contains the generic Cookie Cutter code that's shared between platforms. This repository is __not designed to be used directly__, but instead to serve as a dependency for [Stardust_Cookie_Cutter](https://github.com/strdst-org/Stardust_Cookie_Cutter) and [Stardust_Cookie_Cutter_Safari](https://github.com/strdst-org/Stardust_Cookie_Cutter_Safari) (both currently private, will be made public soon).


## Installation

Run `npm install`

## Start

Run `npm run start`


This will open up a Chromium browser window and visit the website specified in index.ts. It will attempt to close the pop-up on the given page.

## Test

Run `npm run test`


This will run all the tests specified in the logic.test.js file in the tests folder. No browser window will be openeed but rather it is tested whether the correct element was clicked.

## Node.js module

stardust_core is available as an npm module for Node.js. See: https://www.npmjs.com/package/--tbc--

You can install it with:
```
npm install stardustcore
```

Or you can simply add it to your `package.json`.
```javascript
"dependencies": {
    "stardustcore": "^0.1.1",
```