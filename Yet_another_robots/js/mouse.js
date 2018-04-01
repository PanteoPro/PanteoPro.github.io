window.onload = function(){

	function PlayerObject(){
		var self = this;
		this.sourceX = 0;
		this.sourceY = 0;
		this.sourceWidth = 64;
		this.sourceHeight = 64;
		this.x = 50;
		this.y = 50;
		this.width = 64;
		this.height = 64;
		this.vx = 0;
		this.vy = 0;
		this.moveTop = false;
		this.moveLeft = false;
		this.moveBottom = false;
		this.moveRight = false;
		this.side = 0;
		this.rotate = 0;
		this.shot = function(){
			var mouseX = globalVariables.mouseX - this.x-this.width/2;
			var mouseY = globalVariables.mouseY - this.y-this.height/2;
			var hypotinuse = Math.sqrt(Math.pow(mouseX,2)+Math.pow(mouseY,2));
			var vx = mouseX/hypotinuse;
			var vy = mouseY/hypotinuse
			var bullet = new Bullet(this.x + this.width/2 + (vx * 15), this.y + this.height/2 + (vy * 15),
															vx,vy,10);
			bulletArray.push(bullet);
		};
		this.changeRotate = function(){
			var nullX = this.x + this.width/2;
			var nullY = this.y + this.height/2;

			mouseX = globalVariables.mouseX - nullX;
			mouseY = globalVariables.mouseY - nullY;

			mouseXNormal = mouseX/(Math.sqrt(Math.pow(Math.abs(mouseX),2) + Math.pow(Math.abs(mouseY),2)));
			mouseYNormal = mouseY/(Math.sqrt(Math.pow(Math.abs(mouseX),2) + Math.pow(Math.abs(mouseY),2)));

			if(mouseX < 0){
				this.rotate = -(Math.acos(0*mouseXNormal	+(-1)*mouseYNormal) * (360/(Math.PI*2))).toFixed();
			} else {
				this.rotate = (Math.acos(0*mouseXNormal	+(-1)*mouseYNormal) * (360/(Math.PI*2))).toFixed();
			}
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
				this.vx = -5;
				this.side = 6;
			}
			if(this.moveTop){
				this.vy = -5;
				this.side = 0;
			}
			if(this.moveRight){
				this.vx = 5;
				this.side = 2
			}
			if(this.moveBottom){
				this.vy = 5;
				this.side = 4;
			}
			if(this.moveTop && this.moveRight){
				this.vy = -5;
				this.vx = 5;
				this.side = 1;
			}
			if(this.moveTop && this.moveLeft){
				this.vy = -5;
				this.vx = -5;
				this.side = 7;
			}
			if(this.moveBottom && this.moveRight){
				this.vy = 5;
				this.vx = 5;
				this.side = 3;
			}
			if(this.moveBottom && this.moveLeft){
				this.vy = 5;
				this.vx = -5;
				this.side = 5;
			}

			if(!this.moveLeft && !this.moveRight){
				this.vx = 0;
			}
			if(!this.moveTop && !this.moveBottom){
				this.vy = 0;
			}
			this.x += this.vx;
			this.y += this.vy;

		}
	}

	PlayerObject.prototype.moveOn = function(key,self){
		switch(key){
			case 37:
				self.moveLeft = true;
				break;
			case 38:
				self.moveTop = true;
				break;
			case 39:
				self.moveRight = true;
				break;
			case 40:
				self.moveBottom = true;
				break;
		}
	};

	PlayerObject.prototype.moveOff = function(key,self){
		switch(key){
			case 37:
				self.moveLeft = false;
				break;
			case 38:
				self.moveTop = false;
				break;
			case 39:
				self.moveRight = false;
				break;
			case 40:
				self.moveBottom = false;
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

	var gameWorld = {
		x: 0,
		y: 0,
		width: 2560,
		height: 2560,
	}

	var globalVariables = {
		mouseX: 0,
		mousey: 0,
		mousePress: 0
	}

	var bulletArray = [];

	var player = new PlayerObject();


	var mainCanvas = document.querySelector("#main");
	var mainCtx = mainCanvas.getContext("2d");

	var mainImage = new Image();
	mainImage.addEventListener("load", loadGame);
	mainImage.src = "img/test.png";

	window.addEventListener("keydown", player.buttonHanlder);
	window.addEventListener("keyup", player.buttonHanlder);
	mainCanvas.addEventListener("mousemove", mouseHandler);
	mainCanvas.addEventListener("mousedown", mouseHandler);

	function loadGame(){
		main();
	}

	function main(){
		requestAnimationFrame(main, mainCanvas);
		player.update();

		for(var i = 0; i < bulletArray.length; i++){
			bullet = bulletArray[i];
			bullet.move();
			if(bullet.x < 0 || bullet.x > mainCanvas.width || bullet.y < 0 || bullet.y > mainCanvas.height){
				bulletArray.splice(i,1);
			}
		}

		render();
	}

	function render(){
		mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

		// Player DRAW
		mainCtx.save();
		player.changeRotate();
		mainCtx.translate(player.x + player.width/2, player.y + player.height/2);
		mainCtx.rotate((Math.PI/180)*player.rotate);
		mainCtx.drawImage(mainImage,0,0,64,64,-player.width/2,-player.height/2,64,64);
		mainCtx.restore();
		// ------------

		// Bullet DRAW
		for(var i = 0; i < bulletArray.length; i++){
			var bullet = bulletArray[i];
			mainCtx.drawImage(mainImage,bullet.sourceX,bullet.sourceY,bullet.sourceWidth,bullet.sourceHeight,bullet.x,bullet.y,bullet.width,bullet.height);
		}
		// ------------
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