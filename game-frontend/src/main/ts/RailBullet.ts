/**
 * This is the second bullet type for the game.
 */
class RailBullet extends Bullet {
    private static totalRadius: number = 16;
    private static points: Point[] = [
        new Point(-32, 0),
        new Point(0, -12),
        new Point(32, 0)
    ];
    private static indices: number[] = [0, 1, 2];

    private transformedPoints: Point[] = [];
    private vectorDraw: VectorDrawInstance = new VectorDrawInstance();
    private fillColor: string = "#a60000";
    private fillColor2: string = "#000000";

    /**
     * Default constructor.
     */
    constructor() {
        super();
        for(let i = 0; i < RailBullet.points.length; i++) {
            this.transformedPoints[i] = new Point(0, 0);
        }
    }

    public setFillColor(color: string): void {
        this.fillColor = color;
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -RailBullet.totalRadius || screenX - canvas.width > RailBullet.totalRadius ||
            screenY < -RailBullet.totalRadius || screenY - canvas.height > RailBullet.totalRadius) {
            return; //off screen, don't draw
        }

        //prepare draw points
        this.preparePoints();
        this.vectorDraw.setLocalSpacePoints(this.transformedPoints);
        this.vectorDraw.translateToWorldSpace(this.xPosition, this.yPosition, this.angles);
        this.vectorDraw.translateToScreenSpace(screenOrigin.getX(), screenOrigin.getY());

        //prepare context for background color
        context.lineWidth = 8;
        context.lineCap = "round";
        context.strokeStyle = this.fillColor;
        this.vectorDraw.line(context, RailBullet.indices, false);

        //prepare context for foreground color
        context.lineWidth = 4;
        context.strokeStyle = this.fillColor2;
        this.vectorDraw.line(context, RailBullet.indices, false);
    }

    private preparePoints(): void {
        for(let i = 0; i < RailBullet.points.length; i++) {
            let p: Point = this.transformedPoints[i];
            let q: Point = RailBullet.points[i];
            p.setX(q.getX());
            p.setY(q.getY());
        }
    }
}