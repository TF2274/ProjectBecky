interface PhysicsFilter {
    /**
     * Gets the numeric type of this physics filter.
     */
    getType(): number;

    /**
     * Called once per frame per entity that this physics filter applies to.
     * @param entity
     */
    apply(entity: GameEntity): void;

    /**
     * Called once at the start of a game frame. Allows the physics filter to perform any necessary
     * preprocessing steps.
     */
    prepare(): void;

    /**
     * Called by the game client when an entity is created.
     * @param gameEntity
     */
    onEntityCreated(gameEntity: GameEntity): void;

    /**
     * Called by the game client when an entity is removed.
     * @param gameEntity
     */
    onEntityRemoved(gameEntity: GameEntity): void;
}

class BlackHolePhysicsFilter implements PhysicsFilter {
    public static TYPE: number = 10;
    private static EFFECT_RADIUS: number = 750.0;
    private static EFFECT_STRENGTH: number = 2.0;

    private affectedEntities: Set<GameEntity> = new Set<GameEntity>();

    constructor() {}

    public getType(): number {
        return BlackHolePhysicsFilter.TYPE;
    }

    public onEntityCreated(gameEntity: GameEntity): void {
        if(!(gameEntity instanceof Bullet) && !(gameEntity instanceof BlackHoleNpc)) {
            this.affectedEntities.add(gameEntity);
        }
    }

    public onEntityRemoved(gameEntity: GameEntity): void {
        this.affectedEntities.remove(gameEntity);
    }

    public prepare(): void {};

    public apply(gameEntity: GameEntity): void {
        let bX: number = gameEntity.getXPosition();
        let bY: number = gameEntity.getYPosition();

        for(let i = 0; i < this.affectedEntities.length; i++) {
            let entity: GameEntity = this.affectedEntities.get(i);

            //perform broad effect radius checks
            let dX: number = entity.getXPosition() - bX;
            let dY: number = entity.getYPosition() - bY;
            if(Math.abs(dX) > BlackHolePhysicsFilter.EFFECT_RADIUS ||
               Math.abs(dY) > BlackHolePhysicsFilter.EFFECT_RADIUS) {
                continue;
            }

            //perform more accurate/detailed radius check
            let distance: number = Math.sqrt(dX*dX + dY*dY);
            if(distance > BlackHolePhysicsFilter.EFFECT_RADIUS) {
                continue;
            }

            //perform the acceleration change
            let angle: number = dX == 0.0 && dY == 0.0 ? 0.0 : Math.atan2(dY, dX);
            this.changeAccel(gameEntity, distance, angle);
        }
    }

    private changeAccel(gameEntity: GameEntity, distance: number, angle: number) {
        let accel: number = BlackHolePhysicsFilter.EFFECT_STRENGTH * BlackHolePhysicsFilter.EFFECT_RADIUS / distance;
        let sin: number = Math.sin(angle);
        let cos: number = Math.cos(angle);

        gameEntity.setAcceleration(gameEntity.getXAcceleration() + (1000.0 * cos * accel)),
                                   gameEntity.getYAcceleration() + (1000.0 * sin * accel));
    }
}