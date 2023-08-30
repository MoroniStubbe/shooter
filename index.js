var game = new Game('canvas');
game.objects = [
    new GameObject(game.context, 0, 50, game.canvas.width, 10, 'blue', 'black'),
    new GameObject(game.context, 0, 150, 100, 10, 'green', 'black'),
    new GameObject(game.context, 200, 250, 100, 10, 'green', 'black'),
    new GameObject(game.context, 400, 350, 100, 10, 'green', 'black'),
];
game.start();