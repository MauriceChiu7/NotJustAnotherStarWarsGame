/*
Todo:
1. Turn on and off the lightsaber when facing left.
2. Instead of play jump, play attack animation.
3. Switch gunRollJumping to gunJumpAiming.
4. Shooting.
5. this.dyingRightAnim.isDone()
*/


/* Scale size of character */
var scale = 1.5;
/* This is used to toggle between attacking poses. 1 is default if the character only has 1 attack pose. */
var attkNum = 1;
const rightToLeftOffset = 144;//144
const cursorOffset = -48; // -20 // Question
var canvas = document.getElementById("gameWorld");
/* Set to true when debugging */
var debug = false;
/*
Use this height difference whenever you are using luke_sprites_right.png and that when the height of
the frame is 2-high. This value is intentionally set to negative. When you apply it to y coordinates, just "+" them.
*/
const LUKE_2_HIGH_DIFF = -105;
/*
The ground height can be changed depending on which platform the character is on. This value
is intentionally set to negative. When you apply it to y coordinates, just "+" them.
*/
var groundHeight = -30;
// var facingRight = true;
var center_x;
var center_y;
var degree;
var primaryWeapon = true;

/* Character's center. Used to calculate the angle at which the characters should aim their weapon at. */

document.oncontextmenu = function() {
    if (debug) {
        return true;
    } else {
        return false;
    }
}

function Character(game){
    canvas.addEventListener("click", inGameClick);
    canvas.addEventListener("mousemove", aimDirection);
    // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    // *********************** //
    // Right-Facing Animations //
    // *********************** //

    // Primary weapon animations
    this.runRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 2310, 96, 70, 0.1, 8, true, false);
    this.jumpRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 2100, 144, 140, 0.1, 9, false, false);
    this.standRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1540, 96, 70, 1, 3, true, false);
    this.crouchRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1610, 96, 70, 0.5, 3, true, false);
    this.attk1RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1820, 144, 140, 0.07, 5, false, false);
    this.attk2RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1960, 144, 140, 0.07, 5, false, false);
    this.saberOnRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1750, 96, 70, 0.1, 3, false, false);
    this.saberOffRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1750, 96, 70, 0.1, 3, false, true);
    this.dyingRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 630, 96, 70, 0.5, 6, false, false);

    /** Edit by Steven **/
    // Secondary weapon animations
    //this.gunStandRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 0, 96, 70, 1, 3, true, false);
    this.gunCrouchRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 280, 96, 70, 1, 3, true, false);
    this.gunRunRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 140, 96, 70, 0.05, 8, true, false);
    this.gunJumpRightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 490, 96, 70, 0.1, 8, false, false);

    this.gunStanding0RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 576, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding22RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 480, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding45RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 384, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding67RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 288, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding90RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 192, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding135RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding157RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 96, 210, 96, 70, 0.5, 1, true, false);

    this.gunCrouching0RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 576, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching22RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 480, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching45RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 384, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching67RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 288, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching90RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 192, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching157RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching135RightAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 96, 280, 96, 70, 0.5, 1, true, false);

    // ********************** //
    // Left-Facing Animations //
    // ********************** //

    // Primary weapon animations
    this.standLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 1540, -96, 70, 1, 3, true, false);
    this.runLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 2310, -96, 70, 0.1, 8, true, false);
    this.jumpLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 336, 2100, 144, 140, 0.1, 9, false, false);
    this.crouchLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1344, 1610, 96, 70, 1, 3, true, false);
    this.saberOnLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1344, 1750, 96, 70, 0.1, 3, false, true);
    this.saberOffLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1344, 1750, 96, 70, 0.1, 3, false, false);

    // Secondary weapon animations
    this.gunStandLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 0, -96, 70, 1, 3, true, false);
    this.gunCrouchLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1344, 280, 96, 70, 1, 3, true, false);
    this.gunRunLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 140, -96, 70, 0.05, 8, true, false);
    this.gunJumpLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 864, 490, 96, 70, 0.1, 8, false, false);

    this.gunStanding0LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 960, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding22LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1056, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding45LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1152, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding67LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1248, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding90LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1344, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding135LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1536, 210, 96, 70, 0.5, 1, true, false);
    this.gunStanding157LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1440, 210, 96, 70, 0.5, 1, true, false);

    this.gunCrouching0LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 960, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching22LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1056, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching45LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1152, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching67LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1248, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching90LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1344, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching157LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1536, 280, 96, 70, 0.5, 1, true, false);
    this.gunCrouching135LeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1440, 280, 96, 70, 0.5, 1, true, false);

    // ************************ //
    // Aiming                   //
    // ************************ //

    this.mouse = 1;
    primaryWeapon = true;
    this.dying = false;
    /** Edit by Steven **/

    // On create character states
    this.standing = true;
    this.jumping = false;
    this.running = false;
    this.crouching = false;
    this.attacking = false;
    this.switching = false;
    this.dying = false;
    this.dead = false;
    // this.aiming = false;

    this.ground = 500;
    this.speed = 500;

    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 500, 500);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;
Character.prototype.update = function () {
    // ************************************** //
    // Key A, S, D, F.                        //
    // Moving the Character.                  //
    // ************************************** //

    // **************************** //
    // Mouse Events                 //
    // Keyboard Events              //
    // **************************** //

    if (this.game.d){                                   // Key D: Running Right
        this.running = true;
        this.standing = false;
        this.theD = true;
    } else if (this.game.a){                            // Key A: Running Left
        this.running = true;
        this.standing = false;
        this.theD = false;
    }
    if (this.game.w){                                   // Key W: Jumping
        this.jumping = true;
        this.standing = false;
    }
    if (this.game.s){                                   // Key S: Crouching
        this.crouching = true;
        this.standing = false;
    }
    if (this.game.r) {                                  // Key R: Switching between primary and secondary weapon
        this.switching = true;
        this.standing = false;
        this.attacking = false;
        // this.aiming = true;
        primaryWeapon = !primaryWeapon;
    }
    if (this.game.i) {                                  // Key I: Dying
        this.dying = !this.dying;
    }
    if (this.game.keyup && !this.jumping){              // Keyup: Standing
        this.standing = true;
        this.running = false;
        this.crouching = false;
    }

    // Running
    if (this.running){
        this.crouching = false;
        this.standing = false;
        if (this.theD){
            if (this.x > this.game.mouseMoveX) {
                this.x += this.game.clockTick * (this.speed * 0.5);
            } else {
                this.x += this.game.clockTick * this.speed;
            }
        } else {
            if (this.x < this.game.mouseMoveX) {
                this.x -= this.game.clockTick * (this.speed * 0.5);
            } else {
                this.x -= this.game.clockTick * this.speed
            }
        }
    }

    // Jumping
    if (this.jumping){
        this.crouching = false;
        this.attacking = false;
        this.switching = false;
        // this.running = false;
        var jumpDistance;
        if (primaryWeapon) {
            if (this.jumpRightAnim.isDone() || this.jumpLeftAnim.isDone()) {
                this.jumpRightAnim.elapsedTime = 0;
                this.jumpLeftAnim.elapsedTime = 0;
                this.jumping = false;
                this.running = false;
                this.standing = true;
            }
            if (degree >= 0) { // facing right
                if (primaryWeapon) {
                    jumpDistance = this.jumpRightAnim.elapsedTime / this.jumpRightAnim.totalTime;
                } else {
                    jumpDistance = this.gunJumpRightAnim.elapsedTime / this.gunJumpRightAnim.totalTime;
                }
            } else {
                if (primaryWeapon) {
                    jumpDistance = this.jumpLeftAnim.elapsedTime / this.jumpLeftAnim.totalTime;
                } else {
                    jumpDistance = this.gunJumpLeftAnim.elapsedTime / this.gunJumpLeftAnim.totalTime;
                }
            }

        } else {
            if (this.gunJumpRightAnim.isDone() || this.gunJumpLeftAnim.isDone()) {
                this.gunJumpRightAnim.elapsedTime = 0;
                this.gunJumpLeftAnim.elapsedTime = 0;
                this.jumping = false;
                this.running = false;
                this.standing = true;
            }
            if (degree >= 0) { // facing right
                if (primaryWeapon) {
                    jumpDistance = this.jumpRightAnim.elapsedTime / this.jumpRightAnim.totalTime;
                } else {
                    jumpDistance = this.gunJumpRightAnim.elapsedTime / this.gunJumpRightAnim.totalTime;
                }
            } else {
                if (primaryWeapon) {
                    jumpDistance = this.jumpLeftAnim.elapsedTime / this.jumpLeftAnim.totalTime;
                } else {
                    jumpDistance = this.gunJumpLeftAnim.elapsedTime / this.gunJumpLeftAnim.totalTime;
                }
            }
        }
        var totalHeight = scale * 300;

        if (jumpDistance > 0.5) {
            jumpDistance = 1 - jumpDistance;
        }
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }

    // Attacking
    if (this.attacking) {
        this.standing = false;
        if (this.attk1RightAnim.isDone()) {
            this.attk1RightAnim.elapsedTime = 0;
            attkNum = 2;
            this.attacking = false;
            this.standing = true;
        }
        if (this.attk2RightAnim.isDone()) {
            this.attk2RightAnim.elapsedTime = 0;
            attkNum = 1;
            this.attacking = false;
            this.standing = true;
        }
    }

    // Turning on / off Lightsaber
    if (this.saberOnRightAnim.isDone() || this.saberOffRightAnim.isDone() || this.saberOnLeftAnim.isDone() || this.saberOffLeftAnim.isDone()) {
        this.saberOnRightAnim.elapsedTime = 0;
        this.saberOffRightAnim.elapsedTime = 0;
        this.saberOnLeftAnim.elapsedTime = 0;
        this.saberOffLeftAnim.elapsedTime = 0;
        this.switching = false;
        this.standing = true;
    }

    // Crouching
    if (this.crouching) {
        this.jumping = false;
        this.attacking = false;
        this.standing = false;
    } // Could have else if (this.crouching && this.attacking) for crouch attack

    if (this.switching) {
        this.crouching = false;
        this.standing = false;
        // this.jumping = false;
    }

    // World wrapping
    if (this.x > 1200){
      this.x=0;
    } else if (this.x < 0){
      this.x = 1200;
    }

    center_x = this.x;
    center_y = this.y;

    Entity.prototype.update.call(this);
}

Character.prototype.draw = function(){
    if (this.game.mouseMoveX + cursorOffset > this.x) {
        console.log("this.x: " + this.x + ", mouseX: " + (this.game.mouseMoveX + cursorOffset));
        this.drawRight();
    } else {
        console.log("this.x: " + this.x + ", mouseX: " + (this.game.mouseMoveX + cursorOffset));
        this.drawLeft();
    }
}

Character.prototype.drawRight = function() {
    if (primaryWeapon) { // If the character is using their primaryWeapon
        if (this.switching) {
            this.saberOnRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.crouchRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            if (attkNum === 1) {
                this.attk1RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.jumpRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.runRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else { // If the character is using their secondary weapon
        if (this.switching) {
            this.saberOffRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.drawGunStanding();
            // this.gunStandRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.drawGunCrouching();
            // this.gunCrouchRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            // Todo: Need to implement attacking with gun.
            // Todo: Need to remove if else statement below.
            if (attkNum === 1) {
                this.attk1RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.gunJumpRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.gunRunRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    }
    Entity.prototype.draw.call(this);
}

Character.prototype.drawLeft = function() {
    if (primaryWeapon) { // If the character is using their primaryWeapon
        if (this.switching) {
            this.saberOnLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.crouchLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            if (attkNum === 1) {
                this.attk1RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.jumpLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.runLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y + groundHeight, scale);
        }
    } else { // If the character is using their secondary weapon
        if (this.switching) {
            this.saberOffLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.drawGunStanding();
            //this.gunStandLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + mauriceDiff, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.drawGunCrouching();
            // this.gunCrouchRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            // Todo: Need to implement attacking with gun.
            // Todo: Need to remove if else statement below.
            if (attkNum === 1) {
                this.attk1RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.gunJumpLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.gunRunLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + rightToLeftOffset, this.y + groundHeight, scale);
        }
    }
    Entity.prototype.draw.call(this);
}

Character.prototype.drawGunStanding = function () {
    absDegree = Math.abs(degree);
    if (absDegree >= 0 && absDegree < 11) {
        (degree > 0) ? this.gunStanding0RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding0LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    } else if (absDegree >= 11 && absDegree < 33) {
        (degree > 0) ? this.gunStanding22RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding22LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    } else if (absDegree >= 33 && absDegree < 56) {
        (degree > 0) ? this.gunStanding45RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding45LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    } else if (absDegree >= 56 && absDegree < 78) {
        (degree > 0) ? this.gunStanding67RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding67LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    } else if (absDegree >= 78 && absDegree < 112) {
        (degree > 0) ? this.gunStanding90RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding90LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    } else if (absDegree >= 112 && absDegree < 146) {
        (degree > 0) ? this.gunStanding135RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding135LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    } else if (absDegree >= 146 && absDegree <= 180) {
        (degree > 0) ? this.gunStanding157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    } else {
        (degree > 0) ? this.gunStanding157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunStanding157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 20, this.y + groundHeight, scale);
    }
}

Character.prototype.drawGunCrouching = function () {
    absDegree = Math.abs(degree);
    if (absDegree >= 0 && absDegree < 11) {
        (degree > 0) ? this.gunCrouching0RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching0LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    } else if (absDegree >= 11 && absDegree < 33) {
        (degree > 0) ? this.gunCrouching22RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching22LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    } else if (absDegree >= 33 && absDegree < 56) {
        (degree > 0) ? this.gunCrouching45RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching45LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    } else if (absDegree >= 56 && absDegree < 78) {
        (degree > 0) ? this.gunCrouching67RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching67LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    } else if (absDegree >= 78 && absDegree < 112) {
        (degree > 0) ? this.gunCrouching90RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching90LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    } else if (absDegree >= 112 && absDegree < 146) {
        (degree > 0) ? this.gunCrouching135RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching135LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    } else if (absDegree >= 146 && absDegree <= 180) {
        (degree > 0) ? this.gunCrouching157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    } else {
        (degree > 0) ? this.gunCrouching157RightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale) : this.gunCrouching157LeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
    }
}

function aimDirection(event) {
    if (primaryWeapon) {
        center_x += 48; // Question
    } else {
        center_x += 48;
    }
    //center_y += 210;
    // console.log("center_x: " + center_x + ", center_y: " + center_y);
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;

    var delta_x = (x - center_x);
    var delta_y = (y- center_y);
    var hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
    var radian = Math.asin(delta_x/hypotenuse);
    degree = radian * 180 / Math.PI;

    // if (debug) {
        // console.log("mouse x: " + event.clientX + ", mouse y: " + event.clientY);
        //console.log("center_x: " + center_x + ", center_y: " + center_y);
        // console.log("standing: " + this.standing)
        // console.log("dx: " + delta_x + ", dy: " + delta_y);
    // }
    if (y > center_y) {
        if (x > center_x) {
            degree = 180 - degree;
        } else {
            degree = -180 - degree;
        }
        // console.log("mouse Y > center Y ");
    }
    // console.log("aiming here: " + degree + " DEGREE");
}

function stand() {
    this.standing = true;
    this.running = false;
    this.crouching = false;
}

function inGameClick(event) {
    //if (debug)
        //console.log(event + 'click');
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
        audio.volume = sfxVolume * 0.2;
        audio.play();
        statusBars.update(0, -40);
        //console.log(gameEngine.entities[0]);
        gameEngine.entities[0].attacking = true; // entities[0] is luke because we only have one character rn.
        gameEngine.entities[0].switching = false;
    }
}
