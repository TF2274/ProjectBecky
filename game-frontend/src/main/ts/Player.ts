/**
 * Represents any player. Either the current player or any opponent player.
 */
abstract class Player extends GameEntity {
    protected static max_velocity: number = 450;

    protected username: string = null;
    protected score: number = 0;
    protected health: number = 10;

    constructor() {
        super();
        this.max_velocity = Player.max_velocity;
    }

    public receiveMessage(message: EntityMessage): void {
        super.receiveMessage(message);
        this.score = message.score;
        this.health = message.health;
        this.username = message.username;
    }

    /**
     * Gets the username of the player
     */
    public getUsername(): string {
        return this.username;
    }

    /**
     * Gets this player's score.
     * @returns {number}
     */
    public getScore(): number {
         return this.score;
    }

    /**
     * Sets the score of this player.
     * @param score
     */
    public setScore(score: number): void {
        this.score = score;
    }

    /**
     * Gets this player's current health
     * @returns {number}
     */
    public getHealth(): number {
        return this.health;
    }

    /**
     * Sets this player's health
     * @param health
     */
    public setHealth(health: number): void {
        this.health = health;
    }
}