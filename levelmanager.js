var currentMap;

function LevelManager() {

}

LevelManager.prototype.makeLevel_1 = function () {
    gameEngine.addEntity(new Platform(0, 389, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(382, 389, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(764, 389, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(1146, 389, 'darkWall', 0, 0));

    gameEngine.addEntity(new Platform(0, 197, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(382, 197, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(764, 197, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(1146, 197, 'darkWall', 0, 0));

    gameEngine.addEntity(new Platform(0, 5, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(382, 5, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(764, 5, 'darkWall', 0, 0));
    gameEngine.addEntity(new Platform(1146, 5, 'darkWall', 0, 0));

    gameEngine.addEntity(new Platform(0, 570, 'longPlat', 514, 30));
    gameEngine.addEntity(new Platform(512, 570, 'longPlat', 514, 30));
    gameEngine.addEntity(new Platform(1024, 570, 'longPlat', 514, 30));

    gameEngine.addEntity(new Platform(120, 460, 'shortPlat', 130, 30));
    gameEngine.addEntity(new Platform(300, 320, 'shortPlat', 130, 30));
    gameEngine.addEntity(new Platform(550, 250, 'shortPlat', 130, 30));
    gameEngine.addEntity(new Platform(800, 320, 'shortPlat', 130, 30));
    gameEngine.addEntity(new Platform(950, 460, 'shortPlat', 130, 30));

    gameEngine.addEntity(new Platform(500, 510, 'smallCrate', 64, 64));
    gameEngine.addEntity(new Platform(1000, 478, 'bigCrate', 96, 96));
    gameEngine.addEntity(new Platform(600, 190, 'electronics', 0, 0));
}

// LevelManager.prototype.makeLevel_1 = function () {
//     fullCollisions = [];
//     bottomOnlyCollisions = [];
//     currentMap = AM.getAsset("./img/background.png");
//     new FullCollision(-100, 400, 980, 200);
//     new FullCollision(1030, 400, 200, 200);
//     new FullCollision(250, 140, 385, 250);
//     new BottomOnlyCollision(17, 280, 210);
//     new BottomOnlyCollision(-100, 160, 294);
//     new BottomOnlyCollision(-100, 160, 294);
// }

LevelManager.prototype.setEnemiesLevel_1 = function () {
    gameEngine.addEntity(new Trooper(gameEngine));
    let trooper2 = new Trooper(gameEngine);
    trooper2.x = 900;
    trooper2.y = 300 - 80;
    gameEngine.addEntity(trooper2);
    let trooper3 = new Trooper(gameEngine);
    trooper3.x += 125;
    trooper3.y += 70;
    gameEngine.addEntity(trooper3);
    // gameEngine.addEntity(new Dummy(gameEngine));
}