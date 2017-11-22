
class DefaultBullet extends Bullet {
    private static outlineThickness = 4;
    private static fillRadius = 16;
    private static totalRadius = DefaultBullet.fillRadius + DefaultBullet.outlineThickness;
    private static points: Point[] = [
        new Point(0, -8),
        new Point(0, 8)
    ];
    private static indices: number[] = [0, 1];

    private fillColor: string = "#a60000";
    private strokeColor: string = this.hexToRGB("#a60000");
    private fillColor2: string = "#000000";
    private strokeColor2: string = this.hexToRGB("#000000");
    private vectorDraw: VectorDrawInstance = new VectorDrawInstance();
    private transformedPoints: Point[] = [];

    constructor() {
        super();

        for(let i = 0; i < DefaultBullet.points.length; i++) {
            this.transformedPoints[i] = new Point(0, 0);
        }
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -DefaultBullet.totalRadius || screenX - canvas.width > DefaultBullet.totalRadius ||
            screenY < -DefaultBullet.totalRadius || screenY - canvas.height > DefaultBullet.totalRadius) {
            return; //off screen, don't draw
        }

        this.preparePoints();
        this.vectorDraw.setLocalSpacePoints(this.transformedPoints);
        this.vectorDraw.translateToWorldSpace(this.xPosition, this.yPosition, this.angles);
        this.vectorDraw.translateToScreenSpace(screenOrigin.getX(), screenOrigin.getY());
        let translatedPoints: Point[] = this.vectorDraw.getPoints();
        let point1: Point = translatedPoints[0];
        let point2: Point = translatedPoints[1];

        let gradient: CanvasGradient = context.createLinearGradient(point1.getX(), point1.getY(), point2.getX(), point2.getY());
        let gradient2: CanvasGradient = context.createLinearGradient(point1.getX(), point1.getY(), point2.getX(), point2.getY());
        gradient.addColorStop(0, this.fillColor);
        gradient.addColorStop(1, this.strokeColor);
        gradient2.addColorStop(0, this.fillColor2);
        gradient2.addColorStop(1, this.strokeColor2);
        context.lineWidth = DefaultBullet.totalRadius;
        context.lineCap = "round";
        context.strokeStyle = gradient;
        this.vectorDraw.line(context, DefaultBullet.indices, false);
        context.strokeStyle = gradient2;
        context.lineWidth -= DefaultBullet.outlineThickness;
        this.vectorDraw.line(context, DefaultBullet.indices, false);
    }

    public setFillColor(color: string): void {
        this.fillColor = color;
        this.strokeColor = this.hexToRGB(color);
    }

    private preparePoints(): void {
        for(let i = 0; i < DefaultBullet.points.length; i++) {
            let p: Point = this.transformedPoints[i];
            let q: Point = DefaultBullet.points[i];
            p.setX(q.getX());
            p.setY(q.getY());
        }
    }

    private hexToRGB(hex: string): string {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        return "rgba(" + r + ", " + g + ", " + b + ", 0.0)";
    }
}