export const COLS = 12;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
export const LINES_PER_LEVEL = 10;

export let requestId
export const animate = (game, now = 0) => {
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!game.drop()) {
            stop();
            return;
        }
    }

    game.ctx.clearRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);
    game.draw();
    requestId = requestAnimationFrame(animate);
}

const updateAccount = (key, value) => {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
}

export const COLORS = [
    'none',

    '#1abc9c',
    '#3498db',
    '#95a5a6',

    '#e67e22',
    '#2ecc71',
    '#e74c3c',
    '#f1c40f',
];

export const SHAPES = [
    [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],

    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],

    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];

export const KEY = {
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    P: 80
}

export const POINTS = {
    SOFT_DROP: 1,
    HARD_DROP: 2,
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
}

export const LEVEL = {
    0: 800,
    1: 720,
    2: 630,
    3: 550,
    4: 470,
    5: 380,
    6: 300,
    7: 220,
    8: 130,
    9: 100,
    10: 80,
    11: 80,
    12: 80,
    13: 70,
    14: 70,
    15: 70,
    16: 50,
    17: 50,
    18: 50,
    19: 30,
    20: 30,
}

export let account = new Proxy({ score: 0, level: 0, lines: 0 }, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

export let time = { start: 0, elapsed: 0, level: LEVEL[account.level] };

Object.freeze(KEY);
Object.freeze(LEVEL);
Object.freeze(COLORS);
Object.freeze(SHAPES);
Object.freeze(POINTS);