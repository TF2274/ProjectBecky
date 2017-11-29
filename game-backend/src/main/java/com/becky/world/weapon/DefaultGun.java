package com.becky.world.weapon;

import com.becky.world.entity.bullet.Bullet;
import com.becky.world.entity.bullet.DefaultBullet;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;

public class DefaultGun extends Gun {
    private static final byte RATE_OF_FIRE = 10; //per second
    private static final float VELOCITY = 500.0f;

    public DefaultGun(final Player weilder) {
        super(RATE_OF_FIRE, weilder);
    }

    @Override
    public void fire() {
        if(readyToFire()) {
            //determine location and velocity of bullet
            final float angles = weilder.getAngles();
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
            super.fire();
        }
    }
}
