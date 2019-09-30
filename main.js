//Pixel War
// ship is 5 units wide 
// enemies 3 units wide
// bonus is 3 units wide
// enemy fire is 2 units wide

// <canvas width="300" height="500" style="display: block; touch-action: none; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: default;"></canvas>

// screen is about 6 ships wide or 30 units
// enemies, bonus, enemy fire are 1 unit wide
// blue background
// white units
// bonus adds cannons up to 3 -3 cannons which are as wide as the ship
// lives:
// tracked in upper right
// impact kills - 3 lives
// piskel - pixel art
// Score:
// located in upper left
// enemies worth 10 points
// bonus worth 100 points

const colors ={
    // player:'#FFFFFF',
    player:'#8F3A84FF',
    laser:'#22F701FF',
    enemy:'#F7A601',
    enemyFire: '#CE0D0D',
    bonus:'#F1F14C',
    background: '#3A6D8F'
}

class Game {
    constructor (canvasId){
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext('2d')
        this.size = {width: canvas.width, height: canvas.height}
        this.gameSpeed = 2
        this.bodies = []
        this.ticksSinceDanger = 0
        this.keyboard = new Keyboarder()
        this.gameOver = false

        let playerSize = {
            width: 15,
            height: 20
        }

        let playerLocation = {
            x: this.size.width/2,
            y: playerSize.height + 10
        }

        this.player= new Player(playerLocation, playerSize)
        this.addBody(this.player)
        console.log('size',playerSize, 'center',this.player.center, 'colors.player',colors.player,'colors.background',colors.background)
    }
    addBody(body){
    this.bodies.push(body)
    }

    run() {
        const tick= () => {
            this.update()
            this.draw()

            if(!this.gameOver) {
                window.requestAnimationFrame(tick)
            }
        }
        tick()
    }

    addEnemy() {
        this.addBody(new Enemy({x: Math.floor(Math.random()*this.size.width), y: this.top}, {width: 10, height:20}))
    }
    addEnemyFire() {
        this.addBody(new EnemyFire({x: Math.floor(Math.random()*this.size.width), y: this.top}, {width: 5, height:20}))
    }
    addBonus() {
        this.addBody(new Bonus({x: Math.floor(Math.random()*this.size.width), y: this.top}, {width: 10, height:10}))
    }
    addLaser() {
        this.addBody(new Laser({x: this.playerLocation.x, y: this.playerLocation.y + 1}, {width: 10, height:20}))

    }

    update() {
        //noop
        const dangerOccurPercentage = this.ticksSinceDanger * 0.0001

        if (Math.random()< dangerOccurPercentage) {
            this.addEnemy()
            this.ticksSinceDanger = 0
        } else {
            this.ticksSinceDanger++
        }

        if (Math.random() <0.01) {
            this.addBonus()
        }
        for(let body of this.bodies) {
            body.update(this)
            if (colliding(this.player, body)) {
                this.gameOver = true
            }
        }
        this.bodies = this.bodies.filter(bodyOnScreen)
    }

    draw() {
        let top = this.size.height
        let bottom = 0
        this.screen.fillStyle = colors.background
        this.screen.fillRect(0,0,this.size.width,this.size.height)

        for (let body of this.bodies) {
            body.draw(this.screen)
        }
        }
}

    class Player {
        constructor(center, size) {
            this.center = center
            this.size = size
            console.log(this.size)
            this.startingY = 0
            this.startingX = center.x
            // this.game = game;
        }
        update(game) {
            
            // this.center.x = 

            if (game.keyboard.isDown(Keyboarder.KEYS.LEFT)){
                this.center.x =- 2;
            }
            if (game.keyboard.isDown(Keyboarder.KEYS.RIGHT)) {
                this.center.x =+ 2;
            }
            if (game.keyboard.isDown(Keyboarder.KEYS.UP)) {

                var laser = new Laser({x: this.center.x, y: this.center.y - this.size.y - 10}, { x:0, y: -7});

                this.game.addBody(laser);
            }
            
        }

        draw(screen) {
            screen.fillStyle = colors.player
            screen.fillRect(
                this.center.x, this.center.y, this.size.width, this.size.height)
                console.log(this.size.width)
            }
    }

    class Enemy {
        constructor(center, size) {
            this.center = center
            this.size = size
            this.startingY = top
            this.startingX = center.x
    }
    update(game) {
        this.center.y -= game.gameSpeed
    }

    draw (screen) {
        screen.fillStyle = colors.Enemy
        screen.fillRect(
            this.center.x - (this.size.width / 2),
            this.center.y - (this.size.height / 2),
            this.size.width, this.size.height)
        }
    }

    class Bonus {
        constructor(center, size) {
            this.center = center
            this.size = size
            this.startingY = top
            this.startingX = center.x
    }
    update(game) {
        this.center.y -= game.gameSpeed
    }

    draw (screen) {
        screen.fillStyle = colors.Bonus
        screen.fillRect(
            this.center.x - (this.size.width / 2),
            this.center.y - (this.size.height / 2),
            this.size.width, this.size.height)
        }
    }

    function bodyOnScreen (body) {
        return (body.center.y + body.size.height) > 0
    }

    function colliding (b1, b2) {
        return !(
          b1.safe ||
          b2.safe ||
          b1 === b2 ||
              b1.center.x + b1.size.width / 2 < b2.center.x - b2.size.width / 2 ||
              b1.center.y + b1.size.height / 2 < b2.center.y - b2.size.height / 2 ||
              b1.center.x - b1.size.width / 2 > b2.center.x + b2.size.width / 2 ||
              b1.center.y - b1.size.height / 2 > b2.center.y + b2.size.height / 2
        )
    }
      




const game = new Game('game-screen')
game.run()