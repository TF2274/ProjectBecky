package com.becky.world.entity;

public class RailBullet extends Bullet {
    private static final float TRAVEL_DISTANCE = 800.0f;
    private static final int DAMAGE_FACTOR = 10;

    public RailBullet(final Player owner, final float px, final float py, final float vx, final float vy) {
        super(owner, px, py, vx, vy, TRAVEL_DISTANCE, DAMAGE_FACTOR);
        super.collisionRadius = 32;
    }
}
