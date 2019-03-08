/*
  LaserBeam Object
*/
function distance(a, b) {
  // console.log(a.x +" "+a.y+ " "+ b.x +" "+b.y);
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function LaserBeam(start, end, game) {
  // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse

  this.start = start;
  this.end = end;
  this.x = start.x;
  this.y = start.y;
  this.game = game;
  this.isShotgun = false;
  this.tag = "laser";

  this.xVelocity = 20;
  this.yVelocity = 20;

  this.width = 30;
  this.height = 30;

  this.laserID = null;
  this.enemyTag = null;
  this.img = AM.getAsset("./img/blue_laser_small.png");

  this.hitbox = 30;
  Entity.call(this, game, this.x, this.y, this.width, this.height);
}

LaserBeam.prototype = new Entity();
LaserBeam.prototype.constructor = LaserBeam;

LaserBeam.prototype.getDistance = function (otherEnt) {
  let dx, dy;
  dx = this.x - otherEnt.x;
  dy = this.y - otherEnt.y;
  let theDist = Math.sqrt(dx * dx + dy * dy);
  // console.log("Distance: " + theDist + ", " +otherEnt.x + ", "+(thisEnt.x + thisEnt.width));
  return theDist;
}

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

  var entityCollisions = [];
  for (var i = 0; i < gameEngine.entities.length; i++) {
    let current = gameEngine.entities[i];
    if (this.x + this.xVelocity + this.width < current.x + current.width && this.x + this.xVelocity + this.width > current.x &&
      this.y + this.yVelocity + this.height < current.y + current.height && this.y + this.yVelocity - this.height > current.y) {
      entityCollisions.push(current);
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
LaserBeam.prototype.getCollision = function (direction) {
  for (var i = 0; i < this.platformCollisions.length; i++) {
    if (this.platformCollisions[i].direction == direction) {
      return this.platformCollisions[i];
    }
  }
  return null;
}

LaserBeam.prototype.deleteLaserbeam = function () {
  for (var i = 0; i < gameEngine.entities.length; i++) {
    if (gameEngine.entities[i] == this) {
      gameEngine.entities.splice(i, 1);
    }
  }
}

LaserBeam.prototype.draw = function () {
  let theDeg = this.getDegree()
  let absDegree = Math.abs(theDeg);
  if (this.isShotgun){
    this.img = AM.getAsset("./img/shotgun_bullet.PNG");
  }
  drawRotatedImage(this.img, this.x, this.y, theDeg);

  Entity.prototype.draw.call(this);
}

LaserBeam.prototype.getDegree = function () {
  var theDegree = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
  return theDegree;
}

LaserBeam.prototype.deflection = function () {
  let chanceToHit = Math.round(Math.random() * 5);

  if (chanceToHit == 1) {
    this.xVelocity = -this.xVelocity;
    this.yVelocity = -this.yVelocity;
  } else {
    let chanceDeflectUp = Math.round(Math.random());
    let saveStartx = this.start.x;
    let saveStarty = this.start.y;
    this.start.x = this.end.x;
    this.start.y = this.end.y;
    this.end.x = saveStartx
    if (chanceDeflectUp == 0) {
      this.end.y = saveStarty - 400;
    } else {
      this.end.y = saveStarty + 400;
    }
  }
}

function drawRotatedImage(image, x, y, angle) {
  // save the current co-ordinate system 
  // before we screw with it
  ctx.save();

  // move to the middle of where we want to draw our image
  ctx.translate(x, y);

  // rotate around that point, converting our 
  // angle from degrees to radians 
  ctx.rotate(angle);

  // draw it up and to the left by half the width
  // and height of the image 
  ctx.drawImage(image, -(image.width / 2), -(image.height / 2));

  // and restore the co-ords to how they were when we began
  ctx.restore();
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

LightsaberThrow.prototype.getDistance = function (otherEnt) {
  let dx, dy;
  dx = this.x - otherEnt.x;
  dy = this.y - otherEnt.y;
  let theDist = Math.sqrt(dx * dx + dy * dy);
  // console.log("Distance: " + theDist + ", " +otherEnt.x + ", "+(thisEnt.x + thisEnt.width));
  return theDist;
}

LightsaberThrow.prototype.update = function () {
  for (let i = 0; i < gameEngine.entities.length; i++) {
    let curentEnt = gameEngine.entities[i];   // FIX : lightsaber throw collision put in projectiles good job
    if (curentEnt instanceof Trooper && this.getDistance(curentEnt) < 50) {
      curentEnt.health -= 50;
      createSparks(curentEnt.x + curentEnt.width, curentEnt.y + curentEnt.height / 2);
    }
    if (curentEnt instanceof Vader && this.getDistance(curentEnt) < 50) {
      curentEnt.health -= 50;
      createSparks(curentEnt.x + curentEnt.width, curentEnt.y + curentEnt.height / 2);
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
