///<reference path="./GameEntity.ts"/>
///<reference path="./Updateable.ts"/>
///<reference path="./Renderable.ts"/>
///<reference path="./collections/Point.ts"/>
///<reference path="./collections/Set.ts"/>

abstract class Powerup extends GameEntity implements Renderable{
    static STATE_NEW_POWERUP: number = 111;
    static STATE_UPDATE_POWERUP: number = 112;
    static STATE_DEAD_POWERUP: number = 113;

    protected health: number;
    protected powerupId: number;
    protected compensationVelocity: Point = new Point(0, 0);
    protected compensationFrames: number = 0;

    constructor() {
        super();
    }

    public receiveMessage(message: EntityMessage): void {
        super.receiveMessage(message);
        this.health = message.health;
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
    public getPowerupId(): number {
        return this.powerupId;
    }

    abstract draw(context: CanvasRenderingContext2D, screenOrigin: Point): void;
}