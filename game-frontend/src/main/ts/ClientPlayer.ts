///<reference path="./Player.ts"/>
///<reference path="./Updateable.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./collections/Point.ts"/>

/**
 * Represents the current player. The avatar being controlled by the user.
 * See OpponentPlayer for the other players.
 */
class ClientPlayer extends Player implements Renderable {
    static acceleration: number = 1800;
    private static radius: number = 32;

    /**
     * Static information. This is the draw information.
     * @type {[Point,Point,Point,Point,Point,Point]}
     */
    private static points: Point[] = [
        new Point(0, -32),
        new Point(12, -10),
        new Point(32, 32),
        new Point(0, 14),
        new Point(-32, 32),
        new Point(-12, -10)
    ];
    private static polyfill1_ind: number[] = [0, 5, 3, 1];
    private static polyfill2_ind: number[] = [5, 3, 4];
    private static polyfill3_ind: number[] = [3, 1, 2];
    private static outline1_ind: number[] = [0, 1, 2, 3, 4, 5, 0];
    private static outline2_ind: number[] = [5, 3, 1];
    private static outlineWidth: number = 2;
    private static outlineEndcaps: string = "round";
    private static outlineJoins: string = "bevel";
    private static fillColor1: string = "#000000";
    private static fillColor2: string = "#434343";
    private static lineColor: string = "#00FF00";
    private static secondaryLineColor: string = "#00c100";
    private static leftLegTip: number = 4;
    private static rightLegTip: number = 2;
    private static legElongateRatio: number = 5.0 / Player.max_velocity;

    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private shooting: boolean = false;
    private transformedPoints: Point[] = [];
    private vectorDraw: VectorDrawInstance = new VectorDrawInstance();

    constructor() {
        super();

        for(let i = 0; i < ClientPlayer.points.length; i++) {
            this.transformedPoints[i] = new Point();
        }
    }

    public receiveMessage(message: EntityMessage): void {
        //can't just call super.receiveMessage because of angles being set in the GameEntity class.
        //Consequently I have no choice but to do all of it here
        this.score = message.score;
        this.health = message.health;
        this.username = message.username;
        this.xVelocity = message.XVelocity;
        this.yVelocity = message.YVelocity;
        this.xAcceleration = message.XAcceleration;
        this.yAcceleration = message.YAcceleration;
    }

    public getMovingUp = (): boolean => {
        return this.moveUp;
    }

    public getMovingDown = (): boolean => {
        return this.moveDown;
    }

    public getMovingLeft = (): boolean => {
        return this.moveLeft;
    }

    public getMovingRight = (): boolean => {
        return this.moveRight;
    }

    public setMoveUp = (up: boolean): void => {
        this.moveUp = up;
        this.yAcceleration = -ClientPlayer.acceleration;
    }

    public setMoveDown = (down: boolean): void => {
        this.moveDown = down;
        this.yAcceleration = ClientPlayer.acceleration;
    }

    public setMoveLeft = (left: boolean): void => {
        this.moveLeft = left;
        this.xAcceleration = ClientPlayer.acceleration;
    }

    public setMoveRight = (right: boolean): void => {
        this.moveRight = right;
        this.xAcceleration = -ClientPlayer.acceleration;
    }

    public setShooting = (shooting: boolean): void => {
        this.shooting = shooting;
    }

    public isShooting = (): boolean => {
        return this.shooting;
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -ClientPlayer.radius || screenX - canvas.width > ClientPlayer.radius ||
            screenY < -ClientPlayer.radius || screenY - canvas.height > ClientPlayer.radius) {
            return; //off screen, don't draw
        }

        this.preparePoints(); //generate the points themselves
        this.vectorDraw.setLocalSpacePoints(this.transformedPoints);
        this.vectorDraw.translateToWorldSpace(this.xPosition, this.yPosition, this.angles);
        this.vectorDraw.translateToScreenSpace(screenOrigin.getX(), screenOrigin.getY());

        //draw the main ship body
        context.fillStyle = ClientPlayer.fillColor1;
        this.vectorDraw.fill(context, ClientPlayer.polyfill1_ind);
        context.fillStyle = ClientPlayer.fillColor2;
        this.vectorDraw.fill(context, ClientPlayer.polyfill2_ind);
        this.vectorDraw.fill(context, ClientPlayer.polyfill3_ind);

        //prepare to draw the background outline
        context.strokeStyle = ClientPlayer.secondaryLineColor;
        context.lineJoin = ClientPlayer.outlineJoins;
        context.lineWidth = ClientPlayer.outlineWidth + 4;
        context.globalAlpha = 0.3;
        context.lineCap = ClientPlayer.outlineEndcaps;

        //draw background lines
        this.vectorDraw.line(context, ClientPlayer.outline1_ind, false);
        this.vectorDraw.line(context, ClientPlayer.outline2_ind, false);

        //prepare to draw the foreground outline
        context.globalAlpha = 1.0;
        context.lineWidth = ClientPlayer.outlineWidth;
        context.strokeStyle = ClientPlayer.lineColor;

        //draw foreground outline
        this.vectorDraw.line(context, ClientPlayer.outline1_ind, false);
        this.vectorDraw.line(context, ClientPlayer.outline2_ind, false);

        //cleanup settings
        context.lineJoin = "";
        context.lineCap = "";

    }

    private preparePoints(): void {
        //copy over the original positions of the points
        for(let i = 0; i < ClientPlayer.points.length; i++) {
            let src: Point = ClientPlayer.points[i];
            let dest: Point = this.transformedPoints[i];
            dest.setX(src.getX());
            dest.setY(src.getY());
        }

        //set the leg points
        let leftLegPoint: Point = this.transformedPoints[ClientPlayer.leftLegTip];
        let rightLegPoint: Point = this.transformedPoints[ClientPlayer.rightLegTip];
        let legElongateAmount: number = ClientPlayer.legElongateRatio * (Math.abs(this.xVelocity) + Math.abs(this.yVelocity));

        leftLegPoint.addX(legElongateAmount);
        leftLegPoint.addY(legElongateAmount);
        rightLegPoint.addX(-legElongateAmount);
        rightLegPoint.addY(legElongateAmount);
    }
}