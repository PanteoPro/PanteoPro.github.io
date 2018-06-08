var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var spriteImage = new Image();
spriteImage.addEventListener("load", loadHandler);
spriteImage.src = "SomeSprite.png";
function loadHandler(){
	ctx.drawImage(spriteImage,sourceX,sourceY,sourceWidth,sourceHeight,x,y,width,height);
}


// Первая Игра
// 1) Объект спрайта
// 2) Игровой Таймер
// 3) Функция по загрузке изображений
// 4) Функция render
// 5) Обработка событий

// Вторая игра