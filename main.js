var AM = new AssetManager();
var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");
var transition = false;
var frameId;
var transitionCounter = 0;

AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/StarWarsLogo.png");
AM.queueSound("./sounds/VaderVsLukeTheme.mp3");
AM.queueSound("./sounds/Swing2.WAV");
AM.queueSound("./sounds/MenuSelect.wav");
AM.downloadAll(function () {
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