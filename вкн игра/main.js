var map = [
"00000000000000000000",
"00000000000000000000",
"00000000000000000000",
"00000000000000000000",
"00000000000000000000",
"00000000000000000000",
"00000000000000000000",
"0000000BBBBB00000000",
"00000000000000000000",
"00000000000000000000",
"00000000000000000000",
"BBBBBBBBBBBBBBBBBBBB",
"BBBBBBBBBBBBBBBBBBBB"
];

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
spriteImage.src = "sprites.png";

function create_block(x,y){
	var block = Object.create(spriteObj);
	block.sourceY = 293;
	block.sourceX = 5;
	block.sourceHeight = 16;
	block.sourceWidth = 16;
	block.width = 16;
	block.height = 16;
	block.x = x;
	block.y = y;
	return block;
}

function create_empty(x,y){
	var block = Object.create(spriteObj);
	block.sourceY = 280;
	block.sourceX = 5;
	block.sourceHeight = 13;
	block.sourceWidth = 13;
	block.width = 16;
	block.height = 16;
	block.x = x;
	block.y = y;
	return block;
}

function create_map(){
	var elem;
	var x, y;
	var x_start = 0;
	var y_start = canvas.height - 16;
	var step = 16;
	x = x_start; y = y_start;
	for(var i = map.length-1; i >= 0; i--){
		console.log(spriteArray)
		for(var j = 0; j < map[i].length; j++){
			switch(map[i][j]){
				case "0": spriteArray.push(create_empty(x,y));
				case "B": spriteArray.push(create_block(x,y));
			}
			x += step;
		}
		y-=step;
		x = x_start;
	}
}

var gameWorld = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height
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


function loadHandler(){
	create_map();
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