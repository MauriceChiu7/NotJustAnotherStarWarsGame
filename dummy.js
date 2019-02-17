var scale = 1;
var canvas = document.getElementById("gameWorld");

function Dummy(game) {
// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
   //right
   this.walkRightAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 893 ,632, -37, 60, 0.2, 11, true, false);
   this.standAnim = new Animation(AM.getAsset("./img/macewindu_right.png") , 895, 70, -35, 60, 1, 1, true, false);
   this.attackRightAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 880, 1790, -90, 70, 0.2, 3, true, false);

   //left
   this.walkLeftAnim = new Animation(AM.getAsset("./img/macewindu_left.png"), 7, 632, 37, 60, 0.2, 11, true, false);
   this.standLeftAnim = new Animation(AM.getAsset("./img/macewindu_left.png") , 0, 70, 40, 55, 1, 1, true, false);
   this.attackLeftAnim = new Animation(AM.getAsset("./img/macewindu_left.png"), 20, 1790, 90, 70, 0.2, 8, true, false);


   this.begin = true;
   this.speed = 100;
   this.walking = null;
   this.standing = null;

   this.thinking = null;
   this.updateCount = 0;
   this.attack = null
   this.newMap = null;
   this.attackCount = 0;
   this.distance = null;
   this.game = game;

   this.ctx = game.ctx;
   this.player = this.game.entities[2];

   Entity.call(this, game, 770, 490);
}

Dummy.prototype = new Entity();
Dummy.prototype.constructor = Dummy;

Dummy.prototype.update = function (){
   this.distance = this.player.x + 50 - this.x;
   this.attack = false;
   this.standing = false;

   if (this.distance > 50) {
      this.x += this.game.clockTick * this.speed;
   } else if (this.distance < -50) {
      this.x -= this.game.clockTick * this.speed;
   } else if ( Math.abs(this.player.y - this.y) < 50){
      this.attack = true;
   } else {
      this.standing = true;
   }


  

  Entity.prototype.update.call(this);
};

Dummy.prototype.draw = function() {

   if (this.player.x+ 50> this.x) {
      this.drawRight();
   } else {
      this.drawLeft();
   }
}

Dummy.prototype.drawRight = function() {

   if (this.attack) {
      this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 65, this.y - 10, scale);
   } else if (this.standing){
      this.standAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 20, this.y + 5, scale);
   } else {
      this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 50, this.y + 5, scale);
   }
   Entity.prototype.draw.call(this);
}

Dummy.prototype.drawLeft = function() {

   if (this.attack) {
      this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x -50, this.y - 10, scale);
   } else if (this.standing){
      this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 5, scale);
   } else {
      this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y + 5, scale);
   }
   Entity.prototype.draw.call(this);
}
