class GameObject {
    constructor(context, x, y, width, height, fillStyle, strokeStyle) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.movement = [0, 0];
        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.collisionSides = [false, false, false, false];
        this.collisions = []; //[topDiff, rightDiff, bottomDiff, leftDiff]
    }

    draw() {
        this.context.fillStyle = this.fillStyle;
        this.context.beginPath();
        this.context.fillRect(this.x, this.context.canvas.height - this.y - this.height, this.width, this.height);
        this.context.fill();

        this.context.strokeStyle = this.strokeStyle;
        this.context.beginPath();
        this.context.rect(this.x, this.context.canvas.height - this.y - this.height, this.width, this.height);
        this.context.stroke();
    }

    move(xOffset, yOffset) {
        this.movement[0] += xOffset;
        this.movement[1] += yOffset;
        this.x += xOffset;
        this.y += yOffset;
    }

    //bug: noclip still possible if moving fast enough
    checkCollision(gameObject) {
        var x2 = this.x + this.width;
        var y2 = this.y + this.height;
        var gameObjectX2 = gameObject.x + gameObject.width;
        var gameObjectY2 = gameObject.y + gameObject.height;
        var topDiff = y2 - gameObject.y;
        var rightDiff = x2 - gameObject.x;
        var bottomDiff = gameObjectY2 - this.y;
        var leftDiff = gameObjectX2 - this.x;
        if (topDiff > 0 && rightDiff > 0 && bottomDiff > 0 && leftDiff > 0) {
            var arr = [topDiff, rightDiff, bottomDiff, leftDiff];
            this.collisions.push(arr);
            var minI = 0;
            for (var i = 1; i < arr.length; i++) {
                if (arr[i] < arr[minI]) { minI = i; }
            }
            this.collisionSides[minI] = true;
        }
    }
}