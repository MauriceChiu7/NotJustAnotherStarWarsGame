var scale = 1;
var canvas = document.getElementById("gameWorld");

function Dummy(game) {
   //right
   let rightWinduSprite = AM.getAsset("./img/macewindu_right.png");
   this.walkRightAnim = new Animation(rightWinduSprite, 893 ,632, -37, 60, 0.2, 8, true, false);
   this.standRightAnim = new Animation(rightWinduSprite , 895, 70, -30, 65, 1, 1, true, false);
   this.attackRightAnim = new Animation(rightWinduSprite, 885, 1790, -90, 76, 0.15, 8, true, false);
   this.blockRightAnim = new Animation(rightWinduSprite, 685 ,775, -55, 65, 1, 1, true, false);
   this.hurtRightAnim = new Animation(rightWinduSprite, 875 ,1945, 40, 70, 0.2, 1, true, false);
   this.deadRightAnim = new Animation(rightWinduSprite, 355 ,1912, 70, 40, 0.2, 1, true, false);
   this.jumpingRightAnim = new Animation(rightWinduSprite, 897, 1285, -27, 70, 1, 1, true, false);

   //left
   let leftWinduSprite = AM.getAsset("./img/macewindu_left.png");
   this.walkLeftAnim = new Animation(leftWinduSprite, 7, 632, 37, 60, 0.2, 11, true, false);
   this.standLeftAnim = new Animation(leftWinduSprite , 0, 70, 40, 65, 1, 1, true, false);
   this.attackLeftAnim = new Animation(leftWinduSprite, 20, 1790, 90, 75, 0.15, 8, true, false);
   this.blockLeftAnim = new Animation(leftWinduSprite, 215, 775, 55, 65, 1, 1, true, false);
   this.hurtLeftAnim = new Animation(leftWinduSprite, 0 , 1885, 40, 70, 0.2, 1, true, false);
   this.jumpingRightAnim = new Animation(leftWinduSprite, 0, 1285, 30, 70, 1, 1, true, false);



   this.begin = true;
   this.speed = 150;
   this.walking = null;
   this.standing = null;
   this.attack = null;
   this.block = false;
   this.hurting = false;
   this.dead = false;

   this.jumping = null;
   this.updateCount = 0;
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

Dummy.prototype.update = function () {
   this.distance = this.player.x + 50 - this.x;
   // this.attack = false;
   // this.standing = false;

   if (this.distance > 70) {
      this.x += this.game.clockTick * this.speed;
      // this.chanceToBlock = Math.round(Math.random());
      this.block =false;
      this.attack = false;
      this.standing = false;
      this.hurting = false;
      this.dead = false;
   } else if (this.distance < -70) {
      this.x -= this.game.clockTick * this.speed;
      // this.chanceToBlock = Math.round(Math.random());
      this.block =false;
      this.attack = false;
      this.standing = false;
      this.hurting = false;
      this.dead = false;
   } else if (!this.block && !this.attack && Math.abs(this.player.y - this.y) < 40) {
      this.chanceToBlock = Math.round(Math.random()*5);
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
      }
   } else if (Math.abs(this.player.y - this.y) > 40) {
      this.standing = true;
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
      this.blockRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 20, this.y - 5, scale);
    } else if (this.attack) {
      this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 60, this.y - 15, scale);
    } else if (this.standing){
      this.standRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 20, this.y + 10, scale);
    } else if (this.hurting){
      this.hurtRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
    } else if (this.dead){
      this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
    } else {
      this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 50, this.y + 5, scale);
    }
   Entity.prototype.draw.call(this);
}

Dummy.prototype.drawLeft = function() {
  if(this.block){
    this.blockLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x -5 , this.y - 5, scale);
  } else if (this.attack) {
    this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 50, this.y - 15, scale);
  } else if (this.standing){
    this.standLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y  + 10, scale);
  } else if (this.hurting){
    this.hurtLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
  } else if (this.dead){
    this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 20, scale);
  } else {
    this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y + 5, scale);
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