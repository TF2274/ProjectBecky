///<reference path="./Renderable.ts"/>
///<reference path="./Updateable.ts"/>
///<reference path="./collections/Point.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./Player.ts"/>
///<reference path="./LagCompensator.ts"/>

/**
 * The bullet class
 */
class Bullet extends GameEntity implements Renderable {
    private static outlineThickness = 2;
    private static fillRadius = 12;
    private static fillDiameter = Bullet.fillRadius * 2;
    private static totalRadius = Bullet.fillRadius + Bullet.outlineThickness;

    private owner: Player;
    private fillColor: string = "#a8ff96";
    private strokeColor: string = "#000000";
    private id: number;

    constructor(owner: Player, id: number, position: Point, velocity: Point) {
        super(Math.max(velocity.getX(), velocity.getY()));
        this.owner = owner;
        this.deceleration = 0;
        this.xPosition = position.getX();
        this.yPosition = position.getY();
        this.xVelocity = velocity.getX();
        this.yVelocity = velocity.getY();
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public setFillColor(color: string): void {
        this.fillColor = color;
    }

    public setStrokeColor(color: string): void {
        this.strokeColor = color;
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -Bullet.totalRadius || screenX - canvas.width > Bullet.totalRadius ||
           screenY < -Bullet.totalRadius || screenY - canvas.height > Bullet.totalRadius) {
            return; //off screen, don't draw
        }

        //set fill and stroke style
        context.beginPath();
        context.fillStyle = this.fillColor;
        context.arc(screenX, screenY, Bullet.fillRadius, 0, 2*Math.PI, false);
        context.fill();
        context.strokeStyle = this.strokeColor;
        context.lineWidth = Bullet.outlineThickness;
        context.arc(screenX, screenY, Bullet.totalRadius, 0, 2*Math.PI, false);
        context.stroke();
        context.closePath();
    }

    public update(elapsedTime: number): void {
        let multiplier: number = elapsedTime / 1000.0;
        if(this.compensateFrames == 0) {
            this.xPosition += this.xVelocity * multiplier;
            this.yPosition += this.yVelocity * multiplier;
        }
        else {
            this.xPosition += (this.xVelocity + this.xCompensateVelocity) * multiplier;
            this.yPosition += (this.yVelocity + this.yCompensateVelocity) * multiplier;
        }
    }
}