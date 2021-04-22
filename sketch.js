var player, playerRun, playerJump, playerShoot;
var ground1, ground2, groundImg, invisibleGround, invisibleGroundImg;
var bgIntro, bgImg, bg3;
var OBSTACLES, obstacle, obs, crate, cactus;
var ZOMBIE, zomb, zombie, zombie1, zombie2, zombie3, zombie4;
var bullet, bulletImg;
var FLYINGZOMBIE, flying_zombie, flying_zombieImg;
var playButton, playButtonImg, restartButton, restartButtonImg;
var gameState = "serve";
var kills = 0;
var playSound, firingSound, gameOverSound;
var topEdge;

function preload() {
  playerRun = loadAnimation("Run0.png", "Run1.png", "Run2.png", "Run3.png", "Run4.png", "Run5.png", "Run6.png", "Run7.png", "Run8.png", "Run9.png");
  playerJump = loadImage("Jump2.png");
  playerShoot = loadImage("Shoot.png");
  groundImg = loadImage("ground.png");
  bgIntro = loadImage("bgIntro.jpg");
  bgImg = loadImage("bg.png");
  bg3 = loadImage("bg3.jpg");
  cactus = loadImage("Cactus.png");
  crate = loadImage("Crate.png");
  zombie1 = loadImage("zombie1.png");
  zombie2 = loadImage("zombie2.png");
  zombie3 = loadImage("zombie3.png");
  zombie4 = loadImage("zombie4.png");
  flying_zombieImg = loadAnimation("flying_zombie1.png", "flying_zombie2.png");
  bulletImg = loadImage("bullet.png");
  playButtonImg = loadImage("playButton.png");
  restartButtonImg = loadImage("restartButton.png");
  playSound = loadSound("playSound.mp3");
  firingSound = loadSound("firingSound.mp3");
  gameOverSound = loadSound("gameOverSound.mp3");
}

function setup() {
  createCanvas(850, 600);
  topEdge = createSprite(300, 1, 600, 1);
  topEdge.visible = false;

  playButton = createSprite(425, 450);
  playButton.addImage(playButtonImg);
  playButton.scale = 0.7;
  playButton.setCollider("rectangle", 0, 0, 200, 120);

  restartButton = createSprite(425, 430);
  restartButton.addImage(restartButtonImg);
  restartButton.visible = false;
  restartButton.scale = 0.8;
  restartButton.setCollider("rectangle", 0, 0, 200, 120);

  ground1 = createSprite(600, 374);
  ground1.addImage(groundImg);
  ground1.scale = 0.7;

  ground2 = createSprite(1800, 374);
  ground2.addImage(groundImg);
  ground2.scale = 0.7;

  player = createSprite(150, 413);
  player.addAnimation("playerRun", playerRun);
  player.addImage("playerJump", playerJump);
  player.addImage("playerShoot", playerShoot);
  player.setCollider("rectangle", 0, 0, 200, 500);
  player.scale = 0.375;
  player.frameDelay = 3;

  invisibleGround = createSprite(450, 492, 1000, 10);
  invisibleGround.visible = false;

  OBSTACLES = new Group();
  ZOMBIE = new Group();
  FLYINGZOMBIE = new Group();

  playSound.loop();
}

function draw() {
  player.collide(topEdge);

  if (gameState == "serve") {
    background(bgIntro);

    fill("Blue");
    textSize(40);
    textFont("Algerian");
    text("Press SPACE to jump & ENTER to fire !", 55, 265);

    player.x = 150;
    player.y = 413;

    player.velocityX = 0;
    ground1.velocityX = 0;
    ground2.velocityX = 0;

    ground1.visible = false;
    ground2.visible = false;
    player.visible = false;
    playButton.visible = true;
    restartButton.visible = false;

    if (mousePressedOver(playButton))
      gameState = "play";
  }

  if (gameState == "play") {
    background(bgImg);

    fill("Red");
    textSize(65);
    text(kills, 100, 60);

    player.visible = true;
    playButton.visible = false;

    player.velocityX = 0;
    ground1.velocityX = -8.5;
    ground1.visible = true;
    ground2.velocityX = -8.5;
    ground2.visible = true;

    if (ground1.x < -700) {
      ground1.x = 1754;
    }
    if (ground2.x < -700) {
      ground2.x = 1754;
    }

    if (bullet) {
      if (ZOMBIE.isTouching(bullet)) {
        ZOMBIE.destroyEach();
        bullet.destroy();
        kills += 1;
      }
    }

    controls();
    obstacles();
    zombies();
    flyingZombie();

    if (bullet) {
      if (FLYINGZOMBIE.isTouching(bullet)) {
        FLYINGZOMBIE.destroyEach();
        bullet.destroy();
        kills += 1;
      }
    }

    player.velocityY++;

    if (player.x < -10 || ZOMBIE.collide(player) || FLYINGZOMBIE.collide(player)) {
      gameState = "over";
      gameOverSound.play();
    }
  }

  if (gameState == "over") {
    background(bg3);

    // strokeWeight(3);
    fill("Brown");
    textFont("Algerian");
    textSize(100);
    text(kills, 540, 320);

    ground1.visible = false;
    ground2.visible = false;
    player.visible = false;
    //bullet.destroy();
    ZOMBIE.destroyEach();
    OBSTACLES.destroyEach();
    FLYINGZOMBIE.destroyEach();

    ground1.velocityX = 0;
    ground2.velocityX = 0;

    restartButton.visible = true;
    if (mousePressedOver(restartButton) && gameState == "over") {
      gameState = "serve";
      kills = 0;
    }
  }

  drawSprites();
}

function controls() {
  if (player.collide(invisibleGround) | player.collide(OBSTACLES))
    player.changeAnimation("playerRun", playerRun);

  if (keyWentDown("space")) {
    player.velocityY = -18;
    player.changeImage("playerJump", playerJump);
  }

  if (keyWentDown("enter")) {
    bullet = createSprite(175, player.y + 6);
    bullet.addImage(bulletImg);
    firingSound.play();
    bullet.scale = 0.2;
    bullet.lifetime = 100;
    bullet.velocityX = 8.5;
    player.changeImage("playerShoot", playerShoot);
  }
}

function obstacles() {
  if (OBSTACLES.x < -30)
    OBSTACLES.destroyEach();

  if (World.frameCount % 157 == 0) {
    obstacle = createSprite(935, 440);
    obstacle.velocityX = -8.5;
    obs = Math.round(random(1, 2));
    switch (obs) {
      case 1:
        obstacle.addImage(cactus);
        obstacle.scale = 1.6;
        obstacle.y = 413;
        obstacle.setCollider("circle", 0, 0, 40);
        OBSTACLES.add(obstacle);
        break;

      case 2:
        obstacle.addImage(crate);
        obstacle.scale = 1.2;
        OBSTACLES.add(obstacle);
        break;
    }
  }
}

function zombies() {
  if (ZOMBIE.x < -30)
    ZOMBIE.destroyEach();

  if (World.frameCount % 200 == 0) {
    zombie = createSprite(935, 440);
    zombie.velocityX = -8.5;
    zomb = Math.round(random(1, 4));
    switch (zomb) {
      case 1:
        zombie.y = 390;
        zombie.addImage(zombie1);
        zombie.scale = 0.75;
        zombie.setCollider("rectangle", 0, 0, 150, 210);
        ZOMBIE.add(zombie);
        break;

      case 2:
        zombie.y = 398;
        zombie.addImage(zombie2);
        zombie.scale = 0.4;
        zombie.setCollider("rectangle", 0, 0, 240, 420);
        ZOMBIE.add(zombie);
        break;

      case 3:
        zombie.y = 398;
        zombie.addImage(zombie3);
        zombie.scale = 0.78;
        zombie.setCollider("rectangle", 0, 0, 130, 210);
        ZOMBIE.add(zombie);
        break;

      case 4:
        zombie.y = 398;
        zombie.addImage(zombie4);
        zombie.scale = 1;
        zombie.setCollider("rectangle", 0, 5, 180, 190);
        ZOMBIE.add(zombie);
        break;
    }
  }
}

function flyingZombie() {
  if (World.frameCount % 185 == 0) {
    flying_zombie = createSprite(940, 175);
    flying_zombie.velocityX = -13;
    flying_zombie.addAnimation("flying_zombie", flying_zombieImg);
    flying_zombie.setCollider("circle", 0, 0, 80);
    FLYINGZOMBIE.add(flying_zombie);
  }
}
