///<reference path="./Powerup.ts"/>
///<reference path="./ClientPlayer.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./LagCompensator.ts"/>

class HealthPowerup extends Powerup{
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
        if(screenX < -HealthPowerup.radius || screenX - canvas.width > HealthPowerup.radius ||
            screenY < -HealthPowerup.radius || screenY - canvas.height > HealthPowerup.radius) {
            return; //off screen, don't draw
        }

        context.beginPath();
        context.fillStyle = '#f00';
        context.fillRect(screenX-8, screenY-30, 15, 60);
        context.fillRect(screenX-30, screenY-8, 60, 15);
        context.strokeStyle = "#000";
        context.lineWidth = 3;
        context.strokeRect(screenX-8, screenY-30, 15, 60);
        context.strokeRect(screenX-30, screenY-8, 60, 15);
        context.closePath();

    }
}