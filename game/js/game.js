let game = {
    ctx: null,
    board: null,
    snake: null,
    interval: null,
    score: 0,
    width: 0,
    height: 0,
    dimensions: {
        max: {
            width: 640,
            height: 360,
        },
        min: {
            width: 320,
            height: 320,
        }
    },
    keys: {
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40
    },
    sprites: {
        background: null,
        head: null,
        body: null,
        cell: null,
        bomb: null,
        food: null
    },
    sounds: {
        bomb: null,
        food: null,
        theme: null,
    },
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    initDimensions() {
        let data = {
            realWidth: window.innerWidth,
            realHeight: window.innerHeight,
            maxWidth: this.dimensions.max.width,
            maxHeight: this.dimensions.max.height,
            minWidth: this.dimensions.min.width,
            minHeight: this.dimensions.min.height,
        };

        if (data.realWidth / data.realHeight >= data.maxWidth / data.maxHeight) {
            this.fitToWidth(data);
        } else {
            this.fitToHeight(data);
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    fitToWidth(data) {
        // если реальный экран шире рабочего соотношения 
        // полностью вписываем ширину и обрезаем верх и низ
        // значит конечная ширина - это maxWidth, тогда справедлива пропорция:
        // realWidth / realHeight
        // maxWidth / resultHeight
        // resultHeight = maxWidth * realHeight / realWidth
        // округляем вниз и отсекаем все, что выше maxWidth
        this.height = Math.min(Math.floor(data.maxWidth * data.realHeight / data.realWidth), data.maxHeight);
        this.height = Math.max(this.height, data.minHeight);
        this.width  = Math.floor(data.realWidth * this.height / data.realHeight);
        this.canvas.style.width = "100%";
    },
    fitToHeight(data) {
        // если реальный экран уже рабочего соотношения 
        // полностью вписываем высоту и режме левый и правый край
        this.width = Math.min(Math.floor(data.maxHeight * data.realWidth / data.realHeight), data.maxWidth);
        this.width = Math.max(this.width, data.minWidth);
        this.height = Math.floor(this.width * data.realHeight / data.realWidth);
        this.canvas.style.height = "100%";
    },
    init() {
        this.canvas = document.getElementById("mycanvas");
        this.ctx = this.canvas.getContext("2d");
        this.initDimensions();
        this.setTextFont();
    },
    setTextFont() {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "#FFFFFF";
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length + Object.keys(this.sounds).length;

        let onResourceLoad = (e) => {
            ++loaded;
            if (loaded >= required) {
                callback();
            }
        };

        this.preloadSprites(onResourceLoad);
        this.preloadSounds(onResourceLoad);
    },
    preloadSounds(onResourceLoad) {
        for (let key in this.sounds) {
            this.sounds[key] = new Audio();
            this.sounds[key].src = "sounds/" + key + ".mp3";
            this.sounds[key].addEventListener("canplaythrough", onResourceLoad, {once: true});
        }
    },
    preloadSprites(onResourceLoad) {
        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "img/" + key + ".png";
            this.sprites[key].addEventListener("load", onResourceLoad);
        }
    },
    create() {
        this.board.create();
        this.snake.create();
        this.board.createBomb();
        this.board.createFood();
    },
    start() {
        this.init();
        this.preload(() => {
            this.run();
        });
    },
    run() {
        this.create();
		window.addEventListener('keydown', e => {
            this.snake.changeDirection(e.keyCode);
        });
        this.bombInterval = setInterval(() => {
            if (this.snake.moving) {
                this.board.createBomb();
            }
        }, 3000);
        this.gameInterval = setInterval(() => {
            this.update();
        }, 150);
    },
    stop() {
        clearInterval(this.gameInterval);
        clearInterval(this.bombInterval);
        this.sounds.bomb.play();
        this.sounds.theme.pause();
        // alert("Игра завершена");
        // window.location.reload();
    },
    update() {
        window.requestAnimationFrame(() => {
            this.snake.move();
            this.render();
        });
    },
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
		this.ctx.fillText('Score: ' + this.score, 30, 30);
        this.board.render();
        this.snake.render();
    },
    onSnakeStart() {
        this.sounds.theme.loop = true;
        this.sounds.theme.play();
    },
    onSnakeEat() {
        ++this.score;
        this.sounds.food.play();
        this.board.createFood();
    },
};

window.addEventListener("load", () => {
    game.start();
});
