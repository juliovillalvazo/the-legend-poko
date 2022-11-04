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
    enemyRate: 3000,
    finalLevel: false,
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

m0.src = './src/images/main0.gif';
m1.src = './src/images/main1.gif';
m2.src = './src/images/main2.gif';
m3.src = './src/images/main3.gif';

const mSprites = [m0, m1, m2, m3];

// enemies sprites
const e0 = new Image();
const e1 = new Image();
const e2 = new Image();
const e3 = new Image();

e0.src = './src/images/goblin1.gif';
e1.src = './src/images/goblin2.gif';
e2.src = './src/images/goblin3.gif';
e3.src = './src/images/goblin4.gif';

const eSprites = [e0, e1, e2, e3];

// attack sprite
const beamImg = new Image();
beamImg.src = './src/images/shoot.png';

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

h100.src = './src/images/health100.gif';
h90.src = './src/images/health90.gif';
h80.src = './src/images/health80.gif';
h70.src = './src/images/health70.gif';
h60.src = './src/images/health60.gif';
h50.src = './src/images/health50.gif';
h40.src = './src/images/health40.gif';
h30.src = './src/images/health30.gif';
h20.src = './src/images/health20.gif';
h10.src = './src/images/health10.gif';
h0.src = './src/images/health0.gif';

// mana sprites
const m100 = new Image();
const m90 = new Image();
const m80 = new Image();
const m70 = new Image();
const m60 = new Image();
const m20 = new Image();
const m10 = new Image();
const mNone = new Image();

m100.src = './src/images/mana100.gif';
m90.src = './src/images/mana90.gif';
m80.src = './src/images/mana80.gif';
m70.src = './src/images/mana70.gif';
m60.src = './src/images/mana60.gif';
m20.src = './src/images/mana20.gif';
m10.src = './src/images/mana10.gif';
mNone.src = './src/images/mana0.gif';

// mana potion sprite
const mPotion = new Image();
mPotion.src = './src/images/manapotion.png';

// health potion sprite
const hPotion = new Image();
hPotion.src = './src/images/healthpotion.png';

// potion types
const types = ['health', 'mana'];

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
        if (this.posX + 10 < 630) {
            this.posX += 10;
        }
    }

    left() {
        if (this.posX - 10 > 0) {
            this.posX -= 10;
        }
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

    gainHealth() {
        this.health += 15;

        switch (this.health) {
            case 100:
                this.healthImg = h100;
                break;
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
        }
    }

    gainMana() {
        this.mana += 15;
        switch (this.mana) {
            case 100:
                this.manaImg = m100;
                break;
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

    attack() {
        if (this.mana - 10 >= 0) {
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
    constructor(ctx, img, posX, posY, bigger = false) {
        super(ctx, img, posX, posY);
        this.ctx = ctx;
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.bigger = bigger;
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

    render() {
        if (this.bigger) {
            this.ctx.drawImage(this.img, this.posX, 220, 200, 200);
        } else {
            this.ctx.drawImage(this.img, this.posX, this.posY, 74, 74);
        }
    }

    looseHealth() {
        this.health -= 10;
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

class Potion {
    constructor(ctx, img, char, type, posX) {
        this.ctx = ctx;
        this.img = img;
        this.char = char;
        this.type = type;
        this.posX = posX;
        this.posY = 0;
    }

    drop() {
        if (this.posY < 360) this.posY += 2;
    }

    render() {
        this.ctx.drawImage(this.img, this.posX, this.posY, 30, 30);
    }
}

// start game
const startGame = () => {
    menu.classList.add('hide');
    game.classList.remove('hide');
    state.start = true;
    state.enemies = [];
    state.beams = [];
    state.potions = [];
    state.time = 60_000;
    mainChar.kills = 0;

    if (state.finalLevel) {
        state.potionsRate = state.potionsRate / 2;
        state.finalBoss = new Enemy(ctx, e0, 450, 0, true);
        state.finalBoss.health = 30;
    } else {
        state.potionsRate = 300;
    }

    state.initId = setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundImage =
            "url('./src/images/forest_background_animated.gif')";
        canvas.style.backgroundPosition = 'center';
        canvas.style.backgroundSize = 'cover';
        canvas.style.backgroundRepeat = 'no-repeat';

        characterState.intervalId = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mainChar.render();
            mainChar.renderHealth();
            mainChar.renderMana();

            if (state.finalLevel) {
                state.finalBoss.render();
            }

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
                enemy.render();
                enemy.left();

                if (Math.floor(Math.random() * 50) === 10) {
                    enemy.jump();
                }

                enemy.img = eSprites[state.enemiesCounter];

                // collision

                if (
                    enemy.posX <= mainChar.posX + 70 &&
                    !(mainChar.posX >= enemy.posX + 70) &&
                    enemy.posY <= mainChar.posY + 70 &&
                    enemy.posY + 70 >= mainChar.posY &&
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
                        b.posX + 20 >= enemy.posX &&
                        !(b.posX + 20 >= enemy.posX + 74) &&
                        b.posY >= enemy.posY + 5 &&
                        !(b.posY >= enemy.posY + 74)
                    ) {
                        state.beams.splice(ib, 1);
                        state.enemies.splice(ie, 1);
                        state.score += 10;
                        mainChar.kills++;
                    }
                });

                if (
                    state.finalLevel &&
                    b.posX + 20 >= state.finalBoss.posX &&
                    !(b.posX + 20 >= state.finalBoss.posX + 200) &&
                    b.posY >= state.finalBoss.posY + 5
                ) {
                    state.beams.splice(ib, 1);
                    state.finalBoss.looseHealth();

                    if (state.finalBoss.health <= 0) {
                        winGame();
                    }
                }
            });

            if (mainChar.kills >= 3 && !state.finalLevel) {
                advanceLevel();
            }

            state.potions.forEach((potion, i) => {
                potion.render();
                potion.drop();

                // check collision
                if (
                    mainChar.posX + 50 >= potion.posX &&
                    potion.posY + 30 >= mainChar.posY &&
                    mainChar.posX <= potion.posX + 30 &&
                    mainChar.posY + 50 >= potion.posY
                ) {
                    state.potions.splice(i, 1);
                    if (mainChar[potion.type] + 5 <= 100) {
                        if (potion.type === 'health') {
                            mainChar.gainHealth();
                        } else {
                            mainChar.gainMana();
                        }
                    }
                }
            });
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
        }, state.enemyRate);

        state.potionsIntervalId = setInterval(() => {
            // make randomly potions
            if (Math.floor(Math.random() * 10) === 1) {
                const potionType = types[Math.round(Math.random())];
                const randPosX = Math.floor(Math.random() * 370) + 30;
                const potionImg = potionType === 'health' ? hPotion : mPotion;
                const newPotion = new Potion(
                    ctx,
                    potionImg,
                    mainChar,
                    potionType,
                    randPosX
                );

                state.potions.push(newPotion);
            }
        }, state.potionsRate);

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
    if (state.level > 3) {
        state.message1 = `Warning!!`;
        state.message2 = 'Final Boss is here!!';
        state.finalLevel = true;
    } else {
        state.message1 = `Level ${state.level}`;
        state.message2 = '';
    }

    state.score += state.time;
    state.enemyRate = state.enemyRate / 2;

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

    // clear potions interval
    clearInterval(state.potionsIntervalId);

    // clear potions array
    state.potions = [];

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

                        // clear potions interval
                        clearInterval(state.potionsIntervalId);

                        // clear potions array
                        state.potions = [];

                        // reset message
                        state.message1 = 'Rescue the princess and save';
                        state.message2 =
                            'the kingdom from the evil army of Browl!';

                        // clear enemies array
                        state.enemies = [];

                        // clear final level
                        state.finalLevel = false;

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

    if (state.finalLevel) {
        state.finalBoss.img = eSprites[state.enemiesCounter];
    }

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
    clearInterval(state.potionsIntervalId);

    // clear enemies array
    state.enemies = [];

    // clear beams array
    state.beams = [];

    // clear potions array
    state.potions = [];

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

// Win (defeat final boss)
const winGame = () => {
    clearInterval(characterState.intervalId);
    clearInterval(state.renderIntervalId);
    clearInterval(state.enemiesRenderIntervalId);
    clearInterval(state.initId);
    clearInterval(state.timeIntervalId);
    clearInterval(state.potionsIntervalId);

    // clear enemies array
    state.enemies = [];

    // clear beams array
    state.beams = [];

    // clear potions array
    state.potions = [];

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
    ctx.fillText('You saved the kingdom!!', 220, 190);

    // score is calculated from time and kill points
    ctx.fillText(`Your score is ${state.score + state.time}`, 180, 240);

    // reload page
    setTimeout(() => {
        location.reload();
    }, 3000);
};
