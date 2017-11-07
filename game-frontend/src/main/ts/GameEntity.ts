///<reference path="./collections/Set.ts"/>

/**
 * Represents any game entity. A game entity can be contained within any other
 * game entity, and can contain other game entities.
 */
interface GameEntity {
    /**
     * Gets a set of all game entities contained within this game entity.
     * @returns {Set<GameEntity>}
     */
    getChildEntities(): Set<GameEntity>;

    /**
     * Gets the game entity this game entity is contained within.
     * @returns {GameEntity}
     */
    getParentEntity(): GameEntity;

    /**
     * Gets the X position of this game entity.
     */
    getXPosition(): number;

    /**
     * Gets the Y position of this game entity.
     */
    getYPosition(): number;

    /**
     * Get the X velocity of this game entity.
     * @returns {number}
     */
    getXVelocity(): number;

    /**
     * Gets the Y velocity of this game entity.
     * @returns {number}
     */
    getYVelocity(): number;

    /**
     * Get the X acceleration of this game entity.
     * @returns {number}
     */
    getXAcceleration(): number;

    /**
     * Get the Y acceleration of this game entity.
     * @returns {number}
     */
    getYAcceleration(): number;

    /**
     * Sets the position of the game entity.
     * @param x
     * @param y
     */
    setPosition(x: number, y: number): void;

    /**
     * Sets the velocity of the game entity.
     * @param {number} x
     * @param {number} y
     */
    setVelocity(x: number, y: number): void;

    /**
     * Sets the acceleration of the game entity.
     * @param {number} x
     * @param {number} y
     */
    setAcceleration(x: number, y: number): void;

    /**
     * Gets the current look direction of the entity in RADIANS.
     */
    getAngle(): number;

    /**
     * Sets the current look direction of the entity in RADIANS.
     * @param {number} angle
     */
    setAngle(angle: number): void;

    /**
     * Sets the lag compensation velocity. This is velocity that is added separately to the main
     * velocity for the purposes of correcting entity position over time.
     * @param {Point} velocity
     * @param {number} numFrames
     */
    setLagCompensateVelocity(velocity: Point, numFrames: number);
}