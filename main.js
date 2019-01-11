var AM = new AssetManager();

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/notthere.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var img = AM.getAsset("./img/mushroomdude.png");

    ctx.drawImage(img,
                  0, 0,  // source from sheet
                  189, 230, // width and height of source
                  200, 200, // destination coordinates
                  95, 115); // destination width and height

    console.log("All Done!");
});