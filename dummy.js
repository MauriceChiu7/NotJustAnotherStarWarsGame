var scale = 1;
var canvas = document.getElementById("gameWorld");

function Dummy(game) {
   //right
   let rightWinduSprite = AM.getAsset("./img/macewindu_right.png");
   this.walkRightAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 886 ,625, -36, 60, 0.2, 11, true, false);
   this.standRightAnim = new Animation(AM.getAsset("./img/macewindu_right.png") , 886, 75, -30, 65, 1, 1, true, false);
   this.attackRightAnim = new Animation(AM.getAsset("./img/macewindu_right.png"), 889, 1745, -80, 78, 0.2, 3, true, false);
   // this.walkRightAnim = new Animation(rightWinduSprite, 512 ,645, 36, 60, 0.2, 8, true, true);
   // this.standRightAnim = new Animation(rightWinduSprite , 886, 75, -30, 65, 1, 1, true, false);
   // this.attackRightAnim = new Animation(rightWinduSprite, 165, 1800, 100, 75, 0.2, 3, true, false);

   this.blockRightAnim = new Animation(rightWinduSprite, 875 ,325, 32, 70, 0.2, 1, true, false);
   this.hurtRightAnim = new Animation(rightWinduSprite, 875 ,1945, 40, 70, 0.2, 1, true, false);
   this.deadRightAnim = new Animation(rightWinduSprite, 355 ,1912, 70, 40, 0.2, 1, true, false);

   //left
   let leftWinduSprite = AM.getAsset("./img/macewindu_left.png");
   this.walkLeftAnim = new Animation(leftWinduSprite, 10 ,625, 35, 60, 0.2, 11, true, false);
   this.startAnim = new Animation(leftWinduSprite, 0, 1655, 67, 85, 0.3, 4, true, false);
   this.attackLeftAnim = new Animation(leftWinduSprite, 345 ,1750, 75, 75, 0.2, 3, true, false);
   this.blockLeftAnim = new Animation(leftWinduSprite, 10 ,315, 32, 70, 0.2, 1, true, false);
   this.hurtLeftAnim = new Animation(leftWinduSprite, 0 , 1885, 40, 70, 0.2, 1, true, false);

   this.thinkAnim = new Animation(leftWinduSprite, 0, 0, 50, 66, 0.7, 4, true, false);


   this.begin = true;
   this.speed = 150;
   this.walking = null;
   this.standing = null;
   this.attack = null;
   this.block = false;
   this.hurting = false;
   this.dead = false;

   this.thinking = null;
   this.updateCount = 0;
   this.newMap = null;
   this.attackCount = 0;
   this.distance = null;
   this.game = game;
   this.chanceToBlock = 0;
   this.lives = 3;
   this.width = 20;

   this.ctx = game.ctx;
   for (let i = 0; i < this.game.entities.length; i++) {
     let object = this.game.entities[i];
     console.log("ENTER: "+object.tag);
     if (object.tag == "player"){
       this.player = object.object;
     }
   }


   Entity.call(this, game, 770, 490);
}

Dummy.prototype = new Entity();
Dummy.prototype.constructor = Dummy;

Dummy.prototype.update = function (){
   this.distance = this.player.x + 50 - this.x;
   // this.attack = false;
   // this.standing = false;

   if (this.distance > 50) {
      this.x += this.game.clockTick * this.speed;
      // this.chanceToBlock = Math.round(Math.random());
      this.block =false;
      this.attack = false;
      this.standing = false;
      this.hurting = false;
      this.dead = false;
   } else if (this.distance < -50) {
      this.x -= this.game.clockTick * this.speed;
      // this.chanceToBlock = Math.round(Math.random());
      this.block =false;
      this.attack = false;
      this.standing = false;
      this.hurting = false;
      this.dead = false;
   } else if (Math.abs(this.player.y - this.y) < 50) {
     if (!this.block && !this.attack){
       this.chanceToBlock = Math.round(Math.random()*5);
     }
     // this.chanceToBlock = 1;
     if (this.chanceToBlock == 1){
       this.block = true;
     } else if (this.chanceToBlock === 0){
       this.attack = true;
     } else {
       this.standing = true;
     }

     // if (this.player.attacking && this.standing) {
     if (this.player.attacking) {
       this.chanceToBlock = -1;
       this.blocking =false;
       this.attack = false;
       this.standing = false;
       this.hurting = true;
       this.lives--;
       if (this.lives ===0){
         this.dead = true;
       }
       // console.log("Luke attacking: " + this.player.attacking + ", hurting: "+this.hurting + ", lives: " + this.lives);
     } else {
        this.standing = true;
     }
   }
  Entity.prototype.update.call(this);
};

Dummy.prototype.draw = function() {
   if (this.player.x+ 50 > this.x) {
      this.drawRight();
   } else if (this.player.x + 50 < this.x) {
      this.drawLeft();
   }
}

Dummy.prototype.drawRight = function() {
    if(this.block){
      this.blockRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
    } else if (this.attack) {
      this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x-80, this.y - 20, scale);
    } else if (this.standing){
      this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
    } else if (this.hurting){
      this.hurtRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
    } else if (this.dead){
      this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
    } else {
      this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);
    }
   Entity.prototype.draw.call(this);
}

Dummy.prototype.drawLeft = function() {
  if(this.block){
    this.blockLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
  } else if (this.attack) {
    this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
  } else if (this.standing){
    this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
  } else if (this.hurting){
    this.hurtLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
  } else if (this.dead){
    this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
  } else {
    this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y, scale);
  }
   Entity.prototype.draw.call(this);
}
/*
Dummy.prototype.collide = function(xDisplacement, yDisplacement, tag) {
    var collisions = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i];
        if (current.tag == tag) {
            if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX &&
                this.y + yDisplacement < current.collisionY + current.collisionHeight && this.y + yDisplacement > current.collisionY) {
                var direction = [];
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
                collisions.push({entity: current, direction: direction});
            }
        }
    }
    // console.log(collisions);
    return collisions;
}

Dummy.prototype.getCollision = function(direction) {
    for(var i = 0; i < this.platformCollisions.length; i++) {
        if (this.platformCollisions[i].direction == direction) {
            return this.platformCollisions[i];
        }
    }
    return null;
}*/
