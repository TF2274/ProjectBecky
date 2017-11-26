package com.becky.world.entity.npc;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.WorldEventListener;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.SpawnRules;
import com.becky.world.physics.BlackHolePhysics;
import com.becky.world.physics.NpcCollisionDetector;

import java.awt.geom.Point2D;

/**
 * Npc class which doesn't move and slowly pull everything to it. (Self-explanatory)
 * Createed By William Parish 11/18/17
 */
public class BlackHoleNpc extends Npc implements WorldEventListener {
    public static final float MAX_EFFECT_DISTANCE = 300.0f;

    public BlackHoleNpc(final NewGameWorld world) {
        super(world);
        super.maxVelocity = 0.0f;
        super.npcHealth = 150;
        super.pointsValue = 75;
        super.collisionRadius = 15;
        super.addPhysicsFilter(BlackHolePhysics.class);
    }

    @Override
    public void onGameEntityRemoved(final NewGameWorld gameWorld, final GameEntity entity) {

    }

    @Override
    public void onGameEntityAdded(final NewGameWorld gameWorld, final GameEntity entity) {

    }

    public static class BlackHoleNpcSpawnRules extends SpawnRules {
        private static final int MAX_POP = 5;

        public BlackHoleNpcSpawnRules() {
            super(BlackHoleNpc.class);
            super.setSpawnInterval(30000);
            super.setMaxPopulation(MAX_POP);
        }

        @Override
        public void spawn(final NewGameWorld gameWorld) {
            final int spawnNum = MAX_POP - getCurrentPopulation();
            final float width = gameWorld.getWorldWidth();
            final float height = gameWorld.getWorldHeight();
            for (int i = 0; i < spawnNum; i++) {
                final Point2D.Float pos = MathUtils.createRandomPointInBounds(0, 0, width, height);
                final BlackHoleNpc npc = new BlackHoleNpc(gameWorld);
                npc.setXPosition(pos.x);
                npc.setYPosition(pos.y);
                gameWorld.addGameEntity(npc);
            }
        }
    }

}