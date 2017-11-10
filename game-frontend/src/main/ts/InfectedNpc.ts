///<reference path="./Npc.ts"/>
///<reference path="./GameEntity.ts"/>
///<reference path="./ClientPlayer.ts"/>
///<reference path="./LagCompensator.ts"/>

class InfectedNpc extends Npc {
    private static max_velocity: number = 150.0;
    static rpm: number = 4;
    static angleDelta: number = (2 * Math.PI * InfectedNpc.rpm) / (60 * 1000);
    static radius: number = 16;
    static maxBulge: number = 6;

    private extraWidth: number = 0;
    private totalTime: number = Date.now();
    private widthExpand: boolean = true;

    constructor(parent: GameEntity, npcId: number) {
        super(parent, npcId, InfectedNpc.max_velocity);
        this.angles = 0;
    }

    public setAngle(angle: number): void {/* Do nothing */}

    public update(elapsedTime: number): void {
        //update the angle of this npc
        this.angles += InfectedNpc.angleDelta * elapsedTime;

        //update the special width value
        this.totalTime += elapsedTime;

        if(this.widthExpand) {
            this.extraWidth += elapsedTime / 50.0;
            if(this.extraWidth > InfectedNpc.maxBulge) {
                this.widthExpand = false;
                this.extraWidth = InfectedNpc.maxBulge;
            }
        }
        else {
            this.extraWidth -= elapsedTime / 50.0;
            if(this.extraWidth < -InfectedNpc.maxBulge) {
                this.widthExpand = true;
                this.extraWidth = -InfectedNpc.maxBulge;
            }
        }

        //call the super update method
        super.update(elapsedTime);
    }

    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        let screenPosition: Point = new Point(this.xPosition - screenOrigin.getX(), this.yPosition - screenOrigin.getY());
        if(screenPosition.getX() < -InfectedNpc.radius || screenPosition.getY() < -InfectedNpc.radius ||
           screenPosition.getX() > context.canvas.width + InfectedNpc.radius || screenPosition.getY() > context.canvas.height + InfectedNpc.radius) {
            return;
        }

        //draw the bottom part
        context.beginPath()
        context.ellipse(screenPosition.getX(), screenPosition.getY(),
                        InfectedNpc.radius + this.extraWidth, InfectedNpc.radius - this.extraWidth,
                        this.angles, 0, 2 * Math.PI);
        //context.arc(screenPosition.getX(), screenPosition.getY(), 32, 0, 2*Math.PI, false);
        context.fillStyle = "#baff00";
        context.fill();
        context.strokeStyle = "#6fab00";
        context.lineWidth = 5;
        context.stroke();
        context.closePath();
    }
}