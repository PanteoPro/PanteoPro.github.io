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

var widthBrowser = document.documentElement.clientWidth;
var heightBrowser = document.documentElement.clientHeight;

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
canvas.setAttribute("width", widthBrowser-10);
canvas.setAttribute("height", heightBrowser-10);
var ctx = canvas.getContext("2d");

var spriteImage = new Image();
spriteImage.addEventListener("load", loadHandler);
spriteImage.src = "img/sprites4.png";

var background = Object.create(spriteObj);
background.sourceY = 64;
background.sourceHeight = 2048;
background.sourceWidth = 2048;
background.width = widthBrowser;
background.height = heightBrowser;
background.x = 0;
background.y = 0;

var gameWorld = {
	x: 0,
	y: 0,
	width: background.width,
	height: background.height
}

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

var cat = Object.create(spriteObj);
cat.x = (gameWorld.x + gameWorld.width/2) - cat.width/2;
cat.y = 136;

spriteArray.push(background);
spriteArray.push(cat);

window.addEventListener("mousedown", mouseDownHandler);
window.addEventListener("mouseup", mouseUpHandler);

function mouseDownHandler(event){
	var mouseX = event.pageX - canvas.offsetLeft;
	var mouseY = event.pageY - canvas.offsetTop;

	console.log(canvas.clientHeight);

	var centerX = cat.x + cat.width/2;
	var centerY = cat.y + cat.height/2;

	var betwenX = mouseX - centerX;
	var betwenY = mouseY - centerY;
	var lengthVect = Math.sqrt((betwenX * betwenX) + (betwenY * betwenY));

	cat.vx = betwenX/lengthVect;
	cat.vy = betwenY/lengthVect;

	console.log(mouseX, mouseY);
	console.log(centerX, centerY);
	console.log(betwenX, betwenY)
}

function mouseUpHandler(){
	cat.vx = 0;
	cat.vy = 0;
}

function loadHandler(){
	update();
}

function update(){
	requestAnimationFrame(update, canvas);

	cat.x += cat.vx;
	cat.y += cat.vy;

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