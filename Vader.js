const VADER_COLLISION_WIDTH = 32;
const VADER_COLLISION_HEIGHT = 59;
const VADER_HITBOX_X_OFFSET = 33;
const VADER_HITBOX_Y_OFFSET = 11;
function Vader() {
    canvas.addEventListener("click", vaderClick);
    this.vaderLeft = AM.getAsset("./img/vader_sprites_left - Copy.png");
    this.vaderRight = AM.getAsset('./img/vader_sprites_right.png')
    this.x = 800;
    this.y = 10;
    this.xDisplacement = 0;
    this.yDisplacement = 0;
    this.scale = 0.8;
    this.game = gameEngine;
    this.health = 1000;

    this.currentDisplacementX = VADER_COLLISION_WIDTH + VADER_HITBOX_X_OFFSET;
    this.currentDisplacementY = VADER_COLLISION_HEIGHT + VADER_HITBOX_Y_OFFSET;

    this.xAcceleration = 0;
    this.yAcceleration = 0;

// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
// right
    this.walkRightAnim = new Animation(this.vaderRight, 1600, 890, -120, 70, 0.15, 9, true, false);
    this.jumpingRightAnim = new Animation(this.vaderRight, 1560, 780, -120, 100, 0.2, 5, true, false);
    this.blockRightAnim = new Animation(this.vaderRight, 950, 320, -120, 80, 1, 1, true, false);
    this.attackRightAnim = new Animation(this.vaderRight, 960, 450 , -120, 110, 0.1, 6, true, false)
// left
    this.attackLeftAnim = new Animation(this.vaderLeft, 600, 450, 120, 110, 0.1, 6, true, false);
    this.blockLeftAnim = new Animation(this.vaderLeft, 590, 320, 120, 80, 1, 1, true, false);
    //this.attack2Anim = new Animation(this.vaderLeft, 0, 480, 120, 80, 0.05, 11, false, false);
    this.jumpingLeftAnim = new Animation(this.vaderLeft, 0, 780, 120, 100, 0.2, 5, true, false);
    this.walkLeftAnim = new Animation(this.vaderLeft, 0, 890, 120, 70, 0.15, 9, true, false);
    
    this.attacking = false;
    this.switchAttack = true;
    this.jumping = false;
    this.movingRight = false;
    this.movingLeft = false;
    this.dying = false;
    this.dead = false;
    //this.crouching = false;
    this.dropping = false;
    this.fullMCollisions = [];
    this.bottomMCollisions = [];
    this.updateCount = null;
    this.tag = "enemy";
    //Entity.call(this, this.game, this.x, this.y);
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
        this.x = collisionRight.x + collisionRight.width + 1 - this.currentDisplacementX;
        this.xAcceleration = 0;
    } else if (collisionLeft != null) {
        this.x = collisionLeft.x - 1 - this.currentDisplacementX;
        this.xAcceleration = 0;
    }
    if (collisionTop != null) {
        this.yAcceleration = 0;
    } else if (collisionBottom != null) {
        if (collisionBottom instanceof BottomOnlyCollision && this.player.y - this.y > 50) {
            this.yAcceleration += 0.4;
        } else {
            this.y = collisionBottom.y + 1 - this.currentDisplacementY;
            this.yAcceleration = 0;
        }
    } else {
        this.yAcceleration += 0.4;
    }

    this.distance = this.player.x + 35 - this.x;
    if (gameEngine.click) {
        console.log("x :" + this.x + " y :" + this.y);
        console.log("distance: " + this.distance);
        console.log("difference in y: " + (this.player.y  -this.y));
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
        && Math.abs(this.distance) < 100 && collisionBottom != null) {
  
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
              this.xAcceleration += 5;
           } else if (this.distance < 0) {
              this.xAcceleration -= 5;
           }
        }
        this.block = false;
        this.attack = false;
        this.hurting = false;
        this.dead = false;    
        if (this.jumpingRightAnim.isDone() || this.jumpingLeftAnim.isDone()) {
           this.jumpingRightAnim.elapsedTime = 0;
           this.jumpingLeftAnim.elapsedTime = 0;
           this.jumping = false;
        }
     } else if (Math.abs(this.player.y - this.y) < 10 && Math.abs(this.distance) < 70 && !this.jumping) { // avoiding the player getting too close
        var random = Math.round(Math.random());
        console.log(random);
        if (this.distance > 0) {
           this.xAcceleration -= random;
        } else {
           this.xAcceleration += random;
        }
     } else if (this.player.y - this.y > 50) {
        //this.xAcceleration ++;
     }else {
        this.blocking = true; // This is just to prevent Mace from disapearing when the AI decides to do nothing.
     }
/*
    if (this.attack1Anim.isDone() || this.attack2Anim.isDone()) {
        this.attack1Anim.elapsedTime = 0;
        this.attack2Anim.elapsedTime = 0;
        this.attacking = false;
        this.switchAttack = !this.switchAttack;
    }
*/
    if (this.player.attack) {
        if (!this.block && this.attackCollide()) {
            this.health -= 30;
        } 
    }

    if (this.health <= 0) {
        this.dying = true; blocking = false;this.jumping = false; this.attacking = false;
        this.dead = true;
        for (var i = 0; i < gameEngine.entities[i]; i++) {
            if (gameEngine.entities[i].tag === 'enemy') {
                gameEngine.entities.splice(i, 1);
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
    if (true) {
        ctx.strokeStyle = 'orange';
        ctx.strokeRect(this.x + VADER_HITBOX_X_OFFSET, this.y + VADER_HITBOX_Y_OFFSET, VADER_COLLISION_WIDTH, VADER_COLLISION_HEIGHT);
        ctx.fill();
     }
    if (this.player.x > this.x) {
        this.drawRight();
    } else if (this.player.x < this.x) {
        this.drawLeft();
    }
}

Vader.prototype.drawRight = function () {
    if (this.block) {
        this.blockRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 90 , this.y + 5, this.scale);
    } else if (this.attack) {
        this.attackRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 20, this.scale);
    } else if (this.jumping) {
        this.jumpingRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 10, this.scale);
    } else {
        this.walkRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 130, this.y + 14 , this.scale);
    }
    Entity.prototype.draw.call(this);
}

Vader.prototype.drawLeft = function() {
    if (this.block) {
        this.blockLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x , this.y + 5, this.scale);
    } else if (this.attack) {
        this.attackLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 20, this.scale);
    } else if (this.jumping) {
        this.jumpingLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, this.scale);
    } else {
        this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x , this.y + 14 , this.scale);
    }
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
    this.fullMCollisions = [];
    for (var i = 0; i < fullCollisions.length; i++) {
        let current = fullCollisions[i];
        if (this.x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX > current.x &&
            this.y + this.yAcceleration + this.currentDisplacementY < current.y + current.height && this.y + this.yAcceleration + this.currentDisplacementY > current.y) {
            var direction = [];
            if (this.y + this.currentDisplacementY > current.y + current.height) {
                direction = "top";
            } else if (this.y + VADER_COLLISION_HEIGHT+ this.currentDisplacementY > current.y) {
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
    this.bottomMCollisions = [];
    for (var i = 0; i < bottomOnlyCollisions.length; i++) {
        let current = bottomOnlyCollisions[i];
        if (this.x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX > current.x && this.y + this.yAcceleration + this.currentDisplacementY > current.y && 
            this.y + VADER_COLLISION_HEIGHT + this.currentDisplacementY > current.y && this.y + this.yAcceleration + this.currentDisplacementY <= current.y + 10 && this.yAcceleration >= 0) {
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
            } else if (y + VADER_COLLISION_HEIGHT+ this.currentDisplacementY > current.y) {
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
 
Vader.prototype.getCollision = function (direction) {
    for (var i = 0; i < this.platformCollisions.length; i++) {
       if (this.platformCollisions[i].direction == direction) {
          return this.platformCollisions[i];
       }
    }
    return null;
 }
 Vader.prototype.attackCollide = function (thisEnt, otherEnt) {
    let distance = this.getDistance(thisEnt, otherEnt);
    // console.log("Distance: " + distance + ", WIDTH: " + thisEnt.width + ", " + otherEnt.width);
    // console.log(distance < thisEnt.width + otherEnt.width);
    return distance < thisEnt.width + otherEnt.width || distance < thisEnt.height + otherEnt.height;
}
Vader.prototype.getDistance = function (thisEnt, otherEnt) {
    let dx, dy;
    dx = thisEnt.x - otherEnt.x;
    dy = thisEnt.y - otherEnt.y;
    let theDist = Math.sqrt(dx * dx + dy * dy);
    // console.log("Distance: " + theDist + ", " +otherEnt.x + ", "+(thisEnt.x + thisEnt.width));
    return theDist;
}
 
 Vader.prototype.findPlayer = function() {
    for (let i = 0; i < this.game.entities.length; i++) {
       let object = this.game.entities[i];
       if (object.tag == "player") {
          this.player = object;
       }
    }
 }