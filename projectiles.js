/*
  LaserBeam Object
*/
var lasersize = 0.15;
var lasersize2 = 0.5;

function LaserBeam(start, end, game, angle){
  // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
  this.spriteSheet = AM.getAsset("./img/laserbeams_angle.png");
  let frameDuration = 0.5;
  this.shootAnim0 = new Animation(this.spriteSheet, 0, 0, 120, 375, frameDuration, 1, false, false);
  this.shootAnim22 = new Animation(this.spriteSheet, 600, 0, 250, 375, frameDuration,1, false, false);
  this.shootAnim45 = new Animation(this.spriteSheet, 1200, 110, 350, 250, frameDuration, 1, false, false);
  this.shootAnim67 = new Animation(this.spriteSheet, 1800, 100, 400, 300, frameDuration, 1, false, false);
  this.shootAnim90 = new Animation(this.spriteSheet, 2430, 303, 350, 60, frameDuration, 1, false, false);
  this.shootAnim135 = new Animation(this.spriteSheet, 3000, 145, 350, 200, frameDuration, 1, false, false);
  this.spriteSheetLeft = AM.getAsset("./img/laserbeams_angle_left.png");
  this.shootAnim0Left = new Animation(this.spriteSheetLeft, 1284, 13, 40, 120, frameDuration, 1, false, false);
  this.shootAnim22Left = new Animation(this.spriteSheetLeft, 1038, 13, 70, 140, frameDuration,1, false, false);
  this.shootAnim45Left = new Animation(this.spriteSheetLeft, 800, 45, 95, 90, frameDuration, 1, false, false);
  this.shootAnim67Left = new Animation(this.spriteSheetLeft, 580, 75, 120, 75, frameDuration, 1, false, false);
  this.shootAnim90Left = new Animation(this.spriteSheetLeft, 375, 100, 120, 30, frameDuration, 1, false, false);
  this.shootAnim135Left = new Animation(this.spriteSheetLeft, 180, 60, 120, 70, frameDuration, 1, false, false);

  this.start = start;
  this.speed = 100;
  this.end = end;
  this.x = start.x;
  this.y = start.y;
  this.game = game;
  this.angle = angle;
  console.log(this.angle);
  Entity.call(this, game, this.x, this.y);
}
LaserBeam.prototype = new Entity();
LaserBeam.prototype.constructor = LaserBeam;

LaserBeam.prototype.update = function(){
  var rect = canvas.getBoundingClientRect();
  var x =  this.end.x - this.start.x;
  var y = this.end.y - this.start.y;
  var l = Math.sqrt(x * x + y * y);
  x = x / l;
  y = y / l;
  this.x += x * this.speed;
  this.y += y * this.speed;
  // console.log(this.x+" "+this.y);
  if (this.x >1200 || this.x < 0 || this.y >600 ||this.y<0){
    for (var i =0; i< gameEngine.entities.length; i++){
      if (gameEngine.entities[i] instanceof LaserBeam){
        console.log(gameEngine.entities[i] instanceof LaserBeam);
        gameEngine.entities.splice(i, 1);
      }
    }
  }

  Entity.prototype.update.call(this);
}
LaserBeam.prototype.draw = function(){
  absDegree = Math.abs(degree);
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

/*
  LightsaberThrow Object
*/
function LightsaberThrow(start, end, game){
  // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
  this.throwAnim = new Animation(AM.getAsset("./img/luke_sprites_right.png"), 0, 1260, 96, 70, 0.05, 4, true, false);
  // this.throwAnim = new Animation(AM.getAsset("./img/blue_laser_beam.png"), 45, 70, 527, 59, 1, 0.1, false, false);

  this.start = start;
  this.speed = 7;
  this.end = end;
  this.x = start.x;
  this.y = start.y;
  this.game = game;
  console.log(start.x+" "+start.y+ " "+ end.x + " "+end.y);
  Entity.call(this, game, this.x, this.y);
}
LightsaberThrow.prototype = new Entity();
LightsaberThrow.prototype.constructor = LightsaberThrow;

LightsaberThrow.prototype.update = function(){
  if (this.x > this.end.x || this.y > this.end.y){
    console.log("enter"+ this.x+" "+this.y+ " "+ this.end.x + " "+ this.end.y);
    console.log(playerCoor.x+" "+playerCoor.y);
    // let x =  playerCoor.x - this.end.x;
    // let y = playerCoor.y - this.end.y;
    let x =  this.end.x - playerCoor.x;
    let y = this.end.y - playerCoor.y;
    let l = Math.sqrt(x * x + y * y);
    x = x / l;
    y = y / l;
    this.x -= x * this.speed;
    this.y -= y * this.speed;
  } else  if (this.x < this.end.x || this.y < this.end.y) {
    console.log(this.x+" "+this.y+ " "+ this.end.x + " "+ this.end.y);

    let x =  this.end.x - this.start.x;
    let y = this.end.y - this.start.y;
    let l = Math.sqrt(x * x + y * y);
    x = x / l;
    y = y / l;
    this.x += x * this.speed;
    this.y += y * this.speed;
  }
  // if (this.x >1200 || this.x < 0 || this.y >600 ||this.y<0){
  //   for (var i =0; i< gameEngine.entities.length; i++){
  //     if (gameEngine.entities[i] instanceof LightsaberThrow){
  //       console.log(gameEngine.entities[i] instanceof LightsaberThrow);
  //       gameEngine.entities.splice(i, 1);
  //     }
  //   }
  // }

  Entity.prototype.update.call(this);
}

LightsaberThrow.prototype.draw = function(){
  this.throwAnim.drawFrame(gameEngine.clockTick, gameEngine.ctx, this.x, this.y, 1);
  Entity.prototype.draw.call(this);
}
