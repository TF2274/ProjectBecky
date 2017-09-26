// Create new websocket connection on join game button clicked

// Websocket creates the message and error listeners

// Send username changed object via a JSON

// message listener recieves a message from server either true or false

// Creates game client on true and destroy the listeners

// If error, display error to the user from the server adn reset everything

//

import {GameClient} from "./GameClient";
import {InitialServerJoinState} from "./networked/InitialServerJoinState";
import {ServerUsernameRequestStatus} from "./networked/ServerUsernameRequestStatus";


class JoinGame {
    private connection: WebSocket;
    private username: string;
    private authenticationString: string;
    private canvas: HTMLCanvasElement;
    private initialJoinState: InitialServerJoinState;

    constructor(username: string, canvas: HTMLCanvasElement) {
        this.username = username;
        this.canvas = canvas;
        //this.init();
        //this.join();
    }

    public join(): void {
        this.init();
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
        this.connection.onopen = (event: Event) => {
            this.handleSuccessfulConnection();
        }
        console.log("Creating OnMessage event listener...");
        this.connection.onmessage = (event: MessageEvent) => {
            this.handleMessage(event.data);
        }
    }

    private handleSuccessfulConnection(): void {
        console.log("Successful connection to server!");
    }

    private handleMessage(message: string): void {
        console.log("Message received from server: " + message);

        // Deserialize the initial state object
        let state: InitialServerJoinState = JSON.parse(message);
        if(state == null || state.authenticationString == null || state.initialUsername == null) {
            return;
        }

        this.initialJoinState = state;
        this.connection.onmessage = (event: MessageEvent) => {
            this.handleUsernameMessage(message);
        }
    }

    private handleUsernameMessage(message: string): void {
        console.log("Username message received from server: " + message);

        let username: ServerUsernameRequestStatus = JSON.parse(message);
        if(username == null || username.getMessage() == null || username.getStatus() == null) {
            return;
        }

        if(username.getStatus() === 'failed') {
            this.connection.close();
            //TODO: Display the error string
            console.log(username.getMessage());
            return;
        }

        //create the client and kill the current listener
        this.connection.onmessage = (event: MessageEvent) => {};
        let gameClient: GameClient = new GameClient(this.canvas, this.connection, username.getMessage(), this.initialJoinState.authenticationString);
        gameClient.run();
    }


}