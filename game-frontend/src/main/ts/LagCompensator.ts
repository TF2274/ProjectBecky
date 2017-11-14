///<reference path="./networked/BulletInfo.ts"/>
///<reference path="./networked/ServerPlayerUpdate.ts"/>
///<reference path="./networked/NpcInfo.ts"/>
///<reference path="./Npc.ts"/>
///<reference path="./Bullet.ts"/>
///<reference path="./ClientPlayer.ts"/>
///<reference path="./GameClient.ts"/>

class LagCompensator {
    //when a message is received containing the position of an entity,
    //there is likely to be some difference in client position and position
    //from the network. The compensator has three ways to handle things.
    //If the difference in position is <= THRESHHOLD_MAX_IGNORE, the compensator
    //will do absolutely nothing.
    static THRESHOLD_MAX_IGNORE: number = 0.4;
    //If THRESHOLD_MAX_IGNORE <= difference <= THRESHOLD_MAX_ADJUST then
    //use velocity adjustments to correct position within a certain number of frames.
    static THRESHOLD_MAX_ADJUST: number = 200.0;
    //Anything above THRESHOLD_MAX_ADJUST and the object will simply be teleported

    private latency: number = 0;
    private previousLatencies: number[] = [];
    private latencySetCount: number = 0;
    private correctionFps: number;
    private correctionTime: number;

    /**
     * Creates a new lag compensator object which can be used to attempt to correct positioning based on the known
     * connection latency.
     * @param {number} fps The amount of time, specified in number of display frames, it should take for a game entity
     * to be moved from its current position into its predicted position after a server position message is received.
     */
    constructor(fps: number) {
        this.correctionFps = fps;
        this.correctionTime = fps * GameClient.TIME_PER_FRAME;

        //this will set the average latency to 50 starting off.
        for(let i = 0; i < 20; i++) {
            this.previousLatencies[i] = 50;
        }
        this.latency = 50;
    }

    public setLatency(latency: number): void {
        // let oldLatency: number = this.previousLatencies[this.latencySetCount%20];
        // this.previousLatencies[this.latencySetCount%20] = latency;
        // let diff: number = latency - oldLatency;
        // this.latency += diff / 20.0; //much more efficient than recalculating the entire average
        // this.latencySetCount++;
        if(latency < this.latency) {
            this.latency = Math.max(this.latency - 5, latency);
        }
        else {
            this.latency = Math.min(this.latency + 5, latency);
        }
    }

    public getLatency(): number {
        return this.latency;
    }

    public compensateEntityMessage(entity: GameEntity, message: EntityMessage): void {
        let multiplier: number = this.latency / 1000.0;
        message.XVelocity += multiplier * message.XAcceleration;
        message.YVelocity += multiplier * message.YAcceleration;
        message.XPosition += multiplier * message.XVelocity;
        message.YPosition += multiplier * message.YVelocity;

        let deltaX: number = message.XPosition - entity.getXPosition();
        let deltaY: number = message.YPosition - entity.getYPosition();
        let delta: number = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        if(delta > LagCompensator.THRESHOLD_MAX_ADJUST) {
             entity.setPosition(message.XPosition, message.YPosition);
             entity.receiveMessage(message);
            return;
        }

        let compensateVelocity = new Point();
        compensateVelocity.setX((deltaX/this.correctionTime) * 1000.0);
        compensateVelocity.setY((deltaY/this.correctionTime) * 1000.0);
        entity.receiveMessage(message);
        entity.setLagCompensateVelocity(compensateVelocity, this.correctionFps);
    }
}