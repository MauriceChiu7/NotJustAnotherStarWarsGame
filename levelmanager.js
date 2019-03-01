var levelNum = 0;
var gameover = false;
var win = false;
// var currentMap;
var levelTrans = false;

// TODO: Check to see if the correct level is being run at the right time.
// TODO: Try removeFromGameWorld() and see if the bug goes away.

/**
 * LevelManager has to be added as one of the entities in gameEngine at all times because
 * we rely on the update method to keep track of the health status of all entities.
 */
function LevelManager() {
    this.tag = 'LM';
    // this.x = 0; // An x field has to be given because AI code loops through all of the entities and checks their positions.
    // this.y = 0; // Or maybe not cuz LM's tag is not player.
    var map1 = new Map(0);
    var map2 = new Map(1);
    this.levels = [map1, map2];
    // this.levels = [map1];
    this.startLevel(levelNum);
    // setInterval(()=>{console.log(this.levels[levelNum].enemies)}, 1500)
    // setInterval(()=>{console.log(gameEngine.entities)}, 1500)
}

LevelManager.prototype = new Entity();
LevelManager.prototype.constructor = LevelManager;

LevelManager.prototype.startLevel = function (levelNum) {
    console.log('startLevel starting level ' + levelNum);

    // setTimeout(()=>{
    //     console.log('2 second timeout');
    // }, 2000)

    console.log('Before Remove ' + gameEngine.entities);

    /**
     * Removing EVERY OLD entities except for the LevelManager
     */
    // this.levels[levelNum].players = [];
    // this.levels[levelNum].enemies = [];
    for (var i; i < gameEngine.entities.length; i++) {
        if (gameEngine.entities[i].tag != 'LM') {
            gameEngine.entities[i].removeFromWorld = true;
            gameEngine.entities.splice(i, 1);
        }
    }
    
    console.log('After Remove / Before Add ' + gameEngine.entities);
    
    // gameEngine.entities = gameEngine.entities.filter(entity => entity.tag === 'LM')

    /**
     * Adding EVERY NEW entities into gameEngine.entities
     */
    for (var i = 0; i < this.levels[levelNum].players.length; i++) {
        gameEngine.addEntity(this.levels[levelNum].players[i]);
    }
    for (var i = 0; i < this.levels[levelNum].enemies.length; i++) {
        gameEngine.addEntity(this.levels[levelNum].enemies[i]);
    }
    // for (var i = 0; i < this.levels[levelNum].platforms.length; i++) {
    //     gameEngine.addEntity(this.levels[levelNum].platforms[i]);
    // }
    console.log('After Add ' + gameEngine.entities);
    
    ctx.font = "25px monospace";
    ctx.fillStyle = "WHITE";
    ctx.fillText('Level' + levelNum + 1, canvas.width - 200, 100);
    // unpause();
}

LevelManager.prototype.update = function () {
    var player;
    if (gameEngine.entities.length > 0) {                       // Keep a reference of the player
        for (var i = 0; i < gameEngine.entities.length; i++) {
            if (gameEngine.entities[i].tag === 'player') {
                player = gameEngine.entities[i];
            }
        }
    }

    
    // Keep enemies with health greater than 0 (delete enemies with health less than or equal to 0)
    // Remove enemies from the enemies[]
    // for (var i = 0; i < gameEngine.entities.length; i++) {
    //     if (gameEngine.entities[i].health <= 0 && gameEngine.entities[i].tag === 'enemy') {
    //         gameEngine.entities[i].removeFromWorld = true;
    //         gameEngine.entities.splice(i, 1);
    //     }
    // }

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
                console.log('Leveled up');
                this.startLevel(levelNum);
            } else if (levelNum === this.levels.length && this.levels[levelNum].enemies.length === 0) { // Winning the last level
                gameover = true;
                win = true;
                console.log('Won the game');
                canvas.addEventListener('contextmenu', reload);
            } else if (player.health <= 0) { // Loosing the game
                gameover = true;
                canvas.addEventListener('contextmenu', reload);
            }
        }, 1000)
    }
}

LevelManager.prototype.draw = function () {
    // Requires empty draw method. Maybe not.
}

function Map(mapNumber) {
    this.enemies = [];
    // this.platforms = [];
    this.players = [];
    switch(mapNumber) {
        case 0: 
            this.makeLevel_1();
            console.log('map1 built');
            break;
        case 1: 
            this.makeLevel_2();
            console.log('map2 built');
            break;
    }
    // redraw map
}

// Map.prototype = new Entity();
Map.prototype.constructor = Map;

Map.prototype.addEnemy = function (enemy) {
    this.enemies.push(enemy);
}

// Map.prototype.addPlatform = function (platform) {
//     this.platforms.push(platform);
// }

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



// LevelManager.prototype.deleteEntity(type) = function () {
//     for (var i = 0; i < gameEngine.entities.length; i++) {
//         if (gameEngine.entities[i] instanceof type) {
//             gameEngine.entities.splice(i, 1);
//         }
//     }
// }