function Vader() {
    canvas.addEventListener("click", vaderClick);
    this.vaderLeft = AM.getAsset("./img/vader_sprites_left - Copy.png");
    this.vaderRight = AM.getAsset('./img/vader_sprites_right')
    this.x = 800;
    this.y = 300;
    this.xDisplacement = -16;
    this.yDisplacement = 16;
    this.scale = 0.8;
    this.width = 50;
    this.height = 50;

    this.xAcceleration = 0;
    this.yAcceleration = 0;

// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.attack1Anim = new Animation(this.vaderLeft, 0, 320, 120, 80, 0.05, 13, false, false);
    this.attack2Anim = new Animation(this.vaderLeft, 0, 480, 120, 80, 0.05, 11, false, false);
    // this.idleAnim = new Animation(this.vaderLeft, 720, 160, 120, 80, 1, 2, true, false);
    this.idleAnim = new Animation(this.vaderLeft, 720, 160, 120, 80, 1, 2, true, false);
    this.jumpAnim = new Animation(this.vaderLeft, 0, 721, 120, 169, 0.2, 5, true, false);
    this.walkLeftAnim = new Animation(this.vaderLeft, 0, 940, 80, 80, 0.15, 8, true, false);
    this.attacking = false;
    this.switchAttack = true;
    this.jumping = false;
    this.movingRight = false;
    this.movingLeft = false;
    this.crouching = false;
    this.dropping = false;
    this.fullMCollisions = [];
    this.bottomMCollisions = [];
    this.collisionRight;
    this.collisionLeft;
    this.collisionTop;
    this.collisionBottom;
    this.tag = "player";
}

Vader.prototype = new Entity();
Vader.prototype.constructor = Vader;

Vader.prototype.getMapCollisions = function() {
    this.fullMCollisions = [];
    for (var i = 0; i < fullCollisions.length; i++) {
        let current = fullCollisions[i];
        if (this.x + this.xAcceleration < current.x + current.width && this.x + this.xAcceleration > current.x &&
            this.y + this.yAcceleration < current.y + current.height && this.y + this.yAcceleration > current.y) {
            var direction = [];
            if (this.y > current.y + current.height) {
                direction = "top";
            } else if (this.y + this.height > current.y) {
                direction = "bottom";
            }
            if (this.x + 1 >= current.x + current.width && this.x + this.xAcceleration <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 >= current.x && this.yAcceleration != 0) {
                direction = "right";
            } else if (this.x <= current.x  + 1 && this.x + this.xAcceleration <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 >= current.x) {
                direction = "left";
            }
            this.fullMCollisions.push({object: current, direction: direction});
        }
    }
    this.bottomMCollisions = [];
    for (var i = 0; i < bottomOnlyCollisions.length; i++) {
        let current = bottomOnlyCollisions[i];
        if (this.x + this.xAcceleration < current.x + current.width && this.x + this.xAcceleration > current.x && this.y + this.yAcceleration > current.y && 
            this.y + this.height > current.y && this.y + this.yAcceleration <= current.y + 10 && this.yAcceleration >= 0) {
            this.bottomMCollisions.push(bottomOnlyCollisions[i]);
        }
    }
}

Vader.prototype.getMapCollision = function(direction) {
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

Vader.prototype.update = function() {
    this.getMapCollisions();
    collisionRight = this.getMapCollision("right");
    collisionLeft = this.getMapCollision("left");
    collisionTop = this.getMapCollision("top");
    collisionBottom = this.getMapCollision("bottom");

    // stops movement if collision encountered
    if (collisionRight != null) {
        this.x = collisionRight.x + collisionRight.width + 1;
        this.xAcceleration = 0;
    } else if (collisionLeft != null) {
        this.x = collisionLeft.x - 1;
        this.xAcceleration = 0;
    }
    if (collisionTop != null) {
        this.yAcceleration = 0;
    } else if (collisionBottom != null) {
        if (collisionBottom instanceof BottomOnlyCollision && this.crouching && this.dropping) {
            this.yAcceleration += 0.4;
        } else {
            this.y = collisionBottom.y + 1;
            this.yAcceleration = 0;
        }
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
    if (gameEngine.w && collisionBottom != null) {
        this.yAcceleration -= 10;
    }
    if (gameEngine.d) {
        this.movingRight = true;
        this.movingLeft = false;
    }
    if (gameEngine.a) {
        this.movingRight = false;
        this.movingLeft = true;
    }
    if (gameEngine.s) {
        this.crouching = true;
    }
    if (gameEngine.spacebar) {
        this.dropping = true;
    }
    if (gameEngine.keyup) {
        if (gameEngine.keyReleased == 'd') {
            this.movingRight = false;
        } else if (gameEngine.keyReleased == 'a') {
            this.movingLeft = false;
        } else if (gameEngine.keyReleased == 's') {
            this.crouching = false;
        } else if (gameEngine.keyReleased == ' ') {
            this.dropping = false;
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

    if (this.x > 1150) {
        this.x = 1150;
    } else if (this.x < 1) {
        this.x = 1;
    }
}

Vader.prototype.draw = function() {
    if (collisionBottom == null) {
    // if (this.yAcceleration != 0) {
        this.jumpAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y - 80 + this.yDisplacement, this.scale);
    // } else if (this.xAcceleration != 0) {
        // this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y + this.yDisplacement, this.scale);
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
        this.idleAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y + this.yDisplacement, this.scale);
    }
}

function vaderClick(event) {
    var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
    audio.volume = sfxVolume * 0.2;
    audio.play();
    statusBars.update(0, -40);
    gameEngine.entities[0].attacking = true;
}
