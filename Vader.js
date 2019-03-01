function Vader() {
    canvas.addEventListener("click", vaderClick);
    this.vaderLeft = AM.getAsset("./img/vader_sprites_left - Copy.png");
    this.vaderRight = AM.getAsset('./img/vader_sprites_right')
    this.x = 900;
    this.y = 100;
    this.xDisplacement = -16;
    this.yDisplacement = 16;
    this.scale = 0.8;
    this.width = 50;
    this.height = 50;
    this.game = gameEngine;
    this.health = 1000;

    this.xAcceleration = 0;
    this.yAcceleration = 0;

// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.attack1Anim = new Animation(this.vaderLeft, 0, 320, 120, 80, 0.05, 13, false, false);
    this.attack2Anim = new Animation(this.vaderLeft, 0, 480, 120, 80, 0.05, 11, false, false);
    // this.idleAnim = new Animation(this.vaderLeft, 720, 160, 120, 80, 1, 2, true, false);
    this.idleAnim = new Animation(this.vaderLeft, 720, 160, 120, 80, 1, 2, true, false);
    this.jumpingLeftAnim = new Animation(this.vaderLeft, 0, 721, 120, 169, 0.2, 5, true, false);
    this.walkLeftAnim = new Animation(this.vaderLeft, 0, 940, 80, 80, 0.15, 8, true, false);
    this.jumpingRightAnim = new Animation(this.vaderRight, 0, 120, 169, 0.2, 5, false);
    this.attacking = false;
    this.switchAttack = true;
    this.jumping = false;
    this.movingRight = false;
    this.movingLeft = false;
    //this.crouching = false;
    this.dropping = false;
    this.fullMCollisions = [];
    this.bottomMCollisions = [];
    // this.collisionRight;
    // this.collisionLeft;
    // this.collisionTop;
    // this.collisionBottom;
    this.updateCount = null;
    this.tag = "enemy";
}

Vader.prototype = new Entity();
Vader.prototype.constructor = Vader;

Vader.prototype.update = function() {
    this.getMapCollisions();
    var collisionRight = this.getMapCollision("right");
    var collisionLeft = this.getMapCollision("left");
    var collisionTop = this.getMapCollision("top");
    var collisionBottom = this.getMapCollision("bottom");
    if (!this.updateCount ) this.findPlayer(); //will just run once
    this.updateCount = 1;

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
        if (collisionBottom instanceof BottomOnlyCollision ) {
            this.yAcceleration += 0.4;
        } else {
            this.y = collisionBottom.y + 1;
            this.yAcceleration = 0;
        }
    } else {
        this.yAcceleration += 0.4;
    }
    console.log("bottom :" + collisionBottom);

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
    if (this.distance > 105 && this.player.y - this.y == 0) { // player on the right
        this.xAcceleration +=1;
        this.block = false;
        this.attack = false;
        this.jumping = false;
        this.hurting = false;
        this.dead = false;
     } else if (this.distance < -105 && this.player.y - this.y == 0) { //player on the left
        this.xAcceleration -=1;
        this.block = false;
        this.attack = false;
        this.jumping = false;
        this.hurting = false;
        this.dead = false;
     } else if (this.distance > 0 && this.player.y - this.y > 0) {// player is lower && on the right
        this.xAcceleration +=1;
        this.block = false;
        this.attack = false;
        this.jumping = false;
        //this.hurting = false;
     } else if (this.distance < -0 && this.player.y - this.y > 0) {// player is lower && on the left
        this.xAcceleration -=1;
        this.block = false;
        this.attack = false;
        this.jumping = false;
     } else if (!this.block && !this.attack && Math.abs(this.player.y - this.y) < 40
        && Math.abs(this.distance) < 105 && collisionBottom != null) {
  
        this.chanceToBlock = Math.round(Math.random() * 5); this.blocking = false; this.attack = false; this.jumping = false;
        if (this.chanceToBlock === 1) {
           this.block = true;
        } else if (this.chanceToBlock === 0) {
           this.attack = true;
        }
        if (this.player.attacking) {
           // this.blocking =false;
           this.chanceToBlock = -1;
           this.hurting = true;
           this.lives--;
           if (this.lives === 0) {
              this.dead = true;
           }
        }
     } else if (this.player.y - this.y < -100 && collisionBottom != null) { // player is higher
        var collisionCheck = this.getMapCollisions2(this.x, this.y - 13);
        var canJump = true;
        for (var i = 0; i < collisionCheck.length; i++) {
           if (collisionCheck[i].direction == "bottom") {
                 canJump = false;
           }
        }
        if (canJump) {
           this.jumping = true;
           this.yAcceleration -= 13;
           if (this.distance > 0) {
              this.xAcceleration ++;
           } else if (this.distance < 0) {
              this.xAcceleration --;
           }
        }
        this.block = false;
        this.attack = false;
        this.hurting = false;
        this.dead = false;    
        // console.log(this.jumping);
        if (this.jumpingRightAnim.isDone() || this.jumpingLeftAnim.isDone()) {
           this.jumpingRightAnim.elapsedTime = 0;
           this.jumpingLeftAnim.elapsedTime = 0;
           this.jumping = false;
        }
     } else if (Math.abs(this.player.y - this.y) < 50 && Math.abs(this.distance) < 80) { // avoiding the player getting too close
        if (this.distance > 0) {
           this.xAcceleration --;
        } else {
           this.xAcceleration ++;
        }
     } else if (this.player.y - this.y > 50) {
        //this.xAcceleration ++;
     }else {
        this.blocking = true; // This is just to prevent Mace from disapearing when the AI decides to do nothing.
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

    // World Boundary
    if (this.x > 1140) {
        this.x = 1140;
    } else if (this.x + 25 < 0) {
        this.x = -25;
    }
}

Vader.prototype.draw = function() {
    // if (collisionBottom == null) {
    // // if (this.yAcceleration != 0) {
    //     this.jumpAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y - 80 + this.yDisplacement, this.scale);
    // // } else if (this.xAcceleration != 0) {
    //     // this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y + this.yDisplacement, this.scale);
    // // }
    // // if (this.attacking) {
    // //     if (this.switchAttack) {
    // //         this.attack1Anim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    // //     } else {
    // //         this.attack2Anim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    // //     }
    // // } else if (this.jumping) {
    // //     this.jumpAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 80, 1);
    // // } else if (this.movingLeft) {
    // //     this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
    // } else {
    //     this.idleAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y + this.yDisplacement, this.scale);
    // }
    if (this.player.x + 50 > this.x) {
        this.drawRight();
     } else if (this.player.x + 50 < this.x) {
        this.drawLeft();
     }
}

Vader.prototype.drawRight = function () {
    this.idleAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y + this.yDisplacement, this.scale);
    Entity.prototype.draw.call(this);
}

Vader.prototype.drawLeft = function() {
    this.idleAnim.drawFrame(gameEngine.clockTick, ctx, this.x + this.xDisplacement, this.y + this.yDisplacement, this.scale);
    Entity.prototype.draw.call(this);
}

function vaderClick(event) {
    var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
    audio.volume = sfxVolume * 0.2;
    audio.play();
    statusBars.update(0, -40);
    gameEngine.entities[0].attacking = true;
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
 Vader.prototype.getMapCollisions = function() {
    //this.fullMCollisions = [];
    for (var i = 0; i < fullCollisions.length; i++) {
        let current = fullCollisions[i];
        if (this.x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX > current.x &&
            this.y + this.yAcceleration + this.currentDisplacementY < current.y + current.height && this.y + this.yAcceleration + this.currentDisplacementY > current.y) {
            var direction = [];
            if (this.y + this.currentDisplacementY > current.y + current.height) {
                direction = "top";
            } else if (this.y + LUKE_COLLISION_HEIGHT + this.currentDisplacementY > current.y) {
                direction = "bottom";
            }
            if (this.x + 1 + this.currentDisplacementX >= current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x && this.yAcceleration != 0) {
                direction = "right";
            } else if (this.x + this.currentDisplacementX <= current.x  + 1 && this.x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x) {
                direction = "left";
            }
            this.fullMCollisions.push({object: current, direction: direction});
        }
    }
    //this.bottomMCollisions = [];
    for (var i = 0; i < bottomOnlyCollisions.length; i++) {
        let current = bottomOnlyCollisions[i];
        if (this.x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX > current.x && this.y + this.yAcceleration + this.currentDisplacementY > current.y && 
            this.y + LUKE_COLLISION_HEIGHT + this.currentDisplacementY > current.y && this.y + this.yAcceleration + this.currentDisplacementY <= current.y + 10 && this.yAcceleration >= 0) {
            this.bottomMCollisions.push(bottomOnlyCollisions[i]);
        }
    }
 }
 
 Vader.prototype.getMapCollisions2 = function(x, y) {
    this.fullMCollisions = [];
    var toReturn = [];
    for (var i = 0; i < fullCollisions.length; i++) {
        let current = fullCollisions[i];
        if (x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && x + this.xAcceleration + this.currentDisplacementX > current.x &&
            y + this.yAcceleration + this.currentDisplacementY < current.y + current.height && y + this.yAcceleration + this.currentDisplacementY > current.y) {
            var direction = [];
            if (y + this.currentDisplacementY > current.y + current.height) {
                direction = "top";
            } else if (y + LUKE_COLLISION_HEIGHT + this.currentDisplacementY > current.y) {
                direction = "bottom";
            }
            if (x + 1 + this.currentDisplacementX >= current.x + current.width && x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x && this.yAcceleration != 0) {
                direction = "right";
            } else if (x + this.currentDisplacementX <= current.x  + 1 && x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x) {
                direction = "left";
            }
            toReturn.push({object: current, direction: direction});
        }
    }
    return toReturn;
 }
 Vader.prototype.collideRight = function (thisEnt, otherEnt) {
    let distance = this.getDistance(thisEnt, otherEnt);
    // console.log(this.x > ent.x);
    return distance < thisEnt.width && thisEnt.x > otherEnt.x;
 }
 Vader.prototype.collideLeft = function (thisEnt, otherEnt) {
    let distance = this.getDistance(thisEnt, otherEnt);
    return thisEnt.x < otherEnt.x + otherEnt.width && distance < thisEnt.width;
 }
 
 
 Vader.prototype.collide = function (xDisplacement, yDisplacement, tag) {
    var collisions = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
       let theTag = gameEngine.entities[i].tag;
       let current = gameEngine.entities[i];
       if (tag === 'Platform') {
          if (theTag == tag) {
             if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX &&
                this.y + yDisplacement < current.collisionY + current.collisionHeight && this.y + yDisplacement > current.collisionY) {
                var direction = 'bottom';
                // console.log(current);
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
                collisions.push({ entity: current, direction: direction });
             }
          }
       } 
    }
    return collisions;
 }
 
 
 
 Vader.prototype.getCollision = function (direction) {
    for (var i = 0; i < this.platformCollisions.length; i++) {
       if (this.platformCollisions[i].direction == direction) {
          return this.platformCollisions[i];
       }
    }
    return null;
 }
 
 Vader.prototype.findPlayer = function() {
    for (let i = 0; i < this.game.entities.length; i++) {
       let object = this.game.entities[i];
       if (object.tag == "player") {
          this.player = object;
       }
    }
 }