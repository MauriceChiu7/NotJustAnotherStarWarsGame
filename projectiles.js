/*
  LaserBeam Object
*/
var lasersize = 0.15;
var lasersize2 = 0.5;

function distance(a, b) {
  // console.log(a.x +" "+a.y+ " "+ b.x +" "+b.y);
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function LaserBeam(start, end, game) {
  // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
  this.spriteSheet = AM.getAsset("./img/laserbeams_angle.png");
  let frameDuration = 0.5;
  this.shootAnim0 = new Animation(this.spriteSheet, 0, 0, 120, 375, frameDuration, 1, true, false);
  this.shootAnim22 = new Animation(this.spriteSheet, 600, 0, 250, 375, frameDuration, 1, true, false);
  this.shootAnim45 = new Animation(this.spriteSheet, 1200, 110, 350, 250, frameDuration, 1, true, false);
  this.shootAnim67 = new Animation(this.spriteSheet, 1800, 100, 400, 300, frameDuration, 1, true, false);
  this.shootAnim90 = new Animation(this.spriteSheet, 2430, 303, 350, 60, frameDuration, 1, true, false);
  this.shootAnim135 = new Animation(this.spriteSheet, 3000, 145, 350, 200, frameDuration, 1, true, false);
  this.spriteSheetLeft = AM.getAsset("./img/laserbeams_angle_left.png");
  this.shootAnim0Left = new Animation(this.spriteSheetLeft, 1284, 13, 40, 120, frameDuration, 1, true, false);
  this.shootAnim22Left = new Animation(this.spriteSheetLeft, 1038, 13, 70, 140, frameDuration, 1, true, false);
  this.shootAnim45Left = new Animation(this.spriteSheetLeft, 800, 45, 95, 90, frameDuration, 1, true, false);
  this.shootAnim67Left = new Animation(this.spriteSheetLeft, 580, 75, 120, 75, frameDuration, 1, true, false);
  this.shootAnim90Left = new Animation(this.spriteSheetLeft, 375, 100, 120, 30, frameDuration, 1, true, false);
  this.shootAnim135Left = new Animation(this.spriteSheetLeft, 180, 60, 120, 70, frameDuration, 1, true, false);

  this.start = start;
  this.end = end;
  this.x = start.x;
  this.y = start.y;
  this.game = game;
  this.tag = "laser";

  this.xVelocity = 20;
  this.yVelocity = 20;

  this.width = 30;
  this.height = 30;

  this.laserID = null;
  this.enemyTag = null;

  this.hitbox = 30;
  Entity.call(this, game, this.x, this.y, this.width, this.height);
}

LaserBeam.prototype = new Entity();
LaserBeam.prototype.constructor = LaserBeam;

LaserBeam.prototype.update = function () {
  // this.platformCollisions = this.collide(this.xAcceleration, this.yAcceleration, "Platform");
  this.platformCollisions = [];

  var fullMCollisions = [];
  for (var i = 0; i < fullCollisions.length; i++) {
      let current = fullCollisions[i];
      if (this.x + this.xVelocity + this.width < current.x + current.width && this.x + this.xVelocity + this.width > current.x &&
          this.y + this.yVelocity + this.height < current.y + current.height && this.y + this.yVelocity - this.height > current.y) {
          fullMCollisions.push(current);
      }
  }

  if (fullMCollisions.length > 0) {
    // console.log("HERE");
    this.deleteLaserbeam();
  } else {
    var x = this.end.x - this.start.x;
    var y = this.end.y - this.start.y;
    var l = Math.sqrt(x * x + y * y);
    x = x / l;
    y = y / l;
    this.x += x * this.xVelocity;
    this.y += y * this.yVelocity;

    // laser goes out of bounds
    if (this.x > 1500 || this.x < 0 || this.y > 700 || this.y < 0) {
      this.deleteLaserbeam();
    }
  }
  
  // Entity.prototype.update.call(this);
}

LaserBeam.prototype.collide = function (xDisplacement, yDisplacement, tag) {
  var collisions = [];
  for (var i = 0; i < gameEngine.entities.length; i++) {
    let theTag = gameEngine.entities[i].tag;
    let current = gameEngine.entities[i];    
    if (theTag == tag) {
      // console.log(theTag);
      if (this.x + xDisplacement < current.collisionX + current.collisionWidth && this.x + xDisplacement > current.collisionX &&
        this.y + yDisplacement < current.collisionY + current.collisionHeight && this.y + yDisplacement > current.collisionY) {
        var direction = 'bottom';
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
  // console.log(collisions);
  return collisions;
}
LaserBeam.prototype.getCollision = function(direction) {
  for(var i = 0; i < this.platformCollisions.length; i++) {
      if (this.platformCollisions[i].direction == direction) {
          return this.platformCollisions[i];
      }
  }
  return null;
}

LaserBeam.prototype.deleteLaserbeam = function () {
  for (var i = 0; i < gameEngine.entities.length; i++) {
    // if (gameEngine.entities[i] instanceof LaserBeam 
    //   && gameEngine.entities[i].laserID == this.laserID) {  
    if (gameEngine.entities[i] == this) {
      // console.log("Laserbeam delthis.shoot();eted with tag" + this.laserID);
      // console.log(gameEngine.entities[i].laserID == this.laserID);
      gameEngine.entities.splice(i, 1);
    }
  }
}

LaserBeam.prototype.draw = function () {
  let theDeg = this.getDegree()
  let absDegree = Math.abs(theDeg);
  if (absDegree >= 0 && absDegree < 11) {
    (theDeg > 0) ? this.shootAnim0.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim0Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 11 && absDegree < 33) {
    (theDeg > 0) ? this.shootAnim22.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim22Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 33 && absDegree < 56) {
    (theDeg > 0) ? this.shootAnim45.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim45Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 56 && absDegree < 78) {
    (theDeg > 0) ? this.shootAnim67.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim67Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 78 && absDegree < 112) {
    (theDeg > 0) ? this.shootAnim90.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim90Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 112 && absDegree < 146) {
    (theDeg > 0) ? this.shootAnim135.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim135Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else {
    (theDeg > 0) ? this.shootAnim135.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim135Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  }
  Entity.prototype.draw.call(this);
}

LaserBeam.prototype.getDegree = function () {
  let delta_x = (this.end.x - this.start.x);
  let delta_y = (this.end.y - this.start.y);
  let hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
  let radian = Math.asin(delta_x / hypotenuse);
  let theDegree = radian * 180 / Math.PI;
  if (this.end.y > this.start.y) {
    if (this.end.x > this.start.x) {
      theDegree = 180 - theDegree;
    } else {
      theDegree = -180 - theDegree;
    }
  }
  return theDegree;
}




/*
  LightsaberThrow Object
*/
function LightsaberThrow(start, end, game) {
  // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
  this.throwAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1312, 96, 25, 0.08, 4, true, false);
  // this.throwAnim = new Animation(AM.getAsset("./img/blue_laser_beam.png"), 45, 70, 527, 59, 1, 0.1, false, false);

  this.start = start;
  this.speed = 10;
  this.end = end;
  this.x = start.x;
  this.y = start.y;
  this.game = game;
  this.width = 30;
  this.height = 30;
  this.goBack = false;
  this.tag = "lightsaberthrow";

  this.hitbox = 30;
  if (start.x <= end.x) {
    this.right = true;
  } else {
    this.right = false;
  }

  // console.log("Init throw: " + start.x + " " + start.y + " " + end.x + " " + end.y);
  Entity.call(this, game, this.x, this.y, this.width, this.height);
}
LightsaberThrow.prototype = new Entity();
LightsaberThrow.prototype.constructor = LightsaberThrow;

LightsaberThrow.prototype.collide = function (other) {
  // console.log("COLLIDE: " + distance(this, other) +" "+ (this.hitbox + other.hitbox));
  return distance(this, other) < this.hitbox + other.hitbox;
};

LightsaberThrow.prototype.update = function () {
  for (let i = 0; i < this.game.entities.length; i++) {
    let ent = this.game.entities[i];
    if (ent.tag == "AI") {
      // console.log("enter AI, object: " + ent.tag + " " +this.hitbox);
      if (ent.object !== this && this.collide(ent.object)) {
        console.log("LIGHTSABER collision!!!");
      }
    }
  }
  if (this.right) {      // Throwing to the right side
    if (!this.goBack) {
      let x = this.end.x - this.start.x;
      let y = this.end.y - this.start.y;
      let l = Math.sqrt(x * x + y * y);
      x = x / l;
      y = y / l;
      this.x += x * this.speed;
      this.y += y * this.speed;
    } else {
      // if (this.goBack){
      let x = center_x - this.end.x;
      let y = center_y - this.end.y;
      let l = Math.sqrt(x * x + y * y);
      x = x / l;
      y = y / l;
      this.x -= -x * this.speed;
      this.y -= -y * this.speed;
      if (this.x <= center_x) {
        deleteLightsaberThrow();
      }
    }
    if (this.x > this.end.x) {
      this.goBack = true;
    }
  } else {      // Throwing to the left side
    if (!this.goBack) {
      let x = this.end.x - this.start.x;
      let y = this.end.y - this.start.y;
      let l = Math.sqrt(x * x + y * y);
      x = x / l;
      y = y / l;
      this.x += x * this.speed;
      this.y += y * this.speed;
    } else {
      // if (this.goBack){
      let x = center_x - this.end.x;
      let y = center_y - this.end.y;
      let l = Math.sqrt(x * x + y * y);
      x = x / l;
      y = y / l;
      this.x -= -x * this.speed;
      this.y -= -y * this.speed;
      if (this.x >= center_x) {
        deleteLightsaberThrow();
      }
    }
    if (this.x < this.end.x) {
      this.goBack = true;
    }
  }


  Entity.prototype.update.call(this);
}

LightsaberThrow.prototype.draw = function () {
  this.throwAnim.drawFrame(gameEngine.clockTick, gameEngine.ctx, this.x, this.y, 1.4);
  Entity.prototype.draw.call(this);
}

function deleteLightsaberThrow() {
  for (var i = 0; i < gameEngine.entities.length; i++) {
    if (gameEngine.entities[i] instanceof LightsaberThrow) {
      console.log("lightsaber deleted");
      gameEngine.entities.splice(i, 1);
    }
  }
}
