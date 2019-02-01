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
AM.queueDownload("./img/luke_sprites_right.png");
AM.queueDownload("./img/luke_sprites_left.png");
AM.queueDownload("./img/vader_1560x1040.png");
AM.queueDownload("./img/blueLightsaber.png");
AM.queueSound("./sounds/VaderVsLukeTheme.mp3");
AM.queueSound("./sounds/Swing2.WAV");
AM.queueSound("./sounds/MenuSelect.wav");
AM.queueSound("./sounds/VolumeUp.wav");
AM.queueSound("./sounds/VolumeDown.wav");
AM.queueSound("./sounds/CycleMenu.wav");
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
    initializeCharacterData();
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
    initializeMenuItems();
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', mainMenuClick);
    canvas.addEventListener('mousemove', menuMouseMove);
    frameId = requestAnimationFrame(mainMenuFrame);
}

function mainMenuFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    menuItems.forEach(function(item) {
        item.draw();
    });
    frameId = requestAnimationFrame(mainMenuFrame);
    if (transition) {
        if (menuSelection == "STORY MODE" || menuSelection == "MULTIPLAYER") {
            screenTransition(inGame);
        } else if (menuSelection == "CUSTOM GAME") {
            screenTransition(customGame);
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

// --------------------- CUSTOM GAME ----------------------------
function customGame() {
    initializeCustomGameItems();
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', customGameClick);
    frameId = requestAnimationFrame(customGameFrame);
}

function customGameFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();

    ctx.save();
    ctx.font = "30px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("CUSTOM GAME", 600, 75);
    ctx.font = "15px monospace";
    ctx.fillText(characterData[playerCharacter].name, 738, 128);
    ctx.font = "13px monospace";
    ctx.fillText(characterData[computerCharacter1].name, 738, 378);
    ctx.fillText(characterData[computerCharacter2].name, 868, 378);
    ctx.fillText(characterData[computerCharacter3].name, 998, 378);
    ctx.fillText(characterData[computerCharacter4].name, 1128, 378);
    ctx.strokeStyle = "white";
    ctx.rect(20, 200, 500, 250);
    ctx.stroke();

    ctx.rect(680, 150, 115, 160);
    ctx.stroke();
    drawCharacterFromData(650, 170, playerCharacter);

    ctx.rect(810, 150, 375, 160);
    ctx.stroke();

    ctx.rect(680, 400, 115, 160);
    ctx.stroke();
    drawCharacterFromData(650, 420, computerCharacter1);

    ctx.rect(810, 400, 115, 160);
    ctx.stroke();
    drawCharacterFromData(780, 420, computerCharacter2);

    ctx.rect(940, 400, 115, 160);
    ctx.stroke();
    drawCharacterFromData(910, 420, computerCharacter3);

    ctx.rect(1070, 400, 115, 160);
    ctx.stroke();
    drawCharacterFromData(1040, 420, computerCharacter4);

    ctx.font = "20px monospace";    
    ctx.fillText("MAP", 35, 150);
    ctx.textAlign = "right"; 
    ctx.fillText("PLAYER", 1180, 130);
    ctx.fillText("COMPUTER", 1180, 350);
    ctx.restore();

    menuItems.forEach(function(item) {
        item.draw();
    });
    updateCharacterData();
    frameId = requestAnimationFrame(customGameFrame);
    if (transition) {
        if (menuSelection == "BACK") {
            screenTransition(mainMenu);
        } else if (menuSelection == "START") {
            screenTransition(inGame);
        } else {
            screenTransition(customGame);
        }
    }
}

function customGameClick(event) {
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        menuItems.forEach(function(item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w/2 - 5 && x <= item.w/2 + item.x + 5) {
                menuSelection = item.text;
                if (menuSelection == "BACK" || menuSelection == "START") {
                    var audio = AM.getSound("./sounds/MenuSelect.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    canvas.removeEventListener('click', customGameClick);
                    transition = true;
                } else {
                    var audio = AM.getSound("./sounds/CycleMenu.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    if (item.tag == "player<") {
                        playerCharacter--;
                        if (playerCharacter == 0) {
                            playerCharacter = characters.length - 1;
                        }
                    } else if (item.tag == "player>") {
                        playerCharacter++;
                        if (playerCharacter == characters.length) {
                            playerCharacter = 1;
                        }
                    } else if (item.tag == "computer1<") {
                        computerCharacter1--;
                        computerCharacter1 = (computerCharacter1 % characters.length + characters.length) % characters.length;

                    } else if (item.tag == "computer1>") {
                        computerCharacter1++;
                        computerCharacter1 %= characters.length;
                    } else if (item.tag == "computer2<") {
                        computerCharacter2--;
                        computerCharacter2 = (computerCharacter2 % characters.length + characters.length) % characters.length;
                    } else if (item.tag == "computer2>") {
                        computerCharacter2++;
                        computerCharacter2 %= characters.length;
                    } else if (item.tag == "computer3<") {
                        computerCharacter3--;
                        computerCharacter3 = (computerCharacter3 % characters.length + characters.length) % characters.length;
                    } else if (item.tag == "computer3>") {
                        computerCharacter3++;
                        computerCharacter3 %= characters.length;
                    } else if (item.tag == "computer4<") {
                        computerCharacter4--;
                        computerCharacter4 = (computerCharacter4 % characters.length + characters.length) % characters.length;
                    } else if (item.tag == "computer4>") {
                        computerCharacter4++;
                        computerCharacter4 %= characters.length;
                    }
                }
            }
        });
    }
}


// --------------------- SETTINGS ----------------------------
function settings() {
    initializeSettingsItems();
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
    menuItems.forEach(function(item) {
        item.draw();
    });
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
                    if (item.tag == "music+") {
                        if (musicVolume < 1) {
                            musicVolume += 0.05;
                            if (musicVolume > 1) {
                                musicVolume = 1;
                            }
                            var audio = AM.getSound("./sounds/VolumeUp.wav").cloneNode();
                            audio.volume = sfxVolume;
                            audio.play();
                        }
                    } else if (item.tag == "music-") {
                        if (musicVolume > 0) {
                            musicVolume -= 0.05;
                            if (musicVolume < 0) {
                                musicVolume = 0;
                            }
                            var audio = AM.getSound("./sounds/VolumeDown.wav").cloneNode();
                            audio.volume = sfxVolume;
                            audio.play();
                        }
                    } else if (item.tag == "sfx+") {
                        if (sfxVolume < 1) {
                            sfxVolume += 0.05;
                            if (sfxVolume > 1) {
                                sfxVolume = 1;
                            }
                            var audio = AM.getSound("./sounds/VolumeUp.wav").cloneNode();
                            audio.volume = sfxVolume;
                            audio.play();
                        }
                    } else if (item.tag =="sfx-") {
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
        });
    }
}

// --------------------- CREDITS ----------------------------
function credits() {
    initializeCreditsItems();
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
    menuItems.forEach(function(item) {
        item.draw();
    });
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
