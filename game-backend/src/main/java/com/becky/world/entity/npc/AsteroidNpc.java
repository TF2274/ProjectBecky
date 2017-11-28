package com.becky.world.entity.npc;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.SpawnRules;
import com.becky.world.physics.NpcCollisionDetector;

import java.awt.geom.Point2D;
import java.util.Random;

public class AsteroidNpc extends Npc
{
    private static final float RAND_LIMIT = 20;
    private final Random random = new Random();

    protected AsteroidNpc(final NewGameWorld gameWorld)
    {
        super(gameWorld);
        super.maxVelocity = 50.0f;
        super.npcHealth = 10;
        super.pointsValue = 200;
        super.collisionRadius = 32;
        super.addPhysicsFilter(NpcCollisionDetector.class);

    }

    @Override
    public void tick(final long elapsedTime) {

        // Check if asteroid is on world border and remove the entity
        if( (this.getXPosition() < 1) || (this.getXPosition() > this.getGameWorld().getWorldWidth()-1) ||
                (this.getYPosition() < 1) || (this.getYPosition() > this.getGameWorld().getWorldHeight()-1))
        {
            this.setNpcHealth(0);
        }

        super.setXAcceleration(random.nextInt((int)RAND_LIMIT)-(RAND_LIMIT/2));
        super.setYAcceleration(random.nextInt((int)RAND_LIMIT)-(RAND_LIMIT/2));

        super.tick(elapsedTime);
    }


    public static class AsteroidNpcSpawnRules extends SpawnRules
    {
        private static final int POPULATION_CAP = 200;

        private boolean dormant = false;

        public AsteroidNpcSpawnRules()
        {
            super(AsteroidNpc.class);
            super.setMaxPopulation(POPULATION_CAP);
            super.setSpawnInterval(0);
        }

        /**
         * The goal of these spawn rules is to spawn POPULATION_CAP npcs very quickly.
         * After that many npcs are spawned, the goal is to wait until that population has fallen
         * back down to 100 before spawning more.
         * Also after POPULATION_CAP is reached, we only check once per 30 seconds.
         * @param world
         */
        @Override
        public void spawn(final NewGameWorld world) {
            if(dormant) {
                if(super.getCurrentPopulation() <= 100) {
                    dormant = false;
                    super.setSpawnInterval(1);
                }
                return;
            }

            final Point2D.Float randomLocation = MathUtils.createRandomPointInBounds(
                    0, 0, world.getWorldWidth(), world.getWorldHeight());
            final AsteroidNpc npc = new AsteroidNpc(world);
            npc.setXPosition(randomLocation.x);
            npc.setYPosition(randomLocation.y);
            world.addGameEntity(npc);

            if(super.getCurrentPopulation() >= POPULATION_CAP) {
                super.setSpawnInterval(30000);
                dormant = true;
            }
        }

    }
}
