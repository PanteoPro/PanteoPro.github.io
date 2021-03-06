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
	background.sourceY = 32;
	background.sourceWidth = 640;
	background.sourceHeight = 640;
	background.width = 480;
	background.height = 320;
	sprites.push(background);
	//Создание спрайта орудия внизу по центру холста
	var cannon = Object.create(spriteObject);
	cannon.x = canvas.width / 2 - cannon.width / 2;
	cannon.y = 280;
	sprites.push(cannon);
	//Создание объекта для отображения счета игры
	var scoreDisplay = Object.create(messageObject);
	scoreDisplay.font = "normal bold 30px emulogic";
	scoreDisplay.fillStyle = "#00FF00";
	scoreDisplay.x = 400;
	scoreDisplay.y = 10;
	messages.push(scoreDisplay);
	//Создание объекта для отображения сообщения о конце игры
	var gameOverMessage = Object.create(messageObject);
	gameOverMessage.font = "normal bold 20px emulogic";
	gameOverMessage.fillStyle = "#00FF00";
	gameOverMessage.x = 70;
	gameOverMessage.y = 120;
	gameOverMessage.visible = false;
	messages.push(gameOverMessage);
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
	var gameState = LOADING;
	//Коды клавиш со стрелками
	var RIGHT = 39;
	var LEFT = 37;
	var SPACE = 32;
	//Направления движения орудия
	var moveRight = false;
	var moveLeft = false;
	//Переменные для стрельбы ракетами
	var shoot = false;
	var spaceKeyIsDown = false;
	//Переменные игры
	var score = 0;
	var scoreNeededToWin = 60;
	var alienFrequency = 100;
	var alienTimer = 0;
	//Подключение обработчиков событий нажатия/отпускания клавиш
	window.addEventListener("keydown", function(event){
		switch(event.keyCode){
			case LEFT:
				moveLeft = true;
				break;
			case RIGHT:
				moveRight = true;
				break;
			case SPACE:
				if(!spaceKeyIsDown){
					shoot = true;
					spaceKeyIsDown = true;
				}
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
			case SPACE:
				spaceKeyIsDown = false;
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
		//Налево
		if(moveLeft && !moveRight){
			cannon.vx = -8;
		}
		//Направо
		if(moveRight && !moveLeft){
			cannon.vx = 8;
		}
		//Если ни одна из клавиш не нажата, скорость перемещения 0
		if(!moveLeft && !moveRight){
			cannon.vx = 0;
		}
		//Запуск ракеты, если shoot имеет значение true
		if(shoot){
			fireMissile();
			shoot = false;
		}
		//Перемещение орудия в пределах границ холста
		cannon.x = Math.max(0, Math.min(cannon.x + cannon.vx, canvas.width - cannon.width));
		//Перемещение ракеты
		for(var i = 0; i < missiles.length; i++){
			var missile = missiles[i];
			//Перемещение вверх по экрану
			missile.y += missile.vy;
			//Удаление ракеты при пересечении верхней границы холста
			if(missile.y < 0 - missile.height){
				//Удаление ракеты из массива missiles
				removeObject(missile, missiles);
				//Удаление ракеты из массива sprites
				removeObject(missile, sprites);
				//Уменьшение переменной цикла на 1 для компенсации
				i--;
			}
		}
		//Создание пришельца
		//Увеличение на 1 таймера alienTimer
		alienTimer++;
		//Создание нового пришельца, если таймер равен alienFrequency
		if(alienTimer === alienFrequency){
			makeAlien();
			alienTimer = 0;
			//Уменьшение alienFrequency на 1 для постепенного
			//увеличения частоты появления инопланетян
			if(alienFrequency > 2){
				alienFrequency--;
			}
		}
		//Цикл по пришельцам
		for(var i = 0; i < aliens.length; i++){
			var alien = aliens[i];
			if(alien.state === alien.NORMAL){
				//Перемещение пришельца, если его состояние NORMAL
				alien.y += alien.vy;
			}
			//Проверка, пересек ли пришелец нижний край холста
			if(alien.y > canvas.height + alien.height){
				//Завершение игры, если пришелец достиг Земли
				gameState = OVER;
			}
		}
		//--- Столкновение объектов
		//Проверка столкновения пришельцев и ракет
		for(var i = 0; i < aliens.length; i++){
			var alien = aliens[i];
			for(var j = 0; j < missiles.length; j++){
				var missile = missiles[j];
				if(hitTestRectangle(missile, alien) && alien.state === alien.NORMAL){
					//Увеличение счета
					score++;
					//Удаление ракеты
					removeObject(missile, missiles);
					removeObject(missile, sprites);
					//Уменьшение счетчика цикла на 1 для компенсации
					j--;
					//Удаление пришельца
					destroyAlien(alien);
				}
			}
		}
		//Отображение счета
		scoreDisplay.text = score;
		//Проверка завершения игры победой игрока
		if(score === scoreNeededToWin){
			gameState = OVER;
		}
	}
	function destroyAlien(alien){
		//Смена состояния пришельца
		alien.state = alien.EXPLODED;
		alien.update();
		//Удаление спрайта пришельца через 1 секунду
		setTimeout(removeAlien, 1000);
		//Воспроизведение звука взрыва
		explosionSound.currentTime = 0;
		explosionSound.play();
		function removeAlien()
		{
			removeObject(alien, aliens);
			removeObject(alien, sprites);
		}
	}
	function endGame(){
		gameOverMessage.visible = true;
		if(score < scoreNeededToWin){
			gameOverMessage.text = "Что-то захвачено!";
		}
		else{
			gameOverMessage.x = 120;
			gameOverMessage.text = "Что-то спасено!";
		}
	}
	function makeAlien(){
		//Создание спрайта пришельца
		var alien = Object.create(alienObject);
		alien.sourceX = 32;
		//Установка Y-поциции пришельца за верхней границей холста
		alien.y = 0 - alien.height;
		//Установка случайной X-поциции пришельца
		var randomPosition = Math.floor(Math.random() * 15);
		alien.x = randomPosition * alien.width;
		//Установка скорости перемещения пришельца
		alien.vy = 1;
		//Добавление спрайта в массивы sprites и aliens
		sprites.push(alien);
		aliens.push(alien);
	}
	function fireMissile(){
		//Создание спрайта ракеты
		var missile = Object.create(spriteObject);
		missile.sourceX = 96;
		missile.sourceWidth = 32;
		missile.sourceHeight = 32;
		missile.width = 8;
		missile.height = 16;
		//Позиционирование ракеты над орудием
		missile.x = cannon.centerX() - missile.halfWidth();
		missile.y = cannon.y - missile.height;
		//Установка скорости перемещения ракеты
		missile.vy = -8;
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
	function endGame(){
		gameOverMessage.visible = true;
		if(score < scoreNeededToWin){
			gameOverMessage.text = "Что-то захвачено!";
		} else {
			gameOverMessage.x = 120;
			gameOverMessage.text = "Что-то спасено!";
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
		}
		}
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
}());