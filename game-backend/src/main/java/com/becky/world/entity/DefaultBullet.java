package com.becky.world.entity;

import com.becky.world.physics.DefaultBulletCollisionDetector;

public class DefaultBullet extends Bullet {
    private static final float TRAVEL_DISTANCE = 800.0f;
    private static final int DAMAGE_FACTOR = 5;

    public DefaultBullet(final Player owner,
                         final float xPosition,
                         final float yPosition,
                         final float xVelocity,
                         final float yVelocity) {
        super(owner, xPosition, yPosition, xVelocity, yVelocity, TRAVEL_DISTANCE, DAMAGE_FACTOR);
        super.collisionRadius = 8;
        super.addPhysicsFilter(DefaultBulletCollisionDetector.class);
    }
}
