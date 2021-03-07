import {
    COLS, ROWS,
    BLOCK_SIZE,
    LEVEL, POINTS,
    COLORS, SHAPES,
    LINES_PER_LEVEL,
    KEY,
} from './constants'

class Piece {
    shape: number[][]
    x: number
    y: number
    private color: string
    private typeId: number

    constructor(
        private ctx: CanvasRenderingContext2D,

    ) {
        this.typeId = Math.random() * (COLORS.length - 1) + 1 << 0
        this.x = this.y = 0
        this.color = COLORS[this.typeId]
        this.shape = SHAPES[this.typeId]
    }

    draw() {
        this.ctx.lineWidth = 0.05
        this.ctx.fillStyle = this.color
        this.ctx.strokeStyle = '#f0f0f0'
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1)
                    this.ctx.strokeRect(this.x + x, this.y + y, 1, 1)
                }
            })
        })
    }

    move(piece: Piece) {
        this.x = piece.x
        this.y = piece.y
        this.shape = piece.shape
        return this
    }

    rotate() {
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] = [this.shape[y][x], this.shape[x][y]]
            }
        }
        this.shape.forEach(row => row.reverse())
    }

    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3
    }
}

class Game {
    piece: Piece
    requestId: number
    private next: Piece
    private grid: number[][]
    private status: GameState
    private inputStrategy: InputStrategy

    constructor(
        public ctx: CanvasRenderingContext2D,
        public ctxNext: CanvasRenderingContext2D,
    ) {
        this.piece = new Piece(this.ctx)
        this.ctx.canvas.width = COLS * BLOCK_SIZE
        this.ctx.canvas.height = ROWS * BLOCK_SIZE

        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE)
    }

    reset() {
        this.grid = Array.from({
            length: ROWS
        }, () => Array(COLS).fill(0))

        this.piece = new Piece(this.ctx)
        this.piece.setStartingPosition()

        this.getNewPiece()
    }

    valid(p: Piece) {
        const aboveFloor = (y: number) => y <= ROWS
        const insideWalls = (x: number) => x >= 0 && x < COLS
        const notOccupied = (x: number, y: number) => this.grid[y] && this.grid[y][x] === 0

        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    value === 0 ||
                    (insideWalls(x) && aboveFloor(y) && notOccupied(x, y))
                );
            });
        });
    }

    getNewPiece() {
        this.next = new Piece(this.ctxNext)
        this.ctxNext.clearRect(
            0, 0,
            this.ctxNext.canvas.width,
            this.ctxNext.canvas.height
        );
        this.next.draw();
    }

    clearLines() {
        let lines = 0

        this.grid.forEach((row, y) => {
            if (row.every(value => value > 0)) {
                lines++;
                this.grid.splice(y, 1)
                this.grid.unshift(Array(COLS).fill(0))
            }
        })

        if (lines > 0) {
            account.lines += lines
            account.score += this.getLinesClearedPoints(lines)

            if (account.lines >= LINES_PER_LEVEL) {
                account.level++
                account.lines -= LINES_PER_LEVEL
                // time.level = LEVEL[account.level]
            }
        }
    }

    getLinesClearedPoints(lines) {
        const lineClearPoints =
            lines === 1
                ? POINTS.SINGLE
                : lines === 2
                    ? POINTS.DOUBLE
                    : lines === 3
                        ? POINTS.TRIPLE
                        : lines === 4
                            ? POINTS.TETRIS
                            : 0;

        return (account.level + 1) * lineClearPoints;
    }

    draw() {
        this.ctx.lineWidth = 0.05
        this.ctx.strokeStyle = '#f0f0f0'

        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = COLORS[value]
                    this.ctx.fillRect(x, y, 1, 1)
                    this.ctx.lineWidth = 0.05
                    this.ctx.strokeRect(x, y, 1, 1)
                }
            });
        });

        this.piece.draw()
    }

    setState(status: GameState) {
        this.status = status
    }

    setStrategy(inputStrategy: InputStrategy) {
        this.inputStrategy = inputStrategy
    }

    execute() {
        this.inputStrategy.execute(this, this.piece)
    }

    play() {
        this.status.play()
    }
    pause() {
        this.status.pause()
    }

    stop() {
        this.status.stop()
    }
}


/**
 * @interface InputStrategy
 */
interface InputStrategy {
    execute(game: Game, piece?: Piece);
}

/**
 * @class MoveStrategy
 */
class LeftStrategy implements InputStrategy {
    execute(game: Game, piece: Piece) {
        let p = piece

        p.x--
        if (game.valid(p)) {
            p.move(p)
        } else {
            p.x++
        }

        game.piece = p
    }
}
class RightStrategy implements InputStrategy {
    execute(game: Game, piece: Piece) {
        let p = piece
        p.x++

        if (game.valid(p)) {
            p.move(p)
        } else {
            p.x--
        }

        game.piece = piece
    }
}

class DropStrategy implements InputStrategy {
    execute(game: Game, piece: Piece): void {
        let p = piece
        if (game.valid(p)) {
            p.y++
            p.move(p)
            account.score += POINTS.SOFT_DROP
        }
        game.piece = p
    }
}
class BottomStrategy implements InputStrategy {
    execute(game: Game, piece: Piece): void {
        let p = piece
        while (game.valid(p)) {
            account.score += POINTS.HARD_DROP;
            p.y++
            p.move(p)
        }
        game.piece = p
    }
}

class RotateStrategy implements InputStrategy {
    execute(game: Game, piece: Piece): void {
        let p = piece
        for (let y = 0; y < p.shape.length; y++) {
            for (let x = 0; x < y; ++x) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]]
            }
        }
        p.shape.forEach(row => row.reverse())

        game.piece = p
    }
}

class PauseStrategy implements InputStrategy {
    execute(game: Game): void {
        game.setState(new PauseState())
    }
}

class StopStrategy implements InputStrategy {
    execute(game: Game) {
        game.setState(new StopState())
    }
}

/**
 * @interface State
 */

abstract class GameState {
    game: Game

    abstract play()
    abstract stop()
    abstract pause()
}

class PlayState extends GameState {
    play() {
        animate()
    }
    stop() {
        return this
    }
    pause() {
        return this
    }

}
class PauseState extends GameState {
    play() {
        return this
    }

    stop() {
        return this
    }
    pause() {
        if (!game.requestId) {
            animate()
            return;
        }
        cancelAnimationFrame(game.requestId)
        game.requestId = null

        game.ctx.fillStyle = 'rgba(0, 0, 0, .5)'
        game.ctx.fillRect(0, 8, ROWS, 3)

        game.ctx.font = '2px Arial'
        game.ctx.fillStyle = 'yellow'

        game.ctx.fillText('PAUSED', 2, 10)
    }
}

class StopState extends GameState {
    play() {
        return this
    }

    stop() {
        cancelAnimationFrame(game.requestId);
        game.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
        game.ctx.fillRect(0, 8, ROWS, 3);

        game.ctx.font = '2px Arial';
        game.ctx.fillStyle = 'red';

        ctx.fillText('GAME OVER', 0, 10)
    }
    pause() {
        return this
    }

}

let canvas = <HTMLCanvasElement>document.getElementById('board')
let next = <HTMLCanvasElement>document.getElementById('next')

const game: Game = new Game(
    canvas.getContext('2d'),
    next.getContext('2d')
)


const play = () => { 
    game.reset() 
    game.play()
}

const INPUTS = {
    [KEY.ESC]: () => new StopStrategy(),
    [KEY.P]: () => new PauseStrategy(),

    [KEY.DOWN]: () => new DropStrategy(),
    [KEY.LEFT]: () => new LeftStrategy(),
    [KEY.RIGHT]: () => new RightStrategy(),
    [KEY.UP]: () => new RotateStrategy(),
    [KEY.SPACE]: () => new BottomStrategy(),
}

document.addEventListener('keydown', e => {
    if (KEY[e.keyCode]) {
        game.setStrategy(INPUTS[e.keyCode]())
        game.execute()
    }
})