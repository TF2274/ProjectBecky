package com.becky.util;

import com.becky.world.entity.GameEntity;

import java.awt.geom.Point2D;

public class MathUtils {
    public static float distance(final GameEntity first, final GameEntity second) {
        return MathUtils.distance(first.getXPosition(), first.getYPosition(), second.getXPosition(), second.getYPosition());
    }

    public static float distance(final float x1, final float y1, final float x2, final float y2) {
        return (float)Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
    }

    public static float getAngleBetweenEntities(final GameEntity first, final GameEntity second) {
        final float deltaX = first.getXPosition() - second.getXPosition();
        final float deltaY = first.getYPosition() - second.getYPosition();
        if(deltaX == 0.0f && deltaY == 0.0f) {
            return 0.0f;
        }

        return (float)StrictMath.atan2(deltaY, deltaX);
    }

    public static float normalizeAngle(final float angle) {
        if(angle < 0) {
            return angle + 2*(float)Math.PI;
        }
        else {
            return angle - 2*(float)Math.PI;
        }
    }

    public static Point2D.Float createRandomPointInBounds(
            final float minX,
            final float minY,
            final float maxX,
            final float maxY) {
            return new Point2D.Float((float)(Math.random() * (maxX-minX)) + minX,
                                     (float)(Math.random() * (maxY-minY)) + minY);
    }
}
