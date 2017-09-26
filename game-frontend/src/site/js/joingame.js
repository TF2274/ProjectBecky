"use strict";
// Create new websocket connection on join game button clicked
exports.__esModule = true;
// Websocket creates the message and error listeners
// Send username changed object via a JSON
// message listener recieves a message from server either true or false
// Creates game client on true and destroy the listeners
// If error, display error to the user from the server adn reset everything
//
var GameClient_1 = require("./GameClient");
var JoinGame = (function () {
    function JoinGame(username, canvas) {
        this.username = username;
        this.canvas = canvas;
        //this.init();
        //this.join();
    }
    JoinGame.prototype.join = function () {
        this.init();
    };
    JoinGame.prototype.changeUsername = function (newName) {
        console.log('Change username requested. Requested username is: ' + newName);
        this.connection.send(JSON.stringify({
            username: newName
        }));
    };
    /**
     *  Init join game
     */
    JoinGame.prototype.init = function () {
        console.log("Initializing join game...");
        this.initWebSocket();
        this.initSocketListeners();
        console.log("Now listening...");
    };
    JoinGame.prototype.initWebSocket = function () {
        console.log("Creating WebSocket...");
        this.connection = new WebSocket('ws://localhost:3000');
    };
    JoinGame.prototype.initSocketListeners = function () {
        var _this = this;
        console.log("Creating OnError event listener...");
        this.connection.onopen = function (event) {
            _this.handleSuccessfulConnection();
        };
        console.log("Creating OnMessage event listener...");
        this.connection.onmessage = function (event) {
            _this.handleMessage(event.data);
        };
    };
    JoinGame.prototype.handleSuccessfulConnection = function () {
        console.log("Successful connection to server!");
    };
    JoinGame.prototype.handleMessage = function (message) {
        var _this = this;
        console.log("Message received from server: " + message);
        // Deserialize the initial state object
        var state = JSON.parse(message);
        if (state == null || state.authenticationString == null || state.initialUsername == null) {
            return;
        }
        this.initialJoinState = state;
        this.connection.onmessage = function (event) {
            _this.handleUsernameMessage(message);
        };
    };
    JoinGame.prototype.handleUsernameMessage = function (message) {
        console.log("Username message received from server: " + message);
        var username = JSON.parse(message);
        if (username == null || username.getMessage() == null || username.getStatus() == null) {
            return;
        }
        if (username.getStatus() === 'failed') {
            this.connection.close();
            //TODO: Display the error string
            console.log(username.getMessage());
            return;
        }
        //create the client and kill the current listener
        this.connection.onmessage = function (event) { };
        var gameClient = new GameClient_1.GameClient(this.canvas, this.connection, username.getMessage(), this.initialJoinState.authenticationString);
        gameClient.run();
    };
    return JoinGame;
}());
//# sourceMappingURL=JoinGame.js.map