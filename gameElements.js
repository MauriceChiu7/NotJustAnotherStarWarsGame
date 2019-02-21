var statusBars = new StatusBars();
var sparks = [];
var flash = [];
var stars = [];
var fps = 30;
var numStars = 500;
var startScreenPrompt = new StartScreenPrompt();
var menuItems = [];
var characterData = [];
var playerCharacter = 1;
var computerCharacter1 = 0;
var computerCharacter2 = 0;
var computerCharacter3 = 0;
var computerCharacter4 = -0;

// --------------------- CHARACTER SELECTION STUFF ----------------------------
function initializeCharacterData() {
    characterData.push({name: ""});
    characterData.push({name: "Luke", alignment: 0, spritesheet: AM.getAsset("./img/luke_sprites_right.png"), sx: 0, sy: 1550, swidth: 96, sheight: 70, width: 159, height: 116, frameCount: 3, totalTime: 150, currentTime: 0, xBalance: 5, yBalance: 10});
    characterData.push({name: "Vader", alignment: 1, spritesheet: AM.getAsset("./img/vader_sprites_left - Copy.png"), sx: 0, sy: 160, swidth: 120, sheight: 80, width: 168, height: 122.5, frameCount: 8, totalTime: 80, currentTime: 0, xBalance: 10, yBalance: -10});
}

function drawCharacterFromData(x, y, index, width, height, scale, xBalance, yBalance) {
    if (index != 0) {
        ctx.save();
        var grd = ctx.createLinearGradient(x, y + 20, x + width, y + height);
        grd.addColorStop(0, "black");
        if (characterData[index].alignment == 0) {
            grd.addColorStop(1, "blue");
        } else {
            grd.addColorStop(1, "red");
        }
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = grd;
        ctx.fillRect(x + 30, y - 20, width, height);
        ctx.restore();
        ctx.drawImage(characterData[index].spritesheet, characterData[index].sx + Math.floor(characterData[index].currentTime / (characterData[index].totalTime / characterData[index].frameCount)) *
                      characterData[index].swidth, characterData[index].sy, characterData[index].swidth, characterData[index].sheight, x + characterData[index].xBalance + xBalance, y + characterData[index].yBalance + yBalance,
                      characterData[index].width * scale, characterData[index].height * scale);
    }
}

function updateCharacterData() {
    for (var i = 1; i < characterData.length; i++) {
        characterData[i].currentTime++;
        if (characterData[i].currentTime >= characterData[i].totalTime) {
            characterData[i].currentTime = 0;
        }
    }
}

// --------------------- MENU THINGS ----------------------------
function initializeMenuItems() {
    menuItems = [];
    new MenuItem("STORY MODE", 600, 150, 25);
    new MenuItem("CUSTOM GAME", 600, 250, 25);
    new MenuItem("MULTIPLAYER", 600, 350, 25);
    new MenuItem("SETTINGS", 600, 435, 20);
    new MenuItem("CREDITS", 600, 500, 20);
}

function initializeCustomGameItems() {
    menuItems = [];
    new MenuItem("START", 600, 325, 25);
    new MenuItem("<", 120, 152, 30, "map<");
    new MenuItem(">", 400, 152, 30, "map>");
    new MenuItem("<", 685, 132, 30, "player<");
    new MenuItem(">", 790, 132, 30, "player>");
    new MenuItem("<", 690, 380, 20, "computer1<");
    new MenuItem(">", 785, 380, 20, "computer1>");
    new MenuItem("<", 820, 380, 20, "computer2<");
    new MenuItem(">", 915, 380, 20, "computer2>");
    new MenuItem("<", 950, 380, 20, "computer3<");
    new MenuItem(">", 1045, 380, 20, "computer3>");
    new MenuItem("<", 1080, 380, 20, "computer4<");
    new MenuItem(">", 1175, 380, 20, "computer4>");
    new MenuItem("BACK", 600, 550, 20);
}

function initializeMultiplayerItems() {
    menuItems = [];
    new MenuItem("<", 180 ,450, 30);
    new MenuItem(">", 340, 450, 30);
    new MenuItem("FIND MATCH", 600, 325, 25);
    new MenuItem("BACK", 600, 550, 20);
    new MenuItem(playerName, 260, 120, 20, "playername");
}

function initializeSettingsItems() {
    menuItems = [];
    new MenuItem("+", 700, 200, 20, "music+");
    new MenuItem("-", 600, 203, 30, "music-");
    new MenuItem("+", 700, 250, 20, "sfx+");
    new MenuItem("-", 600, 253, 30, "sfx-");
    new MenuItem("BACK", 600, 550, 20);
}

function initializeCreditsItems() {
    menuItems = [];
    menuItemBack = new MenuItem("BACK", 600, 550, 20);
}

function StartScreenPrompt() {
    this.alpha = 1;
    this.decreasing = true;
}

StartScreenPrompt.prototype.draw = function() {
    ctx.save();
    if (!transition) {
        ctx.globalAlpha = this.alpha;
    }
    ctx.font = "20px monospace";
    ctx.fillStyle = "WHITE";
    ctx.textAlign = "center";
    ctx.fillText("CLICK ANYWHERE TO START", canvas.width/2, canvas.height/2 + 150);
    if (this.decreasing && this.alpha > 0.2) {
        this.alpha -= 0.03;
        if (this.alpha <= 0.2) {
            this.decreasing = false;
        }
    } else if (!this.decreasing && this.alpha < 0.95) {
        this.alpha += 0.03;
        if (this.alpha >= 0.95) {
            this.decreasing = true;
        }
    }
    ctx.restore();
}

function MenuItem(text, x, y, size) {
    this.x = x;
    this.y = y;
    this.hover = false;
    this.size = size;
    ctx.font = "" + this.size + "px monospace";
    this.text = text;
    this.h = size;
    this.w = ctx.measureText(this.text).width;
    menuItems.push(this);
}

function MenuItem(text, x, y, size, tag) {
    this.x = x;
    this.y = y;
    this.tag = tag;
    this.hover = false;
    this.size = size;
    ctx.font = "" + this.size + "px monospace";
    this.text = text;
    this.h = size;
    this.w = ctx.measureText(this.text).width;
    this.decreasing = true;
    this.alpha = 1;
    menuItems.push(this);
}

MenuItem.prototype.draw = function() {
    if (this.tag == "playername" && editingName) {
        ctx.save();
        if (!transition) {
            ctx.globalAlpha = this.alpha;
        }
        ctx.font = "" + this.size + "px monospace";
        ctx.fillStyle = "WHITE";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.x, this.y);
        if (this.decreasing && this.alpha > 0.2) {
            this.alpha -= 0.03;
            if (this.alpha <= 0.2) {
                this.decreasing = false;
            }
        } else if (!this.decreasing && this.alpha < 0.95) {
            this.alpha += 0.03;
            if (this.alpha >= 0.95) {
                this.decreasing = true;
            }
        }
        ctx.restore();
    } else {
        ctx.save();
        if (this.hover) {
            ctx.font = "" + this.size * 1.25 + "px monospace";
            this.h = this.size * 1.25;
            this.w = ctx.measureText(this.text).width;
        } else {
            ctx.font = "" + this.size + "px monospace";
        }
        ctx.fillStyle = "WHITE";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// --------------------- STATUS BARS ----------------------------
function StatusBars() {
    this.health = 100;
    this.stamina = 100;
}

StatusBars.prototype.update = function(healthMod, staminaMod) {
    var newHealth = this.health + healthMod;
    var newStamina = this.stamina + staminaMod;
    if (newHealth > 100) {
        this.health = 100;
    } else if (newHealth < 0) {
        this.health = 0;
    } else {
        this.health += healthMod;
    }
    if (newStamina > 100) {
        this.stamina = 100;
    } else if (newStamina < 0) {
        this.stamina = 0;
    } else {
        this.stamina += staminaMod;
    }
};

StatusBars.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.rect(10, 10, 300, 20);
    ctx.rect(10, 35, 300, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(11, 11, this.health * 3 - 2, 18);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.rect(11, 36, this.stamina * 3 - 2, 10);
    ctx.fill();
    statusBars.update(0, 0.5);
}

// --------------------- SPARKS ----------------------------
function createSparks(x, y) {
    statusBars.update(0, -40);
    var particleCount = Math.random() * (3) + 2;
    for (var i = 0; i < particleCount; i++) {
        var spark = new Particle(x, y);
        spark.move(Math.random() * 5 - 2.5, Math.random() * -5);
        sparks.push(spark);
    }
    flash.push(new RadialGradient(x, y, Math.random() * 20 + 40));
}

function drawSparks() {
    while (sparks.length > 0 && sparks[0].lifespan <= 0.1) {
        sparks.shift();
    }
    for (var i = 0; i < sparks.length; i++) {
        sparks[i].move(0, GRAVITY);
        sparks[i].integrate();
        sparks[i].bounce();
        sparks[i].draw();
        sparks[i].lifespan--;
    }
    while (flash.length > 0 && flash[0].alpha < 0.1) {
        flash.shift();
    }
    for (var i = 0; i < flash.length; i++) {
        flash[i].draw();
    }
}

var DAMPING = 0.9999;
var GRAVITY = 0.3;

function Particle(x, y) {
    this.lifespan = 100;
    this.x = this.oldX = x;
    this.y = this.oldY = y;
}

Particle.prototype.integrate = function() {
    var velocity = this.getVelocity();
    this.oldX = this.x;
    this.oldY = this.y;
    this.x += velocity.x * DAMPING;
    this.y += velocity.y * DAMPING;
};

Particle.prototype.getVelocity = function() {
    return {
        x: this.x - this.oldX,
        y: this.y - this.oldY
    };
};

Particle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
};

Particle.prototype.bounce = function() {
    if (this.y > canvas.height) {
        var velocity = this.getVelocity();
        this.oldY = canvas.height;
        this.y = this.oldY - velocity.y * 0.3;
    }
};

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
};

function RadialGradient(x, y, radius) {
    this.lifespan = 20;
    this.alpha = 1;
    this.radius = radius;
    this.x = x;
    this.y = y;
}

RadialGradient.prototype.draw = function() {
    this.alpha = this.alpha - 0.1;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    var grd = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius);
    grd.addColorStop(0, 'white');
    grd.addColorStop(1, 'black');
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
}

// --------------------- STARS ----------------------------
function Star(x, y, length, opacity) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.opacity = opacity;
    this.radius = Math.random() * 1.5;
    this.factor = 1;
    this.increment = Math.random() * .05;
}

Star.prototype.draw = function() {
    ctx.save();
    if(this.opacity > 1) {
        this.factor = -1;
    }
    else if(this.opacity <= 0) {
        this.factor = 1;

        this.x = Math.round(Math.random() * canvas.width);
        this.y = Math.round(Math.random() * canvas.height);
    }
    this.opacity += this.increment * this.factor;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 230, " + this.opacity + ")";
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff ';
    ctx.fill();
    ctx.restore();
}

function createStars() {
    for(var i = 0; i < numStars; i++) {
        var x = Math.round(Math.random() * canvas.width);
        var y = Math.round(Math.random() * canvas.height);
        var length = 0.5 + Math.random() * 2;
        var opacity = Math.random();
        var star = new Star(x, y, length, opacity);
        stars.push(star);
    }
}

function drawStars() {
    for (var i = 0; i < stars.length; i++) {
        stars[i].draw();
    }
}

// --------------------- ENTITIES ----------------------------
// function Platform(x, y, width, height, spritesheet, spritesheetX, spritesheetY, spritesheetWidth, spritesheetHeight, collisionX, collisionY, collisionWidth, collisionHeight) {
function Platform(x, y, type, collisionWidth, collisionHeight) {
    this.tag = "Platform";
    this.x = x;
    this.y = y;
    this.type = type;
    // this.width = width;
    // this.height = height;
    this.mapAsset = AM.getAsset('./img/mapAssets1.png');

    // Animation object: spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.longPlatFrame = new Animation(this.mapAsset, 0, 700, 514, 30, 1, 1, true, false);
    this.shortPlatFrame = new Animation(this.mapAsset, 0, 700, 130, 30, 1, 1, true, false);
    this.darkWallFrame = new Animation(this.mapAsset, 0, 512, 382, 192, 1, 1, true, false);
    this.electronicsFrame = new Animation(this.mapAsset, 64, 126, 64, 64, 1, 1, true, false);
    this.smallCrateFrame = new Animation(this.mapAsset, 160, 125, 64, 64, 1, 1, true, false);
    this.bigCrateFrame = new Animation(this.mapAsset, 576, 254, 96, 96, 1, 1, true, false);
    
    // this.spritesheet = spritesheet;
    // this.spritesheetX = spritesheetX;
    // this.spritesheetY = spritesheetY;
    // this.spritesheetWidth = spritesheetWidth;
    // this.spritesheetHeight = spritesheetHeight;

    this.collisionX = this.x - 60;

    switch (this.type) {
        case 'longPlat':
            this.collisionY = this.y - 67;
            break;
        case 'shortPlat':
            this.collisionY = this.y - 67;
            break;
        case 'darkWall':
            this.collisionY = this.y - 67;
            break;
        case 'electronics':
            this.collisionY = this.y - 67;
            break;
        case 'smallCrate':
            this.collisionY = this.y - 67;
            break;
        case 'bigCrate':
            this.collisionY = this.y - 67;
            break;
        default:
            break;
    }
    
    this.collisionWidth = collisionWidth + 25;
    this.collisionHeight = collisionHeight;
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {

}

Platform.prototype.draw = function() {
    // ctx.drawImage(this.spritesheet,
    //     this.spritesheetX, this.spritesheetY,  // source from sheet
    //     this.spritesheetWidth, this.spritesheetHeight, // width and height of source
    //     this.x, this.y, // destination coordinates
    //     this.width, this.height); // destination width and height
    switch (this.type) {
        case 'longPlat':
            this.longPlatFrame.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
            break;
        case 'shortPlat':
            this.shortPlatFrame.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
            break;
        case 'darkWall':
            this.darkWallFrame.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
            break;
        case 'electronics':
            this.electronicsFrame.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
            break;
        case 'smallCrate':
            this.smallCrateFrame.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
            break;
        case 'bigCrate':
            this.bigCrateFrame.drawFrame(gameEngine.clockTick, ctx, this.x, this.y, 1);
            break;
        default:
            break;
    }
}