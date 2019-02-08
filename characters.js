function Vader() {
    canvas.addEventListener("click", vaderClick);
    this.spritesheet = AM.getAsset("./img/vader_sprites_left - Copy.png");
    this.x = 600;
    this.y = 400;
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
}

Vader.prototype = new Entity();
Vader.prototype.constructor = Vader;

Vader.prototype.collide = function(xDisplacement, yDisplacement, tag) {
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i]; 
        if (current.tag == tag) {
            if (this.x + xDisplacement < current.x + current.width && this.x + xDisplacement > current.x &&
                this.y + yDisplacement< current.y + current.height && this.y + yDisplacement > current.y) {
                return true;
            }
        }
    }
}

Vader.prototype.collideTop = function(xDisplacement, yDisplacement, tag) {
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i]; 
        if (current.tag == tag) {
            if (this.x + xDisplacement < current.x + current.width && this.x + xDisplacement > current.x &&
                this.y + yDisplacement< current.y + current.height && this.y + yDisplacement > current.y) {
                if (this.y > current.y + current.height) {
                    return true;
                }
            }
        }
    }
    return false;
} 

Vader.prototype.collideBottom = function(xDisplacement, yDisplacement, tag) {
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i]; 
        if (current.tag == tag) {
            if (this.x + xDisplacement < current.x + current.width && this.x + xDisplacement > current.x &&
                this.y + yDisplacement< current.y + current.height && this.y + yDisplacement > current.y) {
                if (this.y + this.height > current.y) {
                    console.log("COLLOSION");
                    return true;
                }
            }
        }
    }
    return false;
} 

Vader.prototype.collideLeft = function(xDisplacement, yDisplacement, tag) {

} 

Vader.prototype.collideRight = function(xDisplacement, yDisplacement, tag) {

} 

Vader.prototype.update = function() {
    var platformCollisionTop = this.collideTop(this.xAcceleration, this.yAcceleration, "Platform");
    var platformCollisionBottom = this.collideBottom(this.xAcceleration, this.yAcceleration, "Platform");
    var platformCollisionLeft = this.collideTop(this.xAcceleration, this.yAcceleration, "Platform");
    var platformCollisionRight = this.collideTop(this.xAcceleration, this.yAcceleration, "Platform");
    if (platformCollisionTop) {
        this.yAcceleration = 0;
    }
    if (platformCollisionBottom) {
        this.yAcceleration = 0;
    } else {
        this.yAcceleration += 0.5;
    }
    // if (!this.collide(0, 1, "Platform")) {
    //     this.yAcceleration += 0.5;
    // } else {
    //     this.yAcceleration = 0;
    // }
    if (this.xAcceleration > 0) {
        this.xAcceleration--;
    } else if (this.xAcceleration < 0) {
        this.xAcceleration++;
    }
    
    if (gameEngine.w) {
        if (this.collide(0, 1, "Platform")) {
            this.yAcceleration -= 15;
        }
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
        // var totalHeight = 200;
        // var jumpDistance = this.jumpAnim.elapsedTime / this.jumpAnim.totalTime;
        // if (jumpDistance > 0.5) {
        //     jumpDistance = 1 - jumpDistance;
        // }x
        // var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        // this.y = 500 - height;
    }

    if (this.movingLeft) {
        // if (!this.collide(-4, 0, "Platform")) {
            if (this.attacking) {
                this.xAcceleration -= 2;
            } else {
                this.xAcceleration -= 2;
            }
        // }
    } else if (this.movingRight) {
        // if (!this.collide(4, 0, "Platform")) {
            if (this.attacking) {
                this.xAcceleration += 2;
            } else {
                this.xAcceleration += 2;
            }
        // }
    }

    if (this.xAcceleration > 10) {
        console.log("ACCELERATION MAXED");
        this.xAcceleration = 10;
    } else if (this.xAcceleration < -10) {
        this.xAcceleration = -10;
    }
    if (this.yAcceleration > 20) {
        this.yAcceleration = 20;
    }
    this.y += this.yAcceleration;
    this.x += this.xAcceleration;
    if (this.x > 1200) {
        this.x = 0;
    } else if (this.x < 0) {
        this.x = 1200;
    }
}

Vader.prototype.draw = function() {
    if (!this.collide(0, 1, "Platform")) {
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