///<reference path="./Npc.ts"/>
///<reference path="./collections/Point.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./LagCompensator.ts"/>

class VirusNpc extends Npc {
    private static max_velocity: number = 200;
    private static firstLegIndex: number = 11;
    private static radius: number = 32;
    private static drawPoints: Point[] = [
        new Point(-12, -20),
        new Point(0, -6),
        new Point(12, -20),
        new Point(-12, -20),
        new Point(0, -28),
        new Point(12, -20),
        new Point(12, -6),
        new Point(-12, -6),
        new Point(-12, -20),
        new Point(0, -6),
        new Point(0, 8),
        new Point(), //set on each frame. Left leg
        new Point()  //set on each frame. Right leg
    ];
    private static draw_ind1: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    private static draw_ind2: number[] = [9, 10];
    private static draw_ind3: number[] = [11, 10, 12];

    private transformedPoints: Point[] = [];
    private vectorDraw: VectorDrawInstance = new VectorDrawInstance();

    constructor(parent: GameEntity, npcId: number) {
        super(parent, npcId, VirusNpc.max_velocity);

        //init the point objects for the transformed points
        for(let i = 0; i < 13; i++) {
            this.transformedPoints[i] = new Point();
        }
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenX: number = this.xPosition - screenOrigin.getX();
        let screenY: number = this.yPosition - screenOrigin.getY();
        let canvas: HTMLCanvasElement = context.canvas;
        if(screenX < -VirusNpc.radius || screenX - canvas.width > VirusNpc.radius ||
            screenY < -VirusNpc.radius || screenY - canvas.height > VirusNpc.radius) {
            return; //off screen, don't draw
        }

        //translate the points to screen space
        this.setLegEndpoints();
        this.vectorDraw.setLocalSpacePoints(this.transformedPoints);
        this.vectorDraw.translateToWorldSpace(this.xPosition, this.yPosition, this.angles - Math.PI/2.0);
        this.vectorDraw.translateToScreenSpace(screenOrigin.getX(), screenOrigin.getY());

        //prepare background draw colors and style
        context.strokeStyle = "#007875";
        context.lineWidth = 3;
        this.vectorDraw.line(context, VirusNpc.draw_ind1, false);
        this.vectorDraw.line(context, VirusNpc.draw_ind2, false);
        this.vectorDraw.line(context, VirusNpc.draw_ind3, false);

        //now prepare to draw the points
        context.strokeStyle = "#00fffc";
        context.lineWidth = 1;
        this.vectorDraw.line(context, VirusNpc.draw_ind1, false);
        this.vectorDraw.line(context, VirusNpc.draw_ind2, false);
        this.vectorDraw.line(context, VirusNpc.draw_ind3, false);
    }

    private setLegEndpoints(): void {
        //copy initial points
        for(let i = 0; i < 11; i++) {
            let p: Point = this.transformedPoints[i];
            let q: Point = VirusNpc.drawPoints[i];
            p.setX(q.getX());
            p.setY(q.getY());
        }

        let speedSquared: number = Math.pow(this.xVelocity, 2) + Math.pow(this.yVelocity, 2);
        let changeX: number = Math.min(4.0, 0.000128 * speedSquared);
        let changeY: number = Math.min(1.0, 0.000064 * speedSquared);

        //note, still working with local points as in, points that have not
        //been transformed or rotated
        let p: Point = this.transformedPoints[11];
        let q: Point = this.transformedPoints[12];
        p.setX(-8 + changeX);
        p.setY(15 + changeY);
        q.setX(8 - changeX);
        q.setY(15 + changeY);
    }
}