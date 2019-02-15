var scale = 1.5;
var canvas = document.getElementById("gameWorld");

function Dummy(game) {

  this.startAnim = new Animation(AM.getAsset("./img/macewindu_left.png"), 0, 1655, 67, 85, 0.3, 4, true, false);
  this.walkAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 886 ,625, -36, 60, 0.2, 11, true, false);
  this.standAnim = new Animation(AM.getAsset("./img/macewindu_right.png") , 886, 75, -30, 65, 1, 1, true, false);
  this.thinkAnim = new Animation(AM.getAsset("./img/macewindu_left.png"), 0, 0, 50, 66, 0.7, 4, true, false);
  this.attackAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 889, 1745, -80, 78, 0.2, 3, true, false);
  this.begin = true;
  this.speed = 100;
  this.walking = null;
  this.standing = null;

  this.thinking = null;
  this.updateCount = 0;
  this.attack = null
  this.newMap = null;
  this.attackCount = 0;
   
  this.game = game;
  this.ctx = game.ctx;
  Entity.call(this, game, 70, 110);//70 515
}

Dummy.prototype = new Entity();
Dummy.prototype.constructor = Dummy;

Dummy.prototype.update = function (){
  
  

  Entity.prototype.update.call(this);
};

Dummy.prototype.draw = function() {

   this.walkAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 700 , this.y + 385, scale);


  Entity.prototype.draw.call(this);
}
