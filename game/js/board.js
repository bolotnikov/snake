game.board = {
    types: {bomb: "bomb", food: "food"},
    game: game,
	size: 15,
    cells: [],
    offset: {x: 0, y: 0},
    create() {
        this.init();
        this.createCells();
    },
    init() {
        this.cellSize = this.game.sprites.cell.width + 1;
        this.offset.x = (this.game.width - this.size * this.cellSize) / 2;
        this.offset.y = (this.game.height - this.size * this.cellSize) / 2;
    },
    createCells() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.cells.push(this.createCell(row, col));
            }
        }
    },
    createCell(row, col) {
        let cell = {
            type: false,
            row: row,
            col: col,
            x: this.offset.x + this.cellSize * col,
            y: this.offset.y + this.cellSize * row 
        };
        return cell;
    },
    createBomb() {
        this.createSpecialCell(this.types.bomb);
    },
    createFood() {
        this.createSpecialCell(this.types.food);
    },
    createSpecialCell(type){
        this.resetType(type);

        let newCell = this.getRandomAvailableCell();

        if (newCell) {
            newCell.type = type;
        }
    },
    isBombCell(cell) {
        return this.isSpecialCell(cell, this.types.bomb);
    },
    isFoodCell(cell) {
        return this.isSpecialCell(cell, this.types.food);
    },
    isSpecialCell(cell, type) {
        return cell.type === type;
    },
    resetType(type) {
        let cell = this.cells.find(cell => cell.type === type);
        if (cell) {
            cell.type = false;
        }
    },
    getCell(row, col) {
        return this.cells.find(cell => cell.row === row && cell.col === col);
    },
    getRandomAvailableCell() {
        let pool = this.cells.filter(cell => !cell.type && !this.game.snake.hasCell(cell));
        if (pool.length) {
            return pool[this.game.random(0, pool.length - 1)];
        }
        return false;
    },
	render(){
        this.cells.forEach(cell => {
            this.game.ctx.drawImage(this.game.sprites.cell, cell.x, cell.y);

            if (cell.type) {
                this.game.ctx.drawImage(this.game.sprites[cell.type], cell.x, cell.y);
            }
        });
    },
};