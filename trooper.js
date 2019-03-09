const SCALE_TROOPER = 1;

function Trooper(game) {
    // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.spriteSheetRight = AM.getAsset("./img/trooper_right.png");
    let frameDuration = 0.2;
    this.walkRightAnim = new Animation(this.spriteSheetRight, 0, 74, 62, 74, frameDuration, 9, true, false);
    this.standRightAnim = new Animation(this.spriteSheetRight, 62, 74, 62, 74, frameDuration, 1, true, false);
    this.attackRightAnim = new Animation(this.spriteSheetRight, 0, 444, 62, 74, frameDuration, 9, true, false);

    this.dyingRightAnim = new Animation(this.spriteSheetRight, 0, 3 * 74, 62, 74, frameDuration, 6, false, false);
    this.deadRightAnim = new Animation(this.spriteSheetRight, 0 * 62, 4 * 74, 62, 74, frameDuration, 1, true, false);

    this.spriteSheetLeft = AM.getAsset("./img/trooper_left.png");
    this.walkLeftAnim = new Animation(this.spriteSheetLeft, 124, 74, 62, 74, frameDuration, 9, true, true);
    this.standLeftAnim = new Animation(this.spriteSheetLeft, 558, 74, 62, 74, frameDuration, 1, true, false);
    this.attackLeftAnim = new Animation(this.spriteSheetLeft, 124, 444, 62, 74, frameDuration, 9, true, true);

    this.health = 1000; // added by maurice

    this.x = 600;
    this.y = 400;
    this.width = 30;
    this.height = 80;
    this.xAcceleration = 0;
    this.yAcceleration = 0;

    this.fullMCollisions = [];
    this.bottomMCollisions = [];
    this.collisionRight;
    this.collisionLeft;
    this.collisionTop;
    this.collisionBottom;
    this.currentDisplacementX = 30;
    this.currentDisplacementY = 75;

    this.speed = 100;
    this.dead = false; // added by maurice    
    this.walking = "walk";
    this.standing = "stand";
    this.attacking = "attack";
    this.chanceToShoot = 0;
    this.hitSuccess = true;
    this.hitbox = 30;

    this.isCharger = false;
    this.walk = false;

    this.game = game;

    //console.log("Trooper ID: " + this.id);
    this.ctx = game.ctx;
    this.tag = "enemy";
    Entity.call(this, game, this.x, this.y, this.width, this.height);
}

Trooper.prototype = new Entity();
Trooper.prototype.constructor = Trooper;

Trooper.prototype.getMapCollisions = function () {
    this.fullMCollisions = [];
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
            } else if (this.x + this.currentDisplacementX <= current.x + 1 && this.x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x) {
                direction = "left";
            }
            this.fullMCollisions.push({ object: current, direction: direction });
        }
    }
    this.bottomMCollisions = [];
    for (var i = 0; i < bottomOnlyCollisions.length; i++) {
        let current = bottomOnlyCollisions[i];
        if (this.x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX > current.x && this.y + this.yAcceleration + this.currentDisplacementY > current.y &&
            this.y + LUKE_COLLISION_HEIGHT + this.currentDisplacementY > current.y && this.y + this.yAcceleration + this.currentDisplacementY <= current.y + 10 && this.yAcceleration >= 0) {
            this.bottomMCollisions.push(bottomOnlyCollisions[i]);
        }
    }
}

Trooper.prototype.getMapCollision = function (direction) {
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

Trooper.prototype.getDistance = function (ent) {
    let dx = this.x - this.player.x;
    let dy = this.y - this.player.y;
    let theDist = Math.sqrt(dx * dx + dy * dy);
    return theDist;
}
Trooper.prototype.attackCollide = function () {
    let distance = this.getDistance();
    // console.log("Trooper Attack: Distance: " + distance + ", WIDTH: " + this.width + ", " + this.player.width);
    return distance < this.width + this.player.width;
}

Trooper.prototype.update = function () {
    //this.health = 0; //for testing
    for (let i = 0; i < gameEngine.entities.length; i++) {
        let object = this.game.entities[i];
        if (object.tag === 'player') {
            this.player = object;
        }
    }

    let trooperList = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        if (gameEngine.entities[i] instanceof Trooper) {    // already a trooper so make new id (add 1 to existing id)
            trooperList.push(gameEngine.entities[i].id);
        }
    }
    if (trooperList.length == 0) {
        this.id = 1;
    } else {
        let otherId = trooperList[trooperList.length - 1];
        this.id = 1 + otherId;
    }

    // console.log('Trooper ID'+ this.id+' health: ' + this.health);
    // this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");
    // this.playerCollisions = this.collide(this.xAcceleration, this.yAcceleration, 'player');

    this.distance = this.player.x + 50 - this.x;

    if (this.health <= 0) {
        this.dead = true;
        this.walking = false;
        this.standing = false;
        this.attacking = false;

    }

    if (!this.dead) {
        // this.action = this.standing;
        if (Math.abs(this.distance) > 50) {
            if (this.isCharger) {
                this.walk = true;
                // if (Math.abs(this.distance) < 40) {
                //     this.action = this.standing;
                // } else {
                //     this.action = this.walking;
                // }
                if (this.player.x + 50 > this.x && Math.abs(this.player.y - this.y) < 50 ) {
                    this.x += 1;
                    this.action = this.walking;
                } else if (this.player.x + 50 < this.x && Math.abs(this.player.y - this.y) < 50) {
                    this.x -= 1;
                    this.action = this.walking;
                } else {
                    this.action = this.standing;
                }
            } else {
                this.action = this.standing;
            }

            this.chanceToShoot = Math.round(Math.random() * 60);
            if (this.chanceToShoot == 0) {
                this.shotsFired = false;
                for (var i = 0; i < gameEngine.entities.length; i++) {
                    if (gameEngine.entities[i].tag == "trooperLaser") {
                        this.shotsFired = true;
                    }
                }
                if (this.isCharger){
                    this.shootCharger();
                } else {
                    this.shoot();
                }                
            }

        } else if (Math.abs(this.distance) < 50 && Math.abs(this.player.y - this.y) < 100) {
            let that = this;
            this.walk = false;
            that.action = that.attacking;
            if (that.attackCollide()) {
                statusBars.update(-.2, 0);
                that.player.health -= .2;
                setInterval(function () {
                    // statusBars.update(-20, 0);
                    // that.player.health -= 20;
                }, 2000);
            }
        }

    } 
    // else {
    //     if (this.deadRightAnim.isDone()) {
    //         // for (var i = 0; i < this.game.entities.length; i++) {
    //         //     if (this.game.entities[i] instanceof Trooper && this.game.entities[i].dead) {
    //         //         this.game.entities.splice(i, 1);
    //         //     }
    //         // }
    //     }
    // }

    this.getMapCollisions();
    collisionRight = this.getMapCollision("right");
    collisionLeft = this.getMapCollision("left");
    collisionTop = this.getMapCollision("top");
    collisionBottom = this.getMapCollision("bottom");

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
        if (collisionBottom instanceof BottomOnlyCollision && this.crouching && this.dropping) {
            this.yAcceleration += 0.4;
        } else {
            this.y = collisionBottom.y + 1 - this.currentDisplacementY;
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

Trooper.prototype.charger = function () {
    this.walk = true;
    this.isCharger = true;
    this.health = 500;
}

Trooper.prototype.draw = function () {
    if (this.dead && this.dyingRightAnim.isDone()) {
        this.deadRightAnim.drawFrame(gameEngine.clockTick, this.ctx, this.x, this.y+7, SCALE_TROOPER);
    }

    if (this.dead) {
        this.dyingRightAnim.drawFrame(gameEngine.clockTick, this.ctx, this.x, this.y, SCALE_TROOPER);
    }

    if (this.player.x + 50 > this.x) {
        this.drawRight();
    } else if (this.player.x + 50 < this.x) {
        // console.log(this.player.x + 70 +" < "+ this.x);
        this.drawLeft();
    }
    Entity.prototype.draw.call(this);
}

Trooper.prototype.drawRight = function () {
    switch (this.action) {
        case this.walking:         //walking
            this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 5, SCALE_TROOPER);
            break;
        case this.standing:         //standing
            this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_TROOPER);
            break;
        case this.attacking:         //attacking
            console.log("attack right");
            this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_TROOPER);
            break;
    }
    Entity.prototype.draw.call(this);
}

Trooper.prototype.drawLeft = function () {
    switch (this.action) {
        case this.walking:         //walking
            this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 5, SCALE_TROOPER);
            break;
        case this.standing:         //standing
            this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_TROOPER);

            break;
        case this.attacking:         //attacking
            console.log("attack left");
            this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_TROOPER);
            break;
    }
    Entity.prototype.draw.call(this);
}

Trooper.prototype.shoot = function () {
    let audio = AM.getSound('./sounds/laser_blaster_sound.wav').cloneNode();
    audio.volume = 0.2 * sfxVolume;
    audio.play();
    let rect = canvas.getBoundingClientRect();
    let startCoor = { x: (this.x + 10 + this.x) / 2, y: (this.y + this.height + this.y) / 2 };
    const xend = center_x;
    const yend = center_y + 20;
    let endCoor = { x: xend, y: yend };
    let trooperLaser = new LaserBeam(startCoor, endCoor);
    trooperLaser.tag = "trooperLaser";
    trooperLaser.enemyTag = "jedi";
    // trooperLaser.setID(this.id);
    // console.log("trooper laser id: " + trooperLaser.laserID);
    // gameEngine.addEntity(trooperLaser);
}

Trooper.prototype.shootCharger = function () {
    let audio = AM.getSound('./sounds/laser_blaster_sound.wav').cloneNode();
    audio.volume = 0.2 * sfxVolume;
    audio.play();

    let rect = canvas.getBoundingClientRect();
    let startCoor = { x: (this.x + 70 + this.x) / 2, y: (this.y + this.height + this.y) / 2 };

    var xend = center_x;
    var yend = center_y + 20;
    let endCoor = { x: xend, y: yend };
    let trooperLaser1 = this.shotgun(startCoor, endCoor);
    xend = center_x;
    yend = center_y + 100;
    endCoor = { x: xend, y: yend };
    let trooperLaser2 = this.shotgun(startCoor, endCoor);
    xend = center_x;
    yend = center_y - 60;
    endCoor = { x: xend, y: yend };
    let trooperLaser3 = this.shotgun(startCoor, endCoor);
}

Trooper.prototype.shotgun = function(startCoor, endCoor){
    let trooperLaser = new LaserBeam(startCoor, endCoor);
    trooperLaser.tag = "trooperLaser";
    trooperLaser.enemyTag = "jedi";
    trooperLaser.isShotgun = true;
    return trooperLaser;
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