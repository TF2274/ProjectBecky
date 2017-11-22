///<reference path="./Renderable.ts"/>
///<reference path="./Updateable.ts"/>
///<reference path="./collections/Point.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./Player.ts"/>
///<reference path="./LagCompensator.ts"/>

/**
 * The bullet class
 */
abstract class Bullet extends GameEntity implements Renderable {
    private owner: string;

    constructor() {
        super();
    }

    public receiveMessage(message: EntityMessage) {
        super.receiveMessage(message);
        this.owner = message.owner;
    }

    public abstract draw(context: CanvasRenderingContext2D, screenOrigin: Point): void;

    public update(elapsedTime: number): void {
        let multiplier: number = elapsedTime / 1000.0;

        if(this.compensateFrames > 0) {
            this.xPosition += (this.xVelocity + this.xCompensateVelocity) * multiplier;
            this.yPosition += (this.yVelocity + this.yCompensateVelocity) * multiplier;
            this.compensateFrames--;
        }
        else {
            this.xPosition += this.xVelocity * multiplier;
            this.yPosition += this.yVelocity * multiplier;
        }
    }
}