var AM = new AssetManager();
var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");
var transition = false;
var frameId;
var transitionCounter = 0;

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

AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/StarWarsLogo.png");
AM.queueSound("./sounds/VaderVsLukeTheme.mp3");
AM.queueSound("./sounds/Swing2.WAV");
AM.queueSound("./sounds/MenuSelect.wav");
AM.queueDownload("./img/luke_spites.png");
AM.queueDownload("./img/blueLightsaber.png");
AM.downloadAll(function () {
    // var gameEngine = new GameEngine();
    // gameEngine.init(ctx);
    // gameEngine.start();
    //
    // //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    // gameEngine.addEntity(new Character(gameEngine));
    // console.log("All Done!");
    startScreen();
});

function screenTransition(nextScreen) {
    if (transitionCounter == 20) {
        nextScreen();
        transitionCounter++;
    } else if (transitionCounter < 20) {
        ctx.globalAlpha -= 0.05;
        transitionCounter++;
    } else if (transitionCounter < 40) {
        ctx.globalAlpha += 0.05;
        transitionCounter++;
    } else if (transitionCounter == 40) {
        ctx.globalAlpha = 1;
        transition = false;
        transitionCounter = 0;
    }
}

// --------------------- START SCREEN ----------------------------
function startScreen() {
    initializeMenuItems();
    createStars();
    canvas.addEventListener('click', startScreenClick);
    frameId = requestAnimationFrame(startScreenFrame);
}

function startScreenFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    var img = AM.getAsset("./img/StarWarsLogo.png");
    ctx.drawImage(img,
              0, 0,  // source from sheet
              948, 520, // width and height of source
              390, 50, // destination coordinates
              400, 300); // destination width and height
    startScreenPrompt.draw();
    ctx.font = "15px Impact";
    ctx.fillStyle = "#ffd700";
    ctx.textAlign = "center";
    ctx.fillText("Not Just Another", 450, 80);
    ctx.fillText("Game", 770, 333);
    frameId = requestAnimationFrame(startScreenFrame);
    if (transition) {
        screenTransition(mainMenu);
    }
}

function startScreenClick(event) {
    var audio = AM.getSound("./sounds/MenuSelect.wav");
    audio.play();
    canvas.removeEventListener('click', startScreenClick);
    transition = true;
}

// --------------------- MAIN MENU ----------------------------
function mainMenu() {
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', mainMenuClick);
    canvas,addEventListener('mousemove', mainMenuMove);
    frameId = requestAnimationFrame(mainMenuFrame);
}

function mainMenuFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    menuItemStoryMode.draw();
    menuItemsCustomGame.draw();
    menuItemsMultiplayer.draw();
    menuItemsSettings.draw();
    menuItemsCredits.draw();
    frameId = requestAnimationFrame(mainMenuFrame);
    if (transition) {
        screenTransition(inGame);
    }
}

function mainMenuClick(event) {
    console.log("TEST");
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    menuItems.forEach(function(item) {
        if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w/2 - 5 && x <= item.w/2 + item.x + 5) {
            var audio = AM.getSound("./sounds/MenuSelect.wav");
            audio.play();
            if (item.text == "Story Mode") {
                canvas.removeEventListener('click', mainMenuClick);
                canvas.removeEventListener('mousemove', mainMenuMove);
                transition = true;
            }
        }
    });
}

function mainMenuMove(event) {
    console.log("ASGSAASGASG");
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    menuItems.forEach(function(item) {
        if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w/2 - 5 && x <= item.w/2 + item.x + 5) {
            var audio = AM.getSound("./sounds/MenuSelect.wav");
            audio.play();
            item.hover = true;
        } else {
            item.hover = false;
        }
    });
}

// --------------------- IN GAME ----------------------------
function inGame() {
    cancelAnimationFrame(frameId);
    var audio = AM.getSound("./sounds/VaderVsLukeTheme.mp3");
    audio.volume = 0.5;
    audio.play();
    canvas.addEventListener('click', inGameClick);
    frameId = requestAnimationFrame(inGameFrame);
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Character(gameEngine));
    console.log("All Done!");
}

function inGameFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSparks();
    statusBars.draw();
    frameId = requestAnimationFrame(inGameFrame);
    if (transition) {
        screenTransition(inGame);
    }
}

function inGameClick(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var audio = AM.getSound('./sounds/Swing2.WAV');
    audio.volume = 0.1;
    audio.play();
    createSparks(x, y);
}
