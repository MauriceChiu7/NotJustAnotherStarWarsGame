const OBI_FWIDTH = 100;
const OBI_FHEIGHT = 110;
const OBI_MAGICNUM = 0; // Not being used anymore.
const OBI_GROUND = 0;
const OBI_SCALE = 1;
const OBI_HITBOX_X_OFFSET = 34;
const OBI_HITBOX_Y_OFFSET = 45;
const OBI_COLLISION_WIDTH = 36;
const OBI_COLLISION_HEIGHT = 66;

function Obi() {
    this.obiwan_sprites_right = AM.getAsset("./img/obiwan_right.png");
    this.obiwan_sprites_left = AM.getAsset("./img/obiwan_left.png");
    this.x = 10;
    this.y = 400;

    // Animation object: obiwan_sprites_right, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    // W: 100 H: 110

    /** Right Animations */
    this.attack1RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*25, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 9, false, false); // Anim #25
    this.attack2RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*26, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 10, false, false); // Anim #26
    this.sprintRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*7, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, false, false); // Anim #7
    this.sprintBackwardsRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*7, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, false, true); // Anim #7
    this.idleRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*0, OBI_FWIDTH, OBI_FHEIGHT, 0.2, 5, true, false); // Anim #0
    this.jumpRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*10, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 20, false, true); // Anim #10
    this.jumpRightReverseAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*10, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 20, false, false); // Anim #10

    this.block1RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*11, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 7, false, false); // Anim #11
    this.stopBlock1RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*12, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 3, false, false); // Anim #12
    this.block2RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*13, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 4, false, false); // Anim #13
    this.stopBlock2RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*14, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #14
    this.block3RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*15, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 3, false, false); // Anim #15
    this.stopBlock3RightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*16, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #16

    this.startWalkRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*1, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #1
    this.startWalkBackwardsRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*1, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, true); // Anim #1
    this.walkRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*2, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, false, false); // Anim #2
    this.walkBackwardsRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*2, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, false, true); // Anim #2
    this.stopWalkRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*3, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #3
    this.stopWalkBackwardsRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*3, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #3

    this.forcePushRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*47, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 11, false, false); // Anim #47
    this.hurtRightAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*46, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 3, false, false); // Anim #46

    /** Left Animations */
    this.attack1LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*11, OBI_FHEIGHT*25, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 9, false, true); // Anim #25
    this.attack2LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*10, OBI_FHEIGHT*26, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 10, false, true); // Anim #26
    this.sprintLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*8, OBI_FHEIGHT*7+OBI_MAGICNUM, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, true, true); // Anim #7
    this.sprintBackwardsLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*8, OBI_FHEIGHT*7+OBI_MAGICNUM, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, true, false); // Anim #7
    this.idleLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*15, OBI_FHEIGHT*0, OBI_FWIDTH, OBI_FHEIGHT, 0.15, 5, true, true); // Anim #0
    this.jumpLeftAnim = new Animation(this.obiwan_sprites_left, 0, OBI_FHEIGHT*10, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 20, false, true); // Anim #10
    this.jumpLeftReverseAnim = new Animation(this.obiwan_sprites_left, 0, OBI_FHEIGHT*10, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 20, false, false); // Anim #10

    this.block1LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*13, OBI_FHEIGHT*11, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 7, false, false); // Anim #11
    this.stopBlock1LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*17, OBI_FHEIGHT*12, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 3, false, false); // Anim #12
    this.block2LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*16, OBI_FHEIGHT*13, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 4, false, false); // Anim #13
    this.stopBlock2LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*18, OBI_FHEIGHT*14, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #14
    this.block3LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*17, OBI_FHEIGHT*15, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 3, false, false); // Anim #15
    this.stopBlock3LeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*18, OBI_FHEIGHT*16, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #16

    this.startWalkLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*18, OBI_FHEIGHT*1, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, true); // Anim #1
    this.startWalkBackwardsLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*18, OBI_FHEIGHT*1, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, true); // Anim #1
    this.walkLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*8, OBI_FHEIGHT*2, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, true, true); // Anim #2
    this.walkBackwardsLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*8, OBI_FHEIGHT*2, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 12, true, false); // Anim #2
    this.stopWalkLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*18, OBI_FHEIGHT*3, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #3
    this.stopWalkBackwardsLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*18, OBI_FHEIGHT*3, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 2, false, false); // Anim #3
    
    this.forcePushLeftAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*9, OBI_FHEIGHT*47, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 11, false, false); // Anim #47
    this.hurtLefttAnim = new Animation(this.obiwan_sprites_left, OBI_FWIDTH*17, OBI_FHEIGHT*46, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 3, false, false);

    // Non Directional
    this.victoryAnim = new Animation(this.obiwan_sprites_left, 0, OBI_FHEIGHT*56, OBI_FWIDTH, OBI_FHEIGHT, 0.1, 19, true, false); // Anim #56
    this.dyingAnim = new Animation(this.obiwan_sprites_right, 0, OBI_FHEIGHT*21, OBI_FWIDTH, OBI_FHEIGHT, 0.05, 14, false, false); // Anim #21
    this.deadAnim = new Animation(this.obiwan_sprites_right, OBI_FWIDTH*13, OBI_FHEIGHT*21, 1, 1, true, false); // Anim #13

    // this.attacking = false;
    // this.switchAttack = true;
    // this.blocking = false;
    // this.switchBlock = true;
    // this.jumping = false;
    // this.movingRight = false;
    // this.movingLeft = false;
    // this.isVictorious = false;
    // this.idle = false;

    this.state = 'standing';
}

Obi.prototype = new Entity();
Obi.prototype.constructor = Obi;

Obi.prototype.update = function() {
    
}

Obi.prototype.draw = function() {
    if (SHOWBOX) {
        ctx.strokeStyle = 'orange';
        ctx.strokeRect(this.x + OBI_HITBOX_X_OFFSET, this.y + OBI_HITBOX_Y_OFFSET, OBI_COLLISION_WIDTH, OBI_COLLISION_HEIGHT);
        ctx.fill();
    }
    switch(this.state){
        case 'standing':
            this.idleRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
            break;
        default:
            this.idleRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
            break;
    }

    // if (this.attacking && !this.jumping) {
    //     if (this.switchAttack) {
    //         this.attack1RightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    //     } else {
    //         this.attack2RightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    //     }
    // } else if (this.blocking && !this.jumping) {
    //     if (this.switchBlock) {
    //         this.block1RightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    //     } else {
    //         this.block2RightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    //     }
    // } else if (this.jumping) {
    //     this.jumpRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    // } else if (this.movingRight) {
    //     this.sprintRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    // } else if (this.movingLeft) {
    //     // this.sprintLeftAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    //     this.walkBackwardsRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    // } else if (this.walkRight) {
    //     this.walkRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    // } else if (this.isVictorious) {
    //     this.victoryAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    // } else if (this.idle) {
    //     this.idleRightAnim.drawFrame(gameEngine.clockTick, ctx, this.x, this.y+OBI_GROUND, OBI_SCALE);
    // }
}

