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

var RIGHT = 39;
var LEFT = 37;

var moveRight = false;
var moveLeft = false;

window.addEventListener("keydown", function(event){
	switch(event.keyCode){
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
spriteImage.src = "img/sprites3.png";

var distantBackground = Object.create(spriteObj);
distantBackground.sourceY = 64;
distantBackground.sourceHeight = 200;
distantBackground.sourceWidth = 1024;
distantBackground.width = 1024;
distantBackground.height = 200;
distantBackground.x = 0;
distantBackground.y = 0;

var foreground = Object.create(spriteObj);
foreground.sourceY = 264;
foreground.sourceHeight = 200;
foreground.sourceWidth = 1024;
foreground.width = 1024;
foreground.height = 200;
foreground.x = 0;
foreground.y = 0;

var gameWorld = {
	x: 0,
	y: 0,
	width: foreground.width,
	height: foreground.height
}

var camera = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height,
	vx: 0,
	previousX: 0,
	rightInnerBorder: function(){
		return this.x + (this.width * 0.75);
	},
	leftInnerBorder: function(){
		return this.x + (this.width * 0.25);
	}
}

var cat = Object.create(spriteObj);
cat.x = (gameWorld.x + gameWorld.width/2) - cat.width/2;
cat.y = 136;

spriteArray.push(distantBackground);
spriteArray.push(foreground);
spriteArray.push(cat);

function loadHandler(){
	update();
}

function update(){
	requestAnimationFrame(update, canvas);

	if(moveLeft && !moveRight){
		cat.vx = -5;
	}

	if(moveRight && !moveLeft){
		cat.vx = 5;
	}

	if(!moveLeft && !moveRight){
		cat.vx = 0;
	}

	cat.x = Math.max(0, Math.min(cat.x + cat.vx, gameWorld.width - cat.width));

	if(cat.x < camera.leftInnerBorder()){
		camera.x = Math.floor(cat.x - (camera.width * 0.25));
	}
	if(cat.x + cat.width > camera.rightInnerBorder()){
		camera.x = Math.floor(cat.x + cat.width - (camera.width * 0.75));
	}

	if(camera.x < gameWorld.x){
		camera.x = gameWorld.x;
	}
	if(camera.x + camera.width > gameWorld.x + gameWorld.width){
		camera.x = gameWorld.width + gameWorld.x - camera.width;
	}

	camera.vx = camera.x - camera.previousX;
	distantBackground.x += camera.vx / 2;
	camera.previousX = camera.x;

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