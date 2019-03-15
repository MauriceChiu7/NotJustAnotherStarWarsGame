const VADER_COLLISION_WIDTH = 32;
const VADER_COLLISION_HEIGHT = 59;
const VADER_HITBOX_X_OFFSET = 33;
const VADER_HITBOX_Y_OFFSET = 11;
function Vader() {
    //canvas.addEventListener("click", vaderClick);
    this.vaderLeft = AM.getAsset("./img/vader_sprites_left - Copy.png");
    this.vaderRight = AM.getAsset('./img/vader_sprites_right.png')
    this.x = 800;
    this.y = 10;
    this.width = 30;
    this.height = 30;
    this.xDisplacement = 0;
    this.yDisplacement = 0;
    this.scale = 0.8;
    this.game = gameEngine;
    this.health = 1000;

    this.center_x;
    this.center_y;
    this.mass = 2.5;

    this.currentDisplacementX = VADER_COLLISION_WIDTH + VADER_HITBOX_X_OFFSET;
    this.currentDisplacementY = VADER_COLLISION_HEIGHT + VADER_HITBOX_Y_OFFSET;

    this.xAcceleration = 0;
    this.yAcceleration = 0;

// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
// right
    this.walkRightAnim = new Animation(this.vaderRight, 1560, 890, -120, 70, 0.15, 9, true, false);
    this.jumpingRightAnim = new Animation(this.vaderRight, 1560, 780, -120, 100, 0.2, 5, true, false);
    this.blockRightAnim = new Animation(this.vaderRight, 950, 320, -120, 80, 1, 1, false, false);
    this.attackRightAnim = new Animation(this.vaderRight, 960, 450 , -120, 110, 0.1, 6, false, false);
    this.dyingRightAnim = new Animation(this.vaderRight, 1560, 640, -120,  80, 0.3, 7, false, false);

    this.deadAnim = new Animation(this.vaderRight, 730, 630, 120, 120, 1, 1, true, false);
// left
    this.attackLeftAnim = new Animation(this.vaderLeft, 600, 450, 120, 110, 0.1, 6, false, false);
    this.blockLeftAnim = new Animation(this.vaderLeft, 590, 320, 120, 80, 1, 1, false, false);
    //this.attack2Anim = new Animation(this.vaderLeft, 0, 480, 120, 80, 0.05, 11, false, false);
    this.jumpingLeftAnim = new Animation(this.vaderLeft, 0, 780, 120, 100, 0.2, 5, true, false);
    this.walkLeftAnim = new Animation(this.vaderLeft, 0, 890, 120, 70, 0.15, 9, true, false);
    // this.deadLeftAnim = new Animation(this.vaderLeft, 0, 640, 120,  80, 0.2, 7, false, false);
    
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
    this.energy = 200;
    this.collisionBottom;
    //Entity.call(this, this.game, this.x, this.y);
}

Vader.prototype = new Entity();
Vader.prototype.constructor = Vader;

Vader.prototype.update = function() {
    this.center_x = this.x + this.width / 2;
    this.center_y = this.y + this.height / 2;

    this.getMapCollisions();
    var collisionRight = this.getMapCollision("right");
    var collisionLeft = this.getMapCollision("left");
    var collisionTop = this.getMapCollision("top");
    var collisionBottom = this.getMapCollision("bottom");
    this.collisionBottom = this.getMapCollision("bottom");
    if (!this.updateCount ) this.findPlayer(); //will just run once
    this.updateCount = 1;

    if (this.energy < 200)
        this.energy ++;
    
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
    /*if (gameEngine.click) {
        console.log("x :" + this.x + " y :" + this.y);
        console.log("distance: " + this.distance);
        console.log("difference in y: " + (this.player.y  -this.y));
    }*/

    // friction
    if (this.xAcceleration > 0) {
        this.xAcceleration -= 0.1;
        if (this.xAcceleration < 0) {
            this.xAcceleration = 0;
        }
    } else if (this.xAcceleration < 0) {
        this.xAcceleration += 0.1;
        if (this.xAcceleration > 0) {
            this.xAcceleration = 0;
        }
    }

    if (this.dying && this.dyingRightAnim.isDone()){
        this.dead = true;
    }

    if (!this.dying) {
        // movement
        if (this.distance > 130 && this.player.y - this.y == 0) { // player on the right
            this.xAcceleration +=1;
            this.block = false;
            this.attacking = false;
            this.jumping = false;
            this.hurting = false;
            this.dead = false;
        } else if (this.distance < -50 && this.player.y - this.y == 0) { //player on the left
            this.xAcceleration -=1;
            this.block = false;
            this.attacking = false;
            this.jumping = false;
            this.hurting = false;
            this.dead = false;
        } else if (this.distance > 0 && this.player.y - this.y > 0) {// player is lower && on the right
            this.xAcceleration +=1;
            this.block = false;
            this.attacking = false;
            this.jumping = false;
            //this.hurting = false;
        } else if (this.distance < -0 && this.player.y - this.y > 0) {// player is lower && on the left
            this.xAcceleration -=1;
            this.block = false;
            this.attacking = false;
            this.jumping = false;
        } else if (!this.block && !this.attacking && Math.abs(this.player.y - this.y) < 40
            && (this.distance <= 130 && this.distance >= -50) && collisionBottom != null) {
            // console.log("try to block or attack");
            this.chanceToBlock = Math.round(Math.random() * 5); this.blocking = false; this.attacking = false; this.jumping = false;
            if (this.chanceToBlock === 1) {
                this.block = true;
                this.energy -= 10;
            } else if (this.chanceToBlock === 0 && this.energy > 150) {
                this.attacking = true;
                this.energy -= 100;
            }
            if (this.player.attacking) {
                // this.blocking =false;
                this.chanceToBlock = -1;
                this.hurting = true;
                this.lives--;
                if (this.lives === 0) {
                    // this.dead = true;
                    this.dying = true;
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
            this.attacking = false;
            this.hurting = false;
            this.dead = false;    
            if (this.jumpingRightAnim.isDone() || this.jumpingLeftAnim.isDone()) {
                this.jumpingRightAnim.elapsedTime = 0;
                this.jumpingLeftAnim.elapsedTime = 0;
                this.jumping = false;
            }
        } else if (Math.abs(this.player.y - this.y) < 10 && (this.distance < 110 && this.distance > -20) && !this.jumping) { // avoiding the player getting too close
            // console.log("too close");
            var random = Math.round(Math.random());
            // console.log(random);
            if (this.distance > 0) {
            this.xAcceleration -= random;
            } else {
            this.xAcceleration += random;
            }
        } else {
            this.jumping = false;
        }
        
        //console.log(this.attackRightAnim.isDone() || this.attackLeftAnim.isDone());
        if (this.attacking && this.attackCollide) {
            if (!blocking) {
                this.player.health -= 0.5;
                statusBars.update(-0.5,0);
            }
            if (this.attackRightAnim.isDone() || this.attackLeftAnim.isDone()) {
                this.attackRightAnim.elapsedTime = 0;
                this.attackLeftAnim.elapsedTime = 0;
                this.attacking = false;
            }
        }
        if (this.blockLeftAnim.isDone() || this.blockRightAnim.isDone()) {
            this.blockLeftAnim.elapsedTime = 0;
            this.blockRightAnim.elapsedTime = 0;
            this.block = false;
        }

        if (this.player.attacking) {
            if (!this.block && this.attackCollide()) {
                this.health -= 100;
            } else if (this.block) {
                this.energy +=20;
            }
        }
    }
    if (this.health <= 0) {
        this.dying = true; 
        blocking = false; 
        this.jumping = false; 
        this.attacking = false;
        // this.dead = true;
        this.attacking = false;
        this.jumping = false;
    }

    // speed limits
    if (this.xAcceleration > 7) {
        this.xAcceleration = 7;
    } else if (this.xAcceleration < -7) {
        this.xAcceleration = -7;
    }
    if (this.yAcceleration > 12) {
        this.yAcceleration = 12;
    } else if (this.yAcceleration < -12) {
        this.yAcceleration = -12;
    }

    this.y += this.yAcceleration;
    this.x += this.xAcceleration;
    if (this.y > 600) {
        this.health = 0;
    }
    // World Boundary
    if (this.x > 1140) {
        this.x = 1140;
    } else if (this.x + 30 < 0) {
        this.x = -30;
    } 
}

Vader.prototype.draw = function() {
    // if (true) {
    //     ctx.strokeStyle = 'orange';
    //     ctx.strokeRect(this.x + VADER_HITBOX_X_OFFSET, this.y + VADER_HITBOX_Y_OFFSET, VADER_COLLISION_WIDTH, VADER_COLLISION_HEIGHT);
    //     ctx.fill();
    // }
    if (this.player.x > this.x) {
        this.drawRight();
    } else if (this.player.x < this.x) {
        this.drawLeft();
    }
}

Vader.prototype.drawRight = function () {
    if (this.collisionBottom == null) {
        this.jumpingRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 10, this.scale);
    } else {
        if (this.dying) {
            this.dyingRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 90, this.y + 5, this.scale);
        } else if (this.dead) {
            this.deadAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 90, this.y + 5, this.scale);
        } else if (this.block) {
            this.blockRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 90 , this.y + 5, this.scale);
        } else if (this.attacking) {
            this.attackRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 20, this.scale);
        } else if (this.jumping) {
            this.jumpingRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 10, this.scale);
        } else {
            this.walkRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 115, this.y + 14 , this.scale);
        }
    }

    // if (this.collisionBottom == null) {
    //     this.jumpingRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 10, this.scale);
    // } else {
    //     if (this.dead) {
    //         this.deadRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, this.scale);
    //     } else if (this.block) {
    //         this.blockRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 90 , this.y + 5, this.scale);
    //     } else if (this.attacking) {
    //         this.attackRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 20, this.scale);
    //     } else if (this.jumping) {
    //         this.jumpingRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 95, this.y - 10, this.scale);
    //     } else {
    //         this.walkRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x + 115, this.y + 14 , this.scale);
    //     }
    // }
    Entity.prototype.draw.call(this);
}

Vader.prototype.drawLeft = function() {
    if (this.collisionBottom == null) {
        this.jumpingLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, this.scale);
    } else {
        if (this.dying) {
            this.dyingRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y + 5, this.scale);
        } else if (this.dead) {
            this.deadAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y + 5, this.scale);
        } else if (this.block) {
            this.blockLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x , this.y + 5, this.scale);
        } else if (this.attacking) {
            this.attackLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 20, this.scale);
        } else if (this.jumping) {
            this.jumpingLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, this.scale);
        } else {
            this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x , this.y + 14 , this.scale);
        }
    }

    // if (this.collisionBottom == null) {
    //     this.jumpingLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, this.scale);
    // } else {
    //     if (this.dead) {
    //         this.deadLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, this.scale);
    //     } else if (this.block) {
    //         this.blockLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x , this.y + 5, this.scale);
    //     } else if (this.attacking) {
    //         this.attackLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 20, this.scale);
    //     } else if (this.jumping) {
    //         this.jumpingLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, this.scale);
    //     } else {
    //         this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x , this.y + 14 , this.scale);
    //     }
    // }
    Entity.prototype.draw.call(this);
}

// function vaderClick(event) {
//     var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
//     audio.volume = sfxVolume * 0.2;
//     audio.play();
//     statusBars.update(0, -40);
//     gameEngine.entities[0].attacking = true;
// }

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
            this.y + VADER_COLLISION_HEIGHT + this.currentDisplacementY > current.y && this.y + this.yAcceleration + this.currentDisplacementY <= current.y + 20 && this.yAcceleration >= 0) {
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
//  Vader.prototype.attackCollide = function (thisEnt, otherEnt) {
//     let distance = this.getDistance(thisEnt, otherEnt);
//     // console.log("Distance: " + distance + ", WIDTH: " + thisEnt.width + ", " + otherEnt.width);
//     // console.log(distance < thisEnt.width + otherEnt.width);
//     return distance < thisEnt.width + otherEnt.width || distance < thisEnt.height + otherEnt.height;
// }
// Vader.prototype.getDistance = function (thisEnt, otherEnt) {
//     let dx, dy;
//     dx = thisEnt.x - otherEnt.x;
//     dy = thisEnt.y - otherEnt.y;
//     let theDist = Math.sqrt(dx * dx + dy * dy);
//     // console.log("Distance: " + theDist + ", " +otherEnt.x + ", "+(thisEnt.x + thisEnt.width));
//     return theDist;
// }
Vader.prototype.attackCollide = function () {
    let distance = this.getDistance();
    //  console.log("Trooper Attack: Distance: " + distance + ", WIDTH: " + this.width + ", " + this.player.width);
    return distance < this.width + this.player.width;
}
Vader.prototype.getDistance = function () {
    let dx = this.x - this.player.x;
    let dy = this.y - this.player.y;
    let theDist = Math.sqrt(dx * dx + dy * dy);
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