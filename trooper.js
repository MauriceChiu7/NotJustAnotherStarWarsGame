function getDistance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Trooper(game) {
    // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.spriteSheetRight = AM.getAsset("./img/trooper_right.png");
    let frameDuration = 0.2;
    this.walkRightAnim = new Animation(this.spriteSheetRight, 0, 74, 62, 74, frameDuration, 9, true, false);
    this.standRightAnim = new Animation(this.spriteSheetRight, 62, 74, 62, 74, frameDuration, 1, true, false);
    this.attackRightAnim = new Animation(this.spriteSheetRight, 0, 444, 62, 74, frameDuration, 9, true, false);

    this.dyingRightAnim = new Animation(this.spriteSheetRight, 0, 3*74, 62, 74, frameDuration, 6, false, false);
    this.deadRightAnim = new Animation(this.spriteSheetRight, 5*62, 3*74, 62, 74, frameDuration, 6, false, false);

    this.spriteSheetLeft = AM.getAsset("./img/trooper_left.png");
    this.walkLeftAnim = new Animation(this.spriteSheetLeft, 124, 74, 62, 74, frameDuration, 9, true, true);
    this.standLeftAnim = new Animation(this.spriteSheetLeft, 558, 74, 62, 74, frameDuration, 1, true, false);
    this.attackLeftAnim = new Animation(this.spriteSheetLeft, 124, 444, 62, 74, frameDuration, 9, true, true);

    this.health = 3000; // added by maurice

    this.x = 600;
    this.y = 400;
    this.width = 50;
    this.height = 50;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.platformCollisions = [];

    this.speed = 100;
    this.dead = false; // added by maurice
    this.walking = "walk";
    this.standing = "stand";
    this.attacking = "attack";
    this.chanceToShoot = 0;
    this.hitbox = 30;

    this.game = game;
    for (let i = 0; i < this.game.entities.length; i++) {
        let object = this.game.entities[i];
        if (object.tag == "player") {
            this.player = object;
        }
    }
    let trooperList = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        if (gameEngine.entities[i].tag == "trooper") {    // already a trooper so make new id (add 1 to existing id)
            trooperList.push(gameEngine.entities[i].id);
        }
    }
    if (trooperList.length == 0) {
        this.id = 1;
    } else {
        let otherId = trooperList[trooperList.length - 1];
        this.id = 1 + otherId;
    }
    console.log("Trooper ID: " + this.id);
    this.ctx = game.ctx;
    this.tag = "trooper";
    Entity.call(this, game, this.x, this.y);
}

Trooper.prototype = new Entity();
Trooper.prototype.constructor = Trooper;

Trooper.prototype.collide = function (xDisplacement, yDisplacement, tag) {
    var collisions = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        let theTag = gameEngine.entities[i].tag;
        let current = gameEngine.entities[i];
        if (theTag == tag) {
            if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX &&
                this.y + yDisplacement < current.collisionY + current.collisionHeight && this.y + yDisplacement > current.collisionY) {
                var direction = 'bottom';
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
    // console.log(collisions);
    return collisions;
}

Trooper.prototype.getCollision = function (direction) {
    for (var i = 0; i < this.platformCollisions.length; i++) {
        if (this.platformCollisions[i].direction == direction) {
            return this.platformCollisions[i];
        }
    }
    return null;
}

Trooper.prototype.update = function () {
    console.log('Trooper health: ' + this.health);
    this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");
    // this.playerCollisions = this.collide(this.xAcceleration, this.yAcceleration, 'player');

    this.distance = this.player.x - this.x;

    if (this.health <= 0) {
        this.dead = true;
        this.walking = false;
        this.standing = false;
        this.attacking = false;
    }

    if (!this.dead){
        if (Math.abs(this.distance) > 50) {
            this.chanceToShoot = Math.round(Math.random() * 7);

            if (this.chanceToShoot == 0) {
                this.action = this.standing;
                this.shotsFired = false;
                for (var i = 0; i < gameEngine.entities.length; i++) {
                    if (gameEngine.entities[i].tag == "trooperLaser") {
                        // && gameEngine.entities[i].laserID == this.id) {
                        // console.log("shotsFired");
                        this.shotsFired = true;
                    }
                }
                if (!this.shotsFired) {
                    this.shoot();
                }
                this.action = this.standing;
            } 
            // else {
            //     this.action = this.walking;
            //     if (this.distance > 70) {
            //         this.xAcceleration += 1;
            //     } else if (this.distance < -70) {
            //         this.xAcceleration -= 1;
            //     }
            // }
        // } else if (Math.abs(this.distance) < 70) {
        //     this.action = this.walking;
        //     if (this.distance > 0) {
        //         this.xAcceleration += 1;            
        //     } else if (this.distance < 0) {
        //         this.xAcceleration -= 1;
        //     }    
        } else if (Math.abs(this.player.y - this.y) < 70) {
            this.action = this.attacking;
        } else {
            this.action = this.standing;
        }
    }

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



    Entity.prototype.update.call(this);
}

Trooper.prototype.draw = function () {
    // this.drawRight();
    if (this.dead && this.dyingRightAnim.isDone()) {
        this.deadRightAnim.drawFrame(gameEngine.clockTick, this.ctx, this.x, this.y, scale);
    }

    if (this.dead) {
        this.dyingRightAnim.drawFrame(gameEngine.clockTick, this.ctx, this.x, this.y, scale);
    }
    

    if (this.player.x + 50 > this.x) {
        this.drawRight();
    } else if (this.player.x + 50 < this.x) {
        this.drawLeft();
    }
    Entity.prototype.draw.call(this);
}

Trooper.prototype.drawRight = function () {
    switch (this.action) {
        case this.walking:         //walking
            this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 5, scale);
            break;
        case this.standing:         //standing
            this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);

            break;
        case this.attacking:         //attacking
            this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);
            break;
    }
    Entity.prototype.draw.call(this);
}

Trooper.prototype.drawLeft = function () {
    switch (this.action) {
        case this.walking:         //walking
            this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 5, scale);
            break;
        case this.standing:         //standing
            this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);

            break;
        case this.attacking:         //attacking
            this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);
            break;
    }
    Entity.prototype.draw.call(this);
}

Trooper.prototype.shoot = function () {
    let audio = AM.getSound('./sounds/laser_blaster_sound.wav').cloneNode();
    audio.play();
    let rect = canvas.getBoundingClientRect();
    let startCoor = { x: this.x + 20, y: this.y + 50 };
    const xend = this.player.x;
    const yend = this.player.y;
    let endCoor = { x: xend, y: yend };
    let trooperLaser = new LaserBeam(startCoor, endCoor, gameEngine);
    trooperLaser.tag = "trooperLaser";
    trooperLaser.enemyTag = "jedi";
    // trooperLaser.setID(this.id);
    // console.log("trooper laser id: " + trooperLaser.laserID);
    gameEngine.addEntity(trooperLaser);
}

function getAngle(xCoor, yCoor) {
    let delta_x = (xCoor - center_x);
    let delta_y = (yCoor - center_y);
    let hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
    let radian = Math.asin(delta_x / hypotenuse);
    let theDegree = radian * 180 / Math.PI;
    if (yCoor > center_y) {
        if (xCoor > center_x) {
            degree = 180 - degree;
        } else {
            degree = -180 - degree;
        }
    }
    return theDegree;
}