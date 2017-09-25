// Create new websocket connection on join game button clicked

// Websocket creates the message and error listeners

// Send username changed object via a JSON

// message listener recieves a message from server either true or false

// Creates game client on true and destroy the listeners

// If error, display error to the user from the server adn reset everything

//

import {GameClient} from "./GameClient";


class JoinGame {
    private connection: WebSocket;
    private username: string;
    private authenticationString: string;
    private canvas: HTMLCanvasElement;

    constructor(username: string, canvas: HTMLCanvasElement) {
        this.username = username;
        this.canvas = canvas;
        //this.init();
        //this.join();
    }

    public join(): void {
        this.init();
        console.log('Sending join request JSON')
        this.connection.send(JSON.stringify({
            username: this.username,

        }))
    }

    public changeUsername(newName: String): void {
        console.log('Change username requested. Requested username is: ' + newName)
        this.connection.send(JSON.stringify({
            username: newName,

        }));
    }


    /**
     *  Init join game
     */
    private init(): void {
        console.log("Initializing join game...");
        this.initWebSocket();
        this.initSocketListeners();
        console.log("Now listening...");
    }

    private initWebSocket(): void {
        console.log("Creating WebSocket...");
        this.connection = new WebSocket('ws://localhost:3000');

    }

    private initSocketListeners(): void {
        console.log("Creating OnError event listener...");
        this.connection.onerror = (event: ErrorEvent) => {
            this.handleError(event.message);
        }
        console.log("Creating OnMessage event listener...");
        this.connection.onmessage = (event: MessageEvent) => {
            this.handleMessage(event.data);
        }
    }

    private handleError(message: String): void {
        console.log("Error:" + message);

        // Display error to user
        //TODO: Display friendly error to user

        // Close everything
        this.connection.close();

        // Reset
        //TODO: Reset the connection

    }

    private handleMessage(message: String): void {
        console.log("Message received from server: " + message);

        // Start game on true
        if (message == 'true') {
            // Close the listeners
            console.log("Closing listeners...");
            //TODO: Actually close listeners

            // Create the game client
            console.log("Creating game client...");
            let game = new GameClient(this.canvas, this.connection, this.username, this.authenticationString);

        }
        else {
            // Do something on false
            console.log("But why? (╯°□°）╯︵ ┻━┻");
            //TODO: Actually do something
        }

    }


}