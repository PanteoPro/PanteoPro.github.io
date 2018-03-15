var spriteObj = {
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 64,
	sourceHeight: 64,
	x: 0,
	y: 0,
	width: 64,
	height: 64,
	vx: 0,
	vy: 0,
};

var MODE = 3;

var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

var moveUp = false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;

window.addEventListener("keydown", function(event){
	switch(event.keyCode){
		case UP:
			moveUp = true;
			break;
		case DOWN:
			moveDown = true;
			break;
		case LEFT:
			moveLeft = true;
			break;
		case RIGHT:
			moveRight = true;
			break;
	}
});

window.addEventListener("keyup", function(event){
	switch(event.keyCode){
		case UP:
			moveUp = false;
			break;
		case DOWN:
			moveDown = false;
			break;
		case LEFT:
			moveLeft = false;
			break;
		case RIGHT:
			moveRight = false;
			break;
	}
});

var spriteArray = [];

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var spriteImage = new Image();
spriteImage.addEventListener("load", loadHandler);
spriteImage.src = "img/sprites2.png";

var background = Object.create(spriteObj);
background.sourceY = 64;
background.sourceHeight = 1200;
background.sourceWidth = 1920;
background.width = 1920;
background.height = 1200;

var gameWorld = {
	x: 0,
	y: 0,
	width: background.width,
	height: background.height
};

var camera = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height,
	rightInnerBorder: function(){return this.x + (this.width*0.75)},
	leftInnerBorder: function(){return this.x + (this.width*0.25)},
	topInnerBorder: function(){return this.y + (this.height*0.25)},
	bottomInnerBorder: function(){return this.y + (this.height*0.75)},
};

camera.x = (gameWorld.x + gameWorld.width / 2) - camera.width / 2;
camera.y = (gameWorld.y + gameWorld.height / 2) - camera.height / 2;

var cat = Object.create(spriteObj);
cat.x = (gameWorld.x + gameWorld.width / 2) - cat.width / 2;
cat.y = (gameWorld.y + gameWorld.height / 2) - cat.height / 2;

spriteArray.push(background);
spriteArray.push(cat);

function loadHandler(){
	update();
}

function update(){
	requestAnimationFrame(update, canvas);

	if(moveUp && !moveDown){
		cat.vy = -5;
	}

	if(moveDown && !moveUp){
		cat.vy = 5;
	}

	if(moveLeft && !moveRight){
		cat.vx = -5;
	}

	if(moveRight && !moveLeft){
		cat.vx = 5;
	}

	if(!moveLeft && !moveRight){
		cat.vx = 0;
	}

	if(!moveUp && !moveDown){
		cat.vy = 0;	
	}

	if(MODE === 1){
		cat.x = Math.max(0, Math.min(cat.x + cat.vx, canvas.width - cat.width));
		cat.y = Math.max(0, Math.min(cat.y + cat.vy, canvas.height - cat.height));
	}

	if(MODE === 2){
		cat.x += cat.vx;
		cat.y += cat.vy;
		if(cat.x + cat.width < 0){
			cat.x = canvas.width;
		}
		if(cat.y + cat.height < 0){
			cat.y = canvas.height;
		}
		if(cat.x > canvas.width){
			cat.x = 0 - cat.width;
		}
		if(cat.y > canvas.height){
			cat.y = 0 - cat.height;
		}
	}

	if(MODE === 3){
		cat.x = Math.max(0, Math.min(cat.x + cat.vx, gameWorld.width - cat.width));
		cat.y = Math.max(0, Math.min(cat.y + cat.vy, gameWorld.height - cat.height));

		if(cat.x < camera.leftInnerBorder()){
			camera.x = Math.floor(cat.x - (camera.width * 0.25));
		}
		if(cat.y < camera.topInnerBorder()){
			camera.y = Math.floor(cat.y - (camera.width * 0.25));
		}
		if(cat.x + cat.width > camera.rightInnerBorder()){
			camera.x = Math.floor(cat.x + cat.width - (camera.width * 0.75));
		}
		if(cat.y + cat.height > camera.bottomInnerBorder()){
			camera.y = Math.floor(cat.y + cat.height - (camera.height * 0.75));
		}

		// camera.x = Math.floor(cat.x + (cat.width / 2) - (camera.width / 2));
		// camera.y = Math.floor(cat.y + (cat.height / 2) - (camera.height / 2));
		if(camera.x < gameWorld.x){
			camera.x = gameWorld.x;
		}
		if(camera.x + camera.width > gameWorld.x + gameWorld.width){
			camera.x = gameWorld.width + gameWorld.x - camera.width;
		}
		if(camera.y < gameWorld.y){
			camera.y = gameWorld.y;
		}
		if(camera.y + camera.height > gameWorld.y + gameWorld.height){
			camera.y = gameWorld.height + gameWorld.y - camera.height;
		}
	}


	render();
}

function render(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.save();
	ctx.translate(-camera.x, -camera.y)
	if(spriteArray !== 0){
		for(var i = 0; i < spriteArray.length; i++){
			sprite = spriteArray[i];
			ctx.drawImage(spriteImage,
				sprite.sourceX, sprite.sourceY,
				sprite.sourceWidth, sprite.sourceHeight,
				sprite.x, sprite.y, sprite.width, sprite.height);
		}
	}
	ctx.restore();
}