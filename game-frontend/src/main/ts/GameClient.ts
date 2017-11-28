///<reference path="./GameEntity.ts"/>
///<reference path="./ClientPlayer.ts"/>
///<reference path="./SimpleRenderer.ts"/>
///<reference path="./GameBackground.ts"/>
///<reference path="./collections/Set.ts"/>
///<reference path="./OpponentPlayer.ts"/>
///<reference path="./VirusNpc.ts"/>
///<reference path="./InfectedNpc.ts"/>
///<reference path="./BlackHoleNpc.ts"/>
///<reference path="./networked/ServerPlayerUpdate.ts"/>
///<reference path="./networked/ClientInputStateUpdate.ts"/>
///<reference path="./networked/PlayerListChange.ts"/>
///<reference path="./networked/InitialPlayerList.ts"/>
///<reference path="./networked/PointsUpdate.ts"/>
///<reference path="./networked/PlayerHealthMessage.ts"/>
///<reference path="./networked/HighscoreInfo.ts"/>
///<reference path="./Bullet.ts"/>
///<reference path="./GameUI.ts"/>

/**
 * This class is the base class to the game client itself.
 * This class ultimately contains everything.
 */
class GameClient extends GameEntity {
    static FRAMES_PER_SECOND: number = 60;
    static TIME_PER_FRAME: number = 1000.0 / GameClient.FRAMES_PER_SECOND;

    //keep these the same as the server. Might have server send message to client with these values in future
    private worldWidth: number = 8000;
    private worldHeight: number = 8000;

    private gameUI: GameUI;
    private canvas: HTMLCanvasElement;
    private connection: WebSocket;
    private player: ClientPlayer;
    private entities: Set<GameEntity> = new Set();
    private renderer: SimpleRenderer;
    private playing: boolean = true;
    private username: string;
    private authenticationString: string;
    private background: GameBackground;
    private numFrames: number = 0;
    private lagCompensator: LagCompensator = new LagCompensator(30);
    private playerId: number;

    /**
     * Creates a new GameClient instance.
     * @param canvas A reference to the canvas element to render to.
     * @param connection An established connection to the server.
     * @param Username of the player
     */
    constructor(canvas: HTMLCanvasElement, connection: WebSocket, username: string, playerId: number, authenticationString: string) {
        super();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvas = canvas;
        this.connection = connection;
        this.username = username;
        this.authenticationString = authenticationString;
        this.background = new GameBackground(this.canvas.width, this.canvas.height, 2000, 2000);
        this.gameUI = new GameUI(this.canvas.width, this.canvas.height);
        this.playerId = playerId;
        this.init();
    }

    public getParentEntity(): GameEntity {
        return null; //GameClient has no parent. It IS the container.
    }

    public getChildEntities(): Set<GameEntity> {
        return this.entities;
    }

    private frameStart: number;
    public run = (): void => {
        this.frameStart = Date.now();
        this.execGameFrame();
    }

    private execGameFrame = (): void => {
        let frameEnd: number = Date.now();
        let elapsedTime: number = frameEnd - this.frameStart;
        this.frameStart = frameEnd;

        if (this.windowResized()) {
            this.resizeGameArea();
        }

        this.updateGame(elapsedTime);
        this.render();

        //Once every 4 frames send the current state of the client input to the server
        if(this.numFrames % 4 === 0) {
            this.sendInputState();
        }
        if(this.numFrames % GameClient.FRAMES_PER_SECOND == 0) {//every 60 frames/once per second
            this.connection.send("PING:" + Date.now());
        }
        this.numFrames++;

        //30 fps is 33 milliseconds per frame
        //if frame took less than 34 millis to complete then waitout the remaining time
        elapsedTime = Date.now() - this.frameStart;
        let waitTime: number = GameClient.TIME_PER_FRAME - elapsedTime;

        if(waitTime < 0) {
            waitTime = 0;
        }

        //wait out the remainder to limit frame rate to 30 fps
        setTimeout(this.execGameFrame, waitTime);
    }

    public updateGame(elapsedTime: number): void {
        //update current player
        this.player.update(elapsedTime);

        //update entities
        for(let i = 0; i < this.entities.length; i++) {
            this.entities.get(i).update(elapsedTime);
        }
    }

    private windowResized(): boolean {
        if ((this.canvas.width !== window.innerWidth) || (this.canvas.height !== window.innerHeight)) {
            return true;
        }
        else {
            return false;
        }
    }

    private resizeGameArea(): void {
        // Resize the canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Update the viewable area of background
        this.background.setViewWidth(this.canvas.width);
        this.background.setViewHeight(this.canvas.height);
    }

    private render(): void {
        //this might be all that has to be done. Maybe.
        let sx = this.player.getXPosition() - this.canvas.width/2;
        let sy = this.player.getYPosition() - this.canvas.height/2;
        this.renderer.updateScreenOrigin(new Point(sx, sy));
        this.renderer.draw();
    }

    private sendInputState(): void {
        let state: ClientInputStateUpdate = new ClientInputStateUpdate();
        state.movingDown = this.player.getMovingDown();
        state.movingUp = this.player.getMovingUp();
        state.movingLeft = this.player.getMovingLeft();
        state.movingRight = this.player.getMovingRight();
        state.angle = this.player.getAngle();
        state.shooting = this.player.isShooting();
        state.username = this.player.getUsername();
        state.authString = this.authenticationString;

        this.connection.send("ClientInputStateUpdate:" + JSON.stringify(state));
    }

    /**
     * All steps to initialize the client game go here
     */
    private init(): void {
        this.initPlayer();
        this.initRenderer();
        this.initSocketListeners()
        this.initInput();
    }

    private initPlayer(): void {
        this.background = new GameBackground(this.canvas.width, this.canvas.height, this.worldWidth, this.worldHeight);
        let message: EntityMessage = new EntityMessage();
        message.username = this.username;
        message.entityId = this.playerId;
        this.player = new ClientPlayer();
        this.player.receiveMessage(message);
        this.player.setEntityId(this.playerId);
        this.player.setParentEntity(this);
        this.background.linkPlayer(this.player);
        this.gameUI = new GameUI(this.canvas.width, this.canvas.height);
        this.gameUI.linkPlayer(this.player);
    }

    private initInput(): void {
        document.addEventListener("keydown", this.handleKeyDownInput);
        document.addEventListener("keyup", this.handleKeyUpInput);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mousemove", this.handleMouseMove);
    }

    private initRenderer(): void {
        this.renderer = new SimpleRenderer(this.canvas.getContext("2d"));
        //reminder, renderer stores elements in a set which acts like an arraylist
        //items will be rendered in the order in which they are added.
        //consequently, the background object needs to be the first thing added as it will then be rendered before anything else
        this.renderer.addRenderable(this.background);
        this.renderer.addRenderable(this.player);
        this.renderer.addRenderable(this.gameUI);
    }

    private initSocketListeners(): void {
        this.connection.onerror = (event: ErrorEvent) => {
            this.handleConnectionError(event.message);
        }

        this.connection.onmessage = (event: MessageEvent) => {
            this.handleMessageFromServer(event.data);
        }
    }

    private handleConnectionError = (message: string) => {
        this.playing = false;
        //TODO: Display join screen and a connection error string
    }

    private handleMessageFromServer(message: string): void {
        let object = null;
        //message contains a game entity update
        if((object = EntityMessage.parseArray(message)) !== null) {
            let messages: EntityMessage[] = object as EntityMessage[];
            for(let i = 0; i < messages.length; i++) {
                let msg: EntityMessage = messages[i];
                this.handleEntityMessage(msg);
            }
        }
        else if((object = EntityMessage.parseObject(message)) !== null) {
            let msg: EntityMessage = object as EntityMessage;
            this.handleEntityMessage(msg);
        }
        //message is a ping response
        else if(message.substring(0, 5) === "PING:") {
            let time: number = parseInt(message.substring(5));
            let latency: number = Math.floor((Date.now() - time) / 2);
            if(latency < this.lagCompensator.getLatency()) {
                this.lagCompensator.setLatency(latency);
            }
            else {
                this.lagCompensator.setLatency(latency);
            }
        }
        //message is a server ping
        else if(message.substring(0, 5) === "SPING") {
            //if message is modified in any way when the server sends an SPING message,
            //then the server will reject it as it could be a sign of cheating.
            this.connection.send(message);
        }
        //message is a high score update
        else if((object = HighscoreInfo.getValidObjectFromJson(message)) !== null) {
            let high_scores: HighscoreInfo = object as HighscoreInfo;
            let usernames: string[] = high_scores.players;
            let scores: number[] = high_scores.scores;
            let players: Set<Player> = new Set<Player>();
            for(let i = 0; i < usernames.length; i++) {
                let p: Player = this.getPlayerByUsername(usernames[i]);
                if(p !== null) {
                    p.setScore(scores[i]);
                    players.add(p);
                }
            }
            this.gameUI.linkLeaderBoardList(players);
        }
    }

    private handleEntityMessage(message: EntityMessage): void {
        let entity: GameEntity = this.getEntityById(message.entityId);

        //handle situations where the game entity is null
        //if the entity is null, but the server said the entity is dead anyways, then ignore
        //if the entity is null, but the server says it exists, then create a new entity
        //and add it to the entity list and renderer
        if(entity === null) {
            if(message.state === EntityMessage.STATE_DEAD) {
                return;
            }
            else {
                entity = this.createGameEntity(message);
                this.entities.add(entity);
                this.renderer.addRenderable(entity as any);
                return;
            }
        }
        else {
            //entity is not null. Remove it if the server says the entity died
            if(message.state === EntityMessage.STATE_DEAD) {
                this.renderer.removeRenderable(entity as any);
                this.entities.remove(entity);

                if(this.player === entity) {
                    this.resetGamePage("You were killed by: " + message.username + "\nScore: " + message.score);
                }
            }
            else {
                //use the lag compensator to update the entity since the entity still exists
                //this.lagCompensator.compensateEntityMessage(entity, message);
                this.lagCompensator.compensateEntityMessage(entity, message);
            }
        }
    }

    private resetGamePage = (message: string) => {
        //TODO: David, reset the game and web page or reload it or something. Hopefully display message to the username input screen
        //in the meantime here is something to refresh the page
        alert(message);
        window.location.reload(true);
    }

    private handleKeyDownInput = (event: KeyboardEvent): void => {
        //cancel default browser action
        event.preventDefault();

        if(event.keyCode == 87) { //w key
            this.player.setMoveUp(true);
        }
        else if(event.keyCode == 83) { //s key
            this.player.setMoveDown(true);
        }
        else if(event.keyCode == 65) { //a key
            this.player.setMoveLeft(true);
        }
        else if(event.keyCode == 68) { //d key
            this.player.setMoveRight(true);
        }
    }

    private handleKeyUpInput = (event: KeyboardEvent): void => {
        //cancel default browser action
        event.preventDefault();

        if(event.keyCode == 87) { //w key
            this.player.setMoveUp(false);
        }
        else if(event.keyCode == 83) { //s key
            this.player.setMoveDown(false);
        }
        else if(event.keyCode == 65) { //a key
            this.player.setMoveLeft(false);
        }
        else if(event.keyCode == 68) { //d key
            this.player.setMoveRight(false);
        }
    }

    private handleMouseDown = (event: MouseEvent): void => {
        if(event.button === 0) {
            this.player.setShooting(true);
        }
    }

    private handleMouseUp = (event: MouseEvent): void => {
        if(event.button === 0) {
            this.player.setShooting(false);
        }
    }

    private handleMouseMove = (event: MouseEvent): void => {
        let deltaX: number = event.clientX - this.canvas.width/2;
        let deltaY: number = event.clientY - this.canvas.height/2;
        let angle: number = Math.atan2(deltaY, deltaX);
        this.player.setAngle(angle);
    }

    private getEntityById(id: number): GameEntity {
        if(this.player.getEntityId() === id) {
            return this.player;
        }

        let length: number = this.entities.length;
        for(let i = 0; i < length; i++) {
            let e: GameEntity = this.entities.get(i);
            if(typeof e === 'undefined') {
                continue;
            }
            if(e.getEntityId() === id) {
                return e;
            }
        }

        return null;
    }

    private getPlayerByUsername(username: string): Player {
        if(this.player.getUsername() === username) {
            return this.player;
        }

        for(let i = 0; i < this.entities.length; i++) {
            let e: GameEntity = this.entities.get(i);
            if(e instanceof Player) {
                let p: Player = e as Player;
                if(p.getUsername() === username) {
                    return p;
                }
            }
        }
        return null;
    }

    private createGameEntity(message: EntityMessage): GameEntity {
        let entity: GameEntity = null;
        if(message.type === "Player") {
            entity = new OpponentPlayer();
        }
        else if(message.type === "DefaultBullet") {
            let bullet: DefaultBullet = new DefaultBullet();
            if(message.owner === this.player.getUsername()) {
                bullet.setFillColor("#a8ff96");
            }
            entity = bullet;
        }
        else if(message.type === "RailBullet") {
            let bullet: RailBullet = new RailBullet();
            if(message.owner === this.player.getUsername()) {
                bullet.setFillColor("#a8ff96");
            }
            entity = bullet;
        }
        else if(message.type === "InfectedNpc") {
            entity = new InfectedNpc();
        }
        else if(message.type === "VirusNpc") {
            entity = new VirusNpc();
        }
        else if(message.type === "BlackHoleNpc"){
            entity = new BlackHoleNpc();
        }
        else {
            console.log("Bad Type: " + message.type);
            return null;
        }

        entity.setEntityId(message.entityId);
        this.lagCompensator.compensateEntityMessage(entity, message);

        return entity;
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {}
}