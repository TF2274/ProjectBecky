package com.becky.world.entity;

import com.becky.world.physics.CollisionMesh;
import com.becky.world.physics.DefaultBulletCollisionDetector;

import java.awt.geom.Point2D;

public class RailBullet extends Bullet {
    private static final float TRAVEL_DISTANCE = 1600.0f;
    private static final int DAMAGE_FACTOR = 20;
    private static final Point2D.Float[] COLLISION_POINTS = new Point2D.Float[] {
        new Point2D.Float(-32.0f, 0.0f),
        new Point2D.Float(0.0f, -12.0f),
        new Point2D.Float(32.0f, 0.0f)
    };
    private static final int[] COLLISION_INDICES = new int[] { 0, 1, 2 };

    public RailBullet(final Player owner, final float px, final float py, final float vx, final float vy) {
        super(owner, px, py, vx, vy, TRAVEL_DISTANCE, DAMAGE_FACTOR, new CollisionMesh(COLLISION_POINTS, COLLISION_INDICES));
        super.collisionRadius = 32;
        super.addPhysicsFilter(DefaultBulletCollisionDetector.class);
    }
}
