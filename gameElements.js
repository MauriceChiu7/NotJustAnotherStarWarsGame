var statusBars = new StatusBars();
var sparks = [];
var flash = [];
var stars = [];
var fps = 30;
var numStars = 500;
var startScreenPrompt = new StartScreenPrompt();
var menuItems = [];
var menuItemStoryMode;
var menuItemsCustomGame;
var menuItemsMultiplayer;
var menuItemsSettings;
var menuItemsCredits;

function initializeMenuItems() {
    menuItemStoryMode = new MenuItem("STORY MODE", 600, 150, 25);
    menuItemsCustomGame = new MenuItem("CUSTOM GAME", 600, 250, 25);
    menuItemsMultiplayer = new MenuItem("MULTIPLAYER", 600, 350, 25);
    menuItemsSettings = new MenuItem("SETTINGS", 600, 435, 20);
    menuItemsCredits = new MenuItem("CREDITS", 600, 500, 20);
    menuItemBack = new MenuItem("BACK", 600, 550, 20);
    menuItemMusicPlus = new MenuItem("+", 700, 200, 20, "music");
    menuItemMusicMinus = new MenuItem("-", 600, 203, 30, "music");
    menuItemSFXPlus = new MenuItem("+", 700, 250, 20, "sfx");
    menuItemSFXMinus = new MenuItem("-", 600, 253, 30, "sfx");
}

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

function StartScreenPrompt() {
    this.alpha = 1;
    this.decreasing = true;
}

StartScreenPrompt.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
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
    menuItems.push(this);
}

MenuItem.prototype.draw = function() {
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
