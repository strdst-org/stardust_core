# Cookie Cutter core
=================
This repository contains the generic Cookie Cutter code that's shared between platforms. This repository is __not designed to be used directly__, but instead to serve as a dependency for [Stardust_Cookie_Cutter](https://github.com/strdst-org/Stardust_Cookie_Cutter) and [Stardust_Cookie_Cutter_Safari](https://github.com/strdst-org/Stardust_Cookie_Cutter_Safari).

## 1. Installation
Run `npm install`

## 2. Start
Run `npm run start`


This will open up a Chromium browser window and visit the website specified in index.ts. It will attempt to close the pop-up on the given page.

## 3. Test

Run `npm run test`


This will run all the tests specified in the logic.test.js file in the tests folder. No browser window will be openeed but rather it is tested whether the correct element was clicked.
