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

    private moveUp: boolean;
    private moveDown: boolean;
    private moveLeft: boolean;
    private moveRight: boolean;
    private shooting: boolean;
    private transformedPoints: Point[] = [];

    constructor(parent: GameEntity, x: number = 0, y: number = 0, angle: number = 0, username: string) {
        super(username);
        this.setAngle(angle);
        this.setPosition(x, y);
        this.setParentEntity(parent);

        for(let i = 0; i < ClientPlayer.points.length; i++) {
            this.transformedPoints[i] = new Point();
        }
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
        this.preparePoints(); //generate the points themselves
        this.rotatePoints(); //rotate the generated points around the origin
        this.transformPoints(context.canvas.width/2, context.canvas.height/2); //shift the points to the center of the screen

        //draw the main ship body
        context.fillStyle = ClientPlayer.fillColor1;
        this.fillPolygon(context, ClientPlayer.polyfill1_ind);
        context.fillStyle = ClientPlayer.fillColor2;
        this.fillPolygon(context, ClientPlayer.polyfill2_ind);
        this.fillPolygon(context, ClientPlayer.polyfill3_ind);

        //prepare to draw the background outline
        context.strokeStyle = ClientPlayer.secondaryLineColor;
        context.lineJoin = ClientPlayer.outlineJoins;
        context.lineWidth = ClientPlayer.outlineWidth + 4;
        context.globalAlpha = 0.3;
        context.lineCap = ClientPlayer.outlineEndcaps;

        //draw background lines
        this.linePolygon(context, ClientPlayer.outline1_ind);
        this.linePolygon(context, ClientPlayer.outline2_ind);

        //prepare to draw the foreground outline
        context.globalAlpha = 1.0;
        context.lineWidth = ClientPlayer.outlineWidth;
        context.strokeStyle = ClientPlayer.lineColor;

        //draw foreground outline
        this.linePolygon(context, ClientPlayer.outline1_ind);
        this.linePolygon(context, ClientPlayer.outline2_ind);

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

    private rotatePoints(): void {
        let sinAngle: number = Math.sin(this.angles + Math.PI/2.0);
        let cosAngle: number = Math.cos(this.angles + Math.PI/2.0);

        //rotate all of the points around the origin
        //It is assumed the points have not been transformed
        for (let i = 0; i < ClientPlayer.points.length; i++) {
            let p: Point = this.transformedPoints[i];
            let x: number = p.getX();
            let y: number = p.getY();
            p.setX(x*cosAngle - y*sinAngle);
            p.setY(x*sinAngle + y*cosAngle);
        }
    }

    private transformPoints(screenX: number, screenY: number): void {
        for(let i = 0; i < this.transformedPoints.length; i++) {
            this.transformedPoints[i].addX(screenX);
            this.transformedPoints[i].addY(screenY);
        }
    }

    private fillPolygon(context: CanvasRenderingContext2D, indices: number[]): void {
        context.beginPath();
        let p: Point = this.transformedPoints[indices[0]];
        context.moveTo(p.getX(), p.getY());
        for(let i = 1; i < indices.length; i++) {
            p = this.transformedPoints[indices[i]];
            context.lineTo(p.getX(), p.getY());
        }
        context.closePath();
        context.fill();
    }

    private linePolygon(context: CanvasRenderingContext2D, indices: number[]): void {
        context.beginPath();
        let p: Point = this.transformedPoints[indices[0]];
        context.moveTo(p.getX(), p.getY());
        for(let i = 1; i < indices.length; i++) {
            p = this.transformedPoints[indices[i]];
            context.lineTo(p.getX(), p.getY());
        }
        context.stroke();
        context.closePath();
    }
}