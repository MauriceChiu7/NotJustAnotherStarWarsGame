var levelNum = 0;
var gameover = false;
var win = false;
var levelTrans = false;

/**
 * LevelManager has to be added as one of the entities in gameEngine at all times because
 * we rely on the update method to keep track of the health status of all entities.
 *
 * function FullCollision(x, y, width, height)
 * function BottomOnlyCollision(x, y, width)
 */
function LevelManager() {
    this.tag = 'LM';

    // Setup maps' entities
    var map1 = new Map(0);
    var map2 = new Map(1);

    // Setup map 1 collisions
    fullCollisions = [];
    bottomOnlyCollisions = [];
    new FullCollision(-100, 480, 1030, 200);
    new FullCollision(1080, 480, 200, 200);
    new FullCollision(300, 219, 385, 250);
    new FullCollision(420, -100, 265, 200);
    new BottomOnlyCollision(53, 361, 213);
    new BottomOnlyCollision(-100, 241, 345);
    new BottomOnlyCollision(500, 219, 750);
    new BottomOnlyCollision(734, 344, 133);
    var map1FullColl = fullCollisions;
    var map1BottColl = bottomOnlyCollisions;

    // Setup map 2 collisions
    fullCollisions = [];
    bottomOnlyCollisions = [];
    new FullCollision(0, 554, 922, 45); // Ground floor left
    new FullCollision(1034, 554, 200, 45); // Ground floor right
    // new FullCollision(1195, 0, 5, 600); // Right side wall
    new FullCollision(-10, -10, 1220, 10); // Ceiling
    new BottomOnlyCollision(800, 62, 255); // Small top left
    new BottomOnlyCollision(1120, 62, 90); // Small top right
    new BottomOnlyCollision(1032, 142, 110); // Small middle
    new BottomOnlyCollision(0, 226, 1210); // Main divider
    new BottomOnlyCollision(315, 331, 291); // Upper hanging platform
    new BottomOnlyCollision(315, 423, 291); // Lower hanging platform
    new BottomOnlyCollision(0, 494, 250); // Throne platform
    var map2FullColl = fullCollisions;
    var map2BottColl = bottomOnlyCollisions;

    // Un-comment this section if you want to test with 2 levels
    this.levels = [map1, map2];
    this.currentMaps = [AM.getAsset("./img/background.png"), AM.getAsset("./img/background2.png")]
    this.fullCollisions = [map1FullColl, map2FullColl];
    this.bottomOnlyCollisions = [map1BottColl, map2BottColl];

    // Comment this out if you are using the code above
    // this.levels = [map2];
    // this.currentMaps = [AM.getAsset("./img/background2.png")]
    // this.fullCollisions = [map2FullColl];
    // this.bottomOnlyCollisions = [map2BottColl];

    this.startLevel(levelNum);
}

LevelManager.prototype = new Entity();
LevelManager.prototype.constructor = LevelManager;

LevelManager.prototype.startLevel = function (levelNum) {
    /**
     * Reset Status Bar
     */
    statusBars.health = 100;
    statusBars.stamina = 100;

    /**
     * Setting up map and map collisions
     */
    currentMap = this.currentMaps[levelNum];
    fullCollisions = this.fullCollisions[levelNum];
    bottomOnlyCollisions = this.bottomOnlyCollisions[levelNum];

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
            if (levelNum !== this.levels.length-1 && this.levels[levelNum].enemies.length === 0) { // Check to see if all enemies were defeated
                for (var i = 0; i < gameEngine.entities.length; i++) {
                    if (gameEngine.entities[i].tag === 'player') {
                        gameEngine.entities.splice(i, 1);
                    }
                }
                levelNum++;
                this.startLevel(levelNum);
            } else if (levelNum === this.levels.length-1 && this.levels[levelNum].enemies.length === 0) { // Winning the last level
                gameover = true;
                win = true;
                canvas.addEventListener('contextmenu', reload);
            }
        }, 1000)
    } else if (player.health <= 0) { // Loosing the game
        gameover = true;
        canvas.addEventListener('contextmenu', reload);
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
    this.addPlayer(new Luke());
    // this.addEnemy(new Dummy());
    let trooper1 = new Trooper(gameEngine);
    trooper1.x = 100;
    trooper1.y = 40;
    this.addEnemy(trooper1);
    let trooper2 = new Trooper(gameEngine);
    trooper2.x = 800;
    trooper2.y = 350;
    this.addEnemy(trooper2);
    let trooper3 = new Trooper(gameEngine);
    trooper3.x = 1600;
    trooper3.y = 70;
    trooper3.charger();
    this.addEnemy(trooper3);
    let trooper4 = new Trooper(gameEngine);
    trooper4.x = 1000;
    trooper4.y = 70;
    this.addEnemy(trooper4);
}

Map.prototype.makeLevel_2 = function () {
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
    let trooper4 = new Trooper(gameEngine);
    trooper4.x = 1000;
    trooper4.y = 70;
    trooper4.charger();
    this.addEnemy(trooper4);
    
    // this.addEnemy(new Dummy());
    // this.addEnemy(new Vader());
    let vader = new Vader()
    vader.x = 100;
    vader.y = 450;
    this.addEnemy(vader);
}

function reload () {
    location.reload(true);
}
