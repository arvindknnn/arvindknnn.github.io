
var ammo = {
    gun: {
        name: 'gun',
        image: 'images/gun.png',
        x: 350,
        y: 420
    },
    star: {
        name: 'star',
        image: 'images/Star-small.png',
        x: 350,
        y: 420
    }
};

var Game = function () {
    this.sprite = 'images/play_again.png';
    this.x = 120;
    this.y = 280;
    this.gameOn = true;    
};

Game.prototype.gameOver = function(){
    var info = (player.status == "swimming") ? "Congrats! You completed the game!!" : ((player.status == "bugged") ? "Arrrgghhh...You got BUGGED! Try again..." : "");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    $("#status").text(info); 
};

Game.prototype.newGame = function(){
    $("#status").text(""); 
    init();
};



// Enemies our player must avoid
    
var Enemy = function(num) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    var bugerator = num > 3 ? (num % 2 === 0 ? 2 : num % 3 === 0 ? 3 : 1) : num;
    this.sprite = 'images/enemy-bug.png';
    // this.x = Math.floor(Math.random()*num)*200;
    this.x = 0;
    this.y =  (83 * bugerator) - 25;
    this.max_x = 505;
    this.bugId = num;
    this.bugRow = bugerator;
    this.dead = false;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x >= this.max_x) {
        this.x = 0;
    }
    else {
        this.x += Math.floor(Math.random()*50*this.bugId)*dt;

    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy.protoype.destroy = function () {
//     var x= "";
//     this = x;
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (){
    this.x = 200;
    this.y = 420;
    this.inBugRow = false;
    this.bugRow = 0;
    this.sprite = 'images/char-boy.png';
    this.ammo = "";
    this.status = "soaking sun";
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyPressed){        
        this.action = keyPressed;
        this.status = "running";
};

Player.prototype.update = function (dt) {
    if (this.y <= 0) {
        this.status = "swimming";
        game.gameOn = false;        
    }
    if (game.gameOn){
        switch(this.action){
            case "up":
                this.y = (this.y - 20 <= 0) ? -100 * dt  : this.y - 20; 
                break;           
            case "down":
                this.y = (this.y + 20 >= 400) ? 410 : this.y + 20;
                break;
            case "left":
                this.x = (this.x - 20 <= 0) ? 0 : this.x - 20; 
                break;
            case "right":
                this.x = (this.x + 20 >= 400) ? 410 : this.x + 20;
                break;
            case "space":
                if ((this.x + 20 >= 350 || this.x  - 20 <= 350) && (this.y + 20 >= 420 || this.y -20 <= 420)) {
                    this.ammo = "gun";
                }   
                break;
            case "return":
                if (this.inBugRow && this.ammo == "gun") {
                    var bugX = 0, bugPos;
                    for (var i = 0; i < allEnemies.length; i++){
                        var bug = allEnemies[i];
                        if (bug.bugRow == this.bugRow && !bug.dead && bug.x < this.x){
                            if (bug.x > bugX) {
                                bugX = bug.x;
                                bugPos = i;
                            }                            
                        }
                        if (i + 1 == allEnemies.length) {
                            if (allEnemies[bugPos]) {
                                // allEnemies[bugPos].dead = true;
                                star.shoot = true;
                                star.x = gun.x;
                                star.y = gun.y;
                                star.minX = bugX + 40;
                                star.shootBug = bugPos;
                            }                            
                        }
                    }

                }
            }
        if(this.ammo == "gun"){
            gun.x = this.x;
            gun.y = this.y + 100;
        }
        this.action = "";

        if(this.y >= 15 && this.y <= 99){
            this.inBugRow = true;
            this.bugRow = 1;
        }
        else if(this.y >= 101 && this.y <= 182){
            this.inBugRow = true;
            this.bugRow = 2;
        }
        else if(this.y >=184 && this.y <= 266){
            this.inBugRow = true;
            this.bugRow = 3;
        }
        else{
            this.inBugRow = false;
            this.bugRow = 0;
        }
    }
};

var Addons = function (name) {
    this.name = this.sprite = ammo[name].name;
    this.sprite = ammo[name].image;
    this.x = ammo[name].x;
    this.y = ammo[name].y;
};

Addons.prototype.update = function (dt) {
    if (this.name == "star" && this.shoot) {
        if (this.x > this.minX) {
            this.x -= 1000 * dt;    
        }
        else {
            this.shoot = false;
            allEnemies[this.shootBug].dead = true;
            this.shootBug = "";
        }
    }
};

Addons.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
};

// Now instantiate your objects.

var game,
    allEnemies = [], 
    player,
    star;

function initEntities(){
    game = new Game();
    // Place all enemy objects in an array called allEnemies
    for (var i = 0; i <= 7; i++){    
        allEnemies.push(new Enemy(i+1));
    }
    // Place the player object in a variable called player
    player = new Player();
    gun = new Addons("gun");
    star = new Addons("star");
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'return',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);    
});

document.addEventListener("click", function(e){
    if(!game.gameOn){
        game.newGame(e);
    }    
});
