var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var multiplayerMode={}; //Luu tru cac thong tin ve cac cuoc choi
multiplayerMode.buildRan = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];//tao man choi
multiplayerMode.gameSession = [0];
var datas = {};
server.listen(80);
//1: start(Join or createnew), 2: create new, 3: move, 4: pause, 5: exit
//6: start, 7: move, 8: pause, 9: exit
app.use("/", express.static(__dirname));

io.sockets.on('connection', function(socket){
	//socket.emit('news', {hello: 'world'});
	socket.on('msg', function(data){
		var newData = new Array();
		var i = 0;
		for(var key in data){
			newData[i] = data[key];
			i++;
		}
		console.log(newData);
		
		if(newData[0] == 1){
			datas.messeger = 6;
			//datas.gameBoard = [0];
			datas.numberCards = newData[2];
			datas.numberOnRow =  newData[3];
			datas.orderNumber = 0;
			datas.gameBoard = [0];
			if (multiplayerMode.gameSession[0] == 0){
				
				multiplayerMode.buildRan.sort(shuffle);
				console.log(multiplayerMode.gameSession);
	
				for(var i = 0; i < datas.numberCards/2; i++){
					datas.gameBoard[2*i] = multiplayerMode.buildRan[i];
					datas.gameBoard[2*i+1] = multiplayerMode.buildRan[i];
				}
				datas.gameBoard.sort(shuffle);
				datas.orderNumber = 1;
				multiplayerMode.gameSession[0]=[[newData[1], 1], datas.gameBoard];
			}else{
				datas.orderNumber = 2;
				multiplayerMode.gameSession[0][2]=[newData[1], 2];
				datas.gameBoard=multiplayerMode.gameSession[0][1];
			}
		}else if(newData[0] == 3){
			datas.messeger = 7;
			datas.pointCard = newData[4];
		}
		console.log(datas);
		//console.log(multiplayerMode.gameSession[0][1]);
		io.sockets.emit('new', datas);
		//console.log(data);
	});
});

function shuffle(){
	return 0.5 - Math.random();
}
