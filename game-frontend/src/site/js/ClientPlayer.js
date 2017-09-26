"use strict";
exports.__esModule = true;
var Point_1 = require("./Point");
var Set_1 = require("typescript-collections/dist/lib/Set");
/**
 * Represents the current player. The avatar being controlled by the user.
 * See OpponentPlayer for the other players.
 */
var ClientPlayer = (function () {
    function ClientPlayer(parent, x, y, angle, username) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (angle === void 0) { angle = 0; }
        this.acceleration = 20;
        this.max_velocity = 50;
        this.position = new Point_1.Point(x, y);
        this.angle = angle;
        this.velocity = new Point_1.Point(0, 0);
        this.parent = parent;
    }
    ClientPlayer.prototype.getUsername = function () {
        return this.username;
    };
    ClientPlayer.prototype.getXPosition = function () {
        return this.position.getX();
    };
    ClientPlayer.prototype.getYPosition = function () {
        return this.position.getY();
    };
    ClientPlayer.prototype.setPosition = function (x, y) {
        this.position.setX(x);
        this.position.setY(y);
    };
    ClientPlayer.prototype.getAngle = function () {
        return this.angle;
    };
    ClientPlayer.prototype.setAngle = function (angle) {
        this.angle = angle;
    };
    ClientPlayer.prototype.aimAtMouse = function (mouseX, mouseY) {
        //TODO: Aim player towards mouse (phase 2)
    };
    ClientPlayer.prototype.setMoveUp = function (up) {
        this.moveUp = up;
    };
    ClientPlayer.prototype.setMoveDown = function (down) {
        this.moveDown = down;
    };
    ClientPlayer.prototype.setMoveLeft = function (left) {
        this.moveLeft = left;
    };
    ClientPlayer.prototype.setMoveRight = function (right) {
        this.moveRight = right;
    };
    ClientPlayer.prototype.getChildEntities = function () {
        return new Set_1["default"]();
    };
    ClientPlayer.prototype.getParentEntity = function () {
        return this.parent;
    };
    ClientPlayer.prototype.draw = function (context, screenOrigin) {
        //the current player is simply drawn in the center of the screen always. Never elsewhere
        //other players will be drawn in the proper position.
        //draw a red circle
        //in phase 2 draw an image
        context.beginPath();
        context.arc(context.canvas.width / 2, context.canvas.height / 2, 32, 0, 2 * Math.PI, false);
        context.fillStyle = "green";
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = "#003300";
        context.stroke();
        context.closePath();
    };
    ClientPlayer.prototype.update = function (elapsedTime) {
        var fracSecond = elapsedTime / 1000.0;
        this.updateVelocity(fracSecond);
        this.capVelocity();
        this.updatePosition(fracSecond);
        this.handleBorderCollision();
    };
    ClientPlayer.prototype.updateVelocity = function (fracSecond) {
        //calculate partial second acceleration
        var accel = this.acceleration * fracSecond;
        //update velocity
        if (this.moveUp) {
            this.velocity.addY(-accel);
        }
        else if (this.moveDown) {
            this.velocity.addY(accel);
        }
        else {
            if (this.velocity.getY() < 0) {
                this.velocity.addY(this.acceleration);
            }
            else if (this.velocity.getY() > 0) {
                this.velocity.addY(-this.acceleration);
            }
        }
        if (this.moveLeft) {
            this.velocity.addX(-accel);
        }
        else if (this.moveRight) {
            this.velocity.addX(accel);
        }
        else {
            if (this.velocity.getX() < 0) {
                this.velocity.addX(this.acceleration);
            }
            else if (this.velocity.getX() > 0) {
                this.velocity.addX(-this.acceleration);
            }
        }
    };
    ClientPlayer.prototype.capVelocity = function () {
        //cap velocity
        if (this.velocity.getX() > this.max_velocity) {
            this.velocity.setX(this.max_velocity);
        }
        else if (this.velocity.getX() < -this.max_velocity) {
            this.velocity.setX(-this.max_velocity);
        }
        if (this.velocity.getY() > this.max_velocity) {
            this.velocity.setY(this.max_velocity);
        }
        else if (this.velocity.getY() < -this.max_velocity) {
            this.velocity.setY(-this.max_velocity);
        }
    };
    ClientPlayer.prototype.updatePosition = function (fracSecond) {
        //update position
        this.position.addX(this.velocity.getX() * fracSecond);
        this.position.addY(this.velocity.getY() * fracSecond);
    };
    ClientPlayer.prototype.handleBorderCollision = function () {
        //TODO: Handle collisions with the world border (blocked phase 1)
    };
    return ClientPlayer;
}());
exports.ClientPlayer = ClientPlayer;
//# sourceMappingURL=ClientPlayer.js.map