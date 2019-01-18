var statusBars = new StatusBars();
var sparks = [];
var flash = [];

function createSparks(x, y) {
    statusBars.update(0, -40);
    var particleCount = Math.random() * (3) + 2;
    for (var i = 0; i < particleCount; i++) {
        var spark = new Particle(x, y);
        spark.move(Math.random() * 5 - 2.5, Math.random() * -5);
        sparks.push(spark);
    }
    flash.push(new radialGradient(x, y, Math.random() * 20 + 40));
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

function radialGradient(x, y, radius) {
    this.lifespan = 20;
    this.alpha = 1;
    this.radius = radius;
    this.x = x;
    this.y = y;
}

radialGradient.prototype.draw = function() {
    this.alpha = this.alpha - 0.1;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    var grd = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius);
    grd.addColorStop(0, 'white');
    grd.addColorStop(1, 'lightskyblue');
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
}