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

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");


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

var spriteImage = new Image();
spriteImage.addEventListener("load", loadHandler);
spriteImage.src = "img/sprites2.png";

var bg = Object.create(spriteObj);
bg.sourceWidth = 1920;
bg.sourceHeight = 1200;
bg.sourceY = 64;
bg.width = 1920;
bg.height = 1200;

var gameWorld = {
	x: 0,
	y: 0,
	width: bg.width,
	height: bg.height
};

var camera = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height,
	rightInnerBorder: function(){return this.x + (this.width * 0.75)},
	leftInnerBorder: function(){return this.x + (this.width * 0.25)},
	topInnerBorder: function(){return this.y + (this.height * 0.25)},
	bottomInnerBorder: function(){return this.y + (this.height * 0.75)},
}

camera.x = gameWorld.width/2 - camera.width/2;
camera.y = gameWorld.height/2 - camera.height/2;

var cat = Object.create(spriteObj);
cat.x = gameWorld.width/2 - cat.width/2;
cat.y = gameWorld.height/2 - cat.height/2;

spriteArray.push(bg);
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

	cat.x = Math.max(0,Math.min(cat.x + cat.vx, gameWorld.width - cat.width));
	cat.y = Math.max(0,Math.min(cat.y + cat.vy, gameWorld.height - cat.height));

	if(cat.x < camera.leftInnerBorder()){
		camera.x = Math.floor(cat.x - (camera.width * 0.25));
	}
	if(cat.x > camera.rightInnerBorder()){
		camera.x = Math.floor(cat.x + cat.width - (camera.width * 0.75));
	}
	if(cat.y < camera.topInnerBorder()){
		camera.y = Math.floor(cat.y - (camera.width * 0.25));
	}
	if(cat.y > camera.bottomInnerBorder()){
		camera.y = Math.floor(cat.y + cat.height - (camera.width * 0.75));
	}

	render();

}

function render(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
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