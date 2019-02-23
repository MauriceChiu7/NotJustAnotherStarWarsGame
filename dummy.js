var SCALE_MACE = 1;
var canvas = document.getElementById("gameWorld");
var height = 50;
const L2R_MACE = 35;
const MACE_HITBOX_X_OFFSET = 1;
const MACE_HITBOX_Y_OFFSET = 11;
const MACE_COLLISION_WIDTH = 32;
const MACE_COLLISION_HEIGHT = 59;

function Dummy(game) {
   this.game = game;
   
   this.x = 900;
   this.y = 450;

   // Collisions Stuff
   this.platformCollisions = [];
   this.tag = "enemy";

   // Physics Stuff
   this.xAcceleration = 0;
   this.yAcceleration = 0;
   
   // Animation Stuff
   // Animation object: obiwan_sprites_right, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
   //right
   let rightWinduSprite = AM.getAsset("./img/macewindu_right.png");
   this.walkRightAnim = new Animation(rightWinduSprite, 893, 632, -37, 60, 0.2, 8, true, false);
   this.attackRightAnim = new Animation(rightWinduSprite, 882, 1790, -90, 76, 0.15, 8, true, false);
   this.blockRightAnim = new Animation(rightWinduSprite, 685, 775, -55, 65, 1, 1, true, false);
   this.hurtRightAnim = new Animation(rightWinduSprite, 875, 1945, 40, 70, 0.2, 1, true, false);
   this.deadRightAnim = new Animation(rightWinduSprite, 355, 1912, 70, 40, 0.2, 1, true, false);
   this.jumpingRightAnim = new Animation(rightWinduSprite, 897, 1285, -30, 70, 1, 1, true, false);
   //left
   let leftWinduSprite = AM.getAsset("./img/macewindu_left.png");
   this.walkLeftAnim = new Animation(leftWinduSprite, 7, 632, 37, 60, 0.2, 11, true, false);
   this.attackLeftAnim = new Animation(leftWinduSprite, 20, 1790, 90, 75, 0.15, 8, true, false);
   this.blockLeftAnim = new Animation(leftWinduSprite, 215, 775, 55, 65, 1, 1, true, false);
   this.hurtLeftAnim = new Animation(leftWinduSprite, 0, 1885, 40, 70, 0.2, 1, true, false);
   this.jumpingLeftAnim = new Animation(leftWinduSprite, 0, 1285, 30, 70, 1, 1, true, false);

   // Character's States
   this.begin = true;
   this.speed = 150;
   this.walking = null;
   this.attack = null;
   this.block = false;
   this.hurting = false;
   this.dead = false;
   this.jumping = null;

   // AI Stuff
   this.updateCount = 0;
   this.attackCount = 0;
   this.distance = null;
   this.chanceToBlock = 0;
   this.lives = 3;

   this.ctx = game.ctx;
   for (let i = 0; i < this.game.entities.length; i++) {
      let object = this.game.entities[i];
      if (object.tag == "player") {
         this.player = object;
      }
   }
   Entity.call(this, game, this.x, this.y);
   // setInterval(() => { console.log('delta_x: ' + this.delta_x_from_player + 'delta_y: ' + this.delta_y_from_player) }, 500);
}

Dummy.prototype = new Entity();
Dummy.prototype.constructor = Dummy;

Dummy.prototype.update = function () {
   // vvvvvv Collision Stuff vvvvvv
   this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");

   // Stops movement if collision encountered
   if (this.getCollision("right") != null) {
      this.x = this.getCollision("right").entity.collisionX + this.getCollision("right").entity.collisionWidth + 2; // 2
      this.xAcceleration = 0;
   } else if (this.getCollision("left") != null) {
      this.x = this.getCollision("left").entity.collisionX - 2; // 2
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
   // ^^^^^^ Collision Stuff ^^^^^^^

   // this.distance = this.player.x - this.x + 45;
   this.distance = this.player.x + 50 - this.x;

   // this.delta_x_from_player = this.player.x - this.x + 45;
   // this.delta_y_from_player = this.player.y - this.y;

   if (gameEngine.click) {
      console.log("x :" + this.x + " y :" + this.y);
      console.log("distance: " + this.distance);
      if (this.getCollision("right"))
         console.log("right x :" + this.getCollision("right").entity.collisionX + "right y:" + this.getCollision("right").entity.collisionY);
      else
         console.log("right :" + this.getCollision("right"));
      if (this.getCollision("left"))
         console.log("left x :" + this.getCollision("left").entity.collisionX + "left y:" + this.getCollision("left").entity.collisionY);
      else
         console.log("left :" + this.getCollision("left"));
      if (this.getCollision("top"))
         console.log("top x : " + this.getCollision("top").entity.collisionX + " top y:" + this.getCollision("top").entity.collisionY);
      else
         console.log("top :" + this.getCollision("top"));
      if (this.getCollision("bottom"))
         console.log("bottom x : " + this.getCollision("bottom").entity.collisionX + " bottom y:" + this.getCollision("bottom").entity.collisionY);
      else
         console.log("bottom :" + this.getCollision("bottom"));
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

   if (this.distance > 60) {
      this.xAcceleration +=1;
      // this.chanceToBlock = Math.round(Math.random());
      this.block = false;
      this.attack = false;
      this.jumping = false;
      this.hurting = false;
      this.dead = false;
   } else if (this.distance < -60) {
      this.xAcceleration -=1;
      // this.chanceToBlock = Math.round(Math.random());
      this.block = false;
      this.attack = false;
      this.jumping = false;
      this.hurting = false;
      this.dead = false;
   } else if (!this.block && !this.attack && Math.abs(this.player.y - this.y) < 100
      && Math.abs(this.distance) < 60 && this.getCollision("bottom") != null) {

      this.chanceToBlock = Math.round(Math.random() * 5);
      this.blocking = false;
      this.attack = false;
      this.jumping = false;
      // this.chanceToBlock = 1;
      if (this.chanceToBlock === 1) {
         this.block = true;
      } else if (this.chanceToBlock === 0) {
         this.attack = true;
      }
      if (this.player.attacking) {
         // this.blocking =false;
         this.chanceToBlock = -1;
         this.hurting = true;
         this.lives--;
         if (this.lives === 0) {
            this.dead = true;
         }
      }
   } else if (this.player.y - this.y < -100 && this.getCollision("bottom") != null) {
      this.block = false;
      this.attack = false;
      this.hurting = false;
      this.dead = false;
      this.yAcceleration -= 13;
      if (this.distance > 100) {
         this.xAcceleration +=1;
      } else if (this.distance < -100) {
         this.xAcceleration -=1;
      }
      this.jumping = true;
      // console.log(this.jumping);
      if (this.jumpingRightAnim.isDone() || this.jumpingLeftAnim.isDone()) {
         this.jumpingRightAnim.elapsedTime = 0;
         this.jumpingLeftAnim.elapsedTime = 0;
         this.jumping = false;
      }
   } else {
      this.blocking = true; // This is just to prevent Mace from disapearing when the AI decides to do nothing.
   }
    /*else if (Math.abs(this.distance) > 50){
    if (this.attackLeftAnim.isDone() || this.attackRightAnim.isDone() ||
    this.blockLeftAnim.isDone || this.blockLeftAnim.isDone()) {
      this.block =false;
      this.attack = false;
    }
  }*/

  // More Physics Stuff
  

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
   }
   //console.log("yAcceleration: "+ this.yAcceleration);
   this.y += this.yAcceleration;
   this.x += this.xAcceleration;

   // World Boundary
  /* if (this.x > 1140) {
      this.x = 1140;
  } else if (this.x + 25 < 0) {
      this.x = -25;
  }*/
   Entity.prototype.update.call(this);
};

Dummy.prototype.draw = function () {
   if (SHOWBOX) {
      ctx.strokeStyle = 'orange';
      ctx.strokeRect(this.x + MACE_HITBOX_X_OFFSET, this.y + MACE_HITBOX_Y_OFFSET, MACE_COLLISION_WIDTH, MACE_COLLISION_HEIGHT);
      ctx.fill();
   }
   if (this.player.x + 50 > this.x) {
      this.drawRight();
   } else if (this.player.x + 50 < this.x) {
      this.drawLeft();
   }
}
Dummy.prototype.drawRight = function () {

   if (this.block) {
      this.blockRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + L2R_MACE, this.y + 5, SCALE_MACE);
   } else if (this.jumping) {
      this.jumpingRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + L2R_MACE, this.y, SCALE_MACE);
   } else if (this.attack) {
      this.attackRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + L2R_MACE + 50, this.y, SCALE_MACE);
   } else if (this.hurting) {
      this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + L2R_MACE, this.y - 30, SCALE_MACE);
   } else if (this.dead) {
      this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + L2R_MACE, this.y, SCALE_MACE);
   } else {
      this.walkRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x + L2R_MACE, this.y + 12, SCALE_MACE);
   }
   Entity.prototype.draw.call(this);
}

Dummy.prototype.drawLeft = function () {
   if (this.block) {
      this.blockLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 5, SCALE_MACE);
   } else if (this.jumping) {
      this.jumpingLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SCALE_MACE);
   } else if (this.attack) {
      this.attackLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x - 50, this.y, SCALE_MACE);
   } else if (this.hurting) {
      this.deadRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 30, SCALE_MACE);
   } else if (this.dead) {
      this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 70, SCALE_MACE);
   } else {
      this.walkLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 12, SCALE_MACE);
   }

}
/*
Dummy.prototype.collide = function (xDisplacement, yDisplacement, tag) {
   var collisions = [];
   for (var i = 0; i < gameEngine.entities.length; i++) {
      let theTag = gameEngine.entities[i].tag;
      let current = gameEngine.entities[i];
      if (tag === 'Platform') {
         if (theTag == tag) {
            if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX &&
               this.y + yDisplacement < current.collisionY + current.collisionHeight && this.y + yDisplacement > current.collisionY) {
               var direction = 'bottom';
               // console.log(current);
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
               collisions.push({ entity: current, direction: direction });
            }
         }
      } 
   }
   return collisions;
}

Dummy.prototype.getCollision = function (direction) {
   for (var i = 0; i < this.platformCollisions.length; i++) {
      if (this.platformCollisions[i].direction == direction) {
         return this.platformCollisions[i];
      }
   }
   return null;
}*/



Dummy.prototype.collide = function (xDisplacement, yDisplacement, tag) {
   var collisions = [];
   for (var i = 0; i < gameEngine.entities.length; i++) {
      let current = gameEngine.entities[i];
      let theTag = gameEngine.entities[i].tag;
      if (theTag === tag) {
         // console.log(current);
         if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX /*&&
            this.y + yDisplacement < current.collisionY + current.collisionHeight + 1 && this.y + yDisplacement > current.collisionY*/) {
            var direction = "";
            // console.log(current);
            if (gameEngine.click)
               console.log("this.y: " + this.y + " current.collisionY " + current.collisionY + " current.collisionHeight: " + current.collisionHeight);
            if (this.y < current.collisionY + current.collisionHeight && this.y > current.collisionY) {
               direction = "top";
            }
            if (this.y + height > current.collisionY) {
               direction = "bottom";
            }
            if (this.x > current.collisionX + current.collisionWidth && this.x + xDisplacement < current.collisionX + current.collisionWidth
               && this.x + xDisplacement > current.collisionX) {
               direction = "right";
            }
            if (this.x < current.collisionX && this.x + xDisplacement < current.collisionX + current.collisionWidth
               && this.x + xDisplacement > current.collisionX) {
               direction = "left";
            }
            collisions.push({ entity: current, 'direction': direction });
         }
      }
   }
   // var obj = JSON.parse(collisions);
   for (var i = 0; i < collisions.length; i++) {
      // var obj = JSON.parse(collisions[i]);
      // console.log(obj.direction);
      console.log(collisions[i].direction)
   }

   return collisions;
}

Dummy.prototype.getCollision = function (direction) {
   for (var i = 0; i < this.platformCollisions.length; i++) {
      if (this.platformCollisions[i].direction === direction) {
         return this.platformCollisions[i];
      }
   }
   return null;
}
