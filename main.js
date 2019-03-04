var AM = new AssetManager();
var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");
var gameEngine = new GameEngine();
var transition = false;
var frameId;
var transitionCounter = 0;
var menuSelection;
var musicVolume = 0.1;
var sfxVolume = 1;
var playerName = "<PLAYER NAME>";
var tempName = "";
var searching = false;
var searchingCounter = 0;
var editingName = false;
var mainMenuMusic;
var SHOWBOX = false;

// var testingVader = false;
// var testingMace = false;
// var testingLuke = true;
// var testingObi = false;

AM.queueDownload("./img/StarWarsLogo.png");
AM.queueDownload("./img/luke_sprites_right.png");
AM.queueDownload("./img/luke_sprites_left.png");
AM.queueDownload("./img/vader_sprites_left - Copy.png");
AM.queueDownload("./img/blueLightsaber.png");
AM.queueDownload("./img/mapAssets1.png");
AM.queueDownload("./img/laserbeams_angle.png");
AM.queueDownload("./img/laserbeams_angle_left.png");
AM.queueDownload("./img/macewindu_left.png");
AM.queueDownload("./img/macewindu_right.png");
AM.queueDownload("./img/trooper_right.png");
AM.queueDownload("./img/trooper_left.png");
AM.queueDownload("./img/background.png");
AM.queueDownload("./img/background2.png");
AM.queueDownload("./img/obiwan_right.png");
AM.queueDownload("./img/obiwan_left.png");

AM.queueSound("./sounds/VaderVsLukeTheme.wav");
AM.queueSound("./sounds/Swing2.WAV");
AM.queueSound("./sounds/MenuSelect.wav");
AM.queueSound("./sounds/VolumeUp.wav");
AM.queueSound("./sounds/VolumeDown.wav");
AM.queueSound("./sounds/CycleMenu.wav");
AM.queueSound("./sounds/StartSearch.mp3");
AM.queueSound("./sounds/CancelSearch.wav");
AM.queueSound("./sounds/EditName.wav");
AM.queueSound("./sounds/laser_blaster_sound.wav");
AM.queueSound("./sounds/LightsaberThrow.WAV");
AM.queueSound("./sounds/LightsaberTurnOn.wav");
AM.queueSound("./sounds/LightsaberTurnOff.wav");
AM.queueSound("./sounds/StarWarsMainTheme.wav");
AM.queueSound("./sounds/lasrhit2.WAV");
AM.queueSound("./sounds/StarWarsMainTheme2.mp3");

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
    menuItems.forEach(function (item) {
        if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w / 2 - 5 && x <= item.w / 2 + item.x + 5) {
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
    mainMenuMusic = AM.getSound("./sounds/StarWarsMainTheme2.mp3");
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
    mainMenuMusic.volume = 0.5 * musicVolume;
    mainMenuMusic.play();
    canvas.addEventListener('click', mainMenuClick);
    canvas.addEventListener('mousemove', menuMouseMove);
    frameId = requestAnimationFrame(mainMenuFrame);
}

function mainMenuFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    menuItems.forEach(function (item) {
        item.draw();
    });
    frameId = requestAnimationFrame(mainMenuFrame);
    if (transition) {
        if (menuSelection == "STORY MODE") {
            screenTransition(inGame);
        } else if (menuSelection == "MULTIPLAYER") {
            screenTransition(multiplayer);
        } else if (menuSelection == "CUSTOM GAME") {
            screenTransition(customGame);
        } else if (menuSelection == "SETTINGS") {
            screenTransition(settings);
        } else if (menuSelection == "CREDITS") {
            screenTransition(credits);
        } else if (menuSelection == "CONTROLS") {
            screenTransition(controls);
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
        menuItems.forEach(function (item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w / 2 - 5 && x <= item.w / 2 + item.x + 5) {
                menuSelection = item.text;
                if (menuSelection == "STORY MODE" || menuSelection == "CUSTOM GAME" || menuSelection == "MULTIPLAYER" ||
                    menuSelection == "SETTINGS" || menuSelection == "CREDITS" || menuSelection == "CONTROLS") {
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
    ctx.rect(810, 150, 375, 160);
    ctx.stroke();

    ctx.rect(680, 150, 115, 160);
    ctx.stroke();
    ctx.rect(680, 400, 115, 160);
    ctx.stroke();
    ctx.rect(810, 400, 115, 160);
    ctx.stroke();
    ctx.rect(940, 400, 115, 160);
    ctx.stroke();
    ctx.rect(1070, 400, 115, 160);
    ctx.stroke();

    drawCharacterFromData(650, 170, playerCharacter, 115, 160, 1, 0, 0);
    drawCharacterFromData(650, 420, computerCharacter1, 115, 160, 1, 0, 0);
    drawCharacterFromData(780, 420, computerCharacter2, 115, 160, 1, 0, 0);
    drawCharacterFromData(910, 420, computerCharacter3, 115, 160, 1, 0, 0);
    drawCharacterFromData(1040, 420, computerCharacter4, 115, 160, 1, 0, 0);

    ctx.font = "20px monospace";
    ctx.fillText("MAP", 35, 150);
    ctx.textAlign = "right";
    ctx.fillText("PLAYER", 1180, 130);
    ctx.fillText("COMPUTER", 1180, 350);
    ctx.restore();

    menuItems.forEach(function (item) {
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
        menuItems.forEach(function (item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w / 2 - 5 && x <= item.w / 2 + item.x + 5) {
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
                            playerCharacter = characterData.length - 1;
                        }
                    } else if (item.tag == "player>") {
                        playerCharacter++;
                        if (playerCharacter == characterData.length) {
                            playerCharacter = 1;
                        }
                    } else if (item.tag == "computer1<") {
                        computerCharacter1--;
                        computerCharacter1 = (computerCharacter1 % characterData.length + characterData.length) % characterData.length;

                    } else if (item.tag == "computer1>") {
                        computerCharacter1++;
                        computerCharacter1 %= characterData.length;
                    } else if (item.tag == "computer2<") {
                        computerCharacter2--;
                        computerCharacter2 = (computerCharacter2 % characterData.length + characterData.length) % characterData.length;
                    } else if (item.tag == "computer2>") {
                        computerCharacter2++;
                        computerCharacter2 %= characterData.length;
                    } else if (item.tag == "computer3<") {
                        computerCharacter3--;
                        computerCharacter3 = (computerCharacter3 % characterData.length + characterData.length) % characterData.length;
                    } else if (item.tag == "computer3>") {
                        computerCharacter3++;
                        computerCharacter3 %= characterData.length;
                    } else if (item.tag == "computer4<") {
                        computerCharacter4--;
                        computerCharacter4 = (computerCharacter4 % characterData.length + characterData.length) % characterData.length;
                    } else if (item.tag == "computer4>") {
                        computerCharacter4++;
                        computerCharacter4 %= characterData.length;
                    }
                }
            }
        });
    }
}

// --------------------- MULTIPLAYER ----------------------------
function multiplayer() {
    initializeMultiplayerItems();
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', multiplayerClick);
    frameId = requestAnimationFrame(multiplayerFrame);
}

function multiplayerFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    ctx.save();
    ctx.font = "30px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("MULTIPLAYER", 600, 100);
    ctx.font = "20px monospace";
    if (searching) {
        ctx.fillText("Searching", 600, 250);
        if (searchingCounter < 40) {
            ctx.fillText(".", 600, 270);
        } else if (searchingCounter < 80) {
            ctx.fillText("..", 600, 270);
        } else if (searchingCounter < 120) {
            ctx.fillText("...", 600, 270);
        } else if (searchingCounter < 160) {
            ctx.fillText("....", 600, 270);
        } else {
            searchingCounter = 0;
        }
        searchingCounter++;
    }
    ctx.fillText(characterData[playerCharacter].name, 260, 448);
    ctx.strokeStyle = "white";
    ctx.rect(175, 160, 173, 240);
    ctx.stroke();
    ctx.restore();
    menuItems.forEach(function (item) {
        item.draw();
    });

    drawCharacterFromData(145, 180, playerCharacter, 173, 240, 1.5, -17, 10);
    updateCharacterData();
    frameId = requestAnimationFrame(multiplayerFrame);
    if (transition) {
        screenTransition(mainMenu);
    }
}

function multiplayerClick(event) {
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        menuItems.forEach(function (item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w / 2 - 5 && x <= item.w / 2 + item.x + 5) {
                menuSelection = item.text;
                if (menuSelection == "BACK") {
                    var audio = AM.getSound("./sounds/MenuSelect.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    canvas.removeEventListener('click', multiplayerClick);
                    editingName = false;
                    canvas.removeEventListener('keyup', nameEditHandler, true);
                    transition = true;
                    searching = false;
                    menuItems[0].text = "FIND MATCH";
                } else if (menuSelection == "FIND MATCH") {
                    var audio = AM.getSound("./sounds/StartSearch.mp3").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    searching = true;
                    item.text = "CANCEL";
                } else if (menuSelection == "CANCEL") {
                    var audio = AM.getSound("./sounds/CancelSearch.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    searching = false;
                    item.text = "FIND MATCH";
                } else if (menuSelection == "<") {
                    var audio = AM.getSound("./sounds/CycleMenu.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    playerCharacter--;
                    if (playerCharacter == 0) {
                        playerCharacter = characterData.length - 1;
                    }
                } else if (menuSelection == ">") {
                    var audio = AM.getSound("./sounds/CycleMenu.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    playerCharacter++;
                    if (playerCharacter == characterData.length) {
                        playerCharacter = 1;
                    }
                } else if (item.tag == "playername") {
                    var audio = AM.getSound("./sounds/EditName.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    canvas.addEventListener('keyup', nameEditHandler, true);
                    editingName = true;
                    tempName = "";
                    menuItems[menuItems.length - 1].text = "<ENTER A NAME>";
                }
            }
        });
    }
}

function nameEditHandler(event) {
    var key = event.keyCode;
    if (key == 8) {
        if (tempName != "" && tempName) {
            tempName = tempName.substring(0, tempName.length - 1);
        }
    } else if (key == 13 && tempName != "") {
        playerName = tempName;
        editingName = false;
        canvas.removeEventListener('keyup', nameEditHandler, true);
    } else if (tempName.length < 17) {
        if (key != 13) {
            tempName += String.fromCharCode(event.keyCode);
        }
    }

    if (tempName == "") {
        menuItems[menuItems.length - 1].text = "<ENTER A NAME>";
    } else {
        menuItems[menuItems.length - 1].text = tempName;
    }
}

// --------------------- CONTROLS ----------------------------
function controls() {
    initializeCreditsItems();
    cancelAnimationFrame(frameId);
    canvas.addEventListener('click', controlsClick);
    frameId = requestAnimationFrame(controlsFrame);
}

function controlsFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    ctx.save();
    ctx.font = "30px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("CONTROLS", 600, 100);
    ctx.fillStyle = "#ffd700";
    ctx.font = "20px arial";
    ctx.fillText("Left Click = Attack", 600, 180);
    ctx.fillText("Right Click = Block", 600, 230);
    ctx.fillText("A / D = Left / Right", 600, 280);
    ctx.fillText("W / S = Jump / Crouch", 600, 330);
    ctx.fillText("E = Special Attack", 600, 380);
    ctx.fillText("R = Switch Weapon", 600, 430);
    ctx.fillText("Hold S + SPACE = Jump Down", 600, 480);
    ctx.restore();
    menuItems.forEach(function (item) {
        item.draw();
    });
    frameId = requestAnimationFrame(controlsFrame);
    if (transition) {
        screenTransition(mainMenu);
    }
}

function controlsClick(event) {
    if (transitionCounter == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        menuItems.forEach(function (item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w / 2 - 5 && x <= item.w / 2 + item.x + 5) {
                menuSelection = item.text;
                if (menuSelection == "BACK") {
                    var audio = AM.getSound("./sounds/MenuSelect.wav").cloneNode();
                    audio.volume = sfxVolume;
                    audio.play();
                    canvas.removeEventListener('click', controlsClick);
                    transition = true;
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
    menuItems.forEach(function (item) {
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
        menuItems.forEach(function (item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w / 2 - 5 && x <= item.w / 2 + item.x + 5) {
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
                            mainMenuMusic.volume = 0.5 * musicVolume;
   							mainMenuMusic.play();
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
                            mainMenuMusic.volume = 0.5 * musicVolume;
   							mainMenuMusic.play();
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
                    } else if (item.tag == "sfx-") {
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
    menuItems.forEach(function (item) {
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
        menuItems.forEach(function (item) {
            if (y <= item.y + 5 && y >= item.y - item.h - 5 && x >= item.x - item.w / 2 - 5 && x <= item.w / 2 + item.x + 5) {
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
    mainMenuMusic.pause();
    var audio = AM.getSound("./sounds/VaderVsLukeTheme.wav");
    audio.volume = musicVolume;
    audio.play();
    frameId = requestAnimationFrame(inGameFrame);
    gameEngine.init(ctx);
    
    var promise = new Promise(function (resolve, reject) {
        let levelManager = new LevelManager();
        gameEngine.addEntity(levelManager);
        resolve('LM done loading');
    });
    
    promise.then(function(value) {
        console.log(value);
        console.log(gameEngine.entities);
        gameEngine.start();
    });

    // if (playerCharacter == 3) {
    //     // gameEngine.addEntity(new Vader());
    //     // gameEngine.addEntity(new Character(gameEngine));
    // } else if (playerCharacter == 2 || playerCharacter == 1) {
    //     if (testingLuke) {
    //         gameEngine.addEntity(new Luke(gameEngine));
    //         levelManager.setEnemiesLevel_1();
    //     } else if (testingMace) {
    //         gameEngine.addEntity(new Luke(gameEngine));
    //         levelManager.setEnemiesLevel_1();
    //     } else if (testingObi) {
    //         gameEngine.addEntity(new Obi());
    //     } else {
    //         gameEngine.addEntity(new Vader());
    //         gameEngine.addEntity(new Dummy(gameEngine));
    //     }
        // gameEngine.addEntity(new Dummy(gameEngine));
    // }
    document.getElementById("gameWorld").style.cursor = "url(./img/red_crosshair.PNG), default";
}

function inGameFrame() {
    frameId = requestAnimationFrame(inGameFrame);
    if (transition) {
        screenTransition(inGame);
    }
}