// ==UserScript==
// @name         bga-auto-suggest
// @namespace    https://github.com/nqztv/bga-auto-suggest
// @version      0.3
// @description  automatically suggest players to your table on BGA.
// @include      *.boardgamearena.com/*
// @grant        none
// ==/UserScript==
// 
// on boardgamearena.com, players will often not join your table unless they are
// suggested to that table. bga also limits you to 1 suggestion every 5 seconds.
// so manually suggesting players to your table can be a tedious process. 
// insectman from the perudo community wrote an proof of concept script to 
// automate this process. i rewrote his script to work as a user script on 
// greasemonkey or tampermonkey while taking away dependencies and stuff.
//
// you can adjust the minimum Elo, add people to the white list, or add people 
// to a blacklist below if you wish to.

// VARIABLES TO SET USER PREFERENCE
var minimumElo = 100;
var blackList = [];
var whiteList = ["nqztv", "insectman", "pnight"];
var autoStartGame = false;	// start game when enough players?

// INTERNAL VARIABLES
var alreadySuggested = [];
var suggestPlayers = true;
var interrupted = false;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
	console.log("Creating auto suggest button.");

	var bgaButtonBarNode = document.querySelector(".bgabuttonbar");
	if (!bgaButtonBarNode) {
		console.error("Please reload the page.");
		return;
	}

	var autoSuggestButton = document.createElement("a");
	autoSuggestButton.append("<span>Auto Suggest</span>");
	autoSuggestButton.setAttribute("id", "autosuggest");
	autoSuggestButton.setAttribute("href", "#");
	autoSuggestButton.className = "bgabutton bgabutton_gray tableaction";
	bgaButtonBarNode.appendChild(autoSuggestButton);

	var stopSuggestButton = document.createElement("a");
	stopSuggestButton.append("<span>Stop Auto Suggest</span>");
	stopSuggestButton.setAttribute("id", "stopsuggest");
	stopSuggestButton.setAttribute("href", "#");
	stopSuggestButton.setAttribute("style", "display: none;");
	stopSuggestButton.className = "bgabutton bgabutton_gray tableaction";
	bgaButtonBarNode.appendChild(stopSuggestButton);

	document.getElementById("autosuggest").addEventListener("click", loop, false);
	document.getElementById("stopsuggest").addEventListener("click", stopLoop, false);
}

async function stopLoop() {
	suggestPlayers = false;
	interrupted = true;
	
	// hide Stop Auto Suggest button, show Auto Suggest button
	var autoSuggestButton = document.getElementById("autosuggest");
	if (autoSuggestButton)
		autoSuggestButton.removeAttribute("style");
	var stopSuggestButton = document.getElementById("stopsuggest");
	if (stopSuggestButton)
		stopSuggestButton.setAttribute("style", "display: none;");
}

async function loop() {
	console.log("Beginning auto suggestions...");
	
	if (autoStartGame) {
		observeStartButton();
	}

	var availablePlayersNode = document.querySelector("#available_players_for_game");
	var availablePlayers;
	var tableID = window.location.href.split("table=")[1];
	var index = 0;
	var playerAttributes = [];
	var playerName = "";
	var playerElo = 0;
	var playerID = "";  // technically a number, but just using it to concatenate to a url
	
	// only proceed if there is an available players node
	if (availablePlayersNode) {
		availablePlayers = availablePlayersNode.childNodes;
	} else {
		console.log("availablePlayersNode not found.");
		return;
	}

	// show Stop Auto Suggest button, hide Auto Suggest button
	var autoSuggestButton = document.getElementById("autosuggest");
	if (autoSuggestButton)
		autoSuggestButton.setAttribute("style", "display: none;");
	var stopSuggestButton = document.getElementById("stopsuggest");
	if (stopSuggestButton)
		stopSuggestButton.removeAttribute("style");
	
	suggestPlayers = true;
	while (suggestPlayers) {
		console.log("current index is " + index + " out of " + availablePlayers.length);

		if (index >= availablePlayers.length) {
			index = 0;
			suggestPlayers = false;
			console.log("Finished. The next iteration is scheduled in 12 seconds.");
			interrupted = false;
			await sleep(12000);
			if (!interrupted) {
				loop();
			}
			return;
		}
		
		// OLD WAY TO GET PLAYER ATTRIBUTES... playerID and playerName do not match sometimes with this method.
		//playerAttributes = availablePlayers[index].innerText.split("\n").map(attribute => attribute.trim());
		//playerAttributes = availablePlayers[index].innerHTML;
		//playerName = playerAttributes[0];
		//playerElo = parseInt(playerAttributes[1], 10);
		//playerID = availablePlayers[1].id.split("_")[1];

		var parser = new DOMParser();
		var playerHTML = parser.parseFromString(availablePlayers[index].innerHTML, "text/html");

		// Example of what playerHTML could be:
		// <!DOCTYPE html>
		// <html>
		//   <head>
		// 	  <title></title>
		//   </head>
		//   <body>
		// 	  <div class="\&quot;availableplayername\&quot;">
		//       <a href="/&quot;/#!player?id=34570376/&quot;">saltyk9</a>
		//     </div>
		//     <div class="\&quot;availableplayerrank\&quot;">
		//     <div class="\&quot;gamerank">
		//       <span class="\&quot;icon20"></span> <span class="\&quot;gamerank_value\&quot;">191</span>
		//     </div>&nbsp;
		//     <div class="\&quot;imgtext" style="\&quot;display:none\&quot;"></div>&nbsp;<i class="\&quot;fa" id="\&quot;sticky_avail_34570376\&quot;" style="\&quot;display:none\&quot;"></i>
		//     </div>
		//     <div class="\&quot;availableplayertable\&quot;" id="\&quot;availableplayertable_34570376\&quot;" style="\&quot;display:">
		//       Seasons n°35897569
		//     </div>
		//     <div class="\&quot;availableplayersuggest\&quot;">
		//       <a class="\&quot;bgabutton" href="/&quot;#/&quot;" id="\&quot;suggestjoin_34570376\&quot;"><i class="\&quot;fa"></i>&nbsp;&nbsp;Suggest to join table</a><span class="\&quot;suggestsent\&quot;" id="\&quot;suggestsent_34570376\&quot;"><i class="\&quot;fa"></i> Suggestion sent!</span>
		//     </div>
		//   </body>
		// </html>

		playerID = playerHTML.getElementsByTagName("a")[0].outerHTML.split("id=")[1].split('\">')[0];
		playerName = playerHTML.getElementsByTagName("a")[0].innerText;
		playerElo = playerHTML.querySelector(".gamerank_value").innerText;

		// skip player if on the blacklist.
		if (blackList.indexOf(playerName) != -1) {
			console.log(playerName + " is skipped because player is on the blacklist.");
			index++;
			continue;
		}

		// skip player if the player has already been suggested to play on this table.
		if (alreadySuggested.indexOf(playerName) != -1) {
			console.log(playerName + " is skipped because player has already been suggested.");
			console.log(alreadySuggested);
			index++;
			continue;
		}
		
		// skip player if the player has already been suggested (probably manually prior to runninng this script) to play on this table.
		var statusLabel = document.findElementById("suggestsent_" + playerID);
		if (isVisible(statusLabel)) {
			console.log(playerName + " is skipped because player has already been suggested.");
			alreadySuggested.push(playerName);
			++index;
			continue;
		}

		// skip if player does not meet minimum Elo.
		if (playerElo < minimumElo) {
			console.log(playerName + " is skipped because player's Elo (" + playerElo + ") is less than " + minimumElo + ".");
			index++;
			continue;
		}

		console.log("Suggestion is being sent to " + playerName + " (" + playerElo + "): " + playerID + ".");
		alreadySuggested.push(playerName);
		suggestPlayer(tableID, playerID);

		console.log("Waiting 5 seconds.");
		await sleep(6000);  // actually waiting 6 seconds because bga is still giving 5 second warning when set to 5001.
	}
}

function suggestPlayer(tableID, playerID) {
	var fetchRequest = new Request("https://en.boardgamearena.com/gamelobby/gamelobby/suggest.html?table=" + tableID + "&player=" + playerID);
	var fetchInit = { method: 'GET', mode: 'cors', credentials: "include" };  // make sure to send credentials or you will get "you are not the admin" warnings.
	fetch(fetchRequest, fetchInit)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		console.log(data);

		if (data.status == "0") {
			console.log("BGA Error: " + data.error);
		}
	})
	.catch(function(err) {
		console.log("Fetch Error: " + err);
	});

	// Example Responses:
	// {"status":1,"data":"ok"}
	// {"status":"0","error":"You've already sent a suggestion to that player.","expected":1,"code":100}
	// {"status":"0","error":"You need to wait 5 seconds between two suggestions.","expected":1,"code":100}
}

var isVisible = function(elem) {
    return elem.offsetWidth !== 0 || elem.offsetHeight !== 0;
}

async function observeStartButton() {
	var startGameButton = document.getElementById("startgame");
	if (!startGameButton)
		return;

	var enoughPlayers = false;
	while (!enoughPlayers) {
		await sleep(6000);
		enoughPlayers = isVisible(startGameButton);
	}
	if (!interrupted) {
		startGameButton.click();
	}
}

window.onload = function() {
	// tampermonkey doesn't support '#' in the url (see https://tampermonkey.net/documentation.php#_include), so check if on a table here before continuing.
	if (window.location.href.includes("#!table?table=")) {
		init();
	}
};
