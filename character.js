//Scale size of character
var scale = 1.5;

function Character(game){
    //Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.runAnimation = new Animation(AM.getAsset("./img/luke_spites.png"), 20, 2325, 96, 75, 0.05, 8, true, false);
    this.jumpAnim = new Animation(AM.getAsset("./img/luke_spites.png"), 20, 2117, 144, 140, 0.1, 9, false, false);

    this.standAnim = new Animation(AM.getAsset("./img/luke_spites.png"), 20, 1555, 96, 70, 1, 3, true, false);
    this.crouchAnim = new Animation(AM.getAsset("./img/luke_spites.png"), 20, 1633, 96, 60, 0.5, 3, true, false);

    this.cursorAnim = new Animation(AM.getAsset("./img/blueLightsaber.png"), 0, 0, 1647, 1675, 0.5, 1, true, false);

    this.standing = true;
    this.jumping = false;
    this.running = false;
    this.crouching = false;
    this.ground = 500;
    this.speed = 1000;

    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 500, 500);
}
Character.prototype = new Entity();
Character.prototype.constructor = Character;
Character.prototype.update = function () {
    //Running
    if (this.game.d){
      this.running = true;
      this.theD = true;
    } else if (this.game.a){
      this.running = true;
      this.theD = false;
    }
    if (this.running){
      if (this.theD){
        this.x += this.game.clockTick * this.speed;
      } else {
        this.x -= this.game.clockTick * this.speed;
      }
    }
    //Jumping
    if (this.game.w){
        this.jumping = true;
    }
    if (this.jumping){
        if (this.jumpAnim.isDone()) {
            this.jumpAnim.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnim.elapsedTime / this.jumpAnim.totalTime;
        var totalHeight = scale * 300;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    //crouching
    if (this.game.s){
      this.crouching = true;
      this.standing = false;
    }
    //Standing
    if (this.game.keyup){
      this.standing = true;
      this.running = false;
      this.crouching = false;
    }
    if (this.x > 1200 ){
      this.x=0;
    } else if (this.x < 0){
      this.x = 1200;
    }
    Entity.prototype.update.call(this);
}

Character.prototype.draw = function(){
    // this.cursorAnim.drawFrame(this.game.clockTick, this.ctx, this.game.mouseMoveX - 50, this.game.mouseMoveY - 110, 0.03);
    this.cursorAnim.drawFrame(this.game.clockTick, this.ctx, this.game.mouseMoveX - 275 , this.game.mouseMoveY - 125, 0.03);
    if (this.jumping){
      this.jumpAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y, scale);
    } else if (this.running){
      this.runAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);
    } else if (this.standing){
      this.standAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);
    } else if (this.crouching){
      this.crouchAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 10, scale);
    }
    Entity.prototype.draw.call(this);
}
