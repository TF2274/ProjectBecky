package com.becky.world.weapon;

import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;
import com.becky.world.entity.bullet.Bullet;
import com.becky.world.entity.bullet.DefaultBullet;

public class ShotGun extends Gun {
    //config values
    private static final byte RATE_OF_FIRE = 2;
    private static final float VELOCITY = 500.0f;
    private static final byte NUM_BULLETS_PER_SHOT = 10;

    //derived values
    private static final float ANGLE_INCREMENT = (float) ((Math.PI / 4.0f) / NUM_BULLETS_PER_SHOT);

    public ShotGun(final Player weilder) {
        super(RATE_OF_FIRE, weilder);
    }

    @Override
    public void fire() {
        if (readyToFire()) {
            final float startAngles = weilder.getAngles() - (float) Math.PI / 8.0f;
            final float endAngles = startAngles + (float) Math.PI / 4.0f;
            for (float angles = startAngles; angles < endAngles; angles += ANGLE_INCREMENT) {
                fireBullet(angles);
            }
            super.fire();
        }
    }

    private void fireBullet(final float angles) {
        final float sin = (float) StrictMath.sin(angles);
        final float cos = (float) StrictMath.cos(angles);
        final float vX = cos * VELOCITY;
        final float vY = sin * VELOCITY;
        final float pX = cos * 32 + weilder.getXPosition();
        final float pY = sin * 32 + weilder.getYPosition();
        final Bullet bullet = new DefaultBullet(weilder, pX, pY, vX, vY);
        bullet.setState(GameEntity.STATE_NEW);
        bullet.setAngles(angles);
        weilder.getGameWorld().addGameEntity(bullet);
    }
}
