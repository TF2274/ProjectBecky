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
    public getNpcId(): number {
        return this.npcId;
    }

    abstract draw(context: CanvasRenderingContext2D, screenOrigin: Point): void;
}