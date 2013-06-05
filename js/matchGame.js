var matchingGame = {};
matchingGame.savingObject = {};
matchingGame.savingObject.deck = [];
//an array to store which card is removed by storing their index.
matchingGame.savingObject.removedCards = [];
//store the counting elapsed time
matchingGame.savingObject.currentElapsedTime = 0;

matchingGame.deck = [
<<<<<<< HEAD
	'cardAK', 'cardCK', 
	'cardAQ', 'cardCQ',
	'cardAJ', 'cardCJ',
	'cardBK', 'cardDK',
	'cardBQ', 'cardDQ',
	'cardBJ', 'cardDJ',
];
matchingGame.buildRandom = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
matchingGame.serverRandom = [0];
//Luu tru cac trang thai cua nguoi choi cung khi choi voi nhieu nguoi cung luc
var onlineMode = {};
onlineMode.own=[0];//Luu nguoi tao game room
onlineMode.guest=[0,0];//Luu khach den choi
//Luu tru va tao ra cac trang thai cua game
var menuGame = {};
menuGame.playMode = 0;//chua chon kieu choi nao: single (1) or multiple(2) or resume (3)
menuGame.numberCards = 12; //So luong o trong tro choi 
menuGame.numberOnRow = 4; //so luong card tren mot hang


(function(){
	window.MatchGame={
		
		socket: null,
		
		initialize: function(socketURL){
			this.socket = io.connect(socketURL);
			
			//Game menu
			$("#mainMenu").click(function(){
				$("#popup").addClass("hide");
				$("#menuGame").removeClass("hide");
			});
			
			$("#playButton").click(function(){
				$("#menuGame").addClass("hide");
				$("#gameModeBG").removeClass("hide");
			});
			//chon che do choi mot nguoi
			$("#playButtonS").click(function(){
				$("#playButtonM").addClass("hide");
				$("#settingMode").removeClass("hide");
				menuGame.playMode = 1;
			});
			//chon che do choi mot nguoi
			$("#playButtonM").click(function(){
				$("#playButtonS").addClass("hide");
				$("#settingMode").removeClass("hide");
				$("#userName").removeClass("hide");
				menuGame.playMode = 2;
			});
			//chon kich thuoc cua tro choi
			$("#board1").click(function(){
				$("#gameModeBG").addClass("hide");
				$("#playButtonS").removeClass("hide");
				$("#playButtonM").removeClass("hide");
				$("#settingMode").addClass("hide");
				menuGame.numberCards = 12;
				menuGame.numberOnRow = 4;
				$("#cards").width(380);
				$("#game").width(500);
				if(menuGame.playMode == 1){
					startGame();
				}else{
					
				}
			});
			//chon kich thuoc cua tro choi
			$("#board2").click(function(){
				$("#gameModeBG").addClass("hide");
				$("#playButtonS").removeClass("hide");
				$("#playButtonM").removeClass("hide");
				$("#settingMode").addClass("hide");
				menuGame.numberCards = 18;
				menuGame.numberOnRow = 6;
				$("#cards").width(570);
				$("#game").width(690);
				startGame();
			});
			//chon kich thuoc cua tro choi
			$("#board3").click(function(){
				$("#gameModeBG").addClass("hide");
				$("#playButtonS").removeClass("hide");
				$("#playButtonM").removeClass("hide");
				$("#settingMode").addClass("hide");
				menuGame.numberCards = 24;
				menuGame.numberOnRow = 8;
				$("#cards").width(780);
				$("#game").width(900);
				if(menuGame.playMode == 1){
					startGame();
				}else{
					$("#userName").addClass("hide");
					//Sau nay khi click vao nhung nut ntn thi se mo ra phong game, nhieu nguoi co the tao va choi
					var dataSend={};
					onlineMode.own[0]=1;
					dataSend.messenger=1;
					dataSend.numberCards=24;
					dataSend.numberOnRow=8;
					dataSend.name = $("#userName").val();
					onlineMode.own[0] = dataSend.name;
					onlineMode.own[1] = 0;//stt khi tham gia choi
					MatchGame.send(dataSend);
					
					$("#cards").children().each(function(index){
					$(this).click(function(){
						var data = {};
						data.messenger = 3;
						data.cardPoint = this.attributes["data-card-index"].value;
						//we do nothing if there are already two card flipped.
						MatchGame.send(data);
						if($(".card-flipped").size() > 1){
							return;
						}
						//alert(datas.attributes[1].value);
						$(this).addClass("card-flipped");
	
						//check the pattern of both flipped card 0.7s later
						if($(".card-flipped").size()==2){
							setTimeout(checkPattern, 700);
						}
						//check the pattern of both flipped card 0.7s later
					});	
				});
				}
			});
			//Choi lai sau khi ket thuc
			$("#playAgain").click(function(){
				$("#popup").addClass("hide");
				menuGame.playMode=1;
				startGame();
			});
			//Resume lai tro choi
			$("#resumeButton").click(function(){
				menuGame.playMode = 3;
				$("#menuGame").addClass("hide");
			});
			
			//process any incoming messages
			this.socket.on('new', this.add);
		},
		
		//add action 
		add: function(data){
			//data = JSON.parse(data);
			var newData = new Array();
			var i = 0;
			console.log(data);
			for(var key in data){
				newData[i] = data[key];
				i++;
			}
			if(newData[0] == 6){//create game
				if(data.numberCard == 24){
					$("#cards").width(780);
					$("#game").width(900);
				}
				menuGame.numberCards = newData[1];
				menuGame.numberOnRow = newData[2];
				
				matchingGame.serverRandom = newData[4];
				if(onlineMode.own[1] == 0){
					onlineMode.own[1] = newData[3];
					startGame();
				}
				if(onlineMode.guest[1] == 0){
					if(onlineMode.own[1] == 1){
						onlineMode.guest[1] = 2;
					}else {
						onlineMode.guest[1] = 1;
					}
				}
				
			}else if(newData[0] == 7){
				if($(".card-flipped").size() > 1){
					return;
				}
				alert(newData[5]);
				//alert(datas.attributes[1].value);
				$("div[data-card-index="+newData[5]+"]").addClass("card-flipped");
				if($(".card-flipped").size()==2){
					setTimeout(checkPattern, 700);
				}
			}/*else if(){
				
			}else if(){
			
			}else{}*/
			//return false;
		},
		
		//send action to the server
		send: function(data){
			if(data.messenger == 1){
				this.socket.emit('msg', {
					messenger: 1,
					name: data.name,//Tam thoi de the nay, hoan thien cho them phan nhap ten
					numberCard: data.numberCards,
					numberOnRow: data.numberOnRow
				});
			//}else if(){
			
			
			}else if(data.messenger == 3){
				this.socket.emit('msg', {//send
					messenger: 3,
					cardPoint: data.cardPoint
				});
			}/*else if(){
			
			}else if(){
			
			}else{}*/
			
			return false;
		}		
	};
}() );
=======
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
>>>>>>> f49b86272b41372d2835482698e095c1c372acf0

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

<<<<<<< HEAD
=======
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

>>>>>>> f49b86272b41372d2835482698e095c1c372acf0
function checkPattern(){
	if(isMatchPattern()){
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd", removeTookCards);
	}else{
		$(".card-flipped").removeClass("card-flipped");
	}
}
<<<<<<< HEAD

=======
>>>>>>> f49b86272b41372d2835482698e095c1c372acf0
function isMatchPattern(){
	var cards=$(".card-flipped");
	var pattern=$(cards[0]).data("pattern");
	var anotherPattern=$(cards[1]).data("pattern");
	
	return (pattern == anotherPattern);
}
<<<<<<< HEAD

=======
>>>>>>> f49b86272b41372d2835482698e095c1c372acf0
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
<<<<<<< HEAD
	//MatchGame.send(false);
=======
>>>>>>> f49b86272b41372d2835482698e095c1c372acf0
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
<<<<<<< HEAD
}

//Start game
function startGame(){
	$("#cards").append("<div class='card'></div>");
	$(".card").append("<div class='face front'></div>");
	$(".card").append("<div class='face back'></div>");
	var makeBoard = [0];
	if(menuGame.playMode == 1){
		matchingGame.buildRandom.sort(shuffle);
	
		var j = 0;
		for(var i = 0; i < menuGame.numberCards/2; i++){
			makeBoard[2*i] = matchingGame.deck[matchingGame.buildRandom[i]];
			makeBoard[2*i+1] = matchingGame.deck[matchingGame.buildRandom[i]];
		}
		makeBoard.sort(shuffle);
	}else{//Neu la multiplayer
		var j = 0;
		for(var i = 0; i < menuGame.numberCards; i++){
			makeBoard[i] = matchingGame.deck[matchingGame.serverRandom[i]];
		}
	}
	//clone 12 copies of the card
	if(menuGame.playMode != 0){
		for(var i = 0; i < menuGame.numberCards-1; i++){
			$(".card:first-child").clone().appendTo("#cards");
		}
	}
	//initialize each card's position
	$("#cards").children().each(function(index){
		//align the cards to be 4x3 ourselves.
		$(this).css({
			"left": ($(this).width()  + 20) * (index % menuGame.numberOnRow),
			"top" : ($(this).height() + 20) * Math.floor(index / menuGame.numberOnRow)
		});
		//get pattern from the shuffled deck
		//var pattern = matchingGame.deck.pop();
		var pattern = makeBoard.pop();
		//visually apply the pattern on the card's back side 
		$(this).find(".back").addClass(pattern);
		
		//embed the pattern data into the DOM element 
		$(this).attr("data-pattern", pattern);
		
		//save the index into the DOM element, so we know which is the next card.
		$(this).attr("data-card-index", index);
		//Listen the click event on each card DIV element.
		//if(menuGame.playMode == 1){
			$(this).click(function(){
				//we do nothing if there are already two card flipped.
				if($(".card-flipped").size() > 1){
					return;
				}
				//alert(datas.attributes[1].value);
				$(this).addClass("card-flipped");
	
				//check the pattern of both flipped card 0.7s later
				if($(".card-flipped").size()==2){
					setTimeout(checkPattern, 700);
				}
				//check the pattern of both flipped card 0.7s later
					
			});	
		//}
	});
	if(menuGame.playMode == 1){
		//reset the timer*/
		matchingGame.elapsedTime = 0;
	
		//start the timer*/
		matchingGame.timer = setInterval(countTimer, 1000);
	}
=======
>>>>>>> f49b86272b41372d2835482698e095c1c372acf0
}