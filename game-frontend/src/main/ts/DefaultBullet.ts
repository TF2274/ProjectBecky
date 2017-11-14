
class DefaultBullet extends Bullet {
    private static outlineThickness = 2;
    private static fillRadius = 12;
    private static fillDiameter = DefaultBullet.fillRadius * 2;
    private static totalRadius = DefaultBullet.fillRadius + DefaultBullet.outlineThickness;

    private fillColor: string = "#a8ff96";
    private strokeColor: string = "#000000";

    constructor() {
        super();
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -DefaultBullet.totalRadius || screenX - canvas.width > DefaultBullet.totalRadius ||
            screenY < -DefaultBullet.totalRadius || screenY - canvas.height > DefaultBullet.totalRadius) {
            return; //off screen, don't draw
        }

        //set fill and stroke style
        context.beginPath();
        context.fillStyle = this.fillColor;
        context.arc(screenX, screenY, DefaultBullet.fillRadius, 0, 2*Math.PI, false);
        context.fill();
        context.strokeStyle = this.strokeColor;
        context.lineWidth = DefaultBullet.outlineThickness;
        context.arc(screenX, screenY, DefaultBullet.totalRadius, 0, 2*Math.PI, false);
        context.stroke();
        context.closePath();
    }

    public setFillColor(color: string): void {
        this.fillColor = color;
    }
}