function hitTestRectangle(r1, r2)
{
	//Переменная для обнаружения факта пересечения спрайтов
	var hit = false;
	//Вычисление ширины и высоты вектора
	var vx = r1.centerX() - r2.centerX();
	var vy = r1.centerY() - r2.centerY();
	//Вычисление полуширины и полувысоты
	var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
	var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();
	//Проверка условия пересечения по оси X
	if(Math.abs(vx) < combinedHalfWidths){
		//Пересечение возможно. Проверка условия пересечения по оси Y
		if(Math.abs(vy) < combinedHalfHeights){
			//Пересечение есть
			hit = true;
		}
		else{
			//По оси Y нет пересечения
			hit = false;
		}
	} else {
		//По оси X нет пересечения
		hit = false;
	}
	return hit;
}