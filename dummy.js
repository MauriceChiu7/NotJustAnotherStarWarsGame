var scale = 1;
var canvas = document.getElementById("gameWorld");

function Dummy(game) {
// Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
   //right
   this.walkRightAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 893 ,632, -37, 60, 0.2, 11, true, false);
   this.standAnim = new Animation(AM.getAsset("./img/macewindu_right.png") , 893, 75, -30, 65, 1, 1, true, false);
   this.attackAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 893, 1745, -80, 78, 0.2, 3, true, false);

   //left
   this.walkLeftAnim = new Animation(AM.getAsset("./img/macewindu_left.png"), 7, 632, 37, 60, 0.2, 11, true, false);
   this.startAnim = new Animation(AM.getAsset("./img/macewindu_left.png"), 0, 1655, 67, 85, 0.3, 4, true, false);
   this.thinkAnim = new Animation(AM.getAsset("./img/macewindu_left.png"), 0, 0, 50, 66, 0.7, 4, true, false);

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

   if (this.distance > 50) {
      this.x += this.game.clockTick * this.speed;
   } else if (this.distance < -50) {
      this.x -= this.game.clockTick * this.speed;
   }

   console.log(this.game.entities[0]);

  

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

   this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 50, this.y, scale);
   Entity.prototype.draw.call(this);
}

Dummy.prototype.drawLeft = function() {
   this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y, scale);
   Entity.prototype.draw.call(this);
}
