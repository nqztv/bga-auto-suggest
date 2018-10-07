# bga-auto-suggest

A user script that will automatically suggest players to your table on [boardgamearena.com](https://boardgamearena.com).

On [boardgamearena.com](https://boardgamearena.com), players will often not join your table unless they are suggested to that table. BGA also limits you to 1 suggestion every 5 seconds, so manually suggesting players to your table can be a tedious process. This script is used to automate the tedious suggestion process.

## How to use

To use this script, install greasemonkey or tampermonkey to your browser. After that, come back to this GitHub page and view the "Raw" [bga_auto_suggest.user.js](https://github.com/naXa777/bga-auto-suggest/raw/master/bga-auto-suggest.user.js) file and you will get a page asking you to install the script. If you are using greasemonkey on firefox, you may need to *temporarily* disable the `security.csp.enable` option in about:config (see here https://github.com/greasemonkey/greasemonkey/issues/2631). You can then manually adjust the variables at the top of the script to adjust the minimum Elo, add people to the white list, or add people to a blacklist to your liking. 

When you are on a table on boardgamearena, you will now see a new button that says "Auto Suggest". If you don't see it, try refreshing the page. Click the "Auto Suggest" button to begin suggesting players to join your table. Click the "Stop Auto Suggest" button to stop automatically suggesting players. 

You can view the web console to see the status of the script or to see if there are any errors.

## Screenshots

![Auto Suggest button](/new_button.png)

## Development

JavaScript language version: ECMAScript 6.

If you use IntelliJ IDEA select the Javascript language version in the settings:

1. Go to File > Settings... > Language & Frameworks > Javascript
2. Select 'ECMAScript 6' in JS version dropdown

Test your changes manually before submitting:

1. Reload page
2. Copy-paste the script into Web console, click [ENTER]
3. Invoke `init()` function

## Changes history

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [v0.1] - 2017-10-02
* insectman from the Perudo community wrote a proof of concept script to automate this process (https://pastebin.com/4eW7ugTs).
### [v0.2] - 2017-12-12
* @nqztv rewrote his script to work as a user script on greasemonkey or tampermonkey while taking away dependencies and stuff. 
### [v0.3] - 2018-09-02
* @naXa777 modified this script so it works endlessly until the user interrupts it by pressing STOP button.
### [v0.3.1] - 2018-10-07
* @naXa777 fixed a bug: the script wasted 6 seconds trying to invite users that have been invited already (e.g. manually prior to running the main loop).

## External links

* Tampermonkey in [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/shortcuts) shortcuts
* Opening [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Opening_the_Web_Console)
