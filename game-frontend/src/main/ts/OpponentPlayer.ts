///<reference path="./Player.ts"/>
///<reference path="./Updateable.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./collections/Point.ts"/>

/**
 * Represents another player. Not the player on this client.
 */
class OpponentPlayer extends Player {
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
    private static lineColor: string = "#FF0000";
    private static secondaryLineColor: string = "#a60000";
    private static leftLegTip: number = 4;
    private static rightLegTip: number = 2;
    private static legElongateRatio: number = 5.0 / ClientPlayer.max_velocity;
    private static radius: number = 32;

    private transformedPoints: Point[] = [];
    private usernameDrawXOffset: number = -1;
    private vectorDraw: VectorDrawInstance = new VectorDrawInstance();

    constructor(parent: GameEntity, username: string) {
        super(username);
        this.parent = parent;

        for(let i = 0; i < OpponentPlayer.points.length; i++) {
            this.transformedPoints[i] = new Point();
        }
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -OpponentPlayer.radius || screenX - canvas.width > OpponentPlayer.radius ||
            screenY < -OpponentPlayer.radius || screenY - canvas.height > OpponentPlayer.radius) {
            return; //off screen, don't draw
        }

        let screenPos: Point = this.getScreenspacePosition(screenOrigin);
        this.preparePoints(); //generate the points themselves
        this.vectorDraw.setLocalSpacePoints(this.transformedPoints);
        this.vectorDraw.translateToWorldSpace(this.xPosition, this.yPosition, this.angles);
        this.vectorDraw.translateToScreenSpace(screenOrigin.getX(), screenOrigin.getY());

        //draw the main ship body
        context.fillStyle = OpponentPlayer.fillColor1;
        this.vectorDraw.fill(context, OpponentPlayer.polyfill1_ind);
        context.fillStyle = OpponentPlayer.fillColor2;
        this.vectorDraw.fill(context, OpponentPlayer.polyfill2_ind);
        this.vectorDraw.fill(context, OpponentPlayer.polyfill3_ind);

        //draw prepare to draw first outline set
        context.strokeStyle = OpponentPlayer.secondaryLineColor;
        context.globalAlpha = 0.3;
        context.lineJoin = OpponentPlayer.outlineJoins;
        context.lineWidth = OpponentPlayer.outlineWidth + 4;
        context.lineCap = OpponentPlayer.outlineEndcaps;

        //draw the first outline set
        this.vectorDraw.line(context, OpponentPlayer.outline1_ind, false);
        this.vectorDraw.line(context, OpponentPlayer.outline2_ind, false);

        //prepare to draw second outline set
        context.globalAlpha = 1.0;
        context.strokeStyle = OpponentPlayer.lineColor;
        context.lineWidth = OpponentPlayer.outlineWidth;

        //draw the second outline set
        this.vectorDraw.line(context, OpponentPlayer.outline1_ind, false);
        this.vectorDraw.line(context, OpponentPlayer.outline2_ind, false);

        context.lineJoin = "";
        context.lineCap = "";

        // Draw the username
        this.drawUsername(context, screenPos);

        // Draw the health bar if health < 100
        if (this.health < 100) {
            this.drawHealthBar(context, screenPos);
        }
    }

    private drawUsername(context: CanvasRenderingContext2D, screenPos: Point): void {
        if(this.usernameDrawXOffset === -1) {
            this.usernameDrawXOffset = context.measureText(this.username).width / 2;
        }

        // Draw the username under player
        context.font = "12px Arial";
        context.fillStyle = "red";
        context.fillText(this.username, screenPos.getX() - this.usernameDrawXOffset, screenPos.getY() + 30);
    }

    private drawHealthBar(context: CanvasRenderingContext2D, screenPos: Point): void {
        // Draw internals of health bar
        context.fillStyle = "green";
        //context.lineWidth = 5;
        context.fillRect(screenPos.getX() - 50, screenPos.getY() - 50, (this.health), 10);
    }

    private getScreenspacePosition(screenOrigin: Point): Point {
        return new Point(this.xPosition - screenOrigin.getX(),
                         this.yPosition - screenOrigin.getY());
    }

    private preparePoints(): void {
        //copy over the original positions of the points
        for(let i = 0; i < OpponentPlayer.points.length; i++) {
            let src: Point = OpponentPlayer.points[i];
            let dest: Point = this.transformedPoints[i];
            dest.setX(src.getX());
            dest.setY(src.getY());
        }

        //set the leg points
        let leftLegPoint: Point = this.transformedPoints[OpponentPlayer.leftLegTip];
        let rightLegPoint: Point = this.transformedPoints[OpponentPlayer.rightLegTip];
        let legElongateAmount: number = 0;//TODO: OpponentPlayer.legElongateRatio * (Math.abs(this.velocity.getX()) + Math.abs(this.velocity.getY()));

        leftLegPoint.addX(legElongateAmount);
        leftLegPoint.addY(legElongateAmount);
        rightLegPoint.addX(-legElongateAmount);
        rightLegPoint.addY(legElongateAmount);
    }
}