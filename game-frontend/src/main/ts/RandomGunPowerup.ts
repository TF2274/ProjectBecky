///<reference path="./Powerup.ts"/>
///<reference path="./ClientPlayer.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./LagCompensator.ts"/>

class RandomGunPowerup extends Powerup{
    private static max_velocity: number = 0;
    private static radius: number = 30;

    private vectorDraw: VectorDrawInstance = new VectorDrawInstance();

    constructor() {
        super();
    }

    public setAngle(angle: number): void {/* Do nothing */}

    public update(elapsedTime: number): void{
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -RandomGunPowerup.radius || screenX - canvas.width > RandomGunPowerup.radius ||
            screenY < -RandomGunPowerup.radius || screenY - canvas.height > RandomGunPowerup.radius) {
            return; //off screen, don't draw
        }

        context.beginPath();
        context.ellipse(screenX, screenY, RandomGunPowerup.radius - 5, RandomGunPowerup.radius - 5, 0, 0, 2*Math.PI);
        context.fillStyle = "#0f0";
        context.fill();
        context.strokeStyle = "#000";
        context.lineWidth = 5;
        context.stroke();
        context.closePath();

    }
}