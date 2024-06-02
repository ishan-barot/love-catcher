//Global Variables
screenWidth = window.innerWidth - 20;
screenHeight = window.innerHeight - 20;

intervalBetween = 100;
maxGravity = 2;

//Components
var adrii;
var love;
var ohNo;

var scoreMsg;
var score;
var scoreLock;

var gOver = false;
var menu = true;

function mainMenu() {
    gameTitleMsg = new message("30px", "Consolas", "black", screenWidth / 6, screenHeight / 3, "Welcome to Love Catcher Isabel! Happy Birthday 😚❤️!");
    placeholderPlayer = new player();
    placeholderPlayer.width = 80;
    placeholderPlayer.height = 80;
    placeholderPlayer.speedX = 1;
    placeholderPlayer.x = screenWidth / 3;
    placeholderPlayer.y = screenHeight / 2;

    gameScreen.start();
}

function startGame() {
    gOver = false;
    menu = false;
    intervalBetween = 100;
    maxGravity = 2;
    adrii;
    love = [];
    ohNo = [];
    scoreMsg;
    score = 0;
    scoreLock = false;

    adrii = new player();
    scoreMsg = new message("30px", "Consolas", "black", 10, 40);

    gameScreen.start();
}

var gameScreen = {
    canvas: document.createElement("canvas"),
    start: function() {
        document.getElementById('goBoard').style.display = "none";
        this.canvas.width = screenWidth;
        this.canvas.height = screenHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);
        window.addEventListener('click', function(e) {
            if (menu || gOver) {
                startGame();
            }
        });
        window.addEventListener('keydown', function(e) {
            if (!gOver && !menu) {
                if (e.key === 'ArrowLeft') {
                    adrii.speedX = -adrii.speed;
                }
                if (e.key === 'ArrowRight') {
                    adrii.speedX = adrii.speed;
                }
            }
        });
        window.addEventListener('keyup', function(e) {
            if (!gOver && !menu) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    adrii.speedX = 0;
                }
            }
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    gameOver: function() {
        document.getElementById('goBoard').style.display = "block";
        clearInterval(this.interval);
        gOver = true;
    }
};

function player() {
    this.width = 50;
    this.height = 50;
    this.x = (screenWidth / 2) - (this.width / 2);
    this.y = screenHeight - (this.height * 1.3);
    this.speedX = 0;
    this.speed = 5;
    this.idle = 1;
    this.run = 1;
    this.facingRight = true;
    this.image = new Image();
    this.image.src = "sprites/adrii/Idle (1).png";
    this.update = function() {
        if (this.speedX == 0) {
            this.run = 1;
            if ((gameScreen.frameNo / 5) % 1 == 0) {
                if (this.facingRight) {
                    this.image.src = "sprites/adrii/Idle (" + this.idle + ").png";
                } else {
                    this.image.src = "sprites/adrii/Eldi (" + this.idle + ").png";
                }
                this.idle = this.idle + 1;
                if (this.idle > 16) {
                    this.idle = 1;
                }
            }
        } else {
            this.idle = 1;
            if ((gameScreen.frameNo / 3) % 1 == 0) {
                if (this.speedX < 0) {
                    this.image.src = "sprites/adrii/Nur (" + this.run + ").png";
                    this.facingRight = false;
                } else {
                    this.image.src = "sprites/adrii/Run (" + this.run + ").png";
                    this.facingRight = true;
                }
                this.run = this.run + 1;
                if (this.run > 20) {
                    this.run = 1;
                }
            }
        }

        ctx = gameScreen.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        if (this.x < 5) {
            this.x = 5;
        }
        if (this.x > (screenWidth - this.width) - 5) {
            this.x = screenWidth - this.width - 5;
        }
    },
    this.move = function() {
        this.x += this.speedX;
    },
    this.collision = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);

        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);

        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    },
    this.lose = function() {
        gameScreen.gameOver();
    }
}

function heart(x, y, gravity) {
    this.width = 30;
    this.height = 30;
    this.x = x;
    this.y = y;
    this.gravity = gravity;
    this.exists = true;
    this.image = new Image();
    this.image.src = "sprites/heart.png";

    this.update = function() {
        if (this.exists) {
            ctx = gameScreen.context;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    },
    this.fall = function() {
        this.y = this.y += this.gravity;
    }
    this.destroy = function() {
        this.exists = false;
        this.x = 0;
        this.y = 0;
        this.gravity = 0;
    }
}

function bomb(x, y, gravity) {
    this.width = 30;
    this.height = 30;
    this.x = x;
    this.y = y;
    this.gravity = gravity;
    this.image = new Image();
    this.image.src = "sprites/bomb.png";

    this.update = function() {
        ctx = gameScreen.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    },
    this.fall = function() {
        this.y = this.y += this.gravity;
    }
}

function message(size, fnt, color, x, y, text = "") {
    this.size = size;
    this.fnt = fnt;
    this.text = text;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = gameScreen.context;
        ctx.font = this.size + " " + this.fnt;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
}

// Load and play the background music
function playBackgroundMusic() {
    var backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.play();
}

// Call playBackgroundMusic when the game starts
function startGame() {
    playBackgroundMusic();

    gOver = false;
    menu = false;
    intervalBetween = 100;
    maxGravity = 2;
    adrii;
    love = [];
    ohNo = [];
    scoreMsg;
    score = 0;
    scoreLock = false;

    adrii = new player();
    scoreMsg = new message("30px", "Consolas", "black", 10, 40);

    gameScreen.start();
}


function updateGameArea() {
    if (menu) {
        gameScreen.clear();
        gameTitleMsg.update();
        placeholderPlayer.update();
    } else {
        if (!gOver) {
            console.log("Interval: " + intervalBetween + "\nMxGravity: " + maxGravity);
            for (i = 0; i < love.length; i += 1) {
                if (adrii.collision(love[i])) {
                    score++;
                    scoreLock = false;
                    love[i].destroy();
                }
            }
            for (i = 0; i < ohNo.length; i += 1) {
                if (adrii.collision(ohNo[i])) {
                    adrii.lose();
                }
            }

            gameScreen.clear();
            gameScreen.frameNo += 1;

            if (score % 10 == 0 && score > 0) {
                if (!scoreLock) {
                    intervalBetween = intervalBetween - 15;
                    maxGravity = maxGravity + 2;
                    if (score % 20 == 0) {
                        maxGravity = maxGravity - 4;
                    }
                    if (intervalBetween < 1) {
                        intervalBetween = 1;
                    }
                }
                scoreLock = true;
            }

            if (gameScreen.frameNo == 1 || everyinterval(intervalBetween)) {
                if (randomNumber(0, 1) == 0 || gameScreen.frameNo == 1) {
                    love.push(new heart(randomNumber(5, (screenWidth - 25)), -20, randomNumber(1, maxGravity)));
                } else {
                    ohNo.push(new bomb(randomNumber(5, (screenWidth - 25)), -20, randomNumber(1, maxGravity)));
                }
            }
            for (i = 0; i < love.length; i += 1) {
                love[i].update();
                love[i].fall();
            }
            for (i = 0; i < ohNo.length; i += 1) {
                ohNo[i].update();
                ohNo[i].fall();
            }

            scoreMsg.text = "I owe you this many kisses: " + score;
            scoreMsg.update();

            adrii.update();
            adrii.move();
        }
    }
}

function moveLeft() {
    if (!gOver && !menu) {
        adrii.speedX -= adrii.speed;
    }
}

function moveRight() {
    if (!gOver && !menu) {
        adrii.speedX += adrii.speed;
    }
}

function stopMove() {
    if (!gOver && !menu) {
        adrii.speedX = 0;
    }
}

function everyinterval(n) {
    if ((gameScreen.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
