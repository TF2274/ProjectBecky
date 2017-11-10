///<reference path="./GameEntity.ts"/>
///<reference path="./Updateable.ts"/>
///<reference path="./Renderable.ts"/>
///<reference path="./collections/Point.ts"/>
///<reference path="./collections/Set.ts"/>

abstract class Npc extends GameEntity implements Renderable {
    static STATE_NEW_NPC: number = 111;
    static STATE_UPDATE_NPC: number = 112;
    static STATE_DEAD_NPC: number = 113;

    protected health: number;
    protected npcId: number;
    protected parent: GameEntity;
    protected compensationVelocity: Point = new Point(0, 0);
    protected compensationFrames: number = 0;

    protected constructor(parent: GameEntity, npcId: number, max_velocity: number) {
        super(max_velocity);
        this.parent = parent;
        this.npcId = npcId;
    }

    /**
     * Gets this NPCs health
     * @returns {number}
     */
    public getHealth(): number {
        return this.health;
    }

    /**
     * Sets this NPCs health
     * @param health
     */
    public setHealth(health: number): void {
        this.health = health;
    }

    /**
     * Gets this NPCs id
     * @returns {number}
     */
    public getNpcId(): number {
        return this.npcId;
    }

    public setPosition(x: number, y: number): void {
        this.position.setX(x);
        this.position.setY(y);
    }

    public setVelocity(x: number, y: number): void {
        this.velocity.setX(x);
        this.velocity.setY(y);
    }

    public setLagCompensateVelocity(velocity: Point, numFrames: number): void {
        this.compensationVelocity = velocity;
        this.compensationFrames = numFrames;
    }

    public setAcceleration(x: number, y: number): void {
        this.acceleration.setX(x);
        this.acceleration.setY(y);
    }

    public setAngle(angle: number) {
        this.angle = angle;
    }

    public getAngle(): number {
        return this.angle;
    }

    public update(elapsedTime: number): void {
        if(!LagCompensator.enabled) {
            return;
        }

        let multiplier: number = elapsedTime / 1000.0;

        this.velocity.addX(this.acceleration.getX() * multiplier);
        this.velocity.addY(this.acceleration.getY() * multiplier);
        this.capVelocity();

        this.position.addX((this.velocity.getX() + this.compensationVelocity.getX()) * multiplier);
        this.position.addY((this.velocity.getY() + this.compensationVelocity.getY()) * multiplier);

        if(this.compensationFrames > 0) {
            this.compensationFrames--;
            if(this.compensationFrames == 0) {
                this.compensationVelocity.setX(0);
                this.compensationVelocity.setY(0);
            }
        }
    }

    abstract draw(context: CanvasRenderingContext2D, screenOrigin: Point): void;
}