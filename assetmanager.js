function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.sounds = [];
    this.downloadQueue = [];
    this.soundQueue = [];
}

AssetManager.prototype.queueDownload = function (path) {
    console.log("Queueing " + path);
    this.downloadQueue.push(path);
}

AssetManager.prototype.queueSound = function (path) {
    console.log("Queueing " + path);
    this.soundQueue.push(path);
}

AssetManager.prototype.getSound = function (path) {
    return this.sounds[path];
}

AssetManager.prototype.isDone = function () {
    return this.downloadQueue.length === this.successCount + this.errorCount;
}

AssetManager.prototype.downloadAll = function (callback) {
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var img = new Image();
        var that = this;

        var path = this.downloadQueue[i];
        console.log(path);

        img.addEventListener("load", function () {
            console.log("Loaded " + this.src);
            that.successCount++;
            if(that.isDone()) callback();
        });

        img.addEventListener("error", function () {
            console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        img.src = path;
        this.cache[path] = img;
    }

    for (var i = 0; i < this.soundQueue.length; i++) {
        var sound = new Audio();
        var that  = this;
        var path = this.soundQueue[i];
        console.log(path);
        sound.src = path;
        this.sounds[path] = sound;
    }
}

AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
}