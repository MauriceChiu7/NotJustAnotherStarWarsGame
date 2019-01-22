var AM = new AssetManager();
var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");

AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/StarWarsLogo.png");
AM.queueSound("./sounds/VaderVsLukeTheme.mp3");
AM.queueSound("./sounds/Swing2.WAV");
AM.queueSound("./sounds/MenuSelect.wav");
AM.downloadAll(function () {
    //var gameEngine = new GameEngine();
    //gameEngine.init(ctx);
    //gameEngine.start();
    //var audio = new Audio('./sounds/VaderVsLukeTheme.mp3');
    //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    //console.log("All Done!");

    startScreen();
});

function mainMenu() {
    var audio = AM.getSound("./sounds/VaderVsLukeTheme.mp3");
    audio.volume = 0.5;
    audio.play();
    canvas.addEventListener('click', mainMenuClick);
    requestAnimationFrame(mainMenuframe);
}

function mainMenuframe() {
    requestAnimationFrame(mainMenuframe);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSparks();
    statusBars.draw();
}

function mainMenuClick(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var audio = AM.getSound('./sounds/Swing2.WAV');
    audio.volume = 0.1;
    audio.play();
    createSparks(x, y);
}

function startScreen() {
    createStars();
    setInterval(startScreenFrame, 1000 / fps);
    canvas.addEventListener('click', startScreenClick);
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
}

function startScreenClick(event) {
    var audio = AM.getSound("./sounds/MenuSelect.wav");
    audio.play();
    mainMenu();
    clearInterval(startScreenFrame);
    canvas.removeEventListener('click', startScreenClick);
}