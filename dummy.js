var scale = 1;
var canvas = document.getElementById("gameWorld");

function Dummy(game) {
   //right
   let rightWinduSprite = AM.getAsset("./img/macewindu_right.png");
   this.walkRightAnim = new Animation(rightWinduSprite, 893 ,632, -37, 60, 0.2, 8, true, false);
   this.attackRightAnim = new Animation(rightWinduSprite, 882, 1790, -90, 76, 0.15, 8, true, false);
   this.blockRightAnim = new Animation(rightWinduSprite, 685 ,775, -55, 65, 1, 1, true, false);
   this.hurtRightAnim = new Animation(rightWinduSprite, 875 ,1945, 40, 70, 0.2, 1, true, false);
   this.deadRightAnim = new Animation(rightWinduSprite, 355 ,1912, 70, 40, 0.2, 1, true, false);
   this.jumpingRightAnim = new Animation(rightWinduSprite, 897, 1285, -27, 70, 1, 1, true, false);

   //left
   let leftWinduSprite = AM.getAsset("./img/macewindu_left.png");
   this.walkLeftAnim = new Animation(leftWinduSprite, 7, 632, 37, 60, 0.2, 11, true, false);
   this.attackLeftAnim = new Animation(leftWinduSprite, 20, 1790, 90, 75, 0.15, 8, true, false);
   this.blockLeftAnim = new Animation(leftWinduSprite, 215, 775, 55, 65, 1, 1, true, false);
   this.hurtLeftAnim = new Animation(leftWinduSprite, 0 , 1885, 40, 70, 0.2, 1, true, false);
   this.jumpingLeftAnim = new Animation(leftWinduSprite, 0, 1285, 30, 70, 1, 1, true, false);



   this.begin = true;
   this.speed = 150;
   this.walking = null;
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
   this.platformCollisions = [];
   this.xAcceleration = 0;
   this.yAcceleration = 0;
   this.platformCollisions = [];

   this.ctx = game.ctx;
   for (let i = 0; i < this.game.entities.length; i++) {
     let object = this.game.entities[i];
     if (object.tag == "player"){
       this.player = object;
     }
   }


   Entity.call(this, game, 1000, 300);
}

Dummy.prototype = new Entity();
Dummy.prototype.constructor = Dummy;

Dummy.prototype.update = function () {
  this.distance = this.player.x + 50 - this.x;
  this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");

  if (this.getCollision("right") != null) {
      this.x = this.getCollision("right").entity.collisionX + this.getCollision("right").entity.collisionWidth + 2;
      this.xAcceleration = 0;
  } else if (this.getCollision("left") != null) {
      this.x = this.getCollision("left").entity.collisionWidth - 2;
      this.xAcceleration = 0;
  }
  if (this.getCollision("top") != null) {
      this.yAcceleration = 0;
  } else if (this.getCollision("bottom") != null) {
      this.y = this.getCollision("bottom").entity.collisionY + 1;
      this.yAcceleration = 0;
  } else {
      this.yAcceleration += 0.4;
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


  if (this.distance > 70 && Math.abs(this.player.y - this.y) < 50) {
    this.x += this.game.clockTick * this.speed;
    this.chanceToBlock = Math.round(Math.random());
    this.block =false;
    this.attack = false;
    this.jumping = false;
    this.hurting = false;
    this.dead = false;
  } else if (this.distance < -70 && Math.abs(this.player.y - this.y) < 50) {
    this.x -= this.game.clockTick * this.speed;
    this.chanceToBlock = Math.round(Math.random());
    this.block =false;
    this.attack = false;
    this.jumping = false;
    this.hurting = false;
    this.dead = false;
  } else if (!this.block && !this.attack && Math.abs(this.player.y - this.y) < 50) {
    this.chanceToBlock = Math.round(Math.random()*5);
    // this.chanceToBlock = 1;
    if (this.chanceToBlock === 1){
     this.block = true;
    } else if (this.chanceToBlock === 0){
     this.attack = true;
    } 
    if (this.player.attacking || this.blocking) {
     // this.blocking =false;
     this.chanceToBlock = -1;
     this.blocking =false;
     this.attack = false;
     this.jumping = false;
     this.hurting = true;
     this.lives--;
     if (this.lives ===0){
       this.dead = true;
     }
  } else if (Math.abs(this.player.y - this.y) > 50) {
    this.block =false;
    this.attack = false;
    this.hurting = false;
    this.dead = false;
    if (this.distance > 100) {
        this.x += this.game.clockTick * this.speed;
    } else if (this.distance < -100) {
       this.x -= this.game.clockTick*this.speed;
    } else {
       this.jumping = true;
       if (this.jumpingRightAnim.isDone() || this.jumpingLeftAnim.isDone()) {
           this.jumpingRightAnim.elapsedTime = 0;
           this.jumpingLeftAnim.elapsedTime = 0;
           this.jumping = false;
           this.walking = true;
       }
       if (this.distance > 0) {
          var totalHeight = 200;
          var jumpDistance = this.jumpingRightAnim.elapsedTime / this.jumpingRightAnim.totalTime;
          if (jumpDistance > 0.5) {
             jumpDistance = 1 - jumpDistance;
          }
       var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
       this.y = 500 - height;
       } else {
          var totalHeight = 200;
          var jumpDistance = this.jumpingLeftAnim.elapsedTime / this.jumpingLeftAnim.totalTime;
          if (jumpDistance > 0.5) {
             jumpDistance = 1 - jumpDistance;
          }
          var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
          this.y = 500 - height;
       } 
    } 
  }

  if (this.jumping && this.getCollision("bottom") != null) {
    this.yAcceleration -= 13;
  }

  //speed limits
  if (this.xAcceleration > 7) {
      this.xAcceleration = 7;
  } else if (this.xAcceleration < -7) {
      this.xAcceleration = -7;
  }
  if (this.yAcceleration > 15) {
      this.yAcceleration = 15;
  } else if (this.yAcceleration < -15) {
      this.yAcceleration = -15;
  } else if (Math.abs(this.player.y - this.y) > 40) {

  }
  console.log("yAcceleration: "+ this.yAcceleration);
  this.y += this.yAcceleration;
  this.x += this.xAcceleration;
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
      this.blockRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 20, this.y - 10, scale);
    } else if (this.jumping) {
      this.jumpingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, scale);
    } else if (this.attack) {
      this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 90, this.y - 20, scale);
    } else if (this.hurting){
      this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 30, scale);
    } else if (this.dead){
      this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 50, this.y - 5, scale);
    } else {
      this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + 50, this.y , scale);
    }
   Entity.prototype.draw.call(this);
}

Dummy.prototype.drawLeft = function() {
  if(this.block){
    this.blockLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x -5 , this.y - 5, scale);
  } else if (this.jumping) {
    this.jumpingLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y, scale);
  } else if (this.attack) {
    this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 35, this.y -15, scale);
  } else if (this.hurting){
    this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 30, scale);
  } else if (this.dead){
    this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y - 5, scale);
  } else {
    this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x , this.y, scale);
  }

}
Dummy.prototype.collide = function(xDisplacement, yDisplacement, tag) {
    var collisions = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i];
        if (current.tag == tag) {
            if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX &&
                this.y + yDisplacement < current.collisionY + current.collisionHeight && this.y + yDisplacement > current.collisionY) {
                var direction = "bottom";
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
}
