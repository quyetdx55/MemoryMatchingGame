var matchingGame = {};
matchingGame.savingObject = {};
matchingGame.savingObject.deck = [];
//an array to store which card is removed by storing their index.
matchingGame.savingObject.removedCards = [];
//store the counting elapsed time
matchingGame.savingObject.currentElapsedTime = 0;

matchingGame.deck = [
	'cardAK', 'cardAK', 
	'cardAQ', 'cardAQ',
	'cardAJ', 'cardAJ',
	'cardBK', 'cardBK',
	'cardBQ', 'cardBQ',
	'cardBJ', 'cardBJ',
];

$(document).ready(function(){
	matchingGame.deck.sort(shuffle);
	
	//re-create the saved deck
	var savedObject = savedSavingObject();
	if(savedObject != undefined){
		matchingGame.deck = savedObject.deck;
	}
	//copying the deck into saving object.
	matchingGame.savingObject.deck = matchingGame.deck.slice();
	//clone 12 copies of the card
	for(var i = 0; i < 11; i++){
		$(".card:first-child").clone().appendTo("#cards");
	}
	
	//initialize each card's position
	$("#cards").children().each(function(index){
		//align the cards to be 4x3 ourselves.
		$(this).css({
			"left": ($(this).width()  + 20) * (index % 4),
			"top" : ($(this).height() + 20) * Math.floor(index / 4)
		});
		
		//get pattern from the shuffled deck
		var pattern = matchingGame.deck.pop();
		
		//visually apply the pattern on the card's back side 
		$(this).find(".back").addClass(pattern);
		
		//embed the pattern data into the DOM element 
		$(this).attr("data-pattern", pattern);
		
		//save the index into the DOM element, so we know which is the next card.
		$(this).attr("data-card-index", index);
		//Listen the click event on each card DIV element.
		$(this).click(selectCard);	
	});
	
	//remove the cards that were removed in savedObject.
	if(savedObject != undefined){
		matchingGame.savingObject.removedCards = savedObject.removedCards
		//find those cards and remove them.
		for(var i in matchingGame.savingObject.removedCards){
			$(".card[data-card-index="+matchingGame.savingObject.
			removedCards[i]+"]").remove();
		}
	}
	//reset the timer
	matchingGame.elapsedTime = 0;
	
	//restore the saved elapsed time
	if(savedObject != undefined){
		matchingGame.elapsedTime = savedObject.currentElapsedTime;
		matchingGame.savingObject.currentElapsedTime = savedObject
		.currentElapsedTime
	}
	//start the timer
	matchingGame.timer = setInterval(countTimer, 1000);
});

function countTimer(){
	matchingGame.elapsedTime++;
	
	//save the current elapsed time into savingObject.
	matchingGame.savingObject.currentElapsedTime = matchingGame.elapsedTime;
	
	//calculate the minutes and seconds from elapsed timer
	var minute = Math.floor(matchingGame.elapsedTime/60);
	var second = matchingGame.elapsedTime%60;
	
	//add padding 0 if minute and second is less thean 10 
	if(minute < 10){
		minute = "0" + minute;
	}
	
	if(second < 10){
		second = "0" + second;
	}
	
	//display the elapsed time 
	$("#elapsed-time").html(minute+":"+second);
	
	//save the game process
	saveSavingObject();
}

function shuffle(){
	return 0.5 - Math.random();
}

function selectCard(){
	//we do nothing if there are already two card flipped.
	if($(".card-flipped").size() > 1){
		return;
	}
	var datas = this;
	alert(datas.attributes[1].value);
	$(this).addClass("card-flipped");
	
	//check the pattern of both flipped card 0.7s later
	if($(".card-flipped").size()==2){
		setTimeout(checkPattern, 700);
	}
}

function checkPattern(){
	if(isMatchPattern()){
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd", removeTookCards);
	}else{
		$(".card-flipped").removeClass("card-flipped");
	}
}
function isMatchPattern(){
	var cards=$(".card-flipped");
	var pattern=$(cards[0]).data("pattern");
	var anotherPattern=$(cards[1]).data("pattern");
	
	return (pattern == anotherPattern);
}
function removeTookCards(){
	//add the removed card into the array which store which cards are removed
	$(".card-removed").each(function(){
		matchingGame.savingObject.removedCards.push($(this).data("card-index"));
		$(this).remove();
	});
	
	//Check if all cards are removed and show game over
	if($(".card").length == 0){
		gameOver();
	}
}

function gameOver(){
	//stop the timer
	clearInterval(matchingGame.timer);
	
	//set the score in the game over popup
	$(".score").html($("#elapsed-time").html());
	
	//load the saved last score from the local storage
	var lastScore = localStorage.getItem("last-score");
	
	//Check if there saved last score and save time from load storage
	var lastScoreObj = JSON.parse(lastScore);
	if(lastScoreObj == null){
		//create an empty record if there is no any saved record
		lastScoreObj = {"savedTime": "no record", "score": 0};
	}
	var lastElapsedTime = lastScoreObj.score;
	//convert the elapsed seconds into minute:second format
	//calculate the minutes and seconds from elapsed time
	var minute = Math.floor(lastElapsedTime/60);
	var second = lastElapsedTime%60;
	
	//add padding 0 if minute and second is less than 10
	if(minute < 10) minute = "0" + minute;
	if(second < 10) second = "0" + second;
	
	//display the last elapsed time in game over popup
	$(".last-score").html(minute+":"+second);
	
	if(lastElapsedTime == 0 || matchingGame.elapsedTime < lastElapsedTime){
		$(".ribbon").removeClass("hide");
	}
	//display the saved time of last score
	var savedTime = lastScoreObj.savedTime;
	$(".saved-time").html(savedTime);
	
	//get the current datetime
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	
	//add padding 0 to minutes
	if(minutes < 10) minutes = "0" + minutes;
	//add padding 0 to seconds
	if(seconds < 10) seconds = "0" + seconds;
	
	var now = day+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds;
	
	//construct the object of datetime and game score
	var obj={"savedTime": now, "score": matchingGame.elapsedTime};
	//save the score into local storage
	localStorage.setItem("last-score", JSON.stringify(obj));
	//show the game over popup
	$("#popup").removeClass("hide");
	
	//at last, we clear the saved savingObject
	localStorage.removeItem("savingObject");
}

function saveSavingObject(){
	//save the encoded saving object into local storage
	localStorage["savingObject"] = JSON.stringify(matchingGame.savingObject);
}

//returns the saved saving object from local storage
function savedSavingObject(){
	//returns the saved saving object from local storage
	var savingObject = localStorage["savingObject"];
	if(savingObject != undefined){
		savingObject = JSON.parse(savingObject);
	}
	return savingObject;
}