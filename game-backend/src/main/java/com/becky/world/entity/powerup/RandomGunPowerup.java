package com.becky.world.entity.powerup;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.Player;
import com.becky.world.entity.SpawnRules;
import com.becky.world.physics.PowerupPhysics;
import com.becky.world.weapon.DefaultGun;
import com.becky.world.weapon.Gun;
import com.becky.world.weapon.RailGun;
import com.becky.world.weapon.ShotGun;

import java.awt.geom.Point2D;

public class RandomGunPowerup extends Powerup {
//    private Set<Class<? extends Gun>> gunTypeClasses;

    public RandomGunPowerup(final NewGameWorld gameWorld) {
        super(gameWorld);
        super.powerupHealth = 1;
        super.maxVelocity = 0.0f;
        super.collisionRadius = 25;
        super.addPhysicsFilter(PowerupPhysics.class);
//        populateGunList();
    }

//    private void populateGunList() {
//        final Reflections reflections = new Reflections(this.getClass().getPackage().getName());
//        gunTypeClasses = reflections.getSubTypesOf(Gun.class);
//    }

    @Override
    public void onDeath(final Player player) {
        final int gunNum = (int) (Math.random() * 3);
        final Gun gun;
        switch (gunNum) {
            case 0:
                gun = new DefaultGun(player);
                player.setGun(gun);
                break;
            case 1:
                gun = new RailGun(player);
                player.setGun(gun);
                break;
            case 2:
                gun = new ShotGun(player);
                player.setGun(gun);
                break;
            default:
                gun = new DefaultGun(player);
                player.setGun(gun);
        }
    }

    public static class RandomGunPowerupSpawnRules extends SpawnRules{
        private static final int MAX_POP = 10;

        public RandomGunPowerupSpawnRules(){
            super(RandomGunPowerup.class);
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
//                final Point2D.Float pos = new Point2D.Float(300, 300);
                final RandomGunPowerup randomGunPowerup = new RandomGunPowerup(gameWorld);
                randomGunPowerup.setXPosition(pos.x);
                randomGunPowerup.setYPosition(pos.y);
                gameWorld.addGameEntity(randomGunPowerup);
            }
        }
    }
}
