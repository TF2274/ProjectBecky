/// <reference path='Renderable.ts'/>
/// <reference path='Point.ts'/>

/**
 * Represents any player. Either the current player or any opponent player.
 */
interface Player extends Renderable {
    /**
     * Gets the current global X position of the player.
     */
    getXPosition(): number;

    /**
     * Gets the current global Y position of the player.
     */
    getYPosition(): number;

    /**
     * Gets the current look direction of the player in RADIANS.
     */
    getAngle(): number;

    /**
     * Sets the player look angle.
     * @param angle
     */
    setAngle(angle: number): void;

    /**
     * Sets the position of the player.
     * @param x
     * @param y
     */
    setPosition(x: number, y: number): void;
}