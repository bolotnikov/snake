game.snake = {
    game: game,
    cells: [],
    moving: false,
    direction: null,
    directions: {
        left: {row: 0, col: -1, angle: 270},
        up: {row: -1, col: 0, angle: 0},
        right: {row: 0, col: 1, angle: 90},
        down: {row: 1, col: 0, angle: 180}
    },
    create() {
        this.direction = this.directions.up;
        let cells = [{row: 11, col: 10}, {row: 10, col: 10}];

        for (let cell of cells) {
            this.addCell(this.game.board.getCell(cell.row, cell.col));
        }
    },
	changeDirection(code) {
        if (!this.moving) {
            this.game.onSnakeStart();
            this.moving = true;
        }

        switch(code){
            case this.game.keys.left:
                this.direction = this.directions.left;
              break;
            case this.game.keys.up:
                this.direction = this.directions.up;
                break;
            case this.game.keys.right:
                this.direction = this.directions.right;
                break;
            case this.game.keys.down:
                this.direction = this.directions.down;
                break;
            default:
				break;
        }
	},
	move(){
        if (!this.moving) {
            return false;
        }
        let cell = this.getNextCell();

        if (!cell || this.hasCell(cell) || this.game.board.isBombCell(cell)) {
			this.game.stop();
        } else {
            this.addCell(cell);

            if (this.game.board.isFoodCell(cell)) {
                this.game.onSnakeEat();
            } else {
                this.removeCell();
            }
        }
    },
    getNextCell() {
		var row = this.cells[0].row + this.direction.row;
        var col = this.cells[0].col + this.direction.col;
        return this.game.board.getCell(row, col);
    },
    addCell(cell) {
        this.cells.unshift(cell);
    },
    removeCell() {
        this.cells.pop();
    },
	hasCell(part){
        return this.cells.find(cell => cell === part);
    },
	render(){
        this.renderHead();
        this.renderBody();
    },
    renderHead() {
        let part = this.cells[0];
        // save the context's co-ordinate system before we screw with it
        this.game.ctx.save(); 
        // move the origin to 50, 35   
        this.game.ctx.translate(part.x, part.y); 
        // now move across and down half the width and height of the image (which is 128 x 128)
        this.game.ctx.translate(10, 13); 
        // rotate around this point
        this.game.ctx.rotate(this.direction.angle * Math.PI / 180); 
        // then draw the image back and up
        this.game.ctx.drawImage(this.game.sprites.head, -10, -13); 
        // and restore the co-ordinate system to its default top left origin with no rotation
        this.game.ctx.restore();
    },
    renderBody() {
		for (let i = 1; i < this.cells.length; i++) {
            this.game.ctx.drawImage(this.game.sprites.body, this.cells[i].x, this.cells[i].y);
		}
    },
};
