var D = [0,1];
var M = [-1,1];

var DObzor = 89;

function normal(array){
	var bufArray = array.slice();
	for(var i = 0; i < array.length; i++){
		var sqrt = Math.sqrt(Math.pow(bufArray[0],2)+Math.pow(bufArray[1],2));
		array[i] = bufArray[i]/sqrt;	
	}
}

normal(D);
normal(M);

res = (Math.acos(D[0]*M[0]+D[1]*M[1]) * (360/(Math.PI*2))).toFixed()

if(M[0] < 0)
	res = -res;



console.log(res);
if(res < 0 && -res <= DObzor/2){
	console.log("true");
}
else if(res > 0 && res <= DObzor/2){
	console.log("true");
} else {
	console.log("false");
}