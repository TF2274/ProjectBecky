///<reference path="./Player.ts"/>
///<reference path="./Updateable.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./collections/Point.ts"/>

/**
 * Represents another player. Not the player on this client.
 */
class OpponentPlayer implements Player, Updateable, GameEntity {
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

    private position : Point = new Point();
    private velocity: Point = new Point();
    private acceleration: Point = new Point();
    private compensateVelocity: Point = new Point();
    private numLagFrames: number = 0;
    private angle: number = 0;
    private username: string;
    private parent: GameEntity;
    private transformedPoints: Point[] = [];
    private score: number = 0;
    private health: number = 100;
    private usernameDrawXOffset: number = -1;

    constructor(parent: GameEntity, username: string) {
        this.position = new Point();
        this.username = username;
        this.parent = parent;

        for(let i = 0; i < OpponentPlayer.points.length; i++) {
            this.transformedPoints[i] = new Point();
        }
    }

    public getUsername(): string {
        return this.username;
    }

    public getXPosition(): number {
        return this.position.getX();
    }

    public getYPosition(): number {
        return this.position.getY();
    }

    public getXVelocity(): number {
        return this.velocity.getX();
    }

    public getYVelocity(): number {
        return this.velocity.getY();
    }

    public getXAcceleration(): number {
        return this.acceleration.getX();
    }

    public getYAcceleration(): number {
        return this.acceleration.getY();
    }

    public getAngle(): number {
        return this.angle;
    }

    public setAngle(angle: number): void {
        this.angle = angle;
    }

    public setPosition(x: number, y: number): void {
        this.position.setX(x);
        this.position.setY(y);
    }

    public setVelocity(x: number, y: number): void {
        this.velocity.setX(x);
        this.velocity.setY(y);
    }

    public setAcceleration(x: number, y: number): void {
        this.acceleration.setX(x);
        this.acceleration.setY(y);
    }

    public getParentEntity(): GameEntity {
        return this.parent;
    }

    public getChildEntities(): Set<GameEntity> {
        return new Set<GameEntity>();
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public getScore(): number {
        return this.score;
    }

    public setHealth(health: number): void {
        this.health = health;
    }

    public getHealth(): number {
        return this.health;
    }

    public setLagCompensateVelocity(velocity: Point, numFrames: number): void {
        this.compensateVelocity = velocity;
        this.numLagFrames = numFrames;
    }

    public update(elapsedTime: number) : void {
        if(!LagCompensator.enabled) {
            return;
        }

        let multiplier: number = elapsedTime / 1000.0;
        this.velocity.addX(this.acceleration.getX() * multiplier);
        this.velocity.addY(this.acceleration.getY() * multiplier);
        ClientPlayer.capVelocity(this.velocity);

        if(this.numLagFrames === 0) {
            this.position.addX(this.velocity.getX() * multiplier);
            this.position.addY(this.velocity.getY() * multiplier);
        }
        else {
            this.position.addX((this.velocity.getX() + this.compensateVelocity.getX()) * multiplier);
            this.position.addY((this.velocity.getY() + this.compensateVelocity.getY()) * multiplier);
            this.numLagFrames--;
        }
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenPos: Point = this.getScreenspacePosition(screenOrigin);
        this.preparePoints(); //generate the points themselves
        this.rotatePoints(); //rotate the generated points around the origin
        this.transformPoints(screenPos.getX(), screenPos.getY()); //shift the points to the center of the screen

        //draw the main ship body
        context.fillStyle = OpponentPlayer.fillColor1;
        this.fillPolygon(context, OpponentPlayer.polyfill1_ind);
        context.fillStyle = OpponentPlayer.fillColor2;
        this.fillPolygon(context, OpponentPlayer.polyfill2_ind);
        this.fillPolygon(context, OpponentPlayer.polyfill3_ind);

        //draw prepare to draw first outline set
        context.strokeStyle = OpponentPlayer.secondaryLineColor;
        context.globalAlpha = 0.3;
        context.lineJoin = OpponentPlayer.outlineJoins;
        context.lineWidth = OpponentPlayer.outlineWidth + 4;
        context.lineCap = OpponentPlayer.outlineEndcaps;

        //draw the first outline set
        this.linePolygon(context, OpponentPlayer.outline1_ind);
        this.linePolygon(context, OpponentPlayer.outline2_ind);

        //prepare to draw second outline set
        context.globalAlpha = 1.0;
        context.strokeStyle = OpponentPlayer.lineColor;
        context.lineWidth = OpponentPlayer.outlineWidth;

        //draw the second outline set
        this.linePolygon(context, OpponentPlayer.outline1_ind);
        this.linePolygon(context, OpponentPlayer.outline2_ind);

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
        return new Point(this.position.getX() - screenOrigin.getX(),
                         this.position.getY() - screenOrigin.getY());
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

    private rotatePoints(): void {
        let sinAngle: number = Math.sin(this.angle + Math.PI/2.0);
        let cosAngle: number = Math.cos(this.angle + Math.PI/2.0);

        //rotate all of the points around the origin
        //It is assumed the points have not been transformed
        for (let i = 0; i < OpponentPlayer.points.length; i++) {
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