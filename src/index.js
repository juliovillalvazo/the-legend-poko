// important variables

const menu = document.querySelector('#menu');
const canvas = document.querySelector('#canvas');
const startBtn = document.querySelector('.start');
const instructionsBtn = document.querySelector('.instructions');
const menuGame = document.querySelector('.menu-game');
const creditsBtn = document.querySelector('.credits');
const ctx = canvas.getContext('2d');
const game = document.querySelector('.game-container');

// game state
const state = {
    start: false,
    instructions: false,
    credits: false,
    enemiesCounter: 0,
    enemyFloor: 400 - 70,
    enemyJump: 0,
    level: 1,
    pause: false,
    message1: 'Rescue the princess and save',
    message2: 'the kingdom from the evil army of Browl!',
    score: 0,
};

// character state
const characterState = {
    doubleJump: 0,
    counter: 0,
};

// main character sprites
const m0 = new Image();
const m1 = new Image();
const m2 = new Image();
const m3 = new Image();

m0.src = './images/main0.gif';
m1.src = './images/main1.gif';
m2.src = './images/main2.gif';
m3.src = './images/main3.gif';

const mSprites = [m0, m1, m2, m3];

// enemies sprites
const e0 = new Image();
const e1 = new Image();
const e2 = new Image();
const e3 = new Image();

e0.src = '../images/goblin1.gif';
e1.src = '../images/goblin2.gif';
e2.src = '../images/goblin3.gif';
e3.src = '../images/goblin4.gif';

const eSprites = [e0, e1, e2, e3];

// attack sprite
const beamImg = new Image();
beamImg.src = '../images/shoot.png';

// health sprites
const h100 = new Image();
const h90 = new Image();
const h80 = new Image();
const h70 = new Image();
const h60 = new Image();
const h50 = new Image();
const h40 = new Image();
const h30 = new Image();
const h20 = new Image();
const h10 = new Image();
const h0 = new Image();

h100.src = '../images/health100.gif';
h90.src = '../images/health90.gif';
h80.src = '../images/health80.gif';
h70.src = '../images/health70.gif';
h60.src = '../images/health60.gif';
h50.src = '../images/health50.gif';
h40.src = '../images/health40.gif';
h30.src = '../images/health30.gif';
h20.src = '../images/health20.gif';
h10.src = '../images/health10.gif';
h0.src = '../images/health0.gif';

// mana sprites
const m100 = new Image();
const m90 = new Image();
const m80 = new Image();
const m70 = new Image();
const m60 = new Image();
const m20 = new Image();
const m10 = new Image();
const mNone = new Image();

m100.src = '../images/mana100.gif';
m90.src = '../images/mana90.gif';
m80.src = '../images/mana80.gif';
m70.src = '../images/mana70.gif';
m60.src = '../images/mana60.gif';
m20.src = '../images/mana20.gif';
m10.src = '../images/mana10.gif';
mNone.src = '../images/mana0.gif';

// mana potion sprite
const mPotion = new Image();
mPotion.src = '../images/manapotion.png';

// health potion sprite
const hPotion = new Image();
hPotion.src = '../images/healthpotion.png';

// character class
class Character {
    constructor(ctx, img, posX, posY) {
        this.ctx = ctx;
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.health = 100;
        this.healthImg = h100;
        this.mana = 100;
        this.manaImg = m100;
        this.kills = 0;
    }

    right() {
        this.posX += 10;
    }

    left() {
        this.posX -= 10;
    }

    jump() {
        this.posY -= 36;
        setTimeout(() => {
            this.posY += 36;
            if (this.posY === 390 - 74) {
                characterState.doubleJump = 0;
            }
        }, 700);
    }

    render() {
        this.ctx.drawImage(this.img, this.posX, this.posY, 74, 74);
    }

    attack() {
        const beam = new Beam(ctx, beamImg, this.posX + 40, this.posY + 40);
        this.mana -= 10;
        state.beams.push(beam);

        switch (this.mana) {
            case 90:
                this.manaImg = m90;
                break;
            case 80:
                this.manaImg = m80;
                break;
            case 70:
                this.manaImg = m70;
                break;
            case 60:
                this.manaImg = m60;
                break;
            case 20:
                this.manaImg = m20;
                break;

            case 10:
                this.manaImg = m10;
                break;

            case 0:
                this.manaImg = mNone;
                break;
        }
    }

    renderMana() {
        this.ctx.drawImage(this.manaImg, 10, 0, 150, 120);
    }

    renderHealth() {
        this.ctx.drawImage(this.healthImg, 10, -40, 150, 120);
    }

    looseHealth() {
        this.health -= 5;

        switch (this.health) {
            case 90:
                this.healthImg = h90;
                break;
            case 80:
                this.healthImg = h80;
                break;
            case 70:
                this.healthImg = h70;
                break;
            case 60:
                this.healthImg = h60;
                break;
            case 50:
                this.healthImg = h50;
                break;
            case 40:
                this.healthImg = h40;
                break;
            case 30:
                this.healthImg = h30;
                break;
            case 20:
                this.healthImg = h20;
                break;
            case 10:
                this.healthImg = h10;
                break;
            case 0:
                this.healthImg = h0;
                break;
        }
    }
}

const mainChar = new Character(ctx, m0, 10, 390 - 74);

// Enemies Class

class Enemy extends Character {
    constructor(ctx, img, posX, posY) {
        super(ctx, img, posX, posY);
        this.ctx = ctx;
        this.img = img;
        this.posX = posX;
        this.posY = posY;
    }

    left() {
        this.posX -= 4;
    }

    jump() {
        if (state.enemyJump < 1) {
            this.posY -= 70;
            state.enemyJump++;
            setTimeout(() => {
                this.posY += 70;
                if (this.posY === state.enemyFloor) {
                    state.enemyJump = 0;
                }
            }, 600);
        }
    }
}

class Beam {
    constructor(ctx, img, posX, posY) {
        this.ctx = ctx;
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.health = 1;
    }

    moveForward() {
        this.posX += 5;
    }

    render() {
        this.ctx.drawImage(this.img, this.posX, this.posY, 25, 25);
    }
}

// class Potion {
//     constructor(char, type) {
//         this.char = char;
//         this.type = type;
//     }

//     effect() {

//     }

//     render() {

//     }
// }

// start game
const startGame = () => {
    menu.classList.add('hide');
    game.classList.remove('hide');
    state.start = true;
    state.enemies = [];
    state.beams = [];
    state.time = 60_000;
    mainChar.kills = 0;

    state.initId = setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundImage =
            "url('../images/forest_background_animated.gif')";
        canvas.style.backgroundPosition = 'center';
        canvas.style.backgroundSize = 'cover';
        canvas.style.backgroundRepeat = 'no-repeat';

        characterState.intervalId = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mainChar.render();
            mainChar.renderHealth();
            mainChar.renderMana();

            ctx.font = '20px serif';

            // health bar

            ctx.fillText(`H: ${mainChar.health}`, 160, 28);

            // mana bar

            ctx.fillText(`M: ${mainChar.mana}`, 144, 54);

            // time

            ctx.fillText(`Time: ${state.time}`, 570, 28);

            // score
            ctx.fillText(`Score: ${state.score}`, 570, 54);

            state.enemies.forEach((enemy, i) => {
                enemy.left();

                if (Math.floor(Math.random() * 50) === 10) {
                    enemy.jump();
                }

                enemy.render();
                enemy.img = eSprites[state.enemiesCounter];

                // collision

                if (
                    enemy.posX <= mainChar.posX + 60 &&
                    !(mainChar.posX >= enemy.posX + 60) &&
                    enemy.posY <= mainChar.posY + 60 &&
                    enemy.posY + 60 >= mainChar.posY &&
                    !state.pause
                ) {
                    mainChar.looseHealth();
                    state.enemies.splice(i, 1);

                    if (mainChar.health === 0) {
                        gameOver();
                    }
                }

                if (enemy.posX < 0) {
                    state.enemies.splice(i, 1);
                }
            });

            // time ran out
            if (state.time <= 0) {
                console.log('loose');
                gameOver();
            }

            state.beams.forEach((b, ib) => {
                b.render();
                b.moveForward();

                if (b.posX + 23 > 700) {
                    state.beams.splice(ib, 1);
                }

                state.enemies.forEach((enemy, ie) => {
                    if (
                        b.posX + 23 >= enemy.posX &&
                        b.posY <= enemy.posY + 27 &&
                        b.posY + 27 >= enemy.posY
                    ) {
                        state.beams.splice(ib, 1);
                        state.enemies.splice(ie, 1);
                        state.score += 10;
                        mainChar.kills++;
                    }
                });
            });

            if (mainChar.kills === 6) {
                advanceLevel();
            }
        }, 1000 / 60);

        state.renderIntervalId = setInterval(() => {
            updateSprites();
        }, 100);

        state.enemiesRenderIntervalId = setInterval(() => {
            // make new Enemy
            if (Math.floor(Math.random() * 2) === 1) {
                const newEnemy = new Enemy(ctx, e0, 700, state.enemyFloor);

                state.enemies.push(newEnemy);
            }
        }, 1000);

        state.timeIntervalId = setInterval(() => {
            state.time -= 1;
        }, 1);
    }, 2000);

    ctx.font = '30px serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${state.message1}`, 140, 200);

    if (state.message2) {
        ctx.fillText(`${state.message2}`, 60, 230);
    }
};

const advanceLevel = () => {
    state.level++;
    state.message1 = `Level ${state.level}`;
    state.message2 = '';
    state.score += state.time;

    // clear interval of main character
    clearInterval(characterState.intervalId);

    // clear interval of enemies
    clearInterval(state.enemiesRenderIntervalId);

    // clear rendering interval
    clearInterval(state.renderIntervalId);

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // clear time interval
    clearInterval(state.timeIntervalId);

    // clear enemies array
    state.enemies = [];

    // clear beams array
    state.beams = [];

    startGame();
};

// display instructions screen
const showInstructions = () => {
    const instructions = document.querySelector('#instructions');
    menu.classList.add('hide');
    instructions.classList.remove('hide');

    state.instructions = true;

    state.instructions &&
        instructions.addEventListener('click', (e) => {
            instructions.classList.add('hide');
            menu.classList.remove('hide');
            state.instructions = false;
        });
};

// display credits screen

const showCredits = () => {
    const credits = document.querySelector('#credits');
    menu.classList.add('hide');
    credits.classList.remove('hide');

    state.credits = true;

    state.credits &&
        credits.addEventListener('click', (e) => {
            credits.classList.add('hide');
            menu.classList.remove('hide');
        });
};

startBtn.addEventListener('click', startGame);
instructionsBtn.addEventListener('click', showInstructions);
creditsBtn.addEventListener('click', showCredits);

// controls event listener

const keyPressed = (e) => {
    if (state.start) {
        switch (e.code) {
            case 'KeyP':
                menuGame.classList.remove('hide');

                canvas.style.filter = 'blur(8px)';

                state.pause = true;
                const cont = document.querySelector('.continue');
                const quit = document.querySelector('.quit');

                const time = state.time;

                // quit
                state.pause &&
                    quit.addEventListener('click', () => {
                        // clear interval of main character
                        clearInterval(characterState.intervalId);

                        // clear interval of enemies
                        clearInterval(state.enemiesRenderIntervalId);

                        // clear rendering interval
                        clearInterval(state.renderIntervalId);

                        // clear canvas
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        // clear time interval
                        clearInterval(state.timeIntervalId);

                        // reset message
                        state.message1 = 'Rescue the princess and save';
                        state.message2 =
                            'the kingdom from the evil army of Browl!';

                        // clear enemies array
                        state.enemies = [];

                        // clear beams array
                        state.beams = [];

                        // clear level
                        state.level = 1;

                        // clear score
                        state.score = 0;

                        // clear health
                        mainChar.health = 100;
                        mainChar.healthImg = h100;

                        // clear mana
                        mainChar.mana = 100;
                        mainChar.manaImg = m100;

                        // reset initial values
                        mainChar.posX = 10;
                        mainChar.posY = 390 - 74;
                        mainChar.img = m0;
                        characterState.counter = 0;

                        // get back to main page
                        menuGame.classList.add('hide');
                        menu.classList.remove('hide');

                        state.pause = false;
                        game.classList.add('hide');
                        state.start = false;
                        canvas.style.filter = null;
                        canvas.style.backgroundImage = null;
                    });

                //continue
                state.pause &&
                    cont.addEventListener('click', () => {
                        menuGame.classList.add('hide');
                        canvas.style.filter = null;
                        state.pause = false;
                        state.time = time;
                    });

                break;

            case 'ArrowUp':
                if (characterState.doubleJump < 2) {
                    mainChar.jump();
                    characterState.doubleJump += 1;
                }
                break;

            case 'ArrowRight':
                mainChar.right();
                break;

            case 'ArrowLeft':
                mainChar.left();
                break;

            case 'KeyX':
                if (mainChar.mana > 0 && !state.pause) mainChar.attack();
                break;
        }
    }
};

window.addEventListener('keydown', keyPressed);

// Update Sprites
const updateSprites = () => {
    mainChar.img = mSprites[characterState.counter];

    if (state.enemiesCounter === eSprites.length - 1) {
        state.enemiesCounter = 0;
    } else {
        state.enemiesCounter++;
    }

    if (characterState.counter === mSprites.length - 1) {
        characterState.counter = 0;
    } else {
        characterState.counter += 1;
    }
};

// Loose (Game Over)
const gameOver = () => {
    clearInterval(characterState.intervalId);
    clearInterval(state.renderIntervalId);
    clearInterval(state.enemiesRenderIntervalId);
    clearInterval(state.initId);
    clearInterval(state.timeIntervalId);

    // clear enemies array
    state.enemies = [];

    // clear beams array
    state.beams = [];

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // reset initial values
    mainChar.posX = 10;
    mainChar.posY = 390 - 74;
    mainChar.img = m0;
    characterState.counter = 0;

    canvas.style.backgroundImage = null;
    canvas.style.backgroundColor = 'black';

    ctx.font = '40px Serif';
    ctx.fillText('Game Over', 250, 190);

    // score is calculated from time and kill points
    ctx.fillText(`Your score is ${state.score + state.time}`, 180, 240);

    // reload page
    setTimeout(() => {
        location.reload();
    }, 3000);
};
