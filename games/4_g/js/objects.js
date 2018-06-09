var spriteObject = {
	x: 0,
	y: 0,
	width: 64,
	height: 64,
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 64,
	sourceHeight: 64,
	speed: 3,
	rotationSpeed: 0.3,
	name: undefined,
	hp: false,
	centerX: function(){
		return this.x+(this.width/2);
	},
	centerY: function(){
		return this.y+(this.height/2);
	},
	halfWidth: function(){
		return this.width/2;
	},
	halfHeight: function(){
		return this.height/2;
	}
};

var messageObject = {
	x: 0,
	y: 0,
	visible: true,
	text: "",
	font: "normal bold 20px Helvetica",
	fillStyle: "red",
	textBaseline: "top"
};

var alienObject = Object.create(spriteObject);
alienObject.sourceX = 64;
alienObject.NORMAL = 1;
alienObject.EXPLODED = 2;
alienObject.rotation = 0;
alienObject.friction = 0.96;
alienObject.hp = true;
alienObject.name = "alien";
alienObject.state = alienObject.NORMAL;
alienObject.range = 300;
alienObject.update = function(){
	this.sourceX = this.state * this.width;
};
