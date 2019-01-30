var AM = new AssetManager();
var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");
var transition = false;
var frameId;
var transitionCounter = 0;
var menuSelection;
var musicVolume = 1;
var sfxVolume = 1;
var gameEngine = new GameEngine();

AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/StarWarsLogo.png");
AM.queueSound("./sounds/VaderVsLukeTheme.mp3");
AM.queueSound("./sounds/Swing2.WAV");
AM.queueSound("./sounds/MenuSelect.wav");
AM.queueSound("./sounds/VolumeUp.wav");
AM.queueSound("./sounds/VolumeDown.wav");
AM.queueDownload("./img/luke_sprites.png");
AM.queueDownload("./img/blueLightsaber.png");
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

function menuMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    menuItems.forEach(function(item) {
        if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w/2 - 5 && x <= item.w/2 + item.x + 5) {
            item.hover = true;
        } else {
            item.hover = false;
        }
    });
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
    ctx.fillText("NOT JUST ANOTHER", 450, 80);
    ctx.fillText("GAME", 770, 333);
    frameId = requestAnimationFrame(startScreenFrame);
    if (transition) {
        screenTransition(mainMenu);
    }
}

function startScreenClick(event) {
    if (transitionCounter == 0) {
        var audio = AM.getSound("./sounds/MenuSelect.wav").cloneNode();
        audio.volume = sfxVolume;
        audio.play();
        canvas.removeEventListener('click', startScreenClick);
        transition = true;
    }
}

// --------------------- MAIN MENU ----------------------------
function mainMenu() {
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', mainMenuClick);
    canvas.addEventListener('mousemove', menuMouseMove);
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
        if (menuSelection == "STORY MODE" || menuSelection == "CUSTOM GAME" || menuSelection == "MULTIPLAYER") {
            screenTransition(inGame);
        } else if (menuSelection == "SETTINGS") {
            screenTransition(settings);
        } else if (menuSelection == "CREDITS") {
            screenTransition(credits);
        } else {
            screenTransition(mainMenu);
        }
    }
}

function mainMenuClick(event) {
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        menuItems.forEach(function(item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w/2 - 5 && x <= item.w/2 + item.x + 5) {
                menuSelection = item.text;
                if (menuSelection == "STORY MODE" || menuSelection == "CUSTOM GAME" || menuSelection == "MULTIPLAYER" ||
                    menuSelection == "SETTINGS" || menuSelection == "CREDITS") {
                    var audio = AM.getSound("./sounds/MenuSelect.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    canvas.removeEventListener('click', mainMenuClick);
                    transition = true;
                }
            }
        });
    }
}

// --------------------- SETTINGS ----------------------------
function settings() {
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', settingsClick);
    frameId = requestAnimationFrame(settingsFrame);
}


function settingsFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    ctx.save();
    ctx.font = "30px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("SETTINGS", 600, 100);
    ctx.font = "15px monospace";
    ctx.fillText("MUSIC:", 500, 200);
    ctx.fillText("SFX:", 500, 250);
    ctx.fillText(Math.round(musicVolume * 100), 650, 200);
    ctx.fillText(Math.round(sfxVolume * 100), 650, 250);
    ctx.restore();
    menuItemMusicPlus.draw();
    menuItemMusicMinus.draw();
    menuItemSFXPlus.draw();
    menuItemSFXMinus.draw();
    menuItemBack.draw();
    frameId = requestAnimationFrame(settingsFrame);
    if (transition) {
        screenTransition(mainMenu);
    }
}

function settingsClick(event) {
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        menuItems.forEach(function(item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w/2 - 5 && x <= item.w/2 + item.x + 5) {
                menuSelection = item.text;
                if (menuSelection == "BACK") {
                    var audio = AM.getSound("./sounds/MenuSelect.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    canvas.removeEventListener('click', settingsClick);
                    transition = true;
                } else {
                    if (item.tag == "music") {
                        if (menuSelection == "+") {
                            if (musicVolume < 1) {
                                musicVolume += 0.05;
                                if (musicVolume > 1) {
                                    musicVolume = 1;
                                }
                                var audio = AM.getSound("./sounds/VolumeUp.wav").cloneNode();
                                audio.volume = sfxVolume;
                                audio.play();
                            }
                        } else {
                            if (musicVolume > 0) {
                                musicVolume -= 0.05;
                                if (musicVolume < 0) {
                                    musicVolume = 0;
                                }
                                var audio = AM.getSound("./sounds/VolumeDown.wav").cloneNode();
                                audio.volume = sfxVolume;
                                audio.play();
                            }
                        }
                    } else if (item.tag == "sfx") {
                        if (menuSelection == "+") {
                            if (sfxVolume < 1) {
                                sfxVolume += 0.05;
                                if (sfxVolume > 1) {
                                    sfxVolume = 1;
                                }
                                var audio = AM.getSound("./sounds/VolumeUp.wav").cloneNode();
                                audio.volume = sfxVolume;
                                audio.play();
                            }
                        } else {
                            if (sfxVolume > 0) {
                                sfxVolume -= 0.05;
                                if (sfxVolume < 0) {
                                    sfxVolume = 0;
                                }
                                var audio = AM.getSound("./sounds/VolumeDown.wav").cloneNode();
                                audio.volume = sfxVolume;
                                audio.play();
                            }
                        }
                    }
                }
            }
        });
    }
}

// --------------------- CREDITS ----------------------------
function credits() {
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', creditsClick);
    frameId = requestAnimationFrame(creditsFrame);
}

function creditsFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    ctx.save();
    ctx.font = "30px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("CREDITS", 600, 100);
    ctx.fillStyle = "#ffd700";
    ctx.font = "20px arial";
    ctx.fillText("Maurice Chiu", 600, 225);
    ctx.fillText("Steven Huang", 600, 275);
    ctx.fillText("Jake Yang", 600, 325);
    ctx.fillText("Benjamin Yuen", 600, 375);
    ctx.restore();
    menuItemBack.draw();
    frameId = requestAnimationFrame(creditsFrame);
    if (transition) {
        screenTransition(mainMenu);
    }
}

function creditsClick(event) {
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        menuItems.forEach(function(item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w/2 - 5 && x <= item.w/2 + item.x + 5) {
                menuSelection = item.text;
                if (menuSelection == "BACK") {
                    var audio = AM.getSound("./sounds/MenuSelect.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    canvas.removeEventListener('click', creditsClick);
                    transition = true;
                }
            }
        });
    }
}

// --------------------- IN GAME ----------------------------
function inGame() {
    canvas.removeEventListener('mousemove', menuMouseMove);
    cancelAnimationFrame(frameId);
    var audio = AM.getSound("./sounds/VaderVsLukeTheme.mp3");
    audio.volume = musicVolume;
    audio.play();
    //canvas.addEventListener('click', inGameClick);
    frameId = requestAnimationFrame(inGameFrame);
    // var gameEngine = new GameEngine(); // Made it an instance field.
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Character(gameEngine));

    document.getElementById("gameWorld").style.cursor = "url(./img/red_crosshair.PNG), default";
    // document.getElementById("gameWorld").cursor =  "url(./img/blueLightsaber.png), default";
}

function inGameFrame() {
    frameId = requestAnimationFrame(inGameFrame);
    if (transition) {
        screenTransition(inGame);
    }
}

// function inGameClick(event) {
//     console.log(event + 'here');
//     if (transitionCounter == 0) { // Keep this but move this whole thing to the character class.
//         var rect = canvas.getBoundingClientRect();
//         var x = event.clientX - rect.left;
//         var y = event.clientY - rect.top;
//         var audio = AM.getSound('./sounds/Swing2.WAV').cloneNode();
//         audio.volume = sfxVolume * 0.2;
//         audio.play();
//         createSparks(x, y);
//         console.log(gameEngine.entities[0]);
//         gameEngine.entities[0].attacking = true; // entities[0] is luke because we only have one character rn.
//     }
// }
