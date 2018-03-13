var monster = {
	SIZE: 128,
	HIDING: 0,
	JUMPING: 1,
	HIT: 2,
	state: this.HIDING,
	numberOfFrames: 2,
	currentFrame: 0,
	sourseX: 0,
	sourseY: 0,
	forward: true,
	REPEAT: 5,
	currentRepeat: 0,
	timeToReset: 9,
	resetCounter: 0,
	waitTime: undefined,
	findWaitTime: function(){
		this.waitTime = Math.ceil(Math.random() * 60);
	},
	updateAnimation: function(){
		this.sourseX = this.currentFrame * this.SIZE;
		this.sourseY = 0;

		if(this.state !== this.HIT){
			if(this.waitTime > 0 || this.waitTime === undefined){
				this.state = this.HIDING;
			} else {
				this.state = this.JUMPING;
			}
		}

		switch(this.state){
			case this.HIDING:
				this.waitTime--;
				this.currentFrame = 0;
				break;
			case this.JUMPING:
				if(this.currentRepeat === this.REPEAT){
					if(this.currentFrame === this.numberOfFrames){
						this.forward = false;
						this.currentRepeat = 0;
						this.currentFrame = 0;
					}
					if(this.currentFrame === 0 && this.forward === false){
						this.forward = true;
						this.currentFrame = 0;
						this.currentRepeat = 0;
						this.findWaitTime();
						this.state = this.HIDING;
						break;
					}
				} else {
					if(this.currentFrame === 2 && this.forward === true){
						this.currentFrame = 0;
						this.currentRepeat++;
					}
					if(this.currentFrame === 1 && this.forward === false){
						this.currentFrame = 3;
						this.currentRepeat++;
					}
					// console.log(this.currentRepeat);
				}

				if(this.forward){
					this.currentFrame++;
				} else {
					this.currentFrame--;
				}
				break;
			case this.HIT:
				this.currentFrame = 3;
				this.resetCounter++;
				if(this.resetCounter === this.timeToReset){
					this.state = this.HIDING;
					this.findWaitTime();
					this.forward = true;
					this.resetCounter = 0;
					this.currentFrame = 0;
					this.currentRepeat = 0;
				}
		}

	},
	image: "img/enemy/monster2.png"
};

var gameTimer = {
	time: 0,
	interval: undefined,
	start: function(){
		var self = this;
		this.interval = setInterval(function(){self.tick()},1000);
	},
	tick: function(){
		this.time--;
	},
	stop: function(){
		clearInterval(this.interval);
	},
	reset: function(){
		this.time = 0;
	}
}

var ROWS = 8;
var COLUMNS = 10;
var SIZE = monster.SIZE/2;
var SPACE = 10;

var monsterHit = 0;
var monsterObjects = [];
var monsterCanvases = [];
var monsterCTX = [];

var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

var monsterImage = new Image();
monsterImage.addEventListener("load", loadHandler, false);
monsterImage.src = monster.image;

function buildMap(){
	for(var i = 0; i < ROWS; i++){
		for(var j = 0; j < COLUMNS; j++){
			var newMonsterObject = Object.create(monster);
			newMonsterObject.findWaitTime();
			monsterObjects.push(newMonsterObject);

			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", SIZE);
			canvas.setAttribute("height", SIZE);
			stage.appendChild(canvas);
			canvas.style.left = SIZE * j + SPACE*j + "px";
			canvas.style.top = SIZE * i + SPACE*i + "px";
			canvas.addEventListener("mousedown", mouseDownHandler, false);
			monsterCanvases.push(canvas);

			var ctx = canvas.getContext("2d");
			monsterCTX.push(ctx);
		}
	}
}

function mouseDownHandler(event){
	var canvasWasClicked = event.target;
	for(var i = 0; i < monsterCanvases.length; i++){
		if(monsterCanvases[i] === canvasWasClicked){
			var monster = monsterObjects[i];
			if(monster.state === monster.JUMPING){
				monster.state = monster.HIT;
				monsterHit++;
			}
		}
	}
}

function updateAnimation(){
	if(gameTimer.time > 0){
		setTimeout(updateAnimation, 120);
	}
	for(var i = 0; i < monsterObjects.length; i++){
		monsterObjects[i].updateAnimation();
	}
	if(gameTimer.time === 0){
		endGame();
	}
	render();
}

function endGame(){
	gameTimer.stop();
	for(var i = 0; i < monsterCanvases.length; i++){
		var canvas = monsterCanvases[i];
		var monster = monsterObjects[i];
		monster.sourseX = 0;
		canvas.removeEventListener("mousedown", mouseDownHandler, false);
	}
}

function loadHandler(){
	buildMap();
	gameTimer.time = 20;
	gameTimer.start();
	updateAnimation();
}

function render(){
	for(var i = 0; i < monsterCTX.length; i++){
		monsterCTX[i].clearRect(0,0,monsterCanvases[i].width,monsterCanvases[i].height);
		monsterCTX[i].drawImage(monsterImage, monsterObjects[i].sourseX,monsterObjects[i].sourseY,monsterObjects[i].SIZE,monsterObjects[i].SIZE,0,0,SIZE,SIZE);
	}
	output.innerHTML = "Монстров Погибло: " + monsterHit + " Время: " + gameTimer.time;
	console.log("Render");
}