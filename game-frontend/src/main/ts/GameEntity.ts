///<reference path="./collections/Set.ts"/>

/**
 * Represents any game entity. A game entity can be contained within any other
 * game entity, and can contain other game entities.
 */
abstract class GameEntity implements Updateable {
    protected children: Set<GameEntity> = new Set<GameEntity>();
    protected parent: GameEntity = null;

    protected xPosition: number = 0;
    protected yPosition: number = 0;
    protected xVelocity: number = 0;
    protected yVelocity: number = 0;
    protected xCompensateVelocity: number = 0;
    protected yCompensateVelocity: number = 0;
    protected compensateFrames: number = 0;
    protected xAcceleration: number = 0;
    protected yAcceleration: number = 0;
    protected angles: number = 0;
    protected deceleration: number = 0;

    private max_velocity: number = 0;

    constructor(max_velocity: number) {
        this.max_velocity = max_velocity;
    }

    /**
     * Gets a set of all game entities contained within this game entity.
     * @returns {Set<GameEntity>}
     */
    public getChildEntities(): Set<GameEntity> {
        return this.children;
    }

    /**
     * Makes a game entity become a child of this entity.
     * @param entity
     */
    public addChildEntity(entity: GameEntity): void {
        this.children.add(entity);
    }

    /**
     * Removes an entity from this entity's children.
     * @param entity
     */
    public removeChildEntity(entity: GameEntity): void {
        this.children.remove(entity);
    }

    /**
     * Clears this game entity of all children.
     * @param entity
     */
    public clearChildren(entity: GameEntity): void {
        this.children = new Set<GameEntity>();
    }

    /**
     * Gets the game entity this game entity is contained within.
     * @returns {GameEntity}
     */
    public getParentEntity(): GameEntity {
        return this.parent;
    }

    /**
     * Sets the parent of this game entity.
     * @param entity
     */
    public setParentEntity(entity: GameEntity): void {
        this.parent = entity;
    }

    /**
     * Gets the X position of this game entity.
     */
    public getXPosition(): number {
        return this.xPosition;
    }

    /**
     * Gets the Y position of this game entity.
     */
    public getYPosition(): number {
        return this.yPosition;
    }

    /**
     * Gets the x component of this entity's velocity
     * @returns {number}
     */
    public getXVelocity(): number {
        return this.xVelocity;
    }

    /**
     * Gets the y component of this entity's velocity
     * @returns {number}
     */
    public getYVelocity(): number {
        return this.yVelocity;
    }

    /**
     * Gets the x component of this entity's acceleration.
     * @returns {number}
     */
    public getXAcceleration(): number {
        return this.xAcceleration;
    }

    /**
     * Gets the y component of this entity's acceleration.
     * @returns {number}
     */
    public getYAcceleration(): number {
        return this.yAcceleration;
    }

    /**
     * Sets the position of the game entity;
     * @param x
     * @param y
     */
    public setPosition(x: number, y:number): void {
        this.xPosition = x;
        this.yPosition = y;
    }

    /**
     * Sets the velocity of this game entity.
     * @param x
     * @param y
     */
    public setVelocity(x: number, y: number): void {
        this.xVelocity = x;
        this.yVelocity = y;
    }

    /**
     * Sets the acceleration of this game entity.
     * @param x
     * @param y
     */
    public setAcceleration(x: number, y: number): void {
        this.xAcceleration = x;
        this.yAcceleration = y;
    }

    /**
     * Sets the deceleration rate of this game entity.
     * @param decel
     */
    public setDeceleration(decel: number): void {
        this.deceleration = decel;
    }

    /**
     * Sets the lag compensation "tweak" velocity of this entity
     * @param velocity
     * @param compensateFrames
     */
    public setLagCompensateVelocity(velocity: Point, compensateFrames: number): void {
        this.xCompensateVelocity = velocity.getX();
        this.yCompensateVelocity = velocity.getY();
        this.compensateFrames = compensateFrames;
    }

    /**
     * Gets the current look direction of the player in RADIANS.
     */
    public getAngle(): number {
        return this.angles;
    }

    /**
     * Sets the player look angle.
     * @param angle
     */
    public setAngle(angle: number): void {
        this.angles = angle;
    }

    public update(elapsedTime: number): void {
        let multiplier: number = elapsedTime / 1000.0;

        this.updateVelocity(multiplier);
        this.capVelocity();
        this.updatePosition(multiplier);
    }

    private updateVelocity(multiplier: number): void {
        if(Math.abs(this.xAcceleration) < 0.1) {
            if(this.xVelocity > 0.0) {
                this.xVelocity -= multiplier * this.deceleration;
                if(this.xVelocity < 0.0) {
                    this.xVelocity = 0.0;
                }
            }
            else {
                this.xVelocity += multiplier * this.deceleration;
                if(this.xVelocity > 0.0) {
                    this.xVelocity = 0.0;
                }
            }
        }
        else {
            this.xVelocity += multiplier * this.xAcceleration;
        }

        if(Math.abs(this.yAcceleration) < 0.1) {
            if(this.yVelocity > 0.0) {
                this.yVelocity -= multiplier * this.deceleration;
                if(this.yVelocity < 0.0) {
                    this.yVelocity = 0.0;
                }
            }
            else {
                this.yVelocity += multiplier * this.deceleration;
                if(this.yVelocity > 0.0) {
                    this.yVelocity = 0.0;
                }
            }
        }
        else {
            this.yVelocity += multiplier * this.yAcceleration;
        }
    }

    private capVelocity(): void {
        if(this.xVelocity > this.max_velocity) {
            this.xVelocity = this.max_velocity;
        }
        else if(this.xVelocity < -this.max_velocity) {
            this.xVelocity = -this.max_velocity;
        }

        if(this.yVelocity > this.max_velocity) {
            this.yVelocity = this.max_velocity;
        }
        else if(this.yVelocity < -this.max_velocity) {
            this.yVelocity = -this.max_velocity;
        }
    }

    private updatePosition(multiplier: number): void {
        if(this.compensateFrames == 0) {
            this.xPosition += multiplier * this.xVelocity;
            this.yPosition += multiplier * this.yVelocity;
        }
        else {
            this.xPosition += multiplier * (this.xVelocity + this.xCompensateVelocity);
            this.yPosition += multiplier * (this.yVelocity + this.yCompensateVelocity);

            this.compensateFrames--;
        }
    }
}