class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.context = canvas.getContext('2d');
        //put objects in right order of z-index.
        this.objects = [];
        this.background = new GameObject(this.context, -1000, -1000, 4000, 4000, 'white', 'white');
        this.player = new GameObject(this.context, this.canvas.width / 2, this.canvas.height / 2, 50, 50, 'red', 'black');
        this.setFPS(200);
        this.keys = {
        };
        this.controls = {
            keyDown: {
                'KeyA': this.moveLeft,
                'KeyD': this.moveRight,
                'KeyS': this.fall,
                'ControlLeft': this.crouch,
                'Space': this.jump
            },
            keyUp: {
                'ControlLeft': this.unCrouch
            }
        };
        this.animations = [];
        this.newAnimation(this, 'jump', 50, function (game) { game.player.move(0, 4); });
        this.newAnimation(this, 'fall', 1, function (game) { game.player.move(0, -4); });

        this.loadControls(this);
        this.setPollingRate(1000);
        this.bottom = -1000;
        this.spawn = [this.canvas.width / 2, this.canvas.height / 2, 0];
    }

    draw(game) {
        game.background.draw();
        game.objects.forEach(obj => obj.draw());
        game.player.draw();
    }

    setFPS(fps) {
        this.fps = fps;
        this.drawDelay = 1000 / fps;
        if (this.drawInterval != false) {
            clearInterval(this.drawInterval);
            this.drawInterval = setInterval(this.draw, this.drawDelay, this);
        }
    }

    loadControls(game) {
        onkeydown = function (evt) {
            evt.preventDefault();
            game.keys[evt.code] = true;
        };
        onkeyup = function (evt) {
            evt.preventDefault();
            game.keys[evt.code] = false;
        };
    }

    movement(game) {
        game.player.movement = [0, 0];
        Object.keys(game.controls['keyDown']).forEach(function (key) {
            if (game.controls['keyDown'][key]) {
                if (game.keys[key]) {
                    game.controls['keyDown'][key](game);
                }
            }
        });
        Object.keys(game.controls['keyUp']).forEach(function (key) {
            if (game.controls['keyUp'][key]) {
                if (game.keys[key] == false) {
                    game.controls['keyUp'][key](game);
                }
            }
        });
        Object.keys(game.animations).forEach(function (key) {
            if (game.animations[key][0] >= 0) {
                game.animations[key][0]++;
                game.animations[key][2](game);
                if (game.animations[key][0] == game.animations[key][1]) {
                    game.stopAnimation(game, key);
                }
            }
        });
        game.player.collisionSides = [false, false, false, false];
        game.player.collisions = [];
        game.objects.forEach(function (gameObject) {
            game.player.checkCollision(gameObject);
        });

        game.gravity(game);
        game.centerPlayer(game);
        if (game.player.y < game.bottom) {
            game.respawn(game);
        }
    }

    setPollingRate(pollingRate) {
        this.pollingRate = pollingRate;
        this.movementDelay = 1000 / pollingRate;
    }

    start() {
        this.draw(this);
        this.drawInterval = setInterval(this.draw, this.drawDelay, this);
        this.movementInterval = setInterval(this.movement, this.movementDelay, this);
    }

    quit() {
        clearInterval(this.drawInterval);
        clearInterval(this.movementInterval);
    }

    newAnimation(game, name, end, animation) {
        game.animations[name] = [-1, end, animation];
    }

    startAnimation(game, name) {
        game.animations[name][0] = 0;
    }

    stopAnimation(game, name) {
        game.animations[name][0] = -1;
    }

    jump(game) {
        if (game.animations['jump'][0] == -1 && game.player.collisionSides[2]) {
            game.startAnimation(game, 'jump');
        }
    }

    fall(game) {
        if (game.animations['fall'][0] == -1 && game.player.collisionSides[2] && game.animations['jump'][0] == -1) {
            game.startAnimation(game, 'fall');
        }
    }

    moveLeft(game) {
        if (!game.player.collisionSides[3]) {
            game.player.move(-3, 0);
        }
    }

    moveRight(game) {
        if (!game.player.collisionSides[1]) {
            game.player.move(3, 0);
        }
    }

    crouch(game) {
        game.player.height = 25;
    }

    unCrouch(game) {
        game.player.height = 50;
    }

    gravity(game) {
        if (game.animations['jump'][0] == -1 && !game.player.collisionSides[2]) {
            game.player.move(0, -4);
            game.player.collisionSides = [false, false, false, false];
            game.player.collisions = [];
            game.objects.forEach(function (gameObject) {
                game.player.checkCollision(gameObject);
            });
            if (game.player.collisionSides[2]) {
                game.player.move(0, 3);
            }
        }
    }

    centerPlayer(game) {
        var transform = game.context.getTransform();
        transform['e'] = game.canvas.width / 2 - game.player.x;
        if (game.player.y < 50) {
            transform['f'] = game.player.y - 50;
        }
        else if (game.player.y > game.canvas.height - 100) {
            transform['f'] = game.player.y - game.canvas.height + 100;
        }
        else {
            transform['f'] = 0;
        }
        game.context.setTransform(transform);
    }

    respawn(game) {
        game.player.x = game.spawn[0];
        game.player.y = game.spawn[1];
    }
}