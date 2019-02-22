window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here
    this.ctx.canvas.addEventListener("click", function (e) {
        that.clickPos = getXandY(e);
        that.click = true;
        that.clickx = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        that.clicky = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        // console.log("Left Click Event - X,Y " + getXandY(e).x + ", " + getXandY(e).y);
    }, false);

    this.ctx.canvas.addEventListener("mouseup", function (e) {
        that.clickPos = getXandY(e);
        that.mouseup = true;
        // console.log(e);
        // console.log("MOUSE UP EVENT - X,Y " + e.clientX + ", " + e.clientY);
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        that.clickPos = getXandY(e);
        // console.log(e);
        // console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        that.rightclick = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        var rect = that.ctx.canvas.getBoundingClientRect();
        that.mouse = getXandY(e);
        that.mouseMoveX = getXandY(e).x;
        that.mouseMoveY = getXandY(e).y;
        that.saveX = that.mouseMoveX;
        that.saveY = that.mouseMoveY;
        // console.log(that.mouse);
        //console.log("MOUSE MOVE Event - X,Y " + e.clientX + ", " + e.clientY);
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        // console.log(e);
        that.wheel = e;
        // console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (e.code === "KeyD"){
          that.d = true;
        }
        if (e.code === "KeyA"){
          that.a = true;
        }
        // console.log(e);
        // console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        // if (e.code === "KeyE"){
        //   var rect = that.ctx.canvas.getBoundingClientRect();
        //   that.e = {pressed: true, x: event.clientX - rect.left, y: event.clientY - rect.top}
        // }
        if (e.code === "KeyD"){
          that.d = true;
        }
        if (e.code === "KeyA"){
          that.a = true;
        }
        if (e.code === "KeyW"){
          that.w = true;
        }
        if (e.code === "KeyS"){
          that.s = true;
        }
        if (e.code === "Space"){
            that.spacebar = true;
        }
        if (e.code === "KeyR") {
            that.r = true;
        }
        if (e.code === "KeyI") {
            that.i = true;
        }
        // that.chars[e.code] = true;
        // console.log(e);
        // console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        // console.log(e);
        // console.log("KEY UP EVENT - Char " + e.code + " Code " + e.keyCode);
        that.keyup = true;
        that.keyReleased = e.key;
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    // console.log('added entity: ' + entity.tag);
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].checkCollisions();
        this.entities[i].draw(this.ctx);
    }
    statusBars.draw();
    this.ctx.restore();
}



GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if(entity !== undefined){
            entity.update();
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.mouseMoveX = this.saveX;
    this.mouseMoveY = this.saveY;
    this.d = null;
    this.a = null;
    this.w = null;
    this.s = null;
    this.r = null;//for swithing the weapon
    this.i = null;//for dying
    this.spacebar = null;
    this.click = null;
    this.rightclick = null;
    this.mouseup = null;
    this.keyup = null;
    this.keyReleased = null;
    this.clickx = null;
    this.clicky =null;
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y, width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.checkCollisions = function() {
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var current = gameEngine.entities[i];
        if (current != this) {
            if (this.x < current.x + current.width && this.x > current.x &&
                this.y < current.y + current.height && this.y > current.y) {
                    // this.collide(current);
            }
        }
    }
}

// Entity.prototype.collide = function() {
//     // console.log("collided");
// }

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}
