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
	animation: true,
	bullet: 100,
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

var bulletObj = {
	sourceX: 0,
	sourceY: 100,
	sourceWidth: 10,
	sourceHeight: 10,
	x: 0,
	y: 0,
	width: 10,
	height: 10,
	vx: 0,
	vy: 0,
	speed: 10,
};


var spriteArray = [];
var bulletArray = [];

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var player = Object.create(spriteObject);
player.sourceX = 0;
player.sourceY = 0;
player.sourceWidth = 100;
player.sourceHeight = 100;
player.height = 100;
player.width = 100;
player.x = 40;
player.y = canvas.height/2 - player.height/2;
player.animation = false;

spriteArray.push(player);

window.addEventListener("keydown", function(event){
	switch(event.keyCode){
		case 37:
			player.x -= 5;
			break;
		case 38:
			player.y -= 5;
			break;
		case 39:
			player.x += 5;
			break;
		case 40:
			player.y += 5;
			break;
	}
});

canvas.addEventListener("mousedown", function(event){
	if(player.bullet > 0){
		var mouseX = event.pageX - canvas.offsetLeft;
		var mouseY = event.pageY - canvas.offsetTop;

		var playerX = player.x + player.width/2;
		var playerY = player.y + player.height/2;

		var changeX = mouseX - playerX;
		var changeY = mouseY - playerY;

		var giput = Math.sqrt(Math.pow(changeX, 2) + Math.pow(changeY,2));

		var bullet = Object.create(bulletObj);
		bullet.vx = changeX/giput;
		bullet.vy = changeY/giput;
		bullet.x = playerX;
		bullet.y = playerY;

		bulletArray.push(bullet);
		player.bullet--;
	}
});


var spriteImage = new Image();
spriteImage.addEventListener("load", loadGame);
spriteImage.src = "img/sprites.png";




function loadGame(){
	update();
}

function update(){
	requestAnimationFrame(update, canvas);
	// console.log(zombie.curentFrame);
	updateBullet();
	render();
}

function updateBullet(){
	for(var i = 0; i < bulletArray.length; i++){
		var bullet = bulletArray[i];
		bullet.x += bullet.vx * bullet.speed;
		bullet.y += bullet.vy * bullet.speed;

		if(bullet.x < 0 || bullet.x > canvas.width) bulletArray.splice(i, 1);
		if(bullet.y < 0 || bullet.y > canvas.height) bulletArray.splice(i, 1);
	}
}

function render(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.font = "30px Arial"; 
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.fillText("Ammo: " + player.bullet,5,30);
	renderSprite();
	renderBullet();
}

function renderSprite(){
	for(var i = 0; i < spriteArray.length; i++){
		sprite = spriteArray[i];	
		ctx.drawImage(spriteImage,
			sprite.sourceX,sprite.sourceY,
			sprite.sourceWidth,sprite.sourceHeight,
			sprite.x,sprite.y,sprite.width,sprite.height);
	}
}

function renderBullet(){
	for(var i = 0; i < bulletArray.length; i++){
		bullet = bulletArray[i];	
		ctx.drawImage(spriteImage,
			bullet.sourceX,bullet.sourceY,
			bullet.sourceWidth,bullet.sourceHeight,
			bullet.x,bullet.y,bullet.width,bullet.height);
	}
}