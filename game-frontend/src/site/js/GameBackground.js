"use strict";
exports.__esModule = true;
var Point_1 = require("./Point");
/**
 * Represents, and is responsible for the background of the game screen as well as the world border.
 */
var GameBackground = (function () {
    /**
     * Creates a new GameBackground object
     * @param viewWidth The width of the viewport
     * @param viewHeight The height of the viewport
     * @param worldWidth The width of the world itself.
     * @param worldHeight The height of the world itself.
     * @constructor
     */
    function GameBackground(viewWidth, viewHeight, worldWidth, worldHeight) {
        this.gridSize = 16; //default grid size is 16 pixels
        this.lineThickness = 1;
        this.borderThickness = 4;
        this.borderColor = "#000000";
        this.gridColor = "#a8a8a8";
        this.player = null;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    /**
     * Links a player to the background. The player is what determines the relative positioning of the background.
     * @param player
     */
    GameBackground.prototype.linkPlayer = function (player) {
        this.player = player;
    };
    GameBackground.prototype.draw = function (context, screenOrigin) {
        var playerX = 0;
        var playerY = 0;
        if (this.player !== null) {
            playerX = this.player.getXPosition();
            playerY = this.player.getYPosition();
        }
        context.fillStyle = this.gridColor;
        context.lineWidth = this.lineThickness;
        this.drawVerticalLines(context, playerX); //draw vertical grid lines
        this.drawHorizontalLines(context, playerY); //draw horizontal grid lines
        this.drawBorder(context, playerX, playerY); //draw visible parts of border
    };
    GameBackground.prototype.drawVerticalLines = function (context, playerX) {
        //determine horizontal offset of first vertical line
        var offset = this.gridSize % (playerX / (this.worldWidth / this.viewWidth));
        context.beginPath();
        for (var xPos = offset; xPos < this.viewWidth; xPos += this.gridSize) {
            context.moveTo(xPos, 0);
            context.lineTo(xPos, this.viewHeight);
            context.stroke();
        }
        context.closePath();
        //might have to move begin and close path inside loop.
        //might be able to move stroke outside loop before closePath
    };
    GameBackground.prototype.drawHorizontalLines = function (context, playerY) {
        //determine vertical offset of first horizontal line
        var offset = this.gridSize % (playerY / (this.worldHeight / this.viewHeight));
        context.beginPath();
        for (var yPos = offset; yPos < this.viewHeight; yPos += this.gridSize) {
            context.moveTo(0, yPos);
            context.lineTo(this.viewWidth, yPos);
            context.stroke();
        }
        context.closePath();
        //might have to move begin and close path inside loop.
        //might be able to move stroke outside loop before closePath
    };
    GameBackground.prototype.drawBorder = function (context, playerX, playerY) {
        var centerScreen = new Point_1.Point(this.viewWidth / 2, this.viewHeight / 2);
        //convert world-space coordinates of border corners into screen-space coordinates
        var upperLeft = new Point_1.Point(centerScreen.getX() - playerX, centerScreen.getY() - playerY);
        var upperRight = new Point_1.Point(centerScreen.getX() + (this.worldWidth - playerX), centerScreen.getY() - playerY);
        var lowerLeft = new Point_1.Point(centerScreen.getX() - playerX, centerScreen.getY() + (this.worldHeight - playerY));
        var lowerRight = new Point_1.Point(centerScreen.getX() + (this.worldWidth - playerX), centerScreen.getY() + (this.worldHeight - playerY));
        //for each screen side, determine if part of border can be seen
        context.fillStyle = this.borderColor;
        context.lineWidth = this.borderThickness;
        context.beginPath();
        //top line
        if (upperLeft.getY() > 0 && upperLeft.getY() < this.viewHeight) {
            context.moveTo(upperLeft.getX(), upperLeft.getY());
            context.lineTo(upperRight.getX(), upperRight.getY());
        }
        //right line
        if (upperRight.getX() > 0 && upperRight.getX() < this.viewWidth) {
            context.moveTo(upperRight.getX(), upperRight.getY());
            context.lineTo(lowerRight.getX(), lowerRight.getY());
        }
        //bottom line
        if (lowerLeft.getY() > 0 && lowerLeft.getY() < this.viewHeight) {
            context.moveTo(lowerRight.getX(), lowerRight.getY());
            context.lineTo(lowerLeft.getX(), lowerLeft.getY());
        }
        //left line
        if (upperLeft.getX() > 0 && upperLeft.getX() < this.viewWidth) {
            context.moveTo(lowerLeft.getX(), lowerLeft.getY());
            context.lineTo(upperLeft.getX(), upperLeft.getY());
        }
        context.stroke();
        context.closePath();
    };
    return GameBackground;
}());
exports.GameBackground = GameBackground;
//# sourceMappingURL=GameBackground.js.map