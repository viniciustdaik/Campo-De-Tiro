var score = 0;
var gun, backBoard;//, bluebubble, redbubble, bullet;

var gunImg, blueBubbleImg, redBubbleImg, bulletImg, blastImg, backBoardImg;

var blueBubbleGroup, redBubbleGroup, bulletGroup;

var scoreboard, heading, highscoreboard;

var life = 3;
var score = 0;
var highscore = 0;
var gameState = 1

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

var initialWidth, newWidth, newWidthAdded;

var buttonActivePc = false, shootbutton, shootbuttonhitbox;

function preload() {
  gunImg = loadImage("gun1.png");
  blastImg = loadImage("blast.png");
  bulletImg = loadImage("bullet1.png");
  blueBubbleImg = loadImage("waterBubble.png");
  redBubbleImg = loadImage("redbubble.png");
  backBoardImg = loadImage("back.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);//800, 800

  initialWidth = width;

  shootbutton = createButton("");
  if (isMobile) {
    shootbutton.position(width / 2 - 35, height - 75);
  } else {
    shootbutton.position(width - width - width - 1000, -500);
  }
  shootbutton.class("shootbutton");
  shootbutton.mousePressed(shootBullet);

  shootbuttonhitbox = createSprite(width / 2, height - 40);//width/2, windowHeight-45
  shootbuttonhitbox.scale = 0.7;
  shootbuttonhitbox.visible = false;

  backBoard = createSprite(50, height / 2, 100, height);//50, width / 2, 100, height
  backBoard.addImage(backBoardImg);

  gun = createSprite(100, height / 2, 50, 50);
  gun.addImage(gunImg);
  gun.scale = 0.2;

  bulletGroup = createGroup();
  blueBubbleGroup = createGroup();
  redBubbleGroup = createGroup();

  heading = createElement("h1");
  scoreboard = createElement("h1");
  highscoreboard = createElement("h1");
}

function draw() {
  background("#BDA297");//marrom claro

  heading.html("Vidas: " + life);
  heading.style('color:red');
  heading.position(150, 10);

  scoreboard.html("Pontos: " + score);//"Pontuação: " + score
  scoreboard.style('color:gold');
  //scoreboard.position(width - 200, 10);
  if (!isMobile) {
    scoreboard.position(heading.x + 150, 10);
  } else {
    scoreboard.position(heading.x + 120, 10);
  }

  highscoreboard.html("Maior Pontuação: " + highscore);//"Maior Pontuação: " + highscore
  highscoreboard.style('color:gold');
  //highscoreboard.position(heading.x + 150, 10);
  if (!isMobile) {
    highscoreboard.position(width - 320, 10);
  } else {
    highscoreboard.position(heading.x, 40);
  }

  if (!isMobile) {
    scoreboard.style('font-size:32px');
    heading.style('font-size:32px');
    highscoreboard.style('font-size:32px');
  } else {
    scoreboard.style('font-size:24px');
    heading.style('font-size:24px');
    highscoreboard.style('font-size:24px');
  }

  if (!isMobile && buttonActivePc === true && shootbutton.x !== width / 2 - 35) {
    shootbutton.position(width / 2 - 35, height - 75);
  } else if (!isMobile && buttonActivePc === false && shootbutton.x !== width - width - width - 1000) {
    shootbutton.position(width - width - width - 1000, -500);
  }

  if (gameState === 1) {
    if (!mouseIsOver(shootbuttonhitbox) || !isMobile && buttonActivePc == false) {
      gun.y = mouseY;
    }
    if (gun.y < 55) {
      gun.y = 55;
    }
    if (gun.y > height - 56) {
      gun.y = height - 56;
    }

    if (frameCount % 80 === 0) {
      drawblueBubble();
    }

    if (frameCount % 100 === 0) {
      drawredBubble();
    }

    if (keyWentDown("space")) {
      shootBullet();
    }

    if (blueBubbleGroup.collide(backBoard)) {
      handleGameover(blueBubbleGroup, "bluebubble");
    }

    if (redBubbleGroup.collide(backBoard)) {
      handleGameover(redBubbleGroup, "redbubble");
    }





    if (blueBubbleGroup.isTouching(bulletGroup)) {
      for (var bullet of bulletGroup) {
        handleBubbleCollision(blueBubbleGroup, "bluebubble", bullet);
      }
    }






    if (redBubbleGroup.isTouching(bulletGroup)) {
      for (var bullet of bulletGroup) {
        handleBubbleCollision(redBubbleGroup, "redbubble", bullet);
      }
    }

    if (life <= 0) {//life === 0
      handleGameover
    }

    drawSprites();
  }


}

function drawblueBubble() {
  var bluebubble = createSprite(width, random(30, height - 70), 40, 40);//800, random(20, 780), 40, 40
  bluebubble.addImage(blueBubbleImg);
  bluebubble.scale = 0.1;
  bluebubble.velocityX = -8;
  bluebubble.lifetime = 400;
  blueBubbleGroup.add(bluebubble);
}
function drawredBubble() {
  var redbubble = createSprite(width, random(30, height - 70), 40, 40);//800, random(20, 780), 40, 40
  redbubble.addImage(redBubbleImg);
  redbubble.scale = 0.1;
  redbubble.velocityX = -8;
  redbubble.lifetime = 400;
  redBubbleGroup.add(redbubble);
}

function shootBullet() {
  touches = [];
  var bullet = createSprite(150, width / 2, 50, 20);
  bullet.y = gun.y - 20;
  bullet.addImage(bulletImg);
  bullet.scale = 0.12;
  bullet.depth = gun.depth - 1;
  bullet.velocityX = 7;
  bullet.lifetime = 450;
  bulletGroup.add(bullet);
}

function createExplosion(location) {
  var blast = createSprite(location.x + 60, location.y, -100, 50, 50);
  blast.addImage(blastImg);
  blast.scale = 0.3;
  blast.life = 20;
}

function handleBubbleCollision(bubbleGroup, bubble, bullet) {
  for (var bubble of bubbleGroup) {
    //for(var bullet of bulletGroup){
    if (bubble.isTouching(bullet)) {
      if (life > 0) {
        score = score + 1;
      }
      createExplosion(bubble);
      bullet.destroy();
      bubble.destroy();
      //bubble.addImage(blastImg);
      //bubble.scale = 0.3;
      //bubble.velocityX = 0;
      //bubbleGroup.remove(bubble);
      //setTimeout(() => {

      //}, 1500);
    }
    //}
  }




  //blast = createSprite(bullet.x + 60, bullet.y, 50, 50);
  //blast.addImage(blastImg);
  //blast.scale = 0.3;
  //blast.life = 20;









  //bulletGroup.destroyEach();
  //bubbleGroup.destroyEach();
}

function reset() {
  life = 3;
  gameState = 1;
  if (score > highscore) {
    highscore = score;
  }
  score = 0;
}

function handleGameover(bubbleGroup, bubble) {

  life = life - 1;
  for (var bubble of bubbleGroup) {
    //if(bubble.isTouching(backBoard)){
    bubble.destroy();
    //}

  }
  //bubbleGroup.destroyEach();


  if (life === 0) {
    gameState = 2
    redBubbleGroup.destroyEach();
    blueBubbleGroup.destroyEach();

    swal({
      title: `Fim De Jogo.`,
      text: "Oops Você Perdeu O Jogo!",
      text: "Sua Pontuação É: " + score,
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado Por Jogar! Clique Para Jogar Novamente."
    },
      function (isConfirm) {
        if (isConfirm) {
          reset();
        }
      }
    );
  }

}

function windowResized() {
  if (!isMobile && windowWidth > width) {
    resizeCanvas(windowWidth, height);
    newWidth = width;

    if (initialWidth !== width) {
      newWidthAdded = width - initialWidth;

      backBoard.x = 50 - newWidthAdded / 2;
      gun.x = 100 - newWidthAdded / 2;
    }
  }
}

