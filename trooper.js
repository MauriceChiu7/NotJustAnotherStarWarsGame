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

    this.spriteSheetLeft = AM.getAsset("./img/trooper_left.png");
    this.walkLeftAnim = new Animation(this.spriteSheetLeft, 124, 74, 62, 74, frameDuration, 9, true, true);
    this.standLeftAnim = new Animation(this.spriteSheetLeft, 558, 74, 62, 74, frameDuration, 1, true, false);
    this.attackLeftAnim = new Animation(this.spriteSheetLeft, 124, 444, 62, 74, frameDuration, 9, true, true);

    this.x = 600;
    this.y = 450;
    this.speed = 100;
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

Trooper.prototype.update = function () {
    // if (this.collideLeft() || this.collideRight()) {
    //   if (this.collideLeft()) this.x = this.radius;
    //   if (this.collideRight()) this.x = 800 - this.radius;
    //   this.x += this.speed * this.game.clockTick;
    //   this.y += this.speed * this.game.clockTick;
    // }
    // if (this.collideTop() || this.collideBottom()) {
    //   if (this.collideTop()) this.y = this.radius;
    //   if (this.collideBottom()) this.y = 800 - this.radius;
    //   this.x += this.speed * this.game.clockTick;
    //   this.y += this.speed * this.game.clockTick;
    // }

    this.distance = this.player.x + 50 - this.x;
    if (Math.abs(this.distance) > 80) {
        this.chanceToShoot = Math.round(Math.random() * 7);

        if (this.chanceToShoot == 0) {
            this.action = this.standing;
            this.shotsFired = false;
            for (var i = 0; i < gameEngine.entities.length; i++) {
                if (gameEngine.entities[i].tag == "trooperLaser" ){
                            // && gameEngine.entities[i].laserID == this.id) {
                    // console.log("shotsFired");
                    this.shotsFired = true;
                }
            }
            if (!this.shotsFired) {
                this.shoot();
            }
            this.action = this.standing;
        } else {
            this.action = this.standing;
        }

    // } else if (this.distance > 70) {
    //     this.x += this.game.clockTick * this.speed;
    //     this.action = this.walking;
    // } else if (this.distance < -70) {
    //     this.x -= this.game.clockTick * this.speed;
    //     this.action = this.walking;
    } else if (Math.abs(this.player.y - this.y) < 70) {
        this.action = this.attacking;
    } else {
        this.action = this.standing;
    }

    Entity.prototype.update.call(this);
}

Trooper.prototype.draw = function () {
    // this.drawRight();
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
            this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 30, this.y + 5, scale);
            break;
        case this.standing:         //standing
            this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);

            break;
        case this.attacking:         //attacking
            this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 30, this.y, scale);
            break;
    }
    Entity.prototype.draw.call(this);
}

Trooper.prototype.drawLeft = function () {
    switch (this.action) {
        case this.walking:         //walking
            this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 30, this.y + 5, scale);
            break;
        case this.standing:         //standing
            this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);

            break;
        case this.attacking:         //attacking
            this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 30, this.y, scale);
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
    trooperLaser.setID(this.id);
    // console.log("trooper laser id: " + trooperLaser.laserID);
    gameEngine.addEntity(trooperLaser);
}

// Trooper.prototype.collide = function (other) {
//   // console.log("COLLIDE: " + distance(this, other) +" "+ (this.hitbox + other.hitbox));
//   return distance(this, other) < this.hitbox + other.hitbox;
// };

// Trooper.prototype.collideLeft = function () {
//   return (this.x - this.hitbox) < 0;
// };

// Trooper.prototype.collideRight = function () {
//   return (this.x + this.hitbox) > 1200;
// };

// Trooper.prototype.collideTop = function () {
//   return (this.y - this.hitbox) < 0;
// };

// Trooper.prototype.collideBottom = function () {
//   return (this.y + this.hitbox) > 600;
// };

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