"use strict";
exports.__esModule = true;
var Set_1 = require("typescript-collections/dist/lib/Set");
var Point_1 = require("./Point");
/**
 * A simple 2D renderer class.
 */
var SimpleRenderer = (function () {
    function SimpleRenderer(context) {
        this.renderingContext = context;
        this.screenOrigin = new Point_1.Point();
        this.elements = new Set_1["default"]();
    }

    SimpleRenderer.prototype.addRenderable = function (element) {
        this.elements.add(element);
    };
    SimpleRenderer.prototype.removeRenderable = function (element) {
        return this.elements.remove(element);
    };
    SimpleRenderer.prototype.updateScreenOrigin = function (screenOrigin) {
        this.screenOrigin = screenOrigin;
    };
    SimpleRenderer.prototype.draw = function () {
        for (var index = 0; index < this.elements.size(); index++) {
            this.elements[index].draw(this.renderingContext, this.screenOrigin);
        }
    };
    return SimpleRenderer;
}());
exports.SimpleRenderer = SimpleRenderer;
//# sourceMappingURL=SimpleRenderer.js.map