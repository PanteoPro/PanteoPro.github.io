window.onload = function(){

	function PlayerObject(){
		var self = this;
		this.sides = {"left": 0, "top": 1, "right": 2, "bottom": 3};
		this.sourceX = 0;
		this.sourceY = 0;
		this.sourceWidth = 67;
		this.sourceHeight = 100;
		this.totalFrame = 3;
		this.currentFrame = 3;
		this.x = 50;
		this.y = 50;
		this.width = 67;
		this.height = 100;
		this.vx = 0;
		this.vy = 0;
		this.speed = 3;
		this.moveTop = false;
		this.moveLeft = false;
		this.moveBottom = false;
		this.moveRight = false;
		this.shot = function(){
			var playerX = this.x - camera.x + this.width/2;
			var playerY = this.y - camera.y + this.height/2;

			var mouseX = globalVariables.mouseX - playerX;
			var mouseY = globalVariables.mouseY - playerY;

			var hypotinuse = Math.sqrt(Math.pow(mouseX,2)+Math.pow(mouseY,2));
			var vx = mouseX/hypotinuse;
			var vy = mouseY/hypotinuse
			var bullet = new Bullet(this.x + this.width/2 + (vx * 15), this.y + this.height/2 + (vy * 15),
															vx,vy,10);
			bulletArray.push(bullet);
		};
		this.changeFrame = function(){
			this.sourceX = this.currentFrame * 67;
		}
		this.buttonHanlder = function(event){
			var type = event.type;
			var key = event.keyCode;
			if(type === "keydown")
				PlayerObject.prototype.moveOn(key,self);
			else
				PlayerObject.prototype.moveOff(key,self);
		}
		this.update = function(){
			
			if(this.moveLeft){
				this.vx = -this.speed;
				this.currentFrame = this.sides.left;
			}
			if(this.moveRight){
				this.vx = this.speed;
				this.currentFrame = this.sides.right;
			}
			if(this.moveTop){
				this.vy = -this.speed;
				this.currentFrame = this.sides.top;
			}
			if(this.moveBottom){
				this.vy = this.speed;
				this.currentFrame = this.sides.bottom;
			}

			if(!this.moveRight && !this.moveLeft){
				this.vx = 0;
			}
			if(!this.moveTop && !this.moveBottom){
				this.vy = 0;
			}

			this.x += this.vx;
			this.y += this.vy;
			this.changeFrame();

		}
	}

	PlayerObject.prototype.moveOn = function(key,self){
		switch(key){
			case 37:
				self.moveLeft = true;
				this.pressButtonsNum++;
				break;
			case 38:
				self.moveTop = true;
				this.pressButtonsNum++;
				break;
			case 39:
				self.moveRight = true;
				this.pressButtonsNum++;
				break;
			case 40:
				self.moveBottom = true;
				this.pressButtonsNum++;
				break;
		}
	};

	PlayerObject.prototype.moveOff = function(key,self){
		switch(key){
			case 37:
				self.moveLeft = false;
				this.pressButtonsNum--;
				break;
			case 38:
				self.moveTop = false;
				this.pressButtonsNum--;
				break;
			case 39:
				self.moveRight = false;
				this.pressButtonsNum--;
				break;
			case 40:
				self.moveBottom = false;
				this.pressButtonsNum--;
				break;
		}
	};

	function Bullet(x,y,vx,vy,speed){
		this.sourceX = 0;
		this.sourceY = 0;
		this.sourceWidth = 64;
		this.sourceHeight = 64;
		this.width = 8;
		this.height = 8;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.speed = speed;
		this.move = function(){
			this.x += this.vx * speed;
			this.y += this.vy * speed;
		}
	}

	function Sprite(sX,sY,sWidth,sHeight,x,y,width,height,image){
		this.sourceX = sX;
		this.sourceY = sY;
		this.sourceWidth = sWidth;
		this.sourceHeight = sHeight;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.image = image;
	}

	var loaderInfo = {
		count: 2,
		currentCount: 0
	}

	var mainCanvas = document.querySelector("#main");
	var mainCtx = mainCanvas.getContext("2d");

	var mainImage = new Image();
	mainImage.addEventListener("load", loadGame);
	mainImage.src = "img/mafia.png";

	var map = new Image();
	map.addEventListener("load", loadGame);
	map.src = "img/Map.jpg";

	mainCanvas.addEventListener("mousemove", mouseHandler);
	mainCanvas.addEventListener("mousedown", mouseHandler);

	var gameWorld = {
		x: 0,
		y: 0,
		width: 5000,
		height: 5000,
	}

	var camera = {
		x: 0,
		y: 0,
		width: mainCanvas.width,
		height: mainCanvas.height,
		innerRightBorder: function(){return this.x + (this.width * 0.75);},
		innerLeftBorder: function(){return this.x + (this.width * 0.25);},
		innerTopBorder: function(){return this.y + (this.height * 0.25);},
		innerBottomBorder: function(){return this.y + (this.height * 0.75);}
	}


	var globalVariables = {
		mouseX: 0,
		mousey: 0,
		mousePress: 0
	}

	var bulletArray = [];
	var spritesArray = [];

	var background = new Sprite(0,0,gameWorld.width,gameWorld.height,0,0,gameWorld.width,gameWorld.height,map);

	var player = new PlayerObject();
	player.x = gameWorld.width/2 - player.width/2;
	player.y = gameWorld.height/2 - player.height/2;

	camera.x = gameWorld.width/2 - camera.width/2 - player.width/2;
	camera.y = gameWorld.height/2 - camera.height/2 - player.height/2;

	spritesArray.push(background);
	spritesArray.push(player);

	window.addEventListener("keydown", player.buttonHanlder);
	window.addEventListener("keyup", player.buttonHanlder);

	function loadGame(event){
		loaderInfo.currentCount++;
		console.log(event);
		if(loaderInfo.currentCount === loaderInfo.count)
			main();
	}

	function main(){
		requestAnimationFrame(main, mainCanvas);
		player.update();
		updateCamera();

		for(var i = 0; i < bulletArray.length; i++){
			bullet = bulletArray[i];
			bullet.move();
			if(bullet.x < 0 || bullet.x > gameWorld.width || bullet.y < 0 || bullet.y > gameWorld.height){
				bulletArray.splice(i,1);
			}
		}

		render();
	}

	function updateCamera(){
		if(player.x < camera.innerLeftBorder()){
			camera.x = Math.floor(player.x - (camera.width * 0.25));
		}
		if(player.x + player.width > camera.innerRightBorder()){
			camera.x = Math.floor(player.x + player.width - (camera.width * 0.75));
		}
		if(player.y < camera.innerTopBorder()){
			camera.y = Math.floor(player.y - (camera.height * 0.25));
		}
		if(player.y + player.height > camera.innerBottomBorder()){
			camera.y = Math.floor(player.y + player.height - (camera.height * 0.75));
		}

		if(camera.x < gameWorld.x){
			camera.x = gameWorld.x;
		}
		if(camera.y < gameWorld.y){
			camera.y = gameWorld.y;
		}
		if(camera.x + camera.width > gameWorld.width){
			camera.x = gameWorld.x + gameWorld.width - camera.width;
		}
		if(camera.y + camera.height > gameWorld.height){
			camera.y = gameWorld.y + gameWorld.height - camera.height;
		}
	}

	function render(){
		mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

		mainCtx.save();
		mainCtx.translate(-camera.x, -camera.y);

		if(spritesArray.length !== 0){
			for(var i = 0; i < spritesArray.length; i++){
				var image = mainImage;
				var sprite = spritesArray[i];
				if(sprite.image !== undefined) image = sprite.image;
				mainCtx.drawImage(image,sprite.sourceX,sprite.sourceY,sprite.sourceWidth,sprite.sourceHeight,sprite.x,sprite.y,sprite.width,sprite.height);
			}
		}

		if(spritesArray.length !== 0){
			for(var i = 0; i < spritesArray.length; i++){
				var image = mainImage;
				var sprite = spritesArray[i];
				if(sprite.image !== undefined) image = sprite.image;
				mainCtx.drawImage(image,sprite.sourceX,sprite.sourceY,sprite.sourceWidth,sprite.sourceHeight,camera.x+10+(sprite.x/30),camera.y+10+(sprite.y/30),sprite.width/30,sprite.height/30);
			}
		}
		mainCtx.strokeRect(camera.x+10,camera.y+10,gameWorld.width/30,gameWorld.height/30);

		// Player DRAW
		// mainCtx.drawImage(mainImage,player.sourceX,player.sourceY,player.sourceWidth,player.sourceHeight,player.x,player.y,player.width,player.height);
		// ------------

		// Bullet DRAW
		for(var i = 0; i < bulletArray.length; i++){
			var bullet = bulletArray[i];
			mainCtx.drawImage(mainImage,bullet.sourceX,bullet.sourceY,bullet.sourceWidth,bullet.sourceHeight,bullet.x,bullet.y,bullet.width,bullet.height);
		}
		// ------------

		mainCtx.restore();
	}

	function mouseHandler(event){
		globalVariables.mouseX = event.pageX - mainCanvas.offsetLeft;
		globalVariables.mouseY = event.pageY - mainCanvas.offsetTop;
		if(event.type === "mousedown"){
			globalVariables.mousePress = true;
			player.shot();
		}
		else if (event.type === "mouseup"){
			globalVariables.mousePress = false;
		}
	}

};