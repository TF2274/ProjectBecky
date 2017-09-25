"use strict";
exports.__esModule = true;
var Point_1 = require("./Point");
var Set_1 = require("typescript-collections/dist/lib/Set");
/**
 * Represents another player. Not the player on this client.
 */
var OpponentPlayer = (function () {
    function OpponentPlayer(parent, username) {
        this.position = new Point_1.Point();
        this.username = username;
        this.parent = parent;
    }

    OpponentPlayer.prototype.getUsername = function () {
        return this.username;
    };
    OpponentPlayer.prototype.getXPosition = function () {
        return this.position.getX();
    };
    OpponentPlayer.prototype.getYPosition = function () {
        return this.position.getY();
    };
    OpponentPlayer.prototype.getAngle = function () {
        return this.angle;
    };
    OpponentPlayer.prototype.setAngle = function (angle) {
        this.angle = angle;
    };
    OpponentPlayer.prototype.setPosition = function (x, y) {
        this.position.setX(x);
        this.position.setY(y);
    };
    OpponentPlayer.prototype.getParentEntity = function () {
        return this.parent;
    };
    OpponentPlayer.prototype.getChildEntities = function () {
        return new Set_1["default"]();
    };
    OpponentPlayer.prototype.update = function (elapsedTime) {
        //TODO: Phase 2, lag compensation
    };
    OpponentPlayer.prototype.draw = function (context, screenOrigin) {
        var screenPos = this.getScreenspacePosition(screenOrigin);
        var radius = 32;
        if (screenPos.getX() < -radius || screenPos.getX() > context.canvas.width + radius ||
            screenPos.getY() < -radius || screenPos.getY() > context.canvas.height + radius) {
            return; //no rendering needed because player is outside of renderable screen space
        }
        //draw a red circle
        //in phase 2 draw an image
        context.beginPath();
        context.arc(screenPos.getX(), screenPos.getY(), 32, 0, 2 * Math.PI, false);
        context.fillStyle = "red";
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = "#330000";
        context.stroke();
        context.closePath();
    };
    OpponentPlayer.prototype.getScreenspacePosition = function (screenOrigin) {
        return new Point_1.Point(this.position.getX() - screenOrigin.getX(), this.position.getY() - screenOrigin.getY());
    };
    return OpponentPlayer;
}());
exports.OpponentPlayer = OpponentPlayer;
//# sourceMappingURL=OpponentPlayer.js.map