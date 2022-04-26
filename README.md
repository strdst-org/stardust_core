# Stardust Cookie Cutter core library

This repository contains the logic that powers the [Stardust Cookie Cutter](https://github.com/strdst-org/stardust_cookie_cutter.git). 

However, the funcitonality here is not complete and the current live Chromium/Firefox extensions don’t use this repo (as of April 2022). 
The full flow of the logic will be to first accept all cookies and then delete the cookies that are in categories that are disabled by the user. The latter part is still missing and will be added by around June, 2022. 

Meanwhile please feel free to help improve the pop-up detection.


# Overview

The logic is located in `./src/logic.ts`. There are two main functions available: `checkProvider()` and `executeLogic()`.
The first one contains pre-defined element ids and class names for commonly used cookie pop-ups. This ensures faster closing times and that the pop-up is correctly closed on popular websites.
The `executeLogic()` function implements a sequence of characteristic checks on all potential HTML elements to find the pop-up.

Those two functions are used in the Stardust Cookie Cutter extension. To simulate a similar a behaviour, this project 
uses [Puppeteer](https://developers.google.com/web/tools/puppeteer) to inject the functions into the browser context and 
show the execution in a Chromium-based browser window.

# Getting Started

## 1. Installation

### Requirements

- [Node](https://nodejs.org/en/)  >=15.0.0

### Clone the repository
```
git clone https://github.com/strdst-org/stardust_core.git
cd stardust_core
```
 ### Install dependencies
Run ```npm install```

## 2. Start

Run ```npm run start -- [options]```

The available options are ```-u, --url``` and ```-t, --timeout```.

The `--url` determines which websites to open and the `--timeout` parameter determines how long to keep the browser window open (in milliseconds). 

Example:
```
npm run start -- -u https://www.stardustnetwork.com --timeout 5000
```

The previous example opens a web browser at the Stardust homepage, tries to close the cookie pop-up and keeps the browser window open for 5 seconds.

## 3. Test

The testing framework is still experimental. The general idea is to run the logic on given websites and test if the correct pop-up was selected. Currently, there is only two websites included in the tests and the tests do not include closing pop-ups in iframes.

To run the tests, run 

`npm run test`


This will run all the tests specified in the logic.test.js file in the `./tests` folder. No browser window will be opened but rather it is tested whether the correct element was clicked.

# Contributing

## How to contribute

1. Fork `stardust_core`
2. Make your changes and test them sufficiently
3. Create commits to a separate branch
4. Push your branch to your `stardust_core` fork and open a pull request to the master branch

The logic currently is not able to close pop-ups which are located in shadow roots. Any help with fixing this issue would be greatly appreciated.


