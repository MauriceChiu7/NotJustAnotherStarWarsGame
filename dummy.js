var SCALE_MACE = 1;
var canvas = document.getElementById("gameWorld");
var height = 50;
const L2R_MACE = 35;
const MACE_HITBOX_X_OFFSET = 1;
const MACE_HITBOX_Y_OFFSET = 11;
const MACE_COLLISION_WIDTH = 32;
const MACE_COLLISION_HEIGHT = 59;
function Dummy() {
   this.game = gameEngine;
   this.x = 900; 
   this.y = 10; 
   this.health = 1000;

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
   this.currentDisplacementX = MACE_COLLISION_WIDTH + MACE_HITBOX_X_OFFSET;
   this.currentDisplacementY = MACE_COLLISION_HEIGHT + MACE_HITBOX_Y_OFFSET;

   // AI Stuff
   this.updateCount = null;
   this.attackCount = 0;
   this.distance = null;
   this.chanceToBlock = 0;
   this.lives = 3;

   this.ctx = this.game.ctx;
   
   Entity.call(this, this.game, this.x, this.y);
   // setInterval(() => { console.log('delta_x: ' + this.delta_x_from_player + 'delta_y: ' + this.delta_y_from_player) }, 500);
}

Dummy.prototype = new Entity();
Dummy.prototype.constructor = Dummy;

Dummy.prototype.update = function () {
   // vvvvvv Collision Stuff vvvvvv
   //this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");
   this.getMapCollisions();
   var collisionRight = this.getMapCollision("right");
   var collisionLeft = this.getMapCollision("left");
   var collisionTop = this.getMapCollision("top");
   var collisionBottom = this.getMapCollision("bottom");
   if (!this.updateCount ) this.findPlayer(); //will just run once
   this.updateCount = 1;

   // Stops movement if collision encountered
   if (collisionRight != null) {
      this.x = collisionRight.x + collisionRight.width + 1 - this.currentDisplacementX;
      this.xAcceleration = 0;
  } else if (collisionLeft != null) {
      this.x = collisionLeft.x - 1 - this.currentDisplacementX;
      this.xAcceleration = 0;
  }
  if (collisionTop != null) {
      this.yAcceleration = 0;
  } else if (collisionBottom != null) {
      if (collisionBottom instanceof BottomOnlyCollision && this.player.y - this.y > 50) {
          this.yAcceleration += 0.4;
      } else {
          this.y = collisionBottom.y + 1 - this.currentDisplacementY;
          this.yAcceleration = 0;
      }
  } else {
      this.yAcceleration += 0.4;
  }
   // ^^^^^^ Collision Stuff ^^^^^^^

   // this.distance = this.player.x - this.x + 45;
   this.distance = this.player.x + 35 - this.x;

   // this.delta_x_from_player = this.player.x - this.x + 45;
   // this.delta_y_from_player = this.player.y - this.y;

   if (gameEngine.click) {
      console.log("x :" + this.x + " y :" + this.y);
      console.log("distance: " + this.distance);
      if (collisionRight)
         console.log("right x :" + this.getMapCollision("right") + "right y:" + this.getMapCollision("right"));
      else
         console.log("right :" + this.getMapCollision("right"));
      if (collisionLeft)
         console.log("left x :" + this.getMapCollision("left") + "left y:" + this.getMapCollision("left"));
      else
         console.log("left :" + this.getMapCollision("left"));
      if (collisionTop)
         console.log("top x : " + this.getMapCollision("top") + " top y:" + this.getMapCollision("top"));
      else
         console.log("top :" + this.getMapCollision("top"));
      if (collisionBottom)
         console.log("bottom x : " + this.getMapCollision("bottom") + " bottom y:" + this.getMapCollision("bottom"));
      else
         console.log("bottom :" + this.getMapCollision("bottom"));
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

   if (this.distance > 105 && this.player.y - this.y == 0) { // player on the right
      this.xAcceleration +=1;
      // this.chanceToBlock = Math.round(Math.random());
      this.block = false;
      this.attack = false;
      this.jumping = false;
      this.hurting = false;
      this.dead = false;
   } else if (this.distance < -105 && this.player.y - this.y == 0) { //player on the left
      this.xAcceleration -=1;
      // this.chanceToBlock = Math.round(Math.random());
      this.block = false;
      this.attack = false;
      this.jumping = false;
      this.hurting = false;
      this.dead = false;
   } else if (this.distance > 0 && this.player.y - this.y > 0) {// player is lower && on the right
      this.xAcceleration +=1;
      // this.chanceToBlock = Math.round(Math.random());
      this.block = false;
      this.attack = false;
      this.jumping = false;
      //this.hurting = false;
   } else if (this.distance < -0 && this.player.y - this.y > 0) {// player is lower && on the left
      this.xAcceleration -=1;
      this.block = false;
      this.attack = false;
      this.jumping = false;
   } else if (!this.block && !this.attack && Math.abs(this.player.y - this.y) < 40
      && Math.abs(this.distance) < 105 && collisionBottom != null) {

      this.chanceToBlock = Math.round(Math.random() * 5); this.blocking = false; this.attack = false; this.jumping = false;
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
   } else if (this.player.y - this.y < -80 && collisionBottom != null) { // player is higher
      var collisionCheck = this.getMapCollisions2(this.x, this.y - 13);
      var canJump = true;
      for (var i = 0; i < collisionCheck.length; i++) {
         if (collisionCheck[i].direction == "bottom") {
               canJump = false;
         }
      }
      if (canJump) {
         this.jumping = true;
         this.yAcceleration -= 13;
         if (this.distance > 0) {
            this.xAcceleration += 5;
         } else if (this.distance < 0) {
            this.xAcceleration -= 5;
         }
      }
      this.block = false;
      this.attack = false;
      this.hurting = false;
      this.dead = false;    
      // console.log(this.jumping);
      if (this.jumpingRightAnim.isDone() || this.jumpingLeftAnim.isDone()) {
         this.jumpingRightAnim.elapsedTime = 0;
         this.jumpingLeftAnim.elapsedTime = 0;
         this.jumping = false;
      }
   } else if (Math.abs(this.player.y - this.y) < 50 && Math.abs(this.distance) < 70 && !this.jumping) { // avoiding the player getting too close
      var random = Math.round(Math.random());
        console.log(random);
        if (this.distance > 0) {
           this.xAcceleration -= random;
        } else {
           this.xAcceleration += random;
        }
   } else if (this.player.y - this.y > 50) {
      //this.xAcceleration ++;
   }else {
      this.blocking = true; // This is just to prevent Mace from disapearing when the AI decides to do nothing.
   }

   if (this.health <= 0) {
      this.dying = true; blocking = false;this.jumping = false; this.attacking = false;
      this.dead = true;
      for (var i = 0; i < gameEngine.entities[i]; i++) {
          if (gameEngine.entities[i].tag === 'enemy') {
              gameEngine.entities.splice(i, 1);
          }
      }
  }
   
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
   if (this.x > 1140) {
      this.x = 1140;
   } else if (this.x + 30 < 0) {
      this.x = -30;
   } 
   Entity.prototype.update.call(this);
};

Dummy.prototype.draw = function () {
   // if (true) {
   //    ctx.strokeStyle = 'orange';
   //    ctx.strokeRect(this.x + MACE_HITBOX_X_OFFSET, this.y + MACE_HITBOX_Y_OFFSET, MACE_COLLISION_WIDTH, MACE_COLLISION_HEIGHT);
   //    ctx.fill();
   // }
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


Dummy.prototype.getMapCollision = function(direction) {
   for (var i = 0; i < this.fullMCollisions.length; i++) {
       if (this.fullMCollisions[i].direction == direction) {
           return this.fullMCollisions[i].object;
       }
   }
   if (direction == "bottom") {
       if (this.bottomMCollisions.length > 0) {
           return this.bottomMCollisions[i];
       }
   }
   return null;
}
Dummy.prototype.getMapCollisions = function() {
   this.fullMCollisions = [];
   for (var i = 0; i < fullCollisions.length; i++) {
       let current = fullCollisions[i];
       if (this.x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX > current.x &&
           this.y + this.yAcceleration + this.currentDisplacementY < current.y + current.height && this.y + this.yAcceleration + this.currentDisplacementY > current.y) {
           var direction = [];
           if (this.y + this.currentDisplacementY > current.y + current.height) {
               direction = "top";
           } else if (this.y + MACE_COLLISION_HEIGHT + this.currentDisplacementY > current.y) {
               direction = "bottom";
           }
           if (this.x + 1 + this.currentDisplacementX >= current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x && this.yAcceleration != 0) {
               direction = "right";
           } else if (this.x + this.currentDisplacementX <= current.x  + 1 && this.x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && this.x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x) {
               direction = "left";
           }
           this.fullMCollisions.push({object: current, direction: direction});
       }
   }
   this.bottomMCollisions = [];
   for (var i = 0; i < bottomOnlyCollisions.length; i++) {
       let current = bottomOnlyCollisions[i];
       if (this.x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && this.x + this.xAcceleration + this.currentDisplacementX > current.x && this.y + this.yAcceleration + this.currentDisplacementY > current.y && 
           this.y + MACE_COLLISION_HEIGHT + this.currentDisplacementY > current.y && this.y + this.yAcceleration + this.currentDisplacementY <= current.y + 20 && this.yAcceleration >= 0) {
           this.bottomMCollisions.push(bottomOnlyCollisions[i]);
       }
   }
}

Dummy.prototype.getMapCollisions2 = function(x, y) {
   this.fullMCollisions = []; var toReturn = [];
   for (var i = 0; i < fullCollisions.length; i++) {
       let current = fullCollisions[i];
       if (x + this.xAcceleration + this.currentDisplacementX < current.x + current.width && x + this.xAcceleration + this.currentDisplacementX > current.x &&
           y + this.yAcceleration + this.currentDisplacementY < current.y + current.height && y + this.yAcceleration + this.currentDisplacementY > current.y) {
           var direction = [];
           if (y + this.currentDisplacementY > current.y + current.height) {
               direction = "top";
           } else if (y + MACE_COLLISION_HEIGHT + this.currentDisplacementY > current.y) {
               direction = "bottom";
           }
           if (x + 1 + this.currentDisplacementX >= current.x + current.width && x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x && this.yAcceleration != 0) {
               direction = "right";
           } else if (x + this.currentDisplacementX <= current.x  + 1 && x + this.xAcceleration + this.currentDisplacementX <= current.x + current.width + 1 && x + this.xAcceleration + 1 + this.currentDisplacementX >= current.x) {
               direction = "left";
           }
           toReturn.push({object: current, direction: direction});
       }
   }
   return toReturn;
}
Dummy.prototype.collideRight = function (thisEnt, otherEnt) {
   let distance = this.getDistance(thisEnt, otherEnt);
   // console.log(this.x > ent.x);
   return distance < thisEnt.width && thisEnt.x > otherEnt.x;
}
Dummy.prototype.collideLeft = function (thisEnt, otherEnt) {
   let distance = this.getDistance(thisEnt, otherEnt);
   return thisEnt.x < otherEnt.x + otherEnt.width && distance < thisEnt.width;
}

Dummy.prototype.getCollision = function (direction) {
   for (var i = 0; i < this.platformCollisions.length; i++) {
      if (this.platformCollisions[i].direction == direction) {
         return this.platformCollisions[i];
      }
   }
   return null;
}

Dummy.prototype.findPlayer = function() {
   for (let i = 0; i < this.game.entities.length; i++) {
      let object = this.game.entities[i];
      if (object.tag == "player") {
         this.player = object;
      }
   }
}
