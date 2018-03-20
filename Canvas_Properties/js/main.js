window.onload = function(){
	var canvas = document.querySelector("#canvas1");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			ctx.fillStyle = "#4141ca";
			ctx.fillRect(0,0,canvas.width, canvas.height);
		}
	}

	var canvas = document.querySelector("#canvas2");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			ctx.fillStyle = "#418a9c";
			ctx.fillRect(0,0,canvas.width, canvas.height);

			ctx.fillStyle = "green";
			ctx.fillRect(20,20,100,100);

			ctx.lineWidth = 10;
			ctx.strokeStyle = "blue";
			ctx.strokeRect(20,20,100,100);

			ctx.strokeStyle = "red";
			ctx.strokeRect(140,20,100,100);

			ctx.fillStyle = "grey";
			ctx.fillRect(260,20,100,100);

			ctx.fillStyle = "pink";
			ctx.fillRect(380,20,100,100);

			ctx.strokeStyle = "purple";
			ctx.strokeRect(380,20,100,100);

			ctx.lineWidth = 5;
			ctx.strokeStyle = "red";
			ctx.strokeRect(405,45,50,50);
		}
	}

	var canvas = document.querySelector("#canvas3");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			ctx.fillStyle = "#418a9c";
			ctx.fillRect(0,0,canvas.width, canvas.height);

			ctx.clearRect(40,20,canvas.width-80,20);
			ctx.strokeStyle = "#3cfac9";
			

			ctx.lineWidth = 15;
			ctx.lineCap = "butt";
			ctx.beginPath();
			ctx.moveTo(40,60);
			ctx.lineTo(canvas.width-40,60);
			ctx.stroke();

			ctx.lineWidth = 10;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(40,80);
			ctx.lineTo(canvas.width-40,80);
			ctx.stroke();

			ctx.lineWidth = 8;
			ctx.lineCap = "square";
			ctx.beginPath();
			ctx.moveTo(40,100);
			ctx.lineTo(canvas.width-40,100);
			ctx.stroke();

			ctx.lineCap = "butt";
			ctx.lineWidth = 10;

			ctx.lineJoin = "round";
			ctx.beginPath();
			ctx.moveTo(40,200);
			ctx.lineTo(60,140);
			ctx.lineTo(80,200);
			ctx.stroke();

			ctx.lineJoin = "bevel";
			ctx.beginPath();
			ctx.moveTo(100,200);
			ctx.lineTo(120,140);
			ctx.lineTo(140,200);
			ctx.stroke();

			ctx.lineJoin = "miter";
			ctx.beginPath();
			ctx.moveTo(160,200);
			ctx.lineTo(180,140);
			ctx.lineTo(200,200);
			ctx.stroke();
		}
	}

	var canvas = document.querySelector("#canvas4");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			ctx.fillStyle = "#c1c23c";
			ctx.fillRect(20,20,100,100);

			ctx.save();

			ctx.fillStyle = "#9919cc";
			ctx.fillRect(140,20,100,100);

			ctx.restore();

			ctx.fillRect(260,20,100,100);
		}
	}

	var canvas = document.querySelector("#canvas5");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			ctx.strokeStyle = "blue";
			ctx.fillStyle = "red";
			ctx.lineWidth = 5;

			ctx.beginPath();
			ctx.arc(100,100,80,0, 1.2 * Math.PI,false);
			ctx.fill();
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(350,100,80,0, 1.2 * Math.PI,false);
			ctx.fill();
			ctx.stroke();
		}
	}

	var canvas = document.querySelector("#canvas6");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			ctx.strokeStyle = "#c1c3ac";
			ctx.lineWidth = 10;

			ctx.beginPath()
			ctx.moveTo(40,40);
			ctx.bezierCurveTo(40,120,120,-20,120,40);
			ctx.stroke();

			ctx.beginPath()
			ctx.moveTo(150,40);
			ctx.quadraticCurveTo(170,-40,300,220);
			ctx.stroke();
		}
	}

	var canvas = document.querySelector("#canvas7");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){

			ctx.fillText("Hello World!", 20, 20);

			ctx.font = "30px Impact";
			var hw = "Hello World!";
			ctx.fillText(hw, 20, 50);

			ctx.textBaseline = "bottom";
			ctx.textAlign = "center";
			ctx.fillStyle = "#8391ca";
			ctx.fillText(hw, canvas.width/2, 80);
			ctx.strokeText(hw, canvas.width/2, 110);

			ctx.textBaseline = "alphabetic";
			ctx.textAlign = "start";
			ctx.strokeText(hw, canvas.width/2, 140);
			ctx.fillText(hw, canvas.width/2, 140);

			var textW = ctx.measureText(hw);
			ctx.beginPath();
			ctx.strokeStyle = "black";
			ctx.moveTo(canvas.width/2,150);
			ctx.lineTo(canvas.width/2 + textW.width, 150);
			ctx.stroke();
		}
	}

	var canvas = document.querySelector("#canvas8");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			ctx.shadowColor = "#231313";
			ctx.shadowOffsetX = -5;
			ctx.shadowOffsetY = -5;
			ctx.shadowBlur = 5;

			ctx.fillStyle = "blue";
			ctx.fillRect(20,20,100,80);
			ctx.fillRect(140,20,20,20);

			ctx.font = "40px Impact";
			ctx.fillText("Hello",20,150);
		}
	}

	var canvass = document.querySelector("#canvas9");
	if(canvass && canvass.getContext){
		var ctxx = canvass.getContext("2d");
		if(ctxx){
			var patImg = new Image();
			patImg.onload = function(){
				ctxx.fillStyle = ctxx.createPattern(patImg, "repeat");
				ctxx.fillRect(0,0,150,canvass.height);

				setTimeout(function(){
					var vid = document.querySelector("#vidCanvas");
					var vidPat = ctxx.createPattern(vid, "repeat");
					ctxx.fillStyle = vidPat;
					ctxx.fillRect(150,0,150,canvass.height);
				},1200);

				var patCanvas = document.querySelector("#patCanvas9");
				if(patCanvas && patCanvas.getContext){
					var patCtx = patCanvas.getContext("2d");
					if(patCtx){
						patCtx.strokeStyle = "red";
						patCtx.lineWidth = 1;
						patCtx.beginPath();
						patCtx.moveTo(0,0);
						patCtx.lineTo(patCanvas.width, patCanvas.height);
						patCtx.stroke();

						ctxx.strokeStyle = ctxx.createPattern(patCanvas, "repeat");
						ctxx.lineWidth = 30;
						ctxx.strokeRect(300,0,150,canvass.height);
					}
				}
			}
			patImg.src = "img/sprites.png";
		}
	}

	var canvas = document.querySelector("#canvas10");
	if(canvas && canvas.getContext){
		var ctx = canvas.getContext("2d");
		if(ctx){
			var linGrd = ctx.createLinearGradient(0,0,canvas.width/2,canvas.height);
			linGrd.addColorStop(0, "#f00");
			linGrd.addColorStop(0.5, "#00f");
			linGrd.addColorStop(1, "#0f0");

			ctx.fillStyle = linGrd;
			ctx.fillRect(0,0,canvas.width/2,canvas.height);

			var radGrd = ctx.createRadialGradient(canvas.width/2+canvas.width/4,canvas.height/2,30,canvas.width/2+canvas.width/4,canvas.height/2,125);
			radGrd.addColorStop(0, "#f00");
			radGrd.addColorStop(0.5, "#00f");
			radGrd.addColorStop(1, "#0f0");
			ctx.fillStyle = radGrd;

			ctx.beginPath()
			ctx.arc(canvas.width/2+canvas.width/4,canvas.height/2,125,0,Math.PI * 2);
			ctx.fill();
		}
	}
}