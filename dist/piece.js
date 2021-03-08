class Piece {
    /**
     * @param {CanvasRenderingContext2D} ctx 
    */
    constructor(ctx) {
        this.ctx = ctx;
        this.typeId = Math.random() * (COLORS.length - 1) + 1 << 0
        this.shape = SHAPES[this.typeId]
        this.color = COLORS[this.typeId]
        this.x = this.y = 0
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
            });
        });
    }

    rotate() {
        for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] = [this.shape[y][x], this.shape[x][y]];
            }
        }
        this.shape.forEach(row => row.reverse());
        return this
    }

    /**
     * @param {Piece} p 
     */
    move(p) {
        this.x = p.x;
        this.y = p.y;
        this.shape = p.shape;
    }

    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3;
    }
}
