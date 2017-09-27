/**
 * Represents an update about a player from the server.
 */

class ServerPlayerUpdate {
    private posX: number;
    private posY: number;
    private playerName: string;

    //TODO: Phase 2 uncomment the following fields
    //private accelX: number;
    //private accelY: number;
    //private velX: number;
    //private velY: number;

    public getPosition(): Point {
        return new Point(this.posX, this.posY);
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    //TODO: Phase 2 uncomment the following methods
    //public getVelocity(): Point {
    //    return new Point(this.velX, this.velY);
    //}

    //public getAcceleration(): Point {
    //    return new Point(this.accelX, this.accelY);
    //}
}