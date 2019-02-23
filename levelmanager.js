function gameEnds() {
    ctx.save();
    ctx.font = "20px monospace";
    ctx.fillStyle = "WHITE";
    ctx.textAlign = "center";
    for (var i = 0; i < gameEngine.entities[i]; i++) {
        if (gameEngine.entities[i].tag === 'player' && gameEngine.entities[i].dead === true) {
            ctx.fillText("You Failed. Refresh Page to Start a New Match", canvas.width/2, canvas.height/2 + 150);        
        } 
        // else if (gameEngine.entities[i].tag === 'enemy' )
    }
    ctx.restore();
}

function nextLevel () {
    // clear map
    for (var i = 0; i < gameEngine.entities.length; i++) {
        gameEngine.entities[i].pop();
    }
    // redraw map
}

function Level (map, entities) {
    this.map = map;
    this.entities = [];
}