package com.becky.world.entity.powerup;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.Player;
import com.becky.world.entity.SpawnRules;
import com.becky.world.physics.PowerupPhysics;

import java.awt.geom.Point2D;

public class HealthPowerup extends Powerup {
    private static final int HEALTH_INCREASE = 30;

    public HealthPowerup(final NewGameWorld world) {
        super(world);
        super.powerupHealth = 1;
        super.maxVelocity = 0;
        super.collisionRadius = 30;
        super.addPhysicsFilter(PowerupPhysics.class);
    }

    /**
     * the 100 is to be overwritten when maxHealth gets implemented
     *
     * @param player What will happen to the player when the powerup is picked up
     */
    @Override
    public void onDeath(final Player player) {
        if (player.getHealth() <= 100 - HEALTH_INCREASE) {
            player.setHealth(player.getHealth() + HEALTH_INCREASE, this.getClass().getSimpleName());
        } else {
            player.setHealth(100, this.getClass().getSimpleName());
        }
    }

    public static class HealthPowerupSpawnRules extends SpawnRules {
        private static final int MAX_POP = 10;

        public HealthPowerupSpawnRules() {
            super(HealthPowerup.class);
            super.setSpawnInterval(60000);
            super.setMaxPopulation(MAX_POP);
        }

        @Override
        public void spawn(final NewGameWorld gameWorld) {
            final int spawnNum = MAX_POP - getCurrentPopulation();
            final float width = gameWorld.getWorldWidth();
            final float height = gameWorld.getWorldHeight();
            for (int i = 0; i < spawnNum; i++) {
                final Point2D.Float pos = MathUtils.createRandomPointInBounds(0, 0, width, height);
//                final Point2D.Float pos = new Point2D.Float(300, 300);
                final HealthPowerup healthPowerup = new HealthPowerup(gameWorld);
                healthPowerup.setXPosition(pos.x);
                healthPowerup.setYPosition(pos.y);
                gameWorld.addGameEntity(healthPowerup);
            }

        }
    }
}
