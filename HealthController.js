function HealthController() {
    
}

HealthController.prototype = new Entity();
HealthController.prototype.constructor = HealthController;

HealthController.prototype.collide = function(xDisplacement, yDisplacement, tag) {
    var collisions = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        let theTag = gameEngine.entities[i].tag;
        let current = gameEngine.entities[i];
        if (theTag == tag) {
            if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX &&
                this.y + yDisplacement < current.collisionY + current.collisionHeight && this.y + yDisplacement > current.collisionY) {
                var direction = [];
                if (this.y > current.collisionY + current.collisionHeight) {
                    direction = "top";
                } else if (this.y + this.height > current.collisionY) {
                    direction = "bottom";
                }
                if (this.x > current.collisionX + current.collisionWidth && this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX) {
                    direction = "right";
                } else if (this.x < current.collisionX && this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX) {
                    direction = "left";
                }
                collisions.push({entity: current, direction: direction});
            }
        }
    }
    // console.log(collisions);
    return collisions;
}

HealthController.prototype.getCollision = function(direction) {
    for(var i = 0; i < this.platformCollisions.length; i++) {
        if (this.platformCollisions[i].direction == direction) {
            return this.platformCollisions[i];
        }
    }
    return null;
}

HealthController.prototype.update = function() {
    this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");

    // stops movement if collision encountered
    if (this.getCollision("right") != null) {
        this.x = this.getCollision("right").entity.collisionX + this.getCollision("right").entity.collisionWidth + 2;
        this.xAcceleration = 0;
    } else if (this.getCollision("left") != null) {
        this.x = this.getCollision("left").entity.collisionX - 2;
        this.xAcceleration = 0;
    }
    if (this.getCollision("top") != null) {
        this.yAcceleration = 0;
    } else if (this.getCollision("bottom") != null) {
        this.y = this.getCollision("bottom").entity.collisionY + 1;
        this.yAcceleration = 0;
    } else {
        this.yAcceleration += 0.4;
    }

    // friction
    if (this.xAcceleration > 0) {
        this.xAcceleration -= 0.5;
        if (this.xAcceleration < 0) {
            this.xAcceleration = 0;
        }
    } else if (this.xAcceleration < 0) {
        this.xAcceleration += 0.5;
        if (this.xAcceleration > 0) {
            this.xAcceleration = 0;
        }
    }

    // movement
    if (gameEngine.w && this.getCollision("bottom") != null) {
        this.yAcceleration -= 13;
    }
    if (gameEngine.d) {
        this.movingRight = true;
        this.movingLeft = false;
    }
    if (gameEngine.a) {
        this.movingRight = false;
        this.movingLeft = true;
    }
    if (gameEngine.keyup) {
        if (gameEngine.keyReleased == 'd') {
            this.movingRight = false;
        } else if (gameEngine.keyReleased == 'a') {
            this.movingLeft = false;
        }
    }

    if (this.attack1Anim.isDone() || this.attack2Anim.isDone()) {
        this.attack1Anim.elapsedTime = 0;
        this.attack2Anim.elapsedTime = 0;
        this.attacking = false;
        this.switchAttack = !this.switchAttack;
    }

    if (this.movingLeft) {
        if (this.attacking) {
            this.xAcceleration -= 1;
        } else {
            if (this.yAcceleration == 0) {
                this.xAcceleration -= 1.5;
            } else {
                this.xAcceleration -= 1.5;
            }
        }
    } else if (this.movingRight) {
        if (this.attacking) {
            this.xAcceleration += 1;
        } else {
            if (this.yAcceleration == 0) {
                this.xAcceleration += 1.5;
            } else {
                this.xAcceleration += 1.5;
            }
        }
    }

    // speed limits
    if (this.xAcceleration > 7) {
        this.xAcceleration = 7;
    } else if (this.xAcceleration < -7) {
        this.xAcceleration = -7;
    }
    if (this.yAcceleration > 15) {
        this.yAcceleration = 15;
    } else if (this.yAcceleration < -15) {
        this.yAcceleration = -15;
    }

    this.y += this.yAcceleration;
    this.x += this.xAcceleration;

    if (this.x > 1100) {
        this.x = 1100;
    } else if (this.x < 40) {
        this.x = 40;
    }
}

HealthController.prototype.draw = function() {
    if (this.getCollision("bottom") == null) {
        this.jumpAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 80, 1);
    } else {
        this.idleAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    }
}