const COLS = 12;
const ROWS = 20;
const BLOCK_SIZE = 30;

const LINES_PER_LEVEL = 10;

const COLORS = [
    'none',

    '#1abc9c',
    '#3498db',
    '#95a5a6',
    
    '#e67e22',
    '#2ecc71',
    '#e74c3c',
    '#f1c40f',
];

const SHAPES = [
    [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    
    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];


const KEY = {
    ESC     : 27,
    SPACE   : 32,
    LEFT    : 37,
    UP      : 38,
    RIGHT   : 39,
    DOWN    : 40,
    P       : 80
}

const POINTS = {
    SOFT_DROP   : 1,
    HARD_DROP   : 2,
    SINGLE      : 100,
    DOUBLE      : 300,
    TRIPLE      : 500,
    TETRIS      : 800,
}

const LEVEL = {
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
Object.freeze(KEY);
Object.freeze(LEVEL);
Object.freeze(COLORS);
Object.freeze(SHAPES);
Object.freeze(POINTS);