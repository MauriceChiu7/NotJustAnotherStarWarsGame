// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

// var ASSET_MANAGER = new AssetManager();
// var context;
// var ctx;
// var canvas;
var mousedownID = -1;
var xMouse;
var yMouse;

// ASSET_MANAGER.queueDownload("./img/mapAssets1.png");
// ASSET_MANAGER.queueDownload("./img/background2.png");
// ASSET_MANAGER.queueDownload("./img/background.png");

// ASSET_MANAGER.downloadAll(function () {
    // console.log("starting up da sheild");
    // canvas = document.getElementById('gameWorld');
    // ctx = canvas.getContext('2d');
    // ctx = canvas.getContext('2d');

    // var gameEngine = new GameEngine();
    // fullCollisions = [];
    // bottomOnlyCollisions = [];
    // new FullCollision(0, 554, 922, 45); // Ground floor left
    // new FullCollision(1034, 554, 200, 45); // Ground floor right
    // new FullCollision(-10, -110, 1220, 110); // Ceiling
    // new BottomOnlyCollision(800, 62, 255); // Small top left
    // new BottomOnlyCollision(1120, 62, 90); // Small top right
    // new BottomOnlyCollision(1032, 142, 110); // Small middle
    // new BottomOnlyCollision(-100, 226, 1310); // Main divider
    // new BottomOnlyCollision(315, 331, 291); // Upper hanging platform
    // new BottomOnlyCollision(315, 423, 291); // Lower hanging platform
    // new BottomOnlyCollision(0, 494, 250); // Throne platform



    

    // gameEngine.init(ctx);
    // gameEngine.start();
    // canvas.addEventListener('mousemove', menuMouseMove);
    // canvas,addEventListener('mousedown', mouseDownEvent);
// });

function menuMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    xMouse = event.clientX - rect.left;
    yMouse = event.clientY - rect.top;
}

function mouseDownEvent(event) {
    var rect = canvas.getBoundingClientRect();
    xMouse = event.clientX - rect.left;
    yMouse = event.clientY - rect.top;
}

// var fullCollisions = [];
// var bottomOnlyCollisions = [];

// function FullCollision(x, y, width, height) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//     fullCollisions.push(this);
// }

// function BottomOnlyCollision(x, y, width) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     bottomOnlyCollisions.push(this);
// }

function distance(a, b) {  // Not being used. Maybe
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function pointsDistance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
}

//distance(this, other) < this.radius + other.radius;

function Crate(game, x, y, player) {
    this.x = x;
    this.y = y;
    this.center_x;
    this.center_y;
    this.width = 32;
    this.height = 32;
    this.isPlayer = player;
    this.toggleColor = 0;
    this.game = game;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.currentDisplacementX = this.width;
    this.currentDisplacementY = this.height;
    this.spriteSheet = AM.getAsset("./img/mapAssets1.png");

    this.moving = false;
    this.fullMCollisions = [];
    this.bottomMCollisions = [];
    this.grabbed = false;
}

Crate.prototype = new Entity();
Crate.prototype.constructor = Crate;

Crate.prototype.getMapCollisions = function () {
    this.fullMCollisions = [];
    // console.log("X ACCEL: " + this.xAcceleration + " Y ACCEL: " + this.yAcceleration);
    for (var i = 0; i < fullCollisions.length; i++) {
        let current = fullCollisions[i];
        if (this.x + this.xAcceleration < current.x + current.width && this.x + this.xAcceleration + this.width > current.x &&
            this.y + this.yAcceleration + this.height < current.y + current.height && this.y + this.yAcceleration + this.height > current.y) {
            var direction = [];
            if (this.y + this.height + 1 > current.y + current.height) {
                direction = "top";
            } else if (this.y + this.height > current.y) {
                direction = "bottom";
            }
            if (this.x >= current.x + current.width + 5 && this.x + this.xAcceleration <= current.x + current.width + 5) {
                direction = "right";
            } else if (this.x + this.width <= current.x + 1 && this.x + this.xAcceleration + this.width <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 + this.width >= current.x) {
                direction = "left";
            }
            this.fullMCollisions.push({ object: current, direction: direction });
        }
    }
    for (var i = 0; i < this.game.entities.length; i++) {
    	let current = this.game.entities[i];
    	if (current != this) {
	        if (this.x + this.xAcceleration <= current.x + current.width && this.x + this.xAcceleration + this.width >= current.x &&
	            this.y + this.yAcceleration + this.height <= current.y + current.height && this.y + this.yAcceleration + this.height >= current.y) {
	            this.y -= this.yAcceleration;
	            this.x -= this.xAcceleration;
	            if (this.y <= current.y && this.y + this.width + this.yAcceleration <= current.y + current.width && current.grabbed) {
	            	this.y--;
	            }
	        	var tempXAcceleration = current.xAcceleration;
	        	var tempYAcceleration = current.yAcceleration;
	        	if (Math.abs(this.xAcceleration) > 10 || Math.abs(this.yAcceleration) > 10 || Math.abs(tempXAcceleration) > 10 || Math.abs(tempYAcceleration) > 10) { 
	        		this.toggleColor = (this.toggleColor + 1) % 3;
	        		current.toggleColor = (current.toggleColor + 1) % 3;
	        	}
	        	current.xAcceleration = this.xAcceleration * 0.6;
	        	current.yAcceleration = this.yAcceleration * 0.6;
	        	this.xAcceleration = tempXAcceleration * 0.6;
	        	this.yAcceleration = tempYAcceleration * 0.6;
	    	}
	    }
    }
    this.bottomMCollisions = [];
    if (!this.grabbed) {
        for (var i = 0; i < bottomOnlyCollisions.length; i++) {
            let current = bottomOnlyCollisions[i];
            if (this.x + this.xAcceleration + this.width < current.x + current.width && this.x + this.xAcceleration + this.width > current.x && this.y + this.yAcceleration + this.height > current.y &&
                this.y + this.height * 2 > current.y && this.y + this.yAcceleration + this.height <= current.y + 20 && this.yAcceleration >= 0) {
                this.bottomMCollisions.push(bottomOnlyCollisions[i]);
            }
        }
    }
}

Crate.prototype.getMapCollision = function (direction) {
    for (var i = 0; i < this.fullMCollisions.length; i++) {
        if (this.fullMCollisions[i].direction == direction) {
            return this.fullMCollisions[i].object;
        }
    }
    if (direction == "bottom") {
        if (this.bottomMCollisions.length > 0) {
            return this.bottomMCollisions[i];
        }
    }
    return null;
}

Luke.prototype.push = function() {
    var delta_x = (xMouse - this.center_x);
    var delta_y = (yMouse - this.center_y);
    var hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
    var angle = Math.asin(delta_x / hypotenuse);
    var xMagnitude = Math.sin(angle) * 400;
    var yMagnitude;
    if (delta_y < 0) {
   		yMagnitude = -Math.cos(angle) * 400;
   	} else {
		yMagnitude = Math.cos(angle) * 400;
   	}
    var pushDistance = pointsDistance(this.center_x, this.center_y, this.center_x + xMagnitude, this.center_y + yMagnitude);
    for (var i = 0; i < this.game.entities.length; i++) {
        var current = this.game.entities[i];
        if (current != this && current instanceof Crate) {
        	var distToCurrent = pointsDistance(this.center_x, this.center_y, current.center_x, current.center_y);
        	var distCurrentToMag = pointsDistance(current.center_x, current.center_y, this.center_x + xMagnitude, this.center_y + yMagnitude);
	        var sumDistance = distToCurrent + distCurrentToMag;
	        // if (sumDistance + 50 >= pushDistance && sumDistance - 50 <= pushDistance) {
	        // 	accelModifier = (1 - distToCurrent / pushDistance);
	        // 	if (accelModifier > 0) {
		       //  	current.xAcceleration += xMagnitude * accelModifier * 0.1;
	        // 		current.yAcceleration += yMagnitude * accelModifier * 0.1;
	        // 	}
	        // }

            var delta_x2 = (current.center_x - this.center_x);
    		var delta_y2 = (current.center_y - this.center_y);
    		var hypotenuse2 = Math.sqrt((delta_x2 * delta_x2) + (delta_y2 * delta_y2));
    		var angle2 = Math.asin(delta_x2 / hypotenuse2);
    		console.log(angle);
    		console.log(angle2);
	        if (sumDistance + 50 >= pushDistance && sumDistance - 50 <= pushDistance) {
	        	accelModifier = (1 - distToCurrent / pushDistance);
	        	if (accelModifier > 0) {
		        	current.xAcceleration += xMagnitude * accelModifier * 0.1 * (1 + (angle2 - angle));
	        		current.yAcceleration += yMagnitude * accelModifier * 0.1 * (1 - (angle2 - angle));
	        	}
	        }
    	}
    }
}

Crate.prototype.update = function() {
    this.center_x = (this.x + this.width / 2);
    this.center_y = (this.y + this.height / 2);

    this.getMapCollisions();
    collisionRight = this.getMapCollision("right");
    collisionLeft = this.getMapCollision("left");
    collisionTop = this.getMapCollision("top");
    collisionBottom = this.getMapCollision("bottom");
    if (collisionBottom != null) {
    	if (this.yAcceleration > 2) {
			this.yAcceleration = -this.yAcceleration * 0.4;
    	} else {
            this.y = collisionBottom.y + 1 - this.width;
            this.yAcceleration = 0;
    	}
    } else {
        this.yAcceleration += 0.4;
    }

    if (collisionTop != null) {
    	if (this.yAcceleration < 2) {
        	this.yAcceleration = -this.yAcceleration * 0.4;
        } else {
        	this.y = collisionTop.y + collisionTop.height + 1;
        }
    }
    
    if (collisionLeft != null) {
    	if (this.xAcceleration > 2) {
        	this.xAcceleration = -this.xAcceleration * 0.4;
        } else {
        	this.x = collisionLeft.x - this.width - 5;
        }
    } else if (collisionRight != null) {
    	if (this.xAcceleration < -2) {
        	this.xAcceleration = -this.xAcceleration * 0.4;
        } else {
        	this.x = collisionRight.x + collisionRight.width + 5;
        }
    }

    if (this.game.keyup) {
        if (this.game.keyReleased == 'f') {
            this.grabbed = false;
            this.game.grabbing = false;
        }
    }

    if (this.grabbed) {
        var yMagnitude = (this.y - yMouse) / 600 + 0.4;
        var xMagnitude = (this.x - xMouse) / 500;
        this.yAcceleration -= yMagnitude;
        this.xAcceleration -= xMagnitude;
        if (this.xAcceleration > 0) {
            this.xAcceleration -= 0.1;
        } else {
            this.xAcceleration += 0.1;
        }
    }

    var speed = Math.sqrt(this.xAcceleration * this.xAcceleration + this.yAcceleration * this.yAcceleration);
    if (speed > 20) {
        var ratio = 20 / speed;
        this.xAcceleration *= ratio;
        this.yAcceleration *= ratio;
    };

	this.y += this.yAcceleration;
    this.x += this.xAcceleration;

    if (this.x <= 0 || this.x + this.width >= 1200) {
    	if (this.x <= 0) {
    		this.x += 10;
    	} else {
    		this.x -= 10;
    	}
        this.xAcceleration = -this.xAcceleration * 0.6;
    } else if (!this.grabbed) {
        if (this.xAcceleration > 0) {
        	if (collisionBottom != null) {
         	   this.xAcceleration -= 0.25;
        	} else {
        		this.xAcceleration -= 0.1;
        	}
            if (this.xAcceleration < 0) {
                this.xAcceleration = 0;
            }
        } else if (this.xAcceleration < 0) {
        	if (collisionBottom != null) {
         	   this.xAcceleration += 0.25;
        	} else {
        		this.xAcceleration += 0.1;
        	}
            if (this.xAcceleration > 0) {
                this.xAcceleration = 0;
            }
        }
    }
}

Crate.prototype.draw = function() {
    ctx.drawImage(this.spriteSheet,
        160, 125,  // source from sheet
        64, 64,
        this.x, this.y,
        this.width,
        this.height);
    ctx.beginPath();
    if (this.isPlayer) {
        ctx.fillStyle = "Green";
    } else if (this.toggleColor == 0) {
        ctx.fillStyle = "Blue";
    } else if (this.toggleColor == 1) {
    	ctx.fillStyle = "Red";
    } else {
    	ctx.fillStyle = "Yellow";
    }
    ctx.arc(this.x + 16, this.y + 18, 5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}