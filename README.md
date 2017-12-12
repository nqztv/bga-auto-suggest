# bga-auto-suggest
A user script that will automatically suggest players to your table on boardgamearena.com

On boardgamearena.com, players will often not join your table unless they are suggested to that table. BGA also limits you to 1 suggestion every 5 seconds, so manually suggesting players to your table can be a tedious process. insectman from the Perudo community wrote an proof of concept script to automate this process (https://pastebin.com/4eW7ugTs). I rewrote his script to work as a user script on greasemonkey or tampermonkey while taking away dependencies and stuff. 

To use this script, install greasemonkey or tampermonkey to your browser. After that, come back to this GitHub page and view the "Raw" bga_auto_suggest.user.js file and you will get a page asking you to install the script. If you are using greasemonkey on firefox, you may need to *temporarily* disable the security.csp.enable option in about:config (see here https://github.com/greasemonkey/greasemonkey/issues/2631). You can then manually adjust the variables at the top of the script to adjust the minimum Elo, add people to the white list, or add people to a blacklist to your liking. 

When you are on a table on boardgamearena, you will now see a new button that says "Auto Suggest". Click that to begin the automation process. You can view the web console to see if there are any errors.
