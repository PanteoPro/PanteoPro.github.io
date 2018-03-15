var spriteObj = {
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 64,
	sourceHeight: 64,
	x: 0,
	y: 0,
	width: 64,
	height: 64,
	visible: true,
	rotation: 0,
	alpha: 1,
	shadow: true,
};

for(var i = 1; i <= document.querySelectorAll("button").length; i++){
	button = document.querySelector("#but"+i);
	button.addEventListener("click", activeGame);
}

var cat = Object.create(spriteObj);
cat.y = 128;
cat.rotation = 120;

var background = Object.create(spriteObj);
background.sourceY = 64;
background.sourceHeight = 400;
background.sourceWidth = 400;
background.width = 400;
background.height = 400;

var spriteArray = [];

spriteArray.push(background);
spriteArray.push(cat);

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var spriteImage = new Image();
spriteImage.addEventListener("load", loadHandler);
spriteImage.src = "img/sprites.png";

function activeGame(event){
	button = event.target.id;
	switch(button){
		case "but1":
			cat.x+=5;
			break;
		case "but2":
			cat.x-=5;
			break;
		case "but3":
			cat.y+=5;
			break;
		case "but4":
			cat.y-=5;
			break;
		case "but5":
			cat.width += 10;
			cat.height += 10;
			cat.x -= 5;
			cat.y -= 5;
			break;
		case "but6":
			cat.width -= 10;
			cat.height -= 10;
			cat.x += 5;
			cat.y += 5;
			break;
		case "but7":
			cat.visible = false;
			break;
		case "but8":
			cat.visible = true;
			break;
		case "but9":
			if(cat.alpha > 0.1)
				cat.alpha -= 0.1;
			break;
		case "but10":
			if(cat.alpha < 1)
				cat.alpha += 0.1;
			break;
		case "but11":
			cat.shadow = true;
			break;
		case "but12":
			cat.shadow = false;
			break;
		case "but13":
			cat.rotation += 10;
			break;
		case "but14":
			cat.rotation -= 10;
			break;
	}
}

function loadHandler(){
	update();
}

function update(){
	requestAnimationFrame(update, canvas);
	render();
}

function render(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	if(spriteArray !== 0){
		for(var i = 0; i < spriteArray.length; i++){
			sprite = spriteArray[i];
			if(sprite.visible){
				ctx.save();
				ctx.globalAlpha = sprite.alpha;
				if(sprite.shadow){
					ctx.shadowColor = "rgba(100,100,100,0.5)";
					ctx.shadowOffsetX = -3;
					ctx.shadowOffsetY = -3;
					ctx.shadowBlur = 10;
				}
				if(sprite.width !== 400){
						ctx.translate(
							Math.floor(sprite.x + (sprite.width / 2)),
							Math.floor(sprite.y + (sprite.height/2))
						);
					ctx.rotate(sprite.rotation * Math.PI / 180);
					ctx.drawImage(spriteImage, sprite.sourceX, sprite.sourceY, sprite.sourceWidth, sprite.sourceHeight, Math.floor(-sprite.width/2), Math.floor(-sprite.height/2), sprite.width, sprite.height);
				} else{
					ctx.drawImage(spriteImage, sprite.sourceX, sprite.sourceY, sprite.sourceWidth, sprite.sourceHeight, Math.floor(sprite.x), Math.floor(sprite.y), sprite.width, sprite.height);
				}
				ctx.restore();
			}
		}
	}
}