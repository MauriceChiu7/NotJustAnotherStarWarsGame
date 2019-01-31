/*
Todo:
Turn on and off the lightsaber when facing left.
*/


/* Scale size of character */
var scale = 1.5;
/* This is used to toggle between attacking poses. 1 is default if the character only has 1 attack pose. */
var attkNum = 1;
const mauriceDiff = 144;
const stevenDiff = 48;
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

/* Character's center. Used to calculate the angle at which the characters should aim their weapon at. */

document.oncontextmenu = function() {
    if (debug) {
        return false;
    } else {
        return true;
    }
}

function Character(game){
    canvas.addEventListener("click", inGameClick);
    canvas.addEventListener("mousemove", aimDirection);
    // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    // *********************** //
    // Right-Facing Animations //
    // *********************** //
    this.runAnimation = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 2310, 96, 70, 0.1, 8, true, false);
    this.jumpAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 2100, 144, 140, 0.1, 9, false, false);
    this.standAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1540, 96, 70, 1, 3, true, false);
    this.crouchAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1610, 96, 70, 0.5, 3, true, false);
    this.attk1Anim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1820, 144, 140, 0.07, 5, false, false);
    this.attk2Anim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1960, 144, 140, 0.07, 5, false, false);
    this.saberOnAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1750, 96, 70, 0.1, 3, false, false);
    this.saberOffAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1750, 96, 70, 0.1, 3, false, true);
    /** Edit by Steven **/
    this.gunStandAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 0, 96, 70, 1, 3, true, false);
    this.gunCrouchAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 280, 96, 70, 0.5, 3, true, false);
    this.gunRunAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 140, 96, 70, 0.05, 8, true, false);
    this.gunJumpAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 490, 96, 70, 0.1, 8, false, false);
    this.dyingAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 630, 96, 70, 0.5, 6, false, false);

    this.gunAim0Right = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 576, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim22Right = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 480, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim45Right = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 384, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim67Right = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 288, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim90Right = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 192, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim135Right = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim157Right = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 96, 210, 96, 70, 0.5, 1, true, false);

    // ********************** //
    // Left-Facing Animations //
    // ********************** //
    this.standLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 1540, -96, 70, 1, 3, true, false);
    this.runLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 2310, -96, 70, 0.1, 8, true, false);
    this.gunStandLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 0, -96, 70, 1, 3, true, false);
    this.gunRunLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 140, -96, 70, 0.05, 8, true, false);
    this.gunJumpLeftAnim = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1632, 490, -96, 70, 0.1, 8, false, false);

    this.gunAim0Left = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 960, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim22Left = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1056, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim45Left = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1152, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim67Left = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1248, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim90Left = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1344, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim135Left = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1536, 210, 96, 70, 0.5, 1, true, false);
    this.gunAim157Left = new Animation(AM.getAsset("./img/luke_sprites_left.png"), 1440, 210, 96, 70, 0.5, 1, true, false);

    // ************************ //
    // Aiming                   //
    // ************************ //

    this.mouse = 1;
    this.primaryWeapon = true;
    this.dying = false;
    /** Edit by Steven **/

    // Default Stats
    this.standing = true;
    this.jumping = false;
    this.running = false;
    this.crouching = false;
    this.attacking = false;
    this.switching = false;
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
        this.primaryWeapon = !this.primaryWeapon;
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
            this.x += this.game.clockTick * this.speed;
        } else {
            this.x -= this.game.clockTick * this.speed;
        }
    }

    // Jumping
    if (this.jumping){
        this.crouching = false;
        this.attacking = false;
        this.switching = false;
        // this.running = false;
        var jumpDistance;
        if (this.primaryWeapon) {
            if (this.jumpAnim.isDone()) {
                this.jumpAnim.elapsedTime = 0;
                this.jumping = false;
                this.running = false;
                this.standing = true;
            }
            jumpDistance = this.jumpAnim.elapsedTime / this.jumpAnim.totalTime;
        } else {
            if (this.gunJumpAnim.isDone()) {
                this.gunJumpAnim.elapsedTime = 0;
                this.jumping = false;
                this.running = false;
                this.standing = true;
            }
            jumpDistance = this.gunJumpAnim.elapsedTime / this.gunJumpAnim.totalTime;
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
        if (this.attk1Anim.isDone()) {
            this.attk1Anim.elapsedTime = 0;
            attkNum = 2;
            this.attacking = false;
            this.standing = true;
        }
        if (this.attk2Anim.isDone()) {
            this.attk2Anim.elapsedTime = 0;
            attkNum = 1;
            this.attacking = false;
            this.standing = true;
        }
    }

    // Turning on / off Lightsaber
    if (this.saberOnAnim.isDone() || this.saberOffAnim.isDone()) {
        this.saberOnAnim.elapsedTime = 0;
        this.saberOffAnim.elapsedTime = 0;
        this.switching = false;
        this.standing = true;
    }

    // Crouching
    if (this.crouching) {
        this.jumping = false;
        this.attacking = false;
    } // Could have else if (this.crouching && this.attacking) for crouch attack

    if (this.switching) {
        this.crouching = false;
        this.standing = false;
        // this.jumping = false;
    }

    // if (this.aiming) {
    //     // if (this.gunAim0Right.isDone() || this.gunAim22Right.isDone() || this.gunAim45Right.isDone() || this.gunAim67Right.isDone() || this.gunAim90Right.isDone() || this.gunAim)
    // }

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
    if (this.game.mouseMoveX > this.x + mauriceDiff) {
        // this.facingRight = true;
        this.drawRight();
    } else {
        // this.facingRight = false;
        this.drawLeft();
    }
}

Character.prototype.drawRight = function() {
// this.cursorAnim.drawFrame(this.game.clockTick, this.ctx, this.game.mouseMoveX - 275 , this.game.mouseMoveY - 125, 0.03);
    if (this.primaryWeapon) { // If the character is using their primaryWeapon
        if (this.switching) {
            this.saberOnAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.standAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.crouchAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            if (attkNum === 1) {
                this.attk1Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.jumpAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.runAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else { // If the character is using their secondary weapon
        if (this.switching) {
            this.saberOffAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.drawStanding();
            // this.gunStandAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.gunCrouchAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            // Todo: Need to implement attacking with gun.
            // Todo: Need to remove if else statement below.
            if (attkNum === 1) {
                this.attk1Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.gunJumpAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.gunRunAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    }
    Entity.prototype.draw.call(this);
}

Character.prototype.drawLeft = function() {
// this.cursorAnim.drawFrame(this.game.clockTick, this.ctx, this.game.mouseMoveX - 275 , this.game.mouseMoveY - 125, 0.03);
    if (this.primaryWeapon) { // If the character is using their primaryWeapon
        if (this.switching) {
            this.saberOnAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + mauriceDiff, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.crouchAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            if (attkNum === 1) {
                this.attk1Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.jumpAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.runLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + mauriceDiff, this.y + groundHeight, scale);
            console.log(this.x + ", " + this.game.mouseMoveX);
        }
    } else { // If the character is using their secondary weapon
        if (this.switching) {
            this.saberOffAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.standing) {
            this.drawStanding();
            //this.gunStandLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x + mauriceDiff, this.y + groundHeight, scale);
        }
        if (this.crouching) {
            // This will actually not play the crouch animation.
            // Instead, it will call a function which takes in mouse
            // coords and character coords and return the proper frame to draw.
            this.gunCrouchAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.attacking) {
            // Todo: Need to implement attacking with gun.
            // Todo: Need to remove if else statement below.
            if (attkNum === 1) {
                this.attk1Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            } else {
                this.attk2Anim.drawFrame(this.game.clockTick, this.ctx, this.x - 60, this.y + LUKE_2_HIGH_DIFF + groundHeight, scale);
            }
        }
        if (this.jumping) {
            this.gunJumpLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.dying) {
            this.dyingAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
        if (this.running && !this.jumping && !this.attacking) {
            this.gunRunLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    }
    Entity.prototype.draw.call(this);
}

Character.prototype.drawStanding = function () {
    absDegree = Math.abs(degree);
    if (absDegree >= 0 && absDegree < 11) {
        if (degree > 0) {
            this.gunAim0Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim0Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else if (absDegree >= 11 && absDegree < 33) {
        if (degree > 0) {
            this.gunAim22Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim22Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else if (absDegree >= 33 && absDegree < 56) {
        if (degree > 0) {
            this.gunAim45Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim45Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else if (absDegree >= 56 && absDegree < 78) {
        if (degree > 0) {
            this.gunAim67Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim67Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else if (absDegree >= 78 && absDegree < 112) {
        if (degree > 0) {
            this.gunAim90Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim90Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else if (absDegree >= 112 && absDegree < 146) {
        if (degree > 0) {
            this.gunAim135Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim135Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else if (absDegree >= 146 && absDegree <= 180) {
        if (degree > 0) {
            this.gunAim157Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim157Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    } else {
        if (degree > 0) {
            this.gunAim157Right.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        } else {
            this.gunAim157Left.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + groundHeight, scale);
        }
    }
}

function aimDirection(event) {
    center_x += 144;
    center_y += 200;
    var delta_x;
    var delta_y;

    delta_x = (event.clientX - center_x);
    delta_y = (event.clientY - center_y);

    var hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
    var radian = Math.asin(delta_x/hypotenuse);
    degree = radian * 180 / Math.PI;

    if (debug) {
        console.log("mouse x: " + event.clientX + ", mouse y: " + event.clientY);
        console.log("this.x: " + center_x + ", this.y: " + center_y);
        console.log("dx: " + delta_x + ", dy: " + delta_y);
        console.log("Mouse X: " + event.clientX + "Mouse Y: " + event.clientY);
    }
    if (event.clientY > center_y) {
        if (event.clientX > center_x) {
            degree = 180 - degree;
        } else {
            degree = -180 - degree;
        }
        // console.log("mouse Y > center Y ");
    }
    // console.log("aiming here: " + degree + " DEGREE");
    // return degree;
}

function stand() {
    this.standing = true;
    this.running = false;
    this.crouching = false;
}

function inGameClick(event) {
    console.log(event + 'click');
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
        audio.volume = sfxVolume * 0.2;
        audio.play();
        //console.log(gameEngine.entities[0]);
        gameEngine.entities[0].attacking = true; // entities[0] is luke because we only have one character rn.
        gameEngine.entities[0].switching = false;
    }
}
