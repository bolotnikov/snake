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
        let startCells = [{row: 7, col: 7}, {row: 8, col: 7}];

        for (let startCell of startCells) {
            this.cells.push(this.game.board.getCell(startCell.row, startCell.col));
        }
    },
    render() {
        this.cells.forEach(cell => {
            this.game.ctx.drawImage(this.game.sprites.body, cell.x, cell.y);
        });
    },
    start(code) {
        this.moving = true;
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
    move() {
        if (!this.moving) {
            return;
        }
        // получить следующую ячейку
        let cell = this.getNextCell();
        // если такая ячейка есть
        if (cell) {
            // добавить новую ячейку в snake.cells 
            this.cells.unshift(cell);
            // удалить последнюю ячейку из snake.cells
            this.cells.pop();
        }
    },
    getNextCell() {
        let head = this.cells[0];
        let row = head.row + this.direction.row;
        let col = head.col + this.direction.col;
        return this.game.board.getCell(row, col);
    }
};
