"use strict";
exports.__esModule = true;
/**
 * This class represents a simple x,y location
 */
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.setX = function (x) {
        this.x = x;
    };
    Point.prototype.setY = function (y) {
        this.y = y;
    };
    Point.prototype.getX = function () {
        return this.x;
    };
    Point.prototype.getY = function () {
        return this.y;
    };
    Point.prototype.addX = function (x) {
        this.x += x;
    };
    Point.prototype.addY = function (y) {
        this.y += y;
    };
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=Point.js.map