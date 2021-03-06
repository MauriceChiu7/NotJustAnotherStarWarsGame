const SCALE_LUKE = 1;
/* This is used to toggle between attacking poses. 1 is default if the character only has 1 attack pose. */
const rightToLeftOffset = 92;//144
const cursorOffset = -48; // -20 // Question
const LUKE_HITBOX_X_OFFSET = 35;
const LUKE_HITBOX_Y_OFFSET = 20;
var LUKE_COLLISION_WIDTH = 25;
var LUKE_COLLISION_HEIGHT = 50;
var attkNumLuke = 1;
/*
Use this height difference whenever you are using luke_sprites_right.png and that when the height of
the frame is 2-high. This value is intentionally set to negative. When you apply it to y coordinates, just "+" them.
*/
const LUKE_2_HIGH_DIFF = -70; // -105

/* Character's center. Used to calculate the angle at which the characters should aim their weapon at. */
var center_x;
var center_y;
var degree;
var primaryWeapon = true;
var mouseCoor = { x: 0, y: 0 };
var playerCoor = { x: 0, y: 0 };

var blocking = false;
var rightClickIsDown = false;
var saberthrown = false;
var canSwitchWeapons = true;

function Luke() {
    this.x = 300;
    this.y = 100;
    this.width = 30;
    this.height = 50;
    this.center_x = this.x + this.width / 2;
    this.center_y = this.y + this.height / 2;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.tag = "player";
    this.health = 100; //100
    this.fullHealth = 100;

    // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    // *********************** //
    // Right-Facing Animations //
    // *********************** //

    // Primary weapon animations
    let rightLukeSpriteSheet = AM.getAsset("./img/luke_sprites_right.png");
    this.blockRightAnim = new Animation(rightLukeSpriteSheet, 300, 905, 96, 70, 0.1, 1, true, false);
    this.runRightAnim = new Animation(rightLukeSpriteSheet, 0, 2310, 96, 70, 0.1, 8, true, false);
    this.runRightBackwardsAnim = new Animation(rightLukeSpriteSheet, 0, 2310, 96, 70, 0.1, 8, true, true);
    this.jumpRightAnim = new Animation(rightLukeSpriteSheet, 0, 2100, 144, 140, 0.1, 9, false, false);
    this.standRightAnim = new Animation(rightLukeSpriteSheet, 0, 1540, 96, 70, 1, 3, true, false);
    this.crouchRightAnim = new Animation(rightLukeSpriteSheet, 0, 1610, 96, 70, 0.5, 3, true, false);
    this.attk1RightAnim = new Animation(rightLukeSpriteSheet, 0, 1820, 144, 140, 0.07, 5, false, false);
    this.attk2RightAnim = new Animation(rightLukeSpriteSheet, 0, 1960, 144, 140, 0.07, 5, false, false);
    this.saberOnRightAnim = new Animation(rightLukeSpriteSheet, 0, 1750, 96, 70, 0.1, 3, false, false);
    this.saberOffRightAnim = new Animation(rightLukeSpriteSheet, 0, 1750, 96, 70, 0.1, 3, false, true);
    this.dyingRightAnim = new Animation(rightLukeSpriteSheet, 0, 630, 96, 70, 0.2, 6, false, false);

    this.deadAnim = new Animation(rightLukeSpriteSheet, 5 * 96, 630, 96, 70, 1, 1, true, false);

    /** Edit by Steven **/
    // Secondary weapon animations
    //this.gunStandRightAnim = new Animation(rightLukeSpriteSheet, 0, 0, 96, 70, 1, 3, true, false);
    this.gunCrouchRightAnim = new Animation(rightLukeSpriteSheet, 0, 280, 96, 70, 1, 3, true, false);

    this.gunRunRightAnim = new Animation(rightLukeSpriteSheet, 0, 140, 96, 70, 0.1, 8, true, true);
    this.gunRunRightBackwardsAnim = new Animation(rightLukeSpriteSheet, 0, 140, 96, 70, 0.1, 8, true, false);

    this.gunJumpRightAnim = new Animation(rightLukeSpriteSheet, 0, 490, 96, 70, 0.1, 8, false, false);

    this.gunStanding0RightAnim = new Animation(rightLukeSpriteSheet, 576, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding22RightAnim = new Animation(rightLukeSpriteSheet, 480, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding45RightAnim = new Animation(rightLukeSpriteSheet, 384, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding67RightAnim = new Animation(rightLukeSpriteSheet, 288, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding90RightAnim = new Animation(rightLukeSpriteSheet, 192, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding135RightAnim = new Animation(rightLukeSpriteSheet, 0, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding157RightAnim = new Animation(rightLukeSpriteSheet, 96, 210, 96, 70, 0.5, 1, true, false);

    this.gunCrouching0RightAnim = new Animation(rightLukeSpriteSheet, 576, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching22RightAnim = new Animation(rightLukeSpriteSheet, 480, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching45RightAnim = new Animation(rightLukeSpriteSheet, 384, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching67RightAnim = new Animation(rightLukeSpriteSheet, 288, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching90RightAnim = new Animation(rightLukeSpriteSheet, 192, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching157RightAnim = new Animation(rightLukeSpriteSheet, 0, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching135RightAnim = new Animation(rightLukeSpriteSheet, 96, 280, 96, 70, 0.5, 1, true, false);

    // ********************** //
    // Left-Facing Animations //
    // ********************** //
    let leftLukeSpriteSheet = AM.getAsset("./img/luke_sprites_left.png");
    // Primary weapon animations
    this.blockLeftAnim = new Animation(leftLukeSpriteSheet, 1285, 905, 40, 70, 0.1, 1, true, false);
    this.standLeftAnim = new Animation(leftLukeSpriteSheet, 1632, 1540, -96, 70, 1, 3, true, false);

    this.runLeftAnim = new Animation(leftLukeSpriteSheet, 1632, 2310, -96, 70, 0.1, 8, true, false);
    this.runLeftBackwardsAnim = new Animation(leftLukeSpriteSheet, 1632, 2310, -96, 70, 0.1, 8, true, true);

    this.jumpLeftAnim = new Animation(leftLukeSpriteSheet, 336, 2100, 144, 140, 0.1, 9, false, true);
    this.crouchLeftAnim = new Animation(leftLukeSpriteSheet, 1344, 1610, 96, 70, 1, 3, true, false);
    this.saberOnLeftAnim = new Animation(leftLukeSpriteSheet, 1344, 1750, 96, 70, 0.1, 3, false, true);
    this.saberOffLeftAnim = new Animation(leftLukeSpriteSheet, 1344, 1750, 96, 70, 0.1, 3, false, false);
    this.attk1LefttAnim = new Animation(leftLukeSpriteSheet, 880, 1820, 144, 140, 0.07, 5, false, true);
    this.attk2LefttAnim = new Animation(leftLukeSpriteSheet, 880, 1960, 144, 140, 0.07, 5, false, true);

    // Secondary weapon animations
    this.gunStandLeftAnim = new Animation(leftLukeSpriteSheet, 1632, 0, -96, 70, 1, 3, true, false);
    this.gunCrouchLeftAnim = new Animation(leftLukeSpriteSheet, 1344, 280, 96, 70, 1, 3, true, false);

    this.gunRunLeftAnim = new Animation(leftLukeSpriteSheet, 1632, 140, -96, 70, 0.1, 8, true, true);
    this.gunRunLeftBackwardsAnim = new Animation(leftLukeSpriteSheet, 1632, 140, -96, 70, 0.1, 8, true, false);

    this.gunJumpLeftAnim = new Animation(leftLukeSpriteSheet, 864, 490, 96, 70, 0.1, 8, false, false);

    this.gunStanding0LeftAnim = new Animation(leftLukeSpriteSheet, 960, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding22LeftAnim = new Animation(leftLukeSpriteSheet, 1056, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding45LeftAnim = new Animation(leftLukeSpriteSheet, 1152, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding67LeftAnim = new Animation(leftLukeSpriteSheet, 1248, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding90LeftAnim = new Animation(leftLukeSpriteSheet, 1344, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding135LeftAnim = new Animation(leftLukeSpriteSheet, 1536, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding157LeftAnim = new Animation(leftLukeSpriteSheet, 1440, 210, 96, 70, 0.5, 1, true, false);

    this.gunCrouching0LeftAnim = new Animation(leftLukeSpriteSheet, 960, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching22LeftAnim = new Animation(leftLukeSpriteSheet, 1056, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching45LeftAnim = new Animation(leftLukeSpriteSheet, 1152, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching67LeftAnim = new Animation(leftLukeSpriteSheet, 1248, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching90LeftAnim = new Animation(leftLukeSpriteSheet, 1344, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching157LeftAnim = new Animation(leftLukeSpriteSheet, 1536, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching135LeftAnim = new Animation(leftLukeSpriteSheet, 1440, 280, 96, 70, 0.5, 1, true, false);

    // ************************ //
    // Aiming                   //
    // ************************ //

    this.mouse = 1;
    primaryWeapon = true;
    this.dying = false;
    /** Edit by Steven **/

    // On create character states
    this.jumping = false;
    this.crouching = false;
    this.dropping = false;
    this.attacking = false;
    this.switching = false;
    this.dying = false;
    this.dead = false;

    this.fullMCollisions = [];
    this.bottomMCollisions = [];
    this.collisionRight;
    this.collisionLeft;
    this.collisionTop;
    this.collisionBottom;
    this.crateCollision;
    this.currentDisplacementX = LUKE_COLLISION_WIDTH + LUKE_HITBOX_X_OFFSET;
    this.currentDisplacementY = LUKE_COLLISION_HEIGHT + LUKE_HITBOX_Y_OFFSET;

    canvas.addEventListener('mousedown', function (e) { // FIX : block in same direction facing laser
        rightClickIsDown = true;
        if (e.button == 2 && primaryWeapon) {
            setTimeout(function () {
                if (rightClickIsDown) {
                    blocking = true;
                }
            }, 50);
        }
    });
    let that = this;
    canvas.addEventListener('mouseup', function (e) {
        rightClickIsDown = false;
        if (e.button == 2 && primaryWeapon) {
            blocking = false;
            that.standing = true;
        }
    });

    this.ctx = gameEngine.ctx;
    Entity.call(this, gameEngine, this.x, this.y, this.width, this.height);
}

Luke.prototype = new Entity();
Luke.prototype.constructor = Luke;

Luke.prototype.getMapCollisions = function () {
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
            this.y + LUKE_COLLISION_HEIGHT + this.currentDisplacementY > current.y && this.y + this.yAcceleration + this.currentDisplacementY <= current.y + 20 && this.yAcceleration >= 0) {
            this.bottomMCollisions.push(bottomOnlyCollisions[i]);
        }
    }
}

// Checks theoretical collision starting at given x and y
Luke.prototype.getMapCollisions2 = function (x, y) {
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
            } else if (x + this.currentDisplacementX <= current.x + 1 && x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x) {
                direction = "left";
            }
            toReturn.push({ object: current, direction: direction });
        }
    }
    return toReturn;
}

Luke.prototype.getMapCollision = function (direction) {
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

Luke.prototype.push = function() {
    var audio = AM.getSound('./sounds/ForcePush.wav').cloneNode();
    audio.volume = sfxVolume;
    audio.play();
    var delta_x = (mouseX - this.center_x);
    var delta_y = (mouseY - this.center_y);
    // console.log("CENTER X : " + this.center_x + " CENTER Y : " + this.center_y + " mouseX : " + mouseX + " mouseY : " + mouseY);
    var hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
    var angle = Math.asin(delta_x / hypotenuse);
    var xMagnitude = Math.sin(angle) * 400;
    var yMagnitude;
    if (delta_y < 0) {
        yMagnitude = -Math.cos(angle) * 400;
    } else {
        yMagnitude = Math.cos(angle) * 400;
    }
    var pushDistance = pointsDistance(this.center_x, this.center_y, this.center_x + xMagnitude, this.center_y + yMagnitude);
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i];
        // if (current instanceof Crate) {
        if (this != current) {
            var distToCurrent = pointsDistance(this.center_x, this.center_y, current.center_x, current.center_y);
            var distCurrentToMag = pointsDistance(current.center_x, current.center_y, this.center_x + xMagnitude, this.center_y + yMagnitude);
            var sumDistance = distToCurrent + distCurrentToMag;

            var delta_x2 = (current.center_x - this.center_x);
            var delta_y2 = (current.center_y - this.center_y);
            var hypotenuse2 = Math.sqrt((delta_x2 * delta_x2) + (delta_y2 * delta_y2));
            var angle2 = Math.asin(delta_x2 / hypotenuse2);
            // console.log(angle);
            // console.log(angle2);
            if (sumDistance + 50 >= pushDistance && sumDistance - 50 <= pushDistance) {
                accelModifier = (1 - distToCurrent / pushDistance);
                if (accelModifier > 0) {
                    current.xAcceleration += xMagnitude * accelModifier * 0.1 * (1 + (angle2 - angle));
                    current.yAcceleration += yMagnitude * accelModifier * 0.1 * (1 - (angle2 - angle));
                    current.health -= 100;
                }
            }
        }
    }
}

Luke.prototype.getDistance = function (thisEnt, otherEnt) {
    let dx, dy;
    dx = thisEnt.x - otherEnt.x;
    dy = thisEnt.y - otherEnt.y;
    let theDist = Math.sqrt(dx * dx + dy * dy);
    // console.log("Distance: " + theDist + ", " +otherEnt.x + ", "+(thisEnt.x + thisEnt.width));
    return theDist;
}

Luke.prototype.attackCollide = function (thisEnt, otherEnt) {
    let distance = this.getDistance(thisEnt, otherEnt);
    // console.log("Distance: " + distance + ", WIDTH: " + thisEnt.width + ", " + otherEnt.width);
    // console.log(distance < thisEnt.width + otherEnt.width);
    return distance < thisEnt.width + otherEnt.width || distance < thisEnt.height + otherEnt.height;
}

Luke.prototype.collideRight = function (thisEnt, otherEnt) {
    let distance = this.getDistance(thisEnt, otherEnt);
    return distance < thisEnt.width + 30 && thisEnt.x < otherEnt.x;
}

Luke.prototype.collideLeft = function (thisEnt, otherEnt) {
    let distance = this.getDistance(thisEnt, otherEnt);
    return thisEnt.x < otherEnt.x + otherEnt.width && distance < thisEnt.width;
}

Luke.prototype.update = function () {
    this.center_x = this.x + this.width / 2;
    this.center_y = this.y + this.height / 2;
    // console.log(this.health);
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

    // Luke collides with troopers when moving 
    for (let i = 0; i < this.game.entities.length; i++) {
        let curEnt = this.game.entities[i];
        if (curEnt instanceof Trooper) {
            if (!curEnt.dead) {
                if (this.collideRight(this, curEnt)) {
                    this.x = curEnt.x - this.width - 30;
                    this.xAcceleration = 0;
                } else if (this.collideLeft(this, curEnt)) {
                    this.x = curEnt.x + curEnt.width;
                    this.xAcceleration = 0;
                }
            }
        }
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
    // console.log(this.crateCollision);
    // movement
    if (gameEngine.w && (collisionBottom != null || this.crateCollision) && !this.dead) {
        var collisionCheck = this.getMapCollisions2(this.x, this.y - 13);
        var canJump = true;
        for (var i = 0; i < collisionCheck.length; i++) {
            if (collisionCheck[i].direction == "bottom") {
                canJump = false;
            }
        }
        if (canJump) {
            this.jumping = true;
            statusBars.pauseRegeneration = true;
            this.yAcceleration -= 13;
        }
    }

    if (gameEngine.e && !this.dead) {      // Throw Lightsaber
        if (statusBars.checkStaminaUse(50)) {    
            if (primaryWeapon && !isLightSaberThrown()) {
                var audio = AM.getSound('./sounds/LightsaberThrow.WAV').cloneNode();
                audio.volume = sfxVolume;
                audio.play();
                playerCoor = { x: center_x, y: center_y +20 };
                const endCoor = { x: mouseCoor.x, y: mouseCoor.y };
                gameEngine.addEntity(new LightsaberThrow(playerCoor, endCoor));
                statusBars.update(0, -50);
                primaryWeapon = !primaryWeapon;
                saberthrown = true;
                canSwitchWeapons = false;
            }    
        }
    }
    if (!isLightSaberThrown() && saberthrown){
        primaryWeapon = !primaryWeapon;
        saberthrown = false;
        canSwitchWeapons = true;
    }

    if (gameEngine.d && !this.dead) {
        this.movingRight = true; this.movingLeft = false; this.crouching = false;
    }
    if (gameEngine.a && !this.dead) {
        this.movingRight = false; this.movingLeft = true; this.crouching = false;
    }
    if (gameEngine.s && !this.dead) {
        this.crouching = true; this.movingLeft = false; this.movingRight = false; blocking = false;
    }
    if (gameEngine.spacebar) {
        this.dropping = true;
    }
    if (gameEngine.keyup && !this.dead) {
        if (this.game.keyReleased == 'q') {
            if (statusBars.checkStaminaUse(30)) {
    		  this.push();
              statusBars.update(0, -30);
            }
        } else if (gameEngine.keyReleased == 'd') {
            this.movingRight = false;
        } else if (gameEngine.keyReleased == 'a') {
            this.movingLeft = false;
        } else if (gameEngine.keyReleased == 's') {
            this.crouching = false;
        } else if (gameEngine.keyReleased == ' ') {
            this.dropping = false;
        }
    }
    if (this.movingLeft && !this.dead) {
        if (blocking) {
            this.xAcceleration -= 0.4;
        } else if (this.attacking) {
            this.xAcceleration -= 0.3;
        } else {
            if (this.yAcceleration == 0) {
                this.xAcceleration -= 1.5;
            } else {
                this.xAcceleration -= 1.5;
            }
        }
    } else if (this.movingRight && !this.dead) {
        if (blocking) {
            this.xAcceleration += 0.4;
        } else if (this.attacking) {
            this.xAcceleration += 0.3;
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
    } else if (this.x + 30 < 0) {
        this.x = -30;
    }
    if (this.y > 600) {
        statusBars.health = 0;
        this.health = 0;
        gameover = true;
        canvas.addEventListener('contextmenu', reload);
    }

    canvas.addEventListener("mousemove", aimDirection);

    if (this.game.r && canSwitchWeapons && !this.dead) {                                  // Key R: Switching between primary and secondary weapon
        this.switching = true; this.attacking = false;
        // this.aiming = true;
        if (!primaryWeapon) {
            var audio = AM.getSound('./sounds/LightsaberTurnOn.wav').cloneNode();
            audio.volume = sfxVolume * 0.8;
            audio.play();
        } else {
            var audio = AM.getSound('./sounds/LightsaberTurnOff.wav').cloneNode();
            audio.volume = sfxVolume * 0.8;
            audio.play();
        }
        primaryWeapon = !primaryWeapon;
    }
    if (this.health <= 0) {
        this.dying = true; this.movingRight = false; this.movingLeft = false; blocking = false;
        this.jumping = false; this.attacking = false; this.crouching = false; this.switching = false;
        this.dead = true;
        for (var i = 0; i < gameEngine.entities[i]; i++) {
            if (gameEngine.entities[i].tag === 'player') {
                gameEngine.entities.splice(i, 1);
            }
        }
    }

    if (this.game.click && !this.dead) {
        if (primaryWeapon) {
            if (statusBars.checkStaminaUse(25)) {
                for (let i = 0; i < this.game.entities.length; i++) {   // FIX : only one swing at a time
                    let ent = this.game.entities[i];
                    if (ent instanceof Trooper && this.attackCollide(this, ent)) {
                        ent.health -= 500;
                        if (!ent.dead) {
                            createSparks(ent.x + ent.width, ent.y + ent.height / 2);
                        }
                    } else if (ent instanceof Vader && this.attackCollide(this, ent)) {
                        createSparks(ent.x + ent.width, ent.y + ent.height / 2);
                    }
                }
                if (!this.attacking) {
                    lukeClick();
                }
                this.attacking = true;
                this.switching = false;
            }
        } else {
            let laserShot = false;
            // for (var i = 0; i < gameEngine.projectiles.length; i++) {
            //     if (gameEngine.projectiles[i].tag == "luke_laser") {
            //         laserShot = true;
            //     }
            // }
            if (!laserShot) {
                let audio = AM.getSound('./sounds/laser_blaster_sound.wav').cloneNode();
                audio.volume = sfxVolume * 0.5;
                audio.play();
                let x, y;
                if (center_x > gameEngine.clickx) {
                    x = center_x;
                } else {
                    x = center_x + 40;
                }
                if (center_y > gameEngine.clicky) {
                    y = center_y;
                } else {
                    y = center_y + 30;
                }
                let playerCoor = { x: x, y: y };
                let endCoor = { x: this.game.clickx, y: this.game.clicky };
                let luke_beam = new LaserBeam(playerCoor, endCoor);
                luke_beam.tag = "luke_laser";
                // gameEngine.addEntity(luke_beam);
            }
        }
    }


    // Jumping
    if (this.jumping) {
        this.crouching = false; this.attacking = false; this.switching = false; blocking = false;
        if (primaryWeapon) {
            if (this.jumpRightAnim.isDone() || this.jumpLeftAnim.isDone()) {
                this.jumpRightAnim.elapsedTime = 0;
                this.jumpLeftAnim.elapsedTime = 0;
                statusBars.pauseRegeneration = false;
                this.jumping = false;
            }
        } else {
            if (this.gunJumpRightAnim.isDone() || this.gunJumpLeftAnim.isDone()) {
                this.gunJumpRightAnim.elapsedTime = 0;
                this.gunJumpLeftAnim.elapsedTime = 0;
                statusBars.pauseRegeneration = false;
                this.jumping = false;
            }
        }
    }

    // Attacking
    if (this.attacking) {
        if (this.attk1RightAnim.isDone() || this.attk1LefttAnim.isDone()) {
            this.attk1RightAnim.elapsedTime = 0;
            this.attk1LefttAnim.elapsedTime = 0;
            attkNumLuke = 2;
            this.attacking = false;
        }
        if (this.attk2RightAnim.isDone() || this.attk2LefttAnim.isDone()) {
            this.attk2RightAnim.elapsedTime = 0;
            this.attk2LefttAnim.elapsedTime = 0;
            attkNumLuke = 1;
            this.attacking = false;
        }
    }

    // Turning on / off Lightsaber
    if (this.saberOnRightAnim.isDone() || this.saberOffRightAnim.isDone() || this.saberOnLeftAnim.isDone() || this.saberOffLeftAnim.isDone()) {
        this.saberOnRightAnim.elapsedTime = 0;
        this.saberOffRightAnim.elapsedTime = 0;
        this.saberOnLeftAnim.elapsedTime = 0;
        this.saberOffLeftAnim.elapsedTime = 0;
        this.switching = false;
    }

    // Crouching
    if (this.crouching) {
        this.jumping = false;
        this.attacking = false;
    } // Could have else if (this.crouching && this.attacking) for crouch attack

    if (this.switching) {
        this.crouching = false;
        // this.jumping = false;
    }

    if (!statusBars.checkStaminaUse(1)) {
        blocking = false;
    }

    // Blocking
    if (blocking) {
        statusBars.update(0, -1);
        this.crouching = false;
    }
    // statusBars.update((this.health - this.fullHealth), 0)
    // console.log("health"+ (this.health - this.fullHealth));
    center_x = this.x;
    center_y = this.y;
    Entity.prototype.update.call(this);
}

Luke.prototype.draw = function () {
    // if (true) {
    //     ctx.strokeStyle = 'orange';
    //     ctx.strokeRect(this.x + LUKE_HITBOX_X_OFFSET, this.y + LUKE_HITBOX_Y_OFFSET, LUKE_COLLISION_WIDTH, LUKE_COLLISION_HEIGHT);
    //     ctx.fill();
    // }
    if (this.dead && this.dyingRightAnim.isDone()) {
        this.deadAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 10, SCALE_LUKE);
    }
    if (this.game.mouseMoveX + cursorOffset > this.x) {
        //console.log("this.x: " + this.x + ", mouseX: " + (this.game.mouseMoveX + cursorOffset));
        this.drawRight();
    } else {
        //console.log("this.x: " + this.x + ", mouseX: " + (this.game.mouseMoveX + cursorOffset));
        this.drawLeft();
    }
}

Luke.prototype.drawRight = function () { // FIX : ANIMATION OVERLAP, NEED IF ELSES OR BETTER BOOLEAN SETTINGS CUS SOMETIMES MULTIPLE ANIMATIONS PLAY AT THE SAME TIME
    if (primaryWeapon) { // If the character is using their primaryWeapon
        if (blocking && statusBars.checkStaminaUse(1)) {
            this.blockRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 10, this.y, SCALE_LUKE);
        } else if (this.switching) {
            this.saberOnRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.crouching) {
            this.crouchRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.attacking) {
            if (attkNumLuke === 1) {
                this.attk1RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 32, this.y + LUKE_2_HIGH_DIFF, SCALE_LUKE);
            } else {
                this.attk2RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 32, this.y + LUKE_2_HIGH_DIFF, SCALE_LUKE);
            }
        } else if (this.jumping) {
            this.jumpRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 25, this.y, SCALE_LUKE);
        } else if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 10, SCALE_LUKE);
        } else if (this.movingRight && !this.jumping && !this.attacking) {
            this.runRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.movingLeft && !this.jumping && !this.attacking) {
            this.runRightBackwardsAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (blocking && statusBars.checkStaminaUse(1)) {
            this.blockRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 10, this.y, SCALE_LUKE);
        } else {
            this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        }
    } else { // If the character is using their secondary weapon
        if (this.switching) {
            this.saberOffRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.crouching) {
            this.drawGunCrouching();
        } else if (this.jumping) {
            this.gunJumpRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 10, SCALE_LUKE);
        } else if (this.movingRight && !this.jumping && !this.attacking) {
            this.gunRunRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.movingLeft && !this.jumping && !this.attacking) {
            this.gunRunRightBackwardsAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else {
            this.drawGunStanding();
        }
    }
    Entity.prototype.draw.call(this);
}

Luke.prototype.drawLeft = function () {
    if (primaryWeapon) { // If the character is using their primaryWeapon
        if (blocking && statusBars.checkStaminaUse(1)) {
            this.blockLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 25, this.y, SCALE_LUKE);
        } else if (this.switching) {
            this.saberOnLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.crouching) {
            this.crouchLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.attacking) {
            if (attkNumLuke === 1) {
                this.attk1LefttAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 40, this.y + LUKE_2_HIGH_DIFF, SCALE_LUKE);
            } else {
                this.attk2LefttAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 40, this.y + LUKE_2_HIGH_DIFF, SCALE_LUKE);
            }
        } else if (this.jumping) {
            this.jumpLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 25, this.y, SCALE_LUKE);
        } else if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 10, SCALE_LUKE);
        } else if (this.movingLeft && !this.jumping && !this.attacking) {
            this.runLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y, SCALE_LUKE);
        } else if (this.movingRight && !this.jumping && !this.attacking) {
            this.runLeftBackwardsAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y, SCALE_LUKE);
        } else if (blocking && statusBars.checkStaminaUse(1)) {
            this.blockLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 25, this.y, SCALE_LUKE);
        } else {
            this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y, SCALE_LUKE);
        }
    } else { // If the character is using their secondary weapon
        if (this.switching) {
            this.saberOffLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.crouching) {
            this.drawGunCrouching();
        } else if (this.jumping) {
            this.gunJumpLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
        } else if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 10, SCALE_LUKE);
        } else if (this.movingLeft && !this.jumping && !this.attacking) {
            this.gunRunLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y, SCALE_LUKE);
        } else if (this.movingRight && !this.jumping && !this.attacking) {
            this.gunRunLeftBackwardsAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y, SCALE_LUKE);
        } else {
            this.drawGunStanding();
        }
    }
    Entity.prototype.draw.call(this);
}

var absDegree;
Luke.prototype.drawGunStanding = function () {
    absDegree = Math.abs(degree);
    if (absDegree >= 0 && absDegree < 11) {
        (degree > 0) ? this.gunStanding0RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding0LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    } else if (absDegree >= 11 && absDegree < 33) {
        (degree > 0) ? this.gunStanding22RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding22LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    } else if (absDegree >= 33 && absDegree < 56) {
        (degree > 0) ? this.gunStanding45RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding45LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    } else if (absDegree >= 56 && absDegree < 78) {
        (degree > 0) ? this.gunStanding67RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding67LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    } else if (absDegree >= 78 && absDegree < 112) {
        (degree > 0) ? this.gunStanding90RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding90LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    } else if (absDegree >= 112 && absDegree < 146) {
        (degree > 0) ? this.gunStanding135RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding135LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    } else if (absDegree >= 146 && absDegree <= 180) {
        (degree > 0) ? this.gunStanding157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    } else {
        (degree > 0) ? this.gunStanding157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunStanding157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, SCALE_LUKE);
    }
    return degree;
}

Luke.prototype.drawGunCrouching = function () {
    absDegree = Math.abs(degree);
    if (absDegree >= 0 && absDegree < 11) {
        (degree > 0) ? this.gunCrouching0RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching0LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    } else if (absDegree >= 11 && absDegree < 33) {
        (degree > 0) ? this.gunCrouching22RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching22LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    } else if (absDegree >= 33 && absDegree < 56) {
        (degree > 0) ? this.gunCrouching45RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching45LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    } else if (absDegree >= 56 && absDegree < 78) {
        (degree > 0) ? this.gunCrouching67RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching67LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    } else if (absDegree >= 78 && absDegree < 112) {
        (degree > 0) ? this.gunCrouching90RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching90LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    } else if (absDegree >= 112 && absDegree < 146) {
        (degree > 0) ? this.gunCrouching135RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching135LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    } else if (absDegree >= 146 && absDegree <= 180) {
        (degree > 0) ? this.gunCrouching157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    } else {
        (degree > 0) ? this.gunCrouching157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE) : this.gunCrouching157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_LUKE);
    }
}

function lukeClick() {
    var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
    audio.volume = sfxVolume * 0.25;
    audio.play();
    statusBars.update(0, -25);
}

function aimDirection(event) {
    if (primaryWeapon) {
        center_x += 48; // Question
    } else {
        center_x += 48;
    }
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;
    mouseCoor.x = x;
    mouseCoor.y = y;
    var delta_x = (x - center_x);
    var delta_y = (y - center_y);
    var hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
    var radian = Math.asin(delta_x / hypotenuse);
    degree = radian * 180 / Math.PI;
    if (y > center_y) {
        if (x > center_x) {
            degree = 180 - degree;
        } else {
            degree = -180 - degree;
        }
    }
}
