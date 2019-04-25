let game = {
    sprites: {
        background: null,
        cell: null,
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;

        let onResourceLoad = () => {
            ++loaded;
            if (loaded >= required) {
                callback();
            }
        };

        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "img/" + key + ".png";
            this.sprites[key].addEventListener("load", onResourceLoad);
        }
    },
    start: function() {
        let canvas = document.getElementById("mycanvas");
        let ctx = canvas.getContext("2d");

        this.preload(() => {
            window.requestAnimationFrame(() => {
                ctx.drawImage(this.sprites.background, 0, 0);
                ctx.drawImage(this.sprites.cell, 320, 180);
            });
        });
    }
};

game.start();