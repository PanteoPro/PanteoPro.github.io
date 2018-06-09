(function(){
	//Холст и поверхность рисования
	var canvas = document.querySelector("canvas");
	var drawingSurface = canvas.getContext("2d");
	//Массивы игровых объектов и загружаемых ресурсов
	var sprites = [];
	var assetsToLoad = [];

	var missiles = [];
	var aliens = [];
	var messages = [];

	//Создание спрайта фона
	var background = Object.create(spriteObject);
	background.x = 0;
	background.y = 0;
	background.sourceY = 64;
	background.sourceWidth = 640;
	background.sourceHeight = 640;
	background.width = 500;
	background.height = 500;
	sprites.push(background);
	//Создание спрайта орудия внизу по центру холста
	var cannon = Object.create(spriteObject);
	cannon.x = canvas.width / 2 - cannon.width / 2;
	cannon.y = 280;
	cannon.hp = true;
	cannon.name = "c";
	sprites.push(cannon);
	//Создание спрайта указателя
	var wand = Object.create(spriteObject);
	wand.height = 16;
	wand.width = 16;
	sprites.push(wand);
	//Создание alien
	var alien = Object.create(alienObject);
	alien.x = 150;
	alien.y = 50;
	alien.name = "a";
	sprites.push(alien);
	//Создание объекта для отображения сообщения о конце игры
	var gameOverMessage = Object.create(messageObject);
	gameOverMessage.font = "normal bold 40px emulogic";
	gameOverMessage.fillStyle = "#412с21";
	gameOverMessage.x = 20;
	gameOverMessage.y = 120;
	gameOverMessage.visible = false;
	messages.push(gameOverMessage);
	//Создание сообщения счет игрока
	var scorePlayerMessage = Object.create(messageObject);
	scorePlayerMessage.font = "24px bold Impact";
	scorePlayerMessage.fillStyle = "#5151c1";
	scorePlayerMessage.x = 45;
	scorePlayerMessage.y = 16;
	scorePlayerMessage.visible = true;
	messages.push(scorePlayerMessage);
	var scoreAlienMessage = Object.create(messageObject);
	scoreAlienMessage.font = "24px bold Impact";
	scoreAlienMessage.fillStyle = "#5151c1";
	scoreAlienMessage.x = canvas.width - 75;
	scoreAlienMessage.y = 16;
	scoreAlienMessage.visible = true;
	messages.push(scoreAlienMessage);
	//Загрузка таблицы фреймов
	var image = new Image();
	image.addEventListener("load", loadHandler, false);
	image.src = "img/sprites.png";
	assetsToLoad.push(image);
	//Загрузка звуков
	var music = document.querySelector("#music");
	music.addEventListener("canplaythrough", loadHandler, false);
	music.load();
	assetsToLoad.push(music);
	var shootSound = document.querySelector("#shootSound");
	shootSound.addEventListener("canplaythrough", loadHandler,false);
	shootSound.load();
	shootSound.volume = 0.2;
	assetsToLoad.push(shootSound);
	var explosionSound = document.querySelector("#explosionSound");
	explosionSound.addEventListener("canplaythrough",loadHandler, false);
	explosionSound.load();
	explosionSound.volume = 0.5;
	assetsToLoad.push(explosionSound);
	//Счетчик числа загруженных ресурсов
	var assetsLoaded = 0;
	//Состояния игры
	var LOADING = 0;
	var PLAYING = 1;
	var OVER = 2;
	var LOSE = 3;
	var gameState = LOADING;
	//Коды клавиш со стрелками
	var RIGHT = 39;
	var LEFT = 37;
	var UP = 38;
	var DOWN = 40;
	//Направления движения орудия
	var moveRight = false;
	var moveLeft = false;
	var moveUp = false;
	var moveDown = false;
	//Переменные для стрельбы ракетами
	var shoot = false;
	var spaceKeyIsDown = false;
	//Переменные игры
	var score = 0;
	var scoreAlien = 0;
	var scoreNeededToWin = 60;
	var scoreNeededToLose = 3;
	//Мышка
	var mousePress = false;
	var mouseX;
	var mouseY;
	var radius = 40;
	var angle;
	var angleAlien;
	var bulletTimer = 0;
	var timeToFire = 30;
	//Событие мышки
	canvas.addEventListener("mousemove",mousemoveHandler);

	canvas.addEventListener("mousedown", function(event){
		mousePress = true;
		shoot = true;
	});
	canvas.addEventListener("mouseup", function(event){
		mousePress = false;
	});
	//Подключение обработчиков событий нажатия/отпускания клавиш
	window.addEventListener("keydown", function(event){
		switch(event.keyCode){
			case LEFT:
				moveLeft = true;
				break;
			case RIGHT:
				moveRight = true;
				break;
			case UP:
				moveUp = true;
				break;
			case DOWN:
				moveDown = true;
				break;
		}
}, false);

	window.addEventListener("keyup", function(event){
		switch(event.keyCode){
			case LEFT:
				moveLeft = false;
				break;
			case RIGHT:
				moveRight = false;
				break;
			case UP:
				moveUp = false;
				break;
			case DOWN:
				moveDown = false;
				break;
		}
	}, false);
	//Запуск цикла анимации игры
	update();

	function update(){
		//Цикл анимации
		requestAnimationFrame(update, canvas);
		//Выбор дальнейших действий в зависимости от состояния игры
		switch(gameState){
			case LOADING:
				console.log("Загрузка...");
				break;
			case PLAYING:
				playGame();
			break;
			case OVER:
				endGame();
			break;
		}
	//Отображение игры
		render();
	}
	function loadHandler(){
		assetsLoaded++;
		if(assetsLoaded === assetsToLoad.length){
			//Отключение отслеживания событий загрузки ресурсов
			image.removeEventListener("load", loadHandler, false);
			music.removeEventListener("canplaythrough",
			loadHandler, false);
			shootSound.removeEventListener("canplaythrough",
			loadHandler, false);
			explosionSound.removeEventListener("canplaythrough",
			loadHandler, false);
			//Воспроизведение музыкального файла music
			music.play();
			music.volume = 0.3;
			//Запуск игры
			gameState = PLAYING;
		}
	}

	function playGame(){

		scorePlayerMessage.text = scoreNeededToLose - scoreAlien;
		scoreAlienMessage.text = scoreNeededToWin - score;

		var vx = cannon.centerX() - alien.centerX();
		var vy = cannon.centerY() - alien.centerY();
		var distance = Math.sqrt(vx*vx + vy*vy);
		if(distance <= alien.range){
			alien.vx = alien.rotationSpeed * vx/distance;
			alien.vy = alien.rotationSpeed + vy/distance;
			var moveDistance = Math.sqrt(alien.vx*alien.vx + alien.vy*alien.vy);
			alien.vx = alien.speed * alien.vx/moveDistance;
			alien.vy = alien.speed * alien.vy/moveDistance;
			angleAlien = Math.atan2(alien.vy,alien.vx);
			alien.rotation = angleAlien * 180 / Math.PI + 90;
		} else {
			alien.vx *= alien.friction;
			alien.vy *= alien.friction;
		}

		bulletTimer++;
		if(bulletTimer >= timeToFire && distance <= alien.range){
			fireAlien();
			bulletTimer = 0;
		}

		alien.x += alien.vx;
		alien.y += alien.vy;

		//Налево
		if(moveLeft && !moveRight){
			cannon.vx = -5;
		}
		//Направо
		if(moveRight && !moveLeft){
			cannon.vx = 5;
		}

		if(moveUp && !moveDown){
			cannon.vy = -5;
		}

		if(!moveUp && moveDown){
			cannon.vy = 5;
		}
		//Если ни одна из клавиш не нажата, скорость перемещения 0
		if(!moveLeft && !moveRight){
			cannon.vx = 0;
		}

		if(!moveUp && !moveDown){
			cannon.vy = 0;
		}
		//Запуск ракеты, если shoot имеет значение true
		if(shoot){
			fireMissile();
			shoot = false;
		}
		//Перемещение орудия в пределах границ холста
		cannon.x = Math.max(0, Math.min(cannon.x + cannon.vx, canvas.width - cannon.width));
		cannon.y = Math.max(0, Math.min(cannon.y + cannon.vy, canvas.width - cannon.height));
		//Поворот курсора
		angle = Math.atan2(mouseY - cannon.centerY(), mouseX - cannon.centerX());
		wand.x = cannon.centerX() + (radius * Math.cos(angle)) - cannon.halfWidth()/2;
		wand.y = cannon.centerY() + (radius * Math.sin(angle)) - cannon.halfHeight()/2;
		//Перемещение ракеты
		for(var i = 0; i < missiles.length; i++){
			var missile = missiles[i];
			//Перемещение вверх по экрану
			missile.y += missile.vy;
			missile.x += missile.vx;
			//Удаление ракеты при пересечении верхней границы холста
			if(missile.y < 0 - missile.height || missile.x < 0 - missile.width || missile.y > canvas.height || missile.x > canvas.width){
				//Удаление ракеты из массива missiles
				removeObject(missile, missiles);
				//Удаление ракеты из массива sprites
				removeObject(missile, sprites);
				//Уменьшение переменной цикла на 1 для компенсации
				i--;
			}
		}
		//Создание пришельца
		//--- Столкновение объектов
		//Проверка столкновения пришельцев и ракет
			for(var j = 0; j < missiles.length; j++){
				var missile = missiles[j];
				if(missile.type === "player"){
					if(hitTestRectangle(missile, alien) && alien.state === alien.NORMAL){
						//Увеличение счета
						score++;
						//Удаление ракеты
						removeObject(missile, missiles);
						removeObject(missile, sprites);
						//Уменьшение счетчика цикла на 1 для компенсации
						j--;
					}
					if(Math.sqrt((cannon.centerX() - missile.centerX())*(cannon.centerX() - missile.centerX())+(cannon.centerY() - missile.centerY())*(cannon.centerY() - missile.centerY()))>alien.range-50){
						removeObject(missile, missiles);
						removeObject(missile, sprites);
					}
				} else if(missile.type === "alien"){
					if(hitTestRectangle(missile, cannon)){
						scoreAlien++;
						removeObject(missile, missiles);
						removeObject(missile, sprites);
					}
				}
			}
		//Проверка завершения игры победой игрока
		if(score >= scoreNeededToWin || scoreAlien >= scoreNeededToLose){
			gameState = OVER;
		}
	}
	function endGame(){
		gameOverMessage.visible = true;
		scorePlayerMessage.text = scoreNeededToLose - scoreAlien;
		scoreAlienMessage.text = scoreNeededToWin - score;
		if(score === scoreNeededToWin){
			gameOverMessage.text = "Вы победили";
		} else{
			gameOverMessage.text = "Вас убил монстр";
		}
		render();
	}
	function fireAlien(){
		var missile = Object.create(spriteObject);
		missile.sourceX = 194;
		missile.sourceWidth = 64;
		missile.sourceHeight = 64;
		missile.width = 16;
		missile.height = 16;
		missile.type = "alien";
		//Позиционирование ракеты над орудием
		missile.x = alien.centerX() - missile.halfWidth();
		missile.y = alien.centerY() - missile.halfHeight();
		//Установка скорости перемещения ракеты
		missile.vy = alien.vy * 3;
		missile.vx = alien.vx * 3;
		//Добавление спрайта ракеты в массивы sprites и missiles
		sprites.push(missile);
		missiles.push(missile);
		//Воспроизведение звука пуска ракеты
		shootSound.currentTime = 0;
		shootSound.play();
	}
	function fireMissile(){
		//Создание спрайта ракеты
		var missile = Object.create(spriteObject);
		missile.sourceX = 128;
		missile.sourceWidth = 64;
		missile.sourceHeight = 64;
		missile.width = 16;
		missile.height = 16;
		missile.type = "player";
		//Позиционирование ракеты над орудием
		missile.x = cannon.centerX() - missile.halfWidth();
		missile.y = cannon.centerY() - missile.halfHeight();
		//Установка скорости перемещения ракеты
		missile.vy = 7 * Math.sin(angle);
		missile.vx = 7 * Math.cos(angle);
		//Добавление спрайта ракеты в массивы sprites и missiles
		sprites.push(missile);
		missiles.push(missile);
		//Воспроизведение звука пуска ракеты
		shootSound.currentTime = 0;
		shootSound.play();
	}
	function removeObject(objectToRemove, array){
		var i = array.indexOf(objectToRemove);
		if (i !== -1){
			array.splice(i, 1);
		}
	}
	function render(){
		drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
		//Отображение спрайтов
		if(sprites.length !== 0){
		for(var i = 0; i < sprites.length; i++){
			var sprite = sprites[i];
				drawingSurface.drawImage(image,
				sprite.sourceX, sprite.sourceY,
				sprite.sourceWidth, sprite.sourceHeight,
				Math.floor(sprite.x), Math.floor(sprite.y),
				sprite.width, sprite.height);
				if(sprite.hp){
					if(sprite.name === "c"){
						drawingSurface.fillRect(sprite.x,sprite.y + sprite.height + 5,Math.floor(sprite.width * ((scoreNeededToLose - scoreAlien) / scoreNeededToLose)),15);
						drawingSurface.strokeRect(sprite.x,sprite.y + sprite.height + 5, sprite.width, 15);
					} else if(sprite.name === "a"){
						drawingSurface.fillStyle = "#c93253";
						drawingSurface.fillRect(sprite.x,sprite.y + sprite.height + 5,Math.floor(sprite.width * ((scoreNeededToWin - score) / scoreNeededToWin)),15);
						drawingSurface.strokeRect(sprite.x,sprite.y + sprite.height + 5, sprite.width, 15);
					}
				}
		}
		drawingSurface.strokeStyle = "black";
		drawingSurface.lineWidth = 5;
		drawingSurface.fillStyle = "white";
		drawingSurface.fillRect(5,5,80,40);
		drawingSurface.strokeRect(5,5,80,40);
		drawingSurface.drawImage(image,cannon.sourceX,cannon.sourceY,cannon.sourceWidth,cannon.sourceHeight,10,10,30,30);
		}

		drawingSurface.strokeStyle = "black";
		drawingSurface.lineWidth = 5;
		drawingSurface.fillStyle = "white";
		drawingSurface.fillRect(canvas.width-5-80,5,80,40);
		drawingSurface.strokeRect(canvas.width-5-80,5,80,40);
		drawingSurface.drawImage(image,alien.sourceX,alien.sourceY,alien.sourceWidth,alien.sourceHeight,canvas.width-40,10,30,30);
		
		//Отображение игровых сообщений
		if(messages.length !== 0){
			for(var i = 0; i < messages.length; i++){
				var message = messages[i];
				if(message.visible){
					drawingSurface.font = message.font;
					drawingSurface.fillStyle = message.fillStyle;
					drawingSurface.textBaseline = message.textBaseline;
					drawingSurface.fillText(message.text, message.x,
					message.y);
				}
			}
		}
	}

	function mousemoveHandler(event){
		mouseX = event.pageX - canvas.offsetLeft;
		mouseY = event.pageY - canvas.offsetTop;
	}
}());