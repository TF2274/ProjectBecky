class AsteroidNpc extends Npc
{
    private static max_velocity: number = 50.0;
    static radius: number = 32;
    private img = new Image();

    constructor(){
        super();
        this.img.src = "asteroid.png";
    }

    public setAngle(angle: number): void {/* Do nothing */}


    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void{

        // Check if npc is in the view of the player
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -AsteroidNpc.radius || screenX - canvas.width > AsteroidNpc.radius ||
            screenY < -AsteroidNpc.radius || screenY - canvas.height > AsteroidNpc.radius) {
            return; //off screen, don't draw
        }

        // Draw the NPC image
        context.drawImage(this.img, screenX, screenY);

        // context.beginPath();
        // context.ellipse(screenX, screenY, AsteroidNpc.radius - 5, AsteroidNpc.radius - 5, 0, 0, 2*Math.PI);
        // context.fillStyle = "#000000";
        // context.fill();
        // context.strokeStyle = "#5e5e5e";
        // context.lineWidth = 5;
        // context.stroke();
        // context.closePath();



    }
}