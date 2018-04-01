var cons1 = {
	x: 0,
	y: 2
}

var cons2 = {
	z: 3,
	x: 3
}

cons1.__proto__ = cons2;

for (var key in cons1){
	console.log(key);
}