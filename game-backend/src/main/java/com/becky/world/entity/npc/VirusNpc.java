package com.becky.world.entity.npc;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.SpawnRules;
import com.becky.world.physics.BlackHolePhysics;
import com.becky.world.physics.NpcCollisionDetector;

import java.awt.geom.Point2D;

/**
 * Npc class which is a type of npc that spawns from the death of an infected npc.
 * Created by Clayton Hunsinger on 10/26/2017.
 */
public class VirusNpc extends Npc {
    private boolean xStopped;
    private boolean yStopped;
    private boolean readyForNextDirection = false;
    private boolean readyForNextTurn = true;
    private boolean makingTurn = false;
    private final Point2D.Float nextVelocity = new Point2D.Float();
    private float nextAngle = 0.0f;
    private float turnDirection = 1.0f;
    private long timeTilNextMove = 0L;

    protected VirusNpc(final NewGameWorld gameWorld) {
        super(gameWorld);
        super.collisionRadius = 28;
        super.maxVelocity = 250.0f;
        super.npcHealth = 5;
        super.pointsValue = 2;
        super.acceleration.x = 0.0f;
        super.acceleration.y = 0.0f;
        super.velocity.x = 0.0f;
        super.velocity.y = 0.0f;
        super.addPhysicsFilter(NpcCollisionDetector.class);
    }

    @Override
    public void tick(final long elapsedTime) {
        //NPC is ready to make the next "push" through the world
        //The NPC is ready, but will wait until a certain amount of time
        //has passed before actually moving.
        if(readyForNextDirection) {
            if(timeTilNextMove <= 0) {
                super.velocity.x = nextVelocity.x;
                super.velocity.y = nextVelocity.y;
                super.acceleration.x = 0.0f;
                super.acceleration.y = 0.0f;
                xStopped = false;
                yStopped = false;
                readyForNextDirection = false;
                timeTilNextMove = 0L;
                super.deceleration = 100.0f;
            }
            else {
                timeTilNextMove -= elapsedTime;
            }
            return;
        }

        //The NPC is ready to turn in a different direction before moving
        //and must determine which direction to turn in as well as the next
        //velocity to "push" in
        if(readyForNextTurn) {
            //determine the next velocity and next angle
            nextVelocity.x = ((float) Math.random() * 500.0f) - 250.0f;
            nextVelocity.y = ((float) Math.random() * 500.0f) - 250.0f;
            nextAngle = (float) StrictMath.atan2(nextVelocity.y, nextVelocity.x) + (float)Math.PI/2.0f;
            nextAngle = MathUtils.normalizeAngle(nextAngle);

            //determine which direction to turn in and remaining turn angle
            final float angleDifference = MathUtils.normalizeAngle(nextAngle - super.angles);
            if(angleDifference >= Math.PI) {
                turnDirection = 1.0f;
            }
            else {
                turnDirection = -1.0f;
            }

            //change the states
            makingTurn = true;
            readyForNextTurn = false;
            super.deceleration = 0.0f;
            return;
        }

        //NPC in the middle of actually changing direction
        if(makingTurn) {
            super.velocity.x = 0.0f;
            super.velocity.y = 0.0f;
            final float angleChange = (float)Math.PI * (elapsedTime/1000.0f) * turnDirection;
            super.angles = MathUtils.normalizeAngle(super.angles);
            if(Math.abs(super.angles - nextAngle) <= Math.abs(angleChange)) {
                super.angles = nextAngle;
                makingTurn = false;
                readyForNextDirection = true;
            }
            else {
                super.angles -= angleChange;
            }
            return;
        }

        //NPC is in the process of moving
        super.tick(elapsedTime);

        //Check if NPC has stopped in both directions
        if(!xStopped && Math.abs(velocity.x) < 0.5) {
            xStopped = true;
        }
        if(!yStopped && Math.abs(velocity.y) < 0.5) {
            yStopped = true;
        }

        if(xStopped && yStopped) {
            readyForNextTurn = true;
            timeTilNextMove = 50L;
            super.deceleration = 0.0f;
        }
    }

    public static class VirusNpcSpawnRules extends SpawnRules {
        private static final int POPULATION_CAP = 300;

        private boolean dormant = false;

        public VirusNpcSpawnRules() {
            super(VirusNpc.class);
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
            final VirusNpc npc = new VirusNpc(world);
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
