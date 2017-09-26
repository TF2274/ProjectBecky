"use strict";
exports.__esModule = true;
var SimpleRenderer_1 = require("./SimpleRenderer");
var ClientPlayer_1 = require("./ClientPlayer");
var GameBackground_1 = require("./GameBackground");
var Set_1 = require("typescript-collections/dist/lib/Set");
var InputStateChange_1 = require("./networked/InputStateChange");
/**
 * This class is the base class to the game client itself.
 * This class ultimately contains everything.
 */
var GameClient = (function () {
    /**
     * Creates a new GameClient instance.
     * @param canvas A reference to the canvas element to render to.
     * @param connection An established connection to the server.
     * @param Username of the player
     */
    function GameClient(canvas, connection, username, authenticationString) {
        //keep these the same as the server. Might have server send message to client with these values in future
        this.worldWidth = 10000;
        this.worldHeight = 10000;
        this.playing = true;
        this.canvas = canvas;
        this.connection = connection;
        this.username = username;
        this.authenticationString = authenticationString;
        this.init();
    }
    GameClient.prototype.getParentEntity = function () {
        return null; //GameClient has no parent. It IS the container.
    };
    GameClient.prototype.getChildEntities = function () {
        var entities = new Set_1["default"]();
        entities.add(this.player);
        for (var i = 0; i < this.opponents.size(); i++) {
            entities.add(this.opponents[i]);
        }
        return entities;
    };
    GameClient.prototype.run = function () {
        this.frameStart = this.currentTimeMillis();
        this.execGameFrame();
    };
    GameClient.prototype.execGameFrame = function () {
        var frameEnd = this.currentTimeMillis();
        var elapsedTime = frameEnd - this.frameStart;
        this.frameStart = frameEnd;
        this.update(elapsedTime);
        this.draw();
        //30 fps is 33 milliseconds per frame
        //if frame took less than 34 millis to complete then waitout the remaining time
        var waitTime = 34 - elapsedTime;
        if (waitTime < 0) {
            waitTime = 0;
        }
        //wait out the remainder to limit frame rate to 30 fps
        setTimeout(this.execGameFrame, waitTime);
    };
    GameClient.prototype.update = function (elapsedTime) {
        //update current player
        this.player.update(elapsedTime);
        //update opponent player
        for (var i = 0; i < this.opponents.size(); i++) {
            this.opponents[i].update(elapsedTime);
        }
    };
    GameClient.prototype.draw = function () {
        //this might be all that has to be done. Maybe.
        this.renderer.draw();
    };
    /**
     * All steps to initialize the client game go here
     */
    GameClient.prototype.init = function () {
        this.initPlayer();
        this.initRenderer();
        this.initSocketListeners();
        this.initInput();
    };
    GameClient.prototype.currentTimeMillis = function () {
        return performance.now() || Date.now();
    };
    GameClient.prototype.initPlayer = function () {
        this.background = new GameBackground_1.GameBackground(this.canvas.width, this.canvas.height, this.worldWidth, this.worldHeight);
        this.player = new ClientPlayer_1.ClientPlayer(this, 0, 0, 0, this.username);
    };
    GameClient.prototype.initInput = function () {
        document.addEventListener("keydown", this.handleKeyDownInput);
        document.addEventListener("keyup", this.handleKeyUpInput);
    };
    GameClient.prototype.initRenderer = function () {
        this.renderer = new SimpleRenderer_1.SimpleRenderer(this.canvas.getContext("2d"));
        //reminder, renderer stores elements in a set which acts like an arraylist
        //items will be rendered in the order in which they are added.
        //consequently, the background object needs to be the first thing added as it will then be rendered before anything else
        this.renderer.addRenderable(this.background);
        this.renderer.addRenderable(this.player);
    };
    GameClient.prototype.initSocketListeners = function () {
        var _this = this;
        this.connection.onerror = function (event) {
            _this.handleConnectionError(event.message);
        };
        this.connection.onmessage = function (event) {
            _this.handleMessageFromServer(event.data);
        };
    };
    GameClient.prototype.handleConnectionError = function (message) {
        this.playing = false;
        console.log(message);
    };
    GameClient.prototype.handleMessageFromServer = function (message) {
        //TODO: Handle messages from server
    };
    GameClient.prototype.handleKeyDownInput = function (event) {
        var meHandleIt = false;
        var changeType = "w";
        if (event.keyCode == 87) {
            meHandleIt = true;
            changeType = "w";
            this.player.setMoveUp(true);
        }
        else if (event.keyCode == 83) {
            meHandleIt = true;
            changeType = "s";
            this.player.setMoveDown(true);
        }
        else if (event.keyCode == 65) {
            meHandleIt = true;
            changeType = "a";
            this.player.setMoveLeft(true);
        }
        else if (event.keyCode == 68) {
            meHandleIt = true;
            changeType = "d";
            this.player.setMoveRight(true);
        }
        if (meHandleIt) {
            //cancel default browser action
            event.preventDefault();
            //generate a state change event
            var stateChange = new InputStateChange_1.InputStateChange();
            stateChange.inputName = changeType;
            stateChange.flag = true;
            stateChange.username = this.username;
            stateChange.authenticationString = this.authenticationString;
            //send that state change event to the server as a json object
            var json = JSON.stringify(stateChange);
            this.connection.send(json);
        }
    };
    GameClient.prototype.handleKeyUpInput = function (event) {
        var meHandleIt = false;
        var changeType = "";
        if (event.keyCode == 87) {
            meHandleIt = true;
            changeType = "w";
            this.player.setMoveUp(false);
        }
        else if (event.keyCode == 83) {
            meHandleIt = true;
            changeType = "s";
            this.player.setMoveDown(false);
        }
        else if (event.keyCode == 65) {
            meHandleIt = true;
            changeType = "a";
            this.player.setMoveLeft(false);
        }
        else if (event.keyCode == 68) {
            meHandleIt = true;
            changeType = "d";
            this.player.setMoveRight(false);
        }
        if (meHandleIt) {
            //cancel default browser action
            event.preventDefault();
            //generate a state change event
            var stateChange = new InputStateChange_1.InputStateChange();
            stateChange.inputName = changeType;
            stateChange.flag = false;
            stateChange.username = this.username;
            stateChange.authenticationString = this.authenticationString;
            //send that state change event to the server as a json object
            var json = JSON.stringify(stateChange);
            this.connection.send(json);
        }
    };
    return GameClient;
}());
exports.GameClient = GameClient;
//# sourceMappingURL=GameClient.js.map