/**
 * Represents any object which can be updated.
 */
export interface Updateable {
    /**
     * Update the current state of the object based on the world state and
     * the ellapsed time.
     * @param ellapsedTime
     */
    update(ellapsedTime: number): void;
}