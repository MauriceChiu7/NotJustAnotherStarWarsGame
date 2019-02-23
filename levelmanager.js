var level = 1;
var gameover = false;
var win = false;
var currentMap;

function LevelManager() {
    this.tag = 'LM';
    this.x = 0;
    this.y = 0;
    var map1 = new Map(1);
    this.levels = [map1];
    this.startLevel(1);
}

LevelManager.prototype = new Entity();
LevelManager.prototype.constructor = LevelManager;

LevelManager.prototype.startLevel = function (levelNum) {
    if (gameEngine.entities.length != 0) {
        for (var i = 0; i < gameEngine.entities.length; i++) {
            gameEngine.entities.pop();
        }
    }
    
    for (var i = 0; i < this.levels[levelNum - 1].platforms.length; i++) {
        gameEngine.addEntity(this.levels[levelNum - 1].platforms[i]);
    }
    for (var i = 0; i < this.levels[levelNum - 1].players.length; i++) {
        gameEngine.addEntity(this.levels[levelNum - 1].players[i]);
    }
    for (var i = 0; i < this.levels[levelNum - 1].enemies.length; i++) {
        gameEngine.addEntity(this.levels[levelNum - 1].enemies[i]);
    }
    
    ctx.font = "25px monospace";
    ctx.fillStyle = "WHITE";
    ctx.fillText('Level' + level, canvas.width - 200, 100);
    setTimeout(()=>{
        ctx.clearRect(0, 0, 50, 100);
    }, 500);
}

LevelManager.prototype.update = function () {
    var player;
    if (gameEngine.entities.length != 0) {
        for (var i = 0; i < gameEngine.entities.length; i++) {
            if (gameEngine.entities[i].tag === 'player') {
                player = gameEngine.entities[i];
            }
        }
    }
    if (level !== this.levels.length && gameEngine.entities.length === 1 && gameEngine.entities[0].tag === 'player') {
        level++;
        console.log('Leveled up');
        this.startLevel(level);
    } else if (level === this.levels.length && gameEngine.entities.length === 1 && gameEngine.entities[0].tag === 'player') { // Winning the last level
        gameover = true;
        win = true;

        ctx.font = "25px monospace";
        ctx.fillStyle = "WHITE";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN", canvas.width/2, canvas.height/2);
        console.log('won the game');
        canvas.addEventListener('click', reload);
        // canvas.removeEventListener('click', reload);
    } else if (player.health <= 0) { // Loosing the game
        gameover = true;
        
        ctx.font = "25px monospace";
        ctx.fillStyle = "WHITE";
        ctx.textAlign = "center";
        ctx.fillText("YOU LOOSE", canvas.width/2, canvas.height/2);
        ctx.fillText("(CLICK ANY WHERE TO PLAY AGAIN)",  canvas.width/2, canvas.height/2 + 50)

        canvas.addEventListener('click', reload);
        // canvas.removeEventListener('click', reload);
    }
}

LevelManager.prototype.draw = function () {

}

function Map(mapNumber) {
    this.enemies = [];
    this.platforms = [];
    this.players = [];
    switch(mapNumber) {
        case 1: 
            this.makeLevel_1();
            console.log('map1 built');
            break;
        case 2: 
            this.makeLevel_2();
            console.log('map2 built');
            break;
    }
}

// Map.prototype = new Entity();
Map.prototype.constructor = Map;

Map.prototype.addEnemy = function (enemy) {
    this.enemies.push(enemy);
}

Map.prototype.addPlatform = function (platform) {
    this.platforms.push(platform);
}

Map.prototype.addPlayer = function (player) {
    this.players.push(player);
}

Map.prototype.makeLevel_1 = function () {
    fullCollisions = [];
    bottomOnlyCollisions = [];
    currentMap = AM.getAsset("./img/background.png");
    new FullCollision(-100, 480, 980, 200);
    new FullCollision(1030, 480, 200, 200);
    new FullCollision(300, 219, 385, 250);
    new FullCollision(420, -100, 265, 200);

    new BottomOnlyCollision(53, 361, 213);
    new BottomOnlyCollision(-100, 241, 345);
    new BottomOnlyCollision(500, 219, 750);
    new BottomOnlyCollision(734, 344, 133);

    this.addPlayer(new Luke());

    this.addEnemy(new Trooper(gameEngine));
    // let trooper2 = new Trooper(gameEngine);
    // trooper2.x = 900;
    // trooper2.y = 300 - 80;
    // this.addEnemy(trooper2);
    let trooper3 = new Trooper(gameEngine);
    trooper3.x = 1000;
    trooper3.y = 70;
    this.addEnemy(trooper3);
}

Map.prototype.makeLevel_2 = function () {
    fullCollisions = [];
    bottomOnlyCollisions = [];
    currentMap = AM.getAsset("./img/background.png");
    new FullCollision(-100, 480, 980, 200);
    new FullCollision(1030, 480, 200, 200);
    new FullCollision(300, 219, 385, 250);
    new FullCollision(420, -100, 265, 200);

    new BottomOnlyCollision(53, 361, 213);
    new BottomOnlyCollision(-100, 241, 345);
    new BottomOnlyCollision(500, 219, 750);
    new BottomOnlyCollision(734, 344, 133);

    this.addPlayer(new Luke());
    this.addEnemy(new Trooper(gameEngine));
    let trooper2 = new Trooper(gameEngine);
    trooper2.x = 700;
    trooper2.y = 300 - 80;
    this.addEnemy(trooper2);
    let trooper3 = new Trooper(gameEngine);
    trooper3.x = 1000;
    trooper3.y = 70;
    this.addEnemy(trooper3);
}



function reload () {
    location.reload(true);
}



// LevelManager.prototype.deleteEntity(type) = function () {
//     for (var i = 0; i < gameEngine.entities.length; i++) {
//         if (gameEngine.entities[i] instanceof type) {
//             gameEngine.entities.splice(i, 1);
//         }
//     }
// }

    // this.addPlatform(new Platform(0, 389, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(382, 389, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(764, 389, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(1146, 389, 'darkWall', 0, 0));

    // this.addPlatform(new Platform(0, 197, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(382, 197, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(764, 197, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(1146, 197, 'darkWall', 0, 0));

    // this.addPlatform(new Platform(0, 5, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(382, 5, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(764, 5, 'darkWall', 0, 0));
    // this.addPlatform(new Platform(1146, 5, 'darkWall', 0, 0));

    // this.addPlatform(new Platform(0, 570, 'longPlat', 514, 30));
    // this.addPlatform(new Platform(512, 570, 'longPlat', 514, 30));
    // this.addPlatform(new Platform(1024, 570, 'longPlat', 514, 30));

    // this.addPlatform(new Platform(120, 460, 'shortPlat', 130, 30));
    // this.addPlatform(new Platform(300, 320, 'shortPlat', 130, 30));
    // this.addPlatform(new Platform(550, 250, 'shortPlat', 130, 30));
    // this.addPlatform(new Platform(800, 320, 'shortPlat', 130, 30));
    // this.addPlatform(new Platform(950, 460, 'shortPlat', 130, 30));

    // this.addPlatform(new Platform(500, 510, 'smallCrate', 64, 64));
    // this.addPlatform(new Platform(1000, 478, 'bigCrate', 96, 96));
    // this.addPlatform(new Platform(600, 190, 'electronics', 0, 0));