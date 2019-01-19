var AM = new AssetManager();
var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");

//AM.queueDownload("./img/background.jpg");
AM.downloadAll(function () {
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    console.log("All Done!");
});

canvas.addEventListener('click', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    createSparks(x, y);
		// var audio = new Audio('./sounds/LightsaberClash.wav');
		// audio.play();
}, false);

//ctx.globalCompositeOperation = 'overlay';
requestAnimationFrame(frame);

function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSparks();
    statusBars.draw();
}
