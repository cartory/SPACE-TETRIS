class GameState {
    
}
class InputStrategy {
    execute(game, piece) { 
    }
}

class RightStrategy extends InputStrategy {
    execute(game, piece) { }
}

class LeftStrategy extends InputStrategy {
    execute(game, piece) { }
}

class DropStrategy extends InputStrategy {
    execute(game, piece) { }
}

class BottomStrategy extends InputStrategy {
    execute(game, piece) { }
}

class PauseStrategy extends InputStrategy {
    execute(game) { }
}

class StopStrategy extends InputStrategy {
    execute(game) { }
}


class Game {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {CanvasRenderingContext2D} ctxNext 
     */
    constructor(ctx, ctxNext) {
        this.ctx = ctx
        this.ctxNext = ctxNext

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

    getNewPiece() {
        this.next = new Piece(this.ctxNext)
        this.ctxNext.clearRect(
            0, 0,
            this.ctxNext.canvas.width,
            this.ctxNext.canvas.height
        );
        this.next.draw();
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
        this.piece.draw();
    }

    drop() {
        let p = moves[KEY.DOWN](this.piece);
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            this.freeze();
            this.clearLines();
            if (this.piece.y === 0) {
                return false;
            }

            this.piece = this.next;
            this.piece.ctx = this.ctx;
            this.piece.setStartingPosition();
            this.getNewPiece();
        }
        return true;
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
                time.level = LEVEL[account.level]
            }
        }
    }

    valid(p) {
        const aboveFloor = y => y <= ROWS
        const insideWalls = x => x >= 0 && x < COLS
        const notOccupied = (x, y) => this.grid[y] && this.grid[y][x] === 0

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

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                }
            });
        });
    }

    getEmptyGrid() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
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
}