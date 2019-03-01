var levelNum = 0;
var gameover = false;
var win = false;
var levelTrans = false;

/**
 * LevelManager has to be added as one of the entities in gameEngine at all times because
 * we rely on the update method to keep track of the health status of all entities.
 */
function LevelManager() {
    this.tag = 'LM';
    var map1 = new Map(0);
    var map2 = new Map(1);
    this.levels = [map1, map2];
    this.startLevel(levelNum);
}

LevelManager.prototype = new Entity();
LevelManager.prototype.constructor = LevelManager;

LevelManager.prototype.startLevel = function (levelNum) {
    /**
     * Removing EVERY OLD entities except for the LevelManager
     */
    for (var i; i < gameEngine.entities.length; i++) {
        if (gameEngine.entities[i].tag != 'LM') {
            gameEngine.entities[i].removeFromWorld = true;
            gameEngine.entities.splice(i, 1);
        }
    }

    /**
     * Adding EVERY NEW entities into gameEngine.entities
     */
    for (var i = 0; i < this.levels[levelNum].players.length; i++) {
        gameEngine.addEntity(this.levels[levelNum].players[i]);
    }
    for (var i = 0; i < this.levels[levelNum].enemies.length; i++) {
        gameEngine.addEntity(this.levels[levelNum].enemies[i]);
    }
    
    ctx.font = "25px monospace";
    ctx.fillStyle = "WHITE";
    ctx.fillText('Level' + levelNum + 1, canvas.width - 200, 100);
}

LevelManager.prototype.update = function () {
    var player; // Keep a reference of the player
    if (gameEngine.entities.length > 0) {
        for (var i = 0; i < gameEngine.entities.length; i++) {
            if (gameEngine.entities[i].tag === 'player') {
                player = gameEngine.entities[i];
            }
        }
    }

    /**
     * Set removeFromWorld to true and Remove them from gameEngine for enemies with NO health
     */
    for (var i = 0; i < gameEngine.entities.length; i++) {
        if (gameEngine.entities[i].tag === 'enemy' && gameEngine.entities[i].health <= 0) {
            gameEngine.entities[i].removeFromWorld = true;
            gameEngine.entities.splice(i, 1);
        }
    }

    /**
     * Remove entities with NO health from MAP
     */
    this.levels[levelNum].enemies = this.levels[levelNum].enemies.filter(enemy => enemy.health > 0);

    /**
     * Checks if all enemies are dead
     */
    if (this.levels[levelNum].enemies.length === 0) {
        setTimeout(()=>{
            if (levelNum !== this.levels.length && this.levels[levelNum].enemies.length === 0) { // Check to see if all enemies were defeated
                for (var i = 0; i < gameEngine.entities.length; i++) {
                    if (gameEngine.entities[i].tag === 'player') {
                        gameEngine.entities.splice(i, 1);
                    }
                }
                levelNum++;
                this.startLevel(levelNum);
            } else if (levelNum === this.levels.length && this.levels[levelNum].enemies.length === 0) { // Winning the last level
                gameover = true;
                win = true;
                canvas.addEventListener('contextmenu', reload);
            } else if (player.health <= 0) { // Loosing the game
                gameover = true;
                canvas.addEventListener('contextmenu', reload);
            }
        }, 1000)
    }
}

LevelManager.prototype.draw = function () {
    // Requires empty draw method.
}

function Map(mapNumber) {
    this.enemies = [];
    this.players = [];
    switch(mapNumber) {
        case 0: 
            this.makeLevel_1();
            break;
        case 1: 
            this.makeLevel_2();
            break;
    }
}

Map.prototype.constructor = Map;

Map.prototype.addEnemy = function (enemy) {
    this.enemies.push(enemy);
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
    // this.addEnemy(new Dummy(gameEngine));

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
    new FullCollision(-55, 480, 980, 200);
    new FullCollision(1085, 480, 200, 200);
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
    trooper2.y = 220;
    this.addEnemy(trooper2);
    let trooper3 = new Trooper(gameEngine);
    trooper3.x = 1000;
    trooper3.y = 70;
    this.addEnemy(trooper3);
    this.addEnemy(new Dummy(gameEngine));
}

function reload () {
    location.reload(true);
}