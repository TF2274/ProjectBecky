package com.becky.world.physics;

import com.becky.world.NewGameWorld;
import com.becky.world.entity.Bullet;
import com.becky.world.entity.GameEntity;

public class RailBulletCollisionDetector extends DefaultBulletCollisionDetector {
    public RailBulletCollisionDetector(final NewGameWorld gameWorld) {
        super(gameWorld);
    }

    @Override
    protected boolean isBulletColliding(final GameEntity entity, final Bullet bullet) {
        if(!super.isBulletColliding(entity, bullet)) {
            return false;
        }

        //part of entity radius is within bullet radius
        //Must check if one of the arms of the bullet is colliding
    }
}
