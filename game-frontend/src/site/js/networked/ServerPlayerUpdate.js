"use strict";
exports.__esModule = true;
/**
 * Represents an update about a player from the server.
 */
var Point_1 = require("../Point");
var ServerPlayerUpdate = (function () {
    function ServerPlayerUpdate() {
    }

    //TODO: Phase 2 uncomment the following fields
    //private accelX: number;
    //private accelY: number;
    //private velX: number;
    //private velY: number;
    ServerPlayerUpdate.prototype.getPosition = function () {
        return new Point_1.Point(this.posX, this.posY);
    };
    ServerPlayerUpdate.prototype.getPlayerName = function () {
        return this.playerName;
    };
    return ServerPlayerUpdate;
}());
exports.ServerPlayerUpdate = ServerPlayerUpdate;
//# sourceMappingURL=ServerPlayerUpdate.js.map