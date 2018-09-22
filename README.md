# bga-auto-suggest

A user script that will automatically suggest players to your table on [boardgamearena.com](https://boardgamearena.com).

On [boardgamearena.com](https://boardgamearena.com), players will often not join your table unless they are suggested to that table. BGA also limits you to 1 suggestion every 5 seconds, so manually suggesting players to your table can be a tedious process. This script is used to automate the tedious suggestion process.

## How to use

To use this script, install greasemonkey or tampermonkey to your browser. After that, come back to this GitHub page and view the "Raw" [bga_auto_suggest.user.js](https://github.com/naXa777/bga-auto-suggest/raw/master/bga-auto-suggest.user.js) file and you will get a page asking you to install the script. If you are using greasemonkey on firefox, you may need to *temporarily* disable the `security.csp.enable` option in about:config (see here https://github.com/greasemonkey/greasemonkey/issues/2631). You can then manually adjust the variables at the top of the script to adjust the minimum Elo, add people to the white list, or add people to a blacklist to your liking. 

When you are on a table on boardgamearena, you will now see a new button that says "Auto Suggest". If you don't see it, try refreshing the page. Click the "Auto Suggest" button to begin suggesting players to join your table. Click the "Stop Auto Suggest" button to stop automatically suggesting players. 

You can view the web console to see the status of the script or to see if there are any errors.

## Screenshots

![Auto Suggest button](/new_button.png)

## Changes history

* insectman from the Perudo community wrote a proof of concept script to automate this process (https://pastebin.com/4eW7ugTs).
* @nqztv rewrote his script to work as a user script on greasemonkey or tampermonkey while taking away dependencies and stuff. 
* @naXa777 modified this script so it works endlessly until the user interrupts it by pressing STOP button.

## External links

* Tampermonkey in [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/shortcuts) shortcuts
* Opening [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Opening_the_Web_Console)
