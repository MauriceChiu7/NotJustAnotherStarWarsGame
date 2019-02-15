function Vader() {
    canvas.addEventListener("click", vaderClick);
    this.spritesheet = AM.getAsset("./img/vader_sprites_left - Copy.png");
    this.x = 600;
    this.y = 300;
    this.width = 50;
    this.height = 50;
    this.xAcceleration = 0;
    this.yAcceleration = 0;

// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.attack1Anim = new Animation(this.spritesheet, 0, 320, 120, 80, 0.05, 13, false, false);
    this.attack2Anim = new Animation(this.spritesheet, 0, 480, 120, 80, 0.05, 11, false, false);
    // this.idleAnim = new Animation(this.spritesheet, 720, 160, 120, 80, 1, 2, true, false);
    this.idleAnim = new Animation(this.spritesheet, 720, 160, 120, 80, 1, 2, true, false);
    this.jumpAnim = new Animation(this.spritesheet, 0, 720, 120, 169, 0.2, 5, true, false);
    this.walkLeftAnim = new Animation(this.spritesheet, 0, 940, 80, 80, 0.15, 8, true, false);
    this.attacking = false;
    this.switchAttack = true;
    this.jumping = false;
    this.movingRight = false;
    this.movingLeft = false;
    this.platformCollisions = [];
}

Vader.prototype = new Entity();
Vader.prototype.constructor = Vader;

Vader.prototype.collide = function(xDisplacement, yDisplacement, tag) {
    var collisions = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i]; 
        if (current.tag == tag) {
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

Vader.prototype.getCollision = function(direction) {
    for(var i = 0; i < this.platformCollisions.length; i++) {
        if (this.platformCollisions[i].direction == direction) {
            return this.platformCollisions[i];
        }
    }
    return null;
}

Vader.prototype.update = function() {
    this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");

    // stops movement if collision encountered
    if (this.getCollision("right") != null) {
        this.x = this.getCollision("right").entity.collisionX + this.getCollision("right").entity.collisionWidth + 2;
        this.xAcceleration = 0;
    } else if (this.getCollision("left") != null) {
        this.x = this.getCollision("left").entity.collisionWidth - 2;
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

    if (this.jumpAnim.isDone()) {
        this.jumpAnim.elapsedTime = 0;
        this.jumping = false;
    }

    if (this.jumping) {
        var totalHeight = 200;
        var jumpDistance = this.jumpAnim.elapsedTime / this.jumpAnim.totalTime;
        if (jumpDistance > 0.5) {
            jumpDistance = 1 - jumpDistance;
        }
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = 500 - height;
    }

    if (this.movingLeft) {
        if (this.attacking) {
            this.xAcceleration -= 1;
        } else {
            this.xAcceleration -= 1.5;    
        }
    } else if (this.movingRight) {
        if (this.attacking) {
            this.xAcceleration += 1;
        } else {
            this.xAcceleration += 1.5;
        }
    }

    // if (this.attack1Anim.isDone() || this.attack2Anim.isDone()) {
    //     this.attack1Anim.elapsedTime = 0;
    //     this.attack2Anim.elapsedTime = 0;
    //     this.attacking = false;
    //     this.switchAttack = !this.switchAttack;
    // }

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

Vader.prototype.draw = function() {
    if (this.getCollision("bottom") == null) {
    // if (this.yAcceleration != 0) {
        this.jumpAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 80, 1);
    // }
    // if (this.attacking) {
    //     if (this.switchAttack) {
    //         this.attack1Anim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    //     } else {
    //         this.attack2Anim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    //     }
    // } else if (this.jumping) {
    //     this.jumpAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 80, 1);
    // } else if (this.movingLeft) {
    //     this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    } else {
        this.idleAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    }
}

function vaderClick(event) {
    var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
    audio.volume = sfxVolume * 0.2;
    audio.play();
    statusBars.update(0, -40);
    gameEngine.entities[0].attacking = true;
}
