
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

function Crate(x, y) {
    this.x = x;
    this.y = y;
    this.center_x;
    this.center_y;
    this.width = 32;
    this.height = 32;
    this.mass = 1;
    this.health = 0;

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
    for (var i = 0; i < gameEngine.entities.length; i++) {
    	let current = gameEngine.entities[i];
        if (current != this) {
            if (current instanceof Crate) {
                if (this.x + this.xAcceleration <= current.x + current.width && this.x + this.xAcceleration + this.width >= current.x &&
                    this.y + this.yAcceleration + this.height <= current.y + current.height && this.y + this.yAcceleration + this.height >= current.y) {
                    this.y -= this.yAcceleration;
                    this.x -= this.xAcceleration;
                    if (this.y <= current.y && this.y + this.width + this.yAcceleration <= current.y + current.width && current.grabbed) {
                    	this.y--;
                    }
                	var tempXAcceleration = current.xAcceleration;
                	var tempYAcceleration = current.yAcceleration;
                	current.xAcceleration = this.xAcceleration * 0.6;
                	current.yAcceleration = this.yAcceleration * 0.6;
                	this.xAcceleration = tempXAcceleration * 0.6;
                	this.yAcceleration = tempYAcceleration * 0.6;
            	}
            } else if (!current.dead) {
                // if (this.x + this.xAcceleration <= current.x + current.width && this.x + this.xAcceleration + this.width >= current.x &&
                //     this.y + this.yAcceleration + this.height <= current.y + current.height && this.y + this.yAcceleration + this.height >= current.y) {
                // console.log("CRATE X,Y : " + this.x + ", " + this.y);
                // console.log("LUKE X,Y : " + current.x + ", " + current.y);
                if (!(current instanceof Luke) && this.x <= current.x + current.width + 16 && this.x >= current.x && this.y <= current.y + current.height && this.y + this.height >= current.y) {
                    // if (current instanceof Luke) {
                    //     console.log("HERE");
                    // }
                    this.y -= this.yAcceleration;
                    this.x -= this.xAcceleration;
                    current.y -= current.yAcceleration;
                    current.x -= current.xAcceleration;
                    var tempXAcceleration = current.xAcceleration;
                    var tempYAcceleration = current.yAcceleration;
                    if (Math.sqrt(this.xAcceleration * this.xAcceleration + this.yAcceleration * this.yAcceleration) > 10) {
                        if (current instanceof Luke) {
                            current.health -= 20;
                        } else {
                            current.health -= 400;
                        }
                    }
                    current.xAcceleration = this.xAcceleration * 0.6;
                    current.yAcceleration = this.yAcceleration * 0.6;
                    this.xAcceleration = tempXAcceleration * 0.6;
                    this.yAcceleration = tempYAcceleration * 0.6;
                } else if (current instanceof Luke) {
                    if (this.x <= current.x + current.currentDisplacementX && this.x >= current.x && this.y <= current.y + current.currentDisplacementY && this.y + this.currentDisplacementY >= current.y) {
                        // console.log("HERE2");
                    current.crateCollision = true;
                    // console.log(current.crateCollision);
                    this.y -= this.yAcceleration;
                    this.x -= this.xAcceleration;
                    current.y -= current.yAcceleration;
                    current.x -= current.xAcceleration;
                    var tempXAcceleration = current.xAcceleration;
                    var tempYAcceleration = current.yAcceleration;
                    if (Math.sqrt(this.xAcceleration * this.xAcceleration + this.yAcceleration * this.yAcceleration) > 10) {
                        if (current instanceof Luke) {
                            current.health -= 20;
                        } else {
                            current.health -= 400;
                        }
                    }
                    current.xAcceleration = this.xAcceleration * 0.6;
                    current.yAcceleration = this.yAcceleration * 0.6;
                    this.xAcceleration = tempXAcceleration * 0.6;
                    this.yAcceleration = tempYAcceleration * 0.6;
                    // console.log("TOP COLLISION");6
                    // current.y -= current.yAcceleration;\
                    } else if (Math.abs(current.yAcceleration) > 0.5) {
                        current.crateCollision = false;
                    }
                    // console.log(current.crateCollision);
                }
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

Crate.prototype.update = function() {
    // console.log(this.x);
    // console.log(this.center_x);
    // console.log(mouseX);
    this.center_x = this.x + this.width / 2;
    this.center_y = this.y + this.height / 2;

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

    if (gameEngine.keyup) {
        if (gameEngine.keyReleased == 'f') {
            this.grabbed = false;
            gameEngine.grabbing = false;
        }
    }

    if (this.grabbed) {
        var yMagnitude = (this.y - mouseY) / 600 + 0.4;
        var xMagnitude = (this.x - mouseX) / 500;
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
}