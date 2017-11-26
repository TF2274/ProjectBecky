///<reference path="./Npc.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./ClientPlayer.ts"/>
///<reference path="./LagCompensator.ts"/>

class BlackHoleNpc extends Npc{
    private static max_velocity: number = 0.0;
    static radius: number = 30;

    constructor(){
        super();
    }

    public setAngle(angle: number): void {/* Do nothing */}

    public update(elapsedTime: number): void{
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void{
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -BlackHoleNpc.radius || screenX - canvas.width > BlackHoleNpc.radius ||
            screenY < -BlackHoleNpc.radius || screenY - canvas.height > BlackHoleNpc.radius) {
            return; //off screen, don't draw
        }

        context.beginPath();
        context.ellipse(screenX, screenY, BlackHoleNpc.radius, BlackHoleNpc.radius, 0, 0, 2*Math.PI);
        context.fillStyle = "#000000";
        context.fill();
        context.strokeStyle = "#5e5e5e";
        context.lineWidth = 5;
        context.stroke();
        context.closePath();
    }
}