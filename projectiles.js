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
  this.shootAnim0 = new Animation(this.spriteSheet, 0, 0, 120, 375, frameDuration, 1, false, false);
  this.shootAnim22 = new Animation(this.spriteSheet, 600, 0, 250, 375, frameDuration, 1, false, false);
  this.shootAnim45 = new Animation(this.spriteSheet, 1200, 110, 350, 250, frameDuration, 1, false, false);
  this.shootAnim67 = new Animation(this.spriteSheet, 1800, 100, 400, 300, frameDuration, 1, false, false);
  this.shootAnim90 = new Animation(this.spriteSheet, 2430, 303, 350, 60, frameDuration, 1, false, false);
  this.shootAnim135 = new Animation(this.spriteSheet, 3000, 145, 350, 200, frameDuration, 1, false, false);
  this.spriteSheetLeft = AM.getAsset("./img/laserbeams_angle_left.png");
  this.shootAnim0Left = new Animation(this.spriteSheetLeft, 1284, 13, 40, 120, frameDuration, 1, false, false);
  this.shootAnim22Left = new Animation(this.spriteSheetLeft, 1038, 13, 70, 140, frameDuration, 1, false, false);
  this.shootAnim45Left = new Animation(this.spriteSheetLeft, 800, 45, 95, 90, frameDuration, 1, false, false);
  this.shootAnim67Left = new Animation(this.spriteSheetLeft, 580, 75, 120, 75, frameDuration, 1, false, false);
  this.shootAnim90Left = new Animation(this.spriteSheetLeft, 375, 100, 120, 30, frameDuration, 1, false, false);
  this.shootAnim135Left = new Animation(this.spriteSheetLeft, 180, 60, 120, 70, frameDuration, 1, false, false);

  this.start = start;
  this.speed = 30;
  this.end = end;
  this.x = start.x;
  this.y = start.y;
  this.game = game;
  this.tag = "laser";

  this.hitbox = 30;
  Entity.call(this, game, this.x, this.y);
}

LaserBeam.prototype = new Entity();
LaserBeam.prototype.constructor = LaserBeam;

// LaserBeam.prototype.collide = function (other) {
//   // console.log("COLLIDE: " + distance(this, other) +" "+ (this.hitbox + other.hitbox));
//   return distance(this, other) < this.hitbox + other.hitbox;
// };

// LaserBeam.prototype.collideLeft = function () {
//   return (this.x - this.hitbox) < 0;
// };

// LaserBeam.prototype.collideRight = function () {
//   return (this.x + this.hitbox) > 1200;
// };

// LaserBeam.prototype.collideTop = function () {
//   return (this.y - this.hitbox) < 0;
// };

// LaserBeam.prototype.collideBottom = function () {
//   return (this.y + this.hitbox) > 600;
// };

LaserBeam.prototype.update = function () {
  for (let i = 0; i < this.game.entities.length; i++) {
    let ent = this.game.entities[i];
    if (ent.tag == "AI") {
      // console.log("enter AI, object: " + ent.tag + " " +this.hitbox);
      if (ent.object !== this && this.collide(ent.object)) {
        console.log("Laserbeam collision!!!");
        deleteLaserbeam();
      }
    }
  }

  // if (this.collideLeft() || this.collideRight()) {
  //   if (this.collideLeft()) this.x = this.radius;
  //   if (this.collideRight()) this.x = 800 - this.radius;
  //   this.x += this.speed * this.game.clockTick;
  //   this.y += this.speed * this.game.clockTick;
  // }

  // if (this.collideTop() || this.collideBottom()) {
  //   if (this.collideTop()) this.y = this.radius;
  //   if (this.collideBottom()) this.y = 800 - this.radius;
  //   this.x += this.speed * this.game.clockTick;
  //   this.y += this.speed * this.game.clockTick;
  // }

  var rect = canvas.getBoundingClientRect();
  var x = this.end.x - this.start.x;
  var y = this.end.y - this.start.y;
  var l = Math.sqrt(x * x + y * y);
  x = x / l;
  y = y / l;
  this.x += x * this.speed;
  this.y += y * this.speed;

  // console.log(this.x+" "+this.y);
  if (this.x > 1200 || this.x < 0 || this.y > 600 || this.y < 0) {
    deleteLaserbeam();
  }

  Entity.prototype.update.call(this);
}

LaserBeam.prototype.draw = function () {
  let degree = getAngle(this.end.x, this.end.y);
  let absDegree = Math.abs(degree);
  if (absDegree >= 0 && absDegree < 11) {
    (degree > 0) ? this.shootAnim0.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim0Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 11 && absDegree < 33) {
    (degree > 0) ? this.shootAnim22.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim22Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 33 && absDegree < 56) {
    (degree > 0) ? this.shootAnim45.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim45Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 56 && absDegree < 78) {
    (degree > 0) ? this.shootAnim67.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim67Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 78 && absDegree < 112) {
    (degree > 0) ? this.shootAnim90.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim90Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else if (absDegree >= 112 && absDegree < 146) {
    (degree > 0) ? this.shootAnim135.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim135Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  } else {
    (degree > 0) ? this.shootAnim135.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize) : this.shootAnim135Left.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, lasersize2);
  }

  Entity.prototype.draw.call(this);
}

function deleteLaserbeam() {
  for (var i = 0; i < gameEngine.entities.length; i++) {
    if (gameEngine.entities[i] instanceof LaserBeam) {
      console.log("Laserbeam deleted");
      gameEngine.entities.splice(i, 1);
    }
  }
}

function getAngle(xCoor, yCoor) {
  let delta_x = (xCoor - center_x);
  let delta_y = (yCoor - center_y);
  let hypotenuse = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
  let radian = Math.asin(delta_x / hypotenuse);
  let theDegree = radian * 180 / Math.PI;
  if (yCoor > center_y) {
    if (xCoor > center_x) {
      degree = 180 - degree;
    } else {
      degree = -180 - degree;
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
  this.goBack = false;
  this.tag = "lightsaberthrow";

  this.hitbox = 30;
  if (start.x <= end.x) {
    this.right = true;
  } else {
    this.right = false;
  }

  console.log("Init throw: " + start.x + " " + start.y + " " + end.x + " " + end.y);
  Entity.call(this, game, this.x, this.y);
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
    if (this.x > this.end.x && this.y < this.end.y) {
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
    if (this.x < this.end.x && this.y < this.end.y) {
      this.goBack = true;
    }
  }


  Entity.prototype.update.call(this);
}

LightsaberThrow.prototype.draw = function () {
  this.throwAnim.drawFrame(gameEngine.clockTick, gameEngine.ctx, this.x, this.y, 1.7);
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
