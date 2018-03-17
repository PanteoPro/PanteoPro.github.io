var spriteObject = {
	sourceX: 0,
	sourceY: 105,
	sourceWidth: 96,
	sourceHeight: 64,
	x: 0,
	y: 0,
	width: 96,
	height: 64,
	curentFrame: 0,
	totalFrame: 14,
	forward: true,
	active: true,
	updateAnimation: function(){
		this.sourceX = this.sourceWidth * (this.curentFrame % 5);
		this.sourceY = 105 + (this.sourceHeight * Math.floor(this.curentFrame / 5));

		if(this.curentFrame === this.totalFrame){
			this.forward = false;
		}
		if(this.curentFrame === 0 && this.forward === false){
			this.forward = true;
		}

		if(this.forward)
			this.curentFrame++;
		else
			this.curentFrame--;
	},
}



var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", function(event){
	var mouseX = event.pageX - canvas.offsetLeft;
	var mouseY = event.pageY - canvas.offsetTop;

	console.log(mouseX, mouseY);

	for(var i = 0; i < spriteArray.length; i++){
		object = spriteArray[i];
		if(mouseX > object.x && mouseX < object.x + object.width){
			if(mouseY > object.y && mouseY < object.y + object.height){
				if(object.active)
					activeFunc(object);
			}
		}
	}
});


var spriteImage = new Image();
spriteImage.addEventListener("load", loadGame);
spriteImage.src = "img/zombie_reborn_sprites.png";

var spriteArray = [];

var zombie = Object.create(spriteObject);
var zombie2 = Object.create(spriteObject);
zombie2.x = 100;

var title = Object.create(spriteObject);
title.sourceY = 0;
title.sourceX = 0;
title.sourceHeight = 35;
title.sourceWidth = 230;
title.height = 35;
title.width = 230; 
title.x = canvas.width/2 - title.width / 2;
title.y = 40;

var play = Object.create(spriteObject);
play.sourceY = 35;
play.sourceX = 0;
play.sourceHeight = 35;
play.sourceWidth = 230;
play.height = 35;
play.width = 230; 
play.x = 40;
play.y = canvas.height/2 - play.height / 2;

var scoreBoard = Object.create(spriteObject);
scoreBoard.sourceY = 70;
scoreBoard.sourceX = 0;
scoreBoard.sourceHeight = 35;
scoreBoard.sourceWidth = 230;
scoreBoard.height = 35;
scoreBoard.width = 230; 
scoreBoard.x = 40;
scoreBoard.y = canvas.height/2 - scoreBoard.height / 2 + scoreBoard.height;

var backgroud = Object.create(spriteObject);
backgroud.sourceY = 297;
backgroud.sourceWidth = 720;
backgroud.width = 720;
backgroud.sourceHeight = 480;
backgroud.height = 480;
backgroud.totalFrame = 0;
backgroud.active = false;

spriteArray.push(backgroud);
spriteArray.push(zombie);
spriteArray.push(zombie2);
spriteArray.push(title);
spriteArray.push(play);
spriteArray.push(scoreBoard);


function activeFunc(object){
	object.curentFrame = 14;
}

function loadGame(){
	update();
}

function update(){
	setTimeout(update, 140);
	zombie.updateAnimation();
	zombie2.updateAnimation();
	// console.log(zombie.curentFrame);
	render();
}

function render(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	for(var i = 0; i < spriteArray.length; i++){
		sprite = spriteArray[i];	
		ctx.drawImage(spriteImage,
			sprite.sourceX,sprite.sourceY,
			sprite.sourceWidth,sprite.sourceHeight,
			sprite.x,sprite.y,sprite.width,sprite.height);
	}
}