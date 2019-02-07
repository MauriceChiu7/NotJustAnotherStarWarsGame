function Vader() {
    canvas.addEventListener("click", vaderClick);
    this.spritesheet = AM.getAsset("./img/vader_sprites_left - Copy.png");
    this.x = 600;
    this.y = 500;

// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.attack1Anim = new Animation(this.spritesheet, 0, 320, 120, 80, 0.05, 13, false, false);
    this.attack2Anim = new Animation(this.spritesheet, 0, 480, 120, 80, 0.05, 11, false, false);
    // this.idleAnim = new Animation(this.spritesheet, 720, 160, 120, 80, 1, 2, true, false);
    this.idleAnim = new Animation(this.spritesheet, 720, 160, 120, 80, 1, 2, true, false);
    this.jumpAnim = new Animation(this.spritesheet, 0, 720, 120, 169, 0.2, 5, false, false);
    this.walkLeftAnim = new Animation(this.spritesheet, 0, 940, 80, 80, 0.15, 8, true, false);
    this.attacking = false;
    this.switchAttack = true;
    this.jumping = false;
    this.movingRight = false;
    this.movingLeft = false;
}

Vader.prototype = new Entity();
Vader.prototype.constructor = Vader;

Vader.prototype.update = function() {
    if (gameEngine.w) {
        this.jumping = true;
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
        var totalHeight = 200;
        var jumpDistance = this.jumpAnim.elapsedTime / this.jumpAnim.totalTime;
        if (jumpDistance > 0.5) {
            jumpDistance = 1 - jumpDistance;
        }
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = 500 - height;
    }

    if (this.movingLeft) {
        if (this.attacking) {
            this.x -= 2;
        } else {
            this.x -= 4;
        }
    } else if (this.movingRight) {
        if (this.attacking) {
            this.x += 2;
        } else {
            this.x += 4;
        }
    }
}

Vader.prototype.draw = function() {
    if (this.attacking) {
        if (this.switchAttack) {
            this.attack1Anim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
        } else {
            this.attack2Anim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
        }
    } else if (this.jumping) {
        this.jumpAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y - 80, 1);
    } else if (this.movingLeft) {
        this.walkLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
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