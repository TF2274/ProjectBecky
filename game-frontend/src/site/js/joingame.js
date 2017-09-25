// Create new websocket connection on join game button clicked
"use strict";
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
        console.log('Sending join request JSON');
        this.connection.send(JSON.stringify({
            username: this.username
        }));
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
        this.connection.onerror = function (event) {
            _this.handleError(event.message);
        };
        console.log("Creating OnMessage event listener...");
        this.connection.onmessage = function (event) {
            _this.handleMessage(event.data);
        };
    };
    JoinGame.prototype.handleError = function (message) {
        console.log("Error:" + message);
        // Display error to user
        //TODO: Display friendly error to user
        // Close everything
        this.connection.close();
        // Reset
        //TODO: Reset the connection
    };
    JoinGame.prototype.handleMessage = function (message) {
        console.log("Message received from server: " + message);
        // Start game on true
        if (message == 'true') {
            // Close the listeners
            console.log("Closing listeners...");
            //TODO: Actually close listeners
            // Create the game client
            console.log("Creating game client...");
            var game = new GameClient_1.GameClient(this.canvas, this.connection, this.username, this.authenticationString);
        }
        else {
            // Do something on false
            console.log("But why? (╯°□°）╯︵ ┻━┻");
            //TODO: Actually do something
        }
    };
    return JoinGame;
}());
//# sourceMappingURL=JoinGame.js.map