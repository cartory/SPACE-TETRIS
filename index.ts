import {
    COLS, ROWS,
    BLOCK_SIZE,
    LEVEL, POINTS,
    COLORS, SHAPES,
    LINES_PER_LEVEL,
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
    private next: Piece
    private grid: number[][]
    private inputStrategy: InputStrategy

    constructor(
        private ctx: CanvasRenderingContext2D,
        private ctxNext: CanvasRenderingContext2D,
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

    setStrategy(inputStrategy: InputStrategy) {
        this.inputStrategy = inputStrategy
    }

    execute(data: (Piece | Game)) {
        this.inputStrategy.execute(data)
    }
}

/**
 * @interface InputStrategy
 */
interface InputStrategy {
    execute(data: Game | Piece);
}

/**
 * @class MoveStrategy
 */
class MoveStrategy implements InputStrategy {
    execute(piece: Piece) {
        piece.move(piece)
    }
}

class DropStrategy implements InputStrategy {
    execute(piece: Piece): void {
        // piece.drop();
    }
}

class RotateStrategy implements InputStrategy {
    execute(piece: Piece): void {
        throw new Error("Method not implemented.");
    }
}

class PauseStrategy implements InputStrategy {
    execute(game: Game): void {
        // game.pause()
    }
}