const canvas = document.getElementById('board');
const canvasNext = document.getElementById('next');

const ctx = canvas.getContext('2d');
const ctxNext = canvasNext.getContext('2d');

let night = document.getElementById('night')
let bubble = document.getElementById('bubble')
let bubble2 = document.getElementById('bubble2')

let requestId;
let board = new Game(ctx, ctxNext);

const updateAccount = (key, value) => {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
}

let account = new Proxy({ score: 0, level: 0, lines: 0 }, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

const moves = {
    [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: p => p.rotate()
};

ctxNext.canvas.width = 4 * BLOCK_SIZE;
ctxNext.canvas.height = 4 * BLOCK_SIZE;
ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

document.addEventListener('keydown', async event => {
    if (event.keyCode === KEY.P) {
        pause();
    }
    if (event.keyCode === KEY.ESC) {
        gameOver();
    } else if (moves[event.keyCode]) {
        event.preventDefault();
        let p = moves[event.keyCode](board.piece);
        if (event.keyCode === KEY.SPACE) {
            await bubble2.play()
            while (board.valid(p)) {
                account.score += POINTS.HARD_DROP;
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
            }
        } else if (board.valid(p)) {
            await bubble.play()
            board.piece.move(p);
            if (event.keyCode === KEY.DOWN) {
                account.score += POINTS.SOFT_DROP;
            }
        }
    }
});

function resetGame() {
    account.score = 0;
    account.lines = 0;
    account.level = 0;
    board.reset();
    time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
}

function play() {
    resetGame()
    time.start = performance.now()
    if (requestId) {
        cancelAnimationFrame(requestId);
    }
    animate()
}

function animate(now = 0) {
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            stop();
            return;
        }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();
    requestId = requestAnimationFrame(animate);
}

function stop() {
    cancelAnimationFrame(requestId);
    ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    ctx.fillRect(0, 8, ROWS, 3);

    ctx.font = '2px Arial';
    ctx.fillStyle = 'red';

    ctx.fillText('GAME OVER', 0, 10);
}

function pause() {
    if (!requestId) {
        animate();
        return;
    }

    cancelAnimationFrame(requestId);
    requestId = null;

    ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    ctx.fillRect(0, 8, ROWS, 3);

    ctx.font = '2px Arial';
    ctx.fillStyle = 'yellow';

    ctx.fillText('PAUSED', 2, 10)
}