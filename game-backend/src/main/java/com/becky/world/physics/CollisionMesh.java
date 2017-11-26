package com.becky.world.physics;

import com.becky.util.MathUtils;

import java.awt.geom.Point2D;
import java.util.Arrays;

public class CollisionMesh {
    private static final float ANGLE_OFFSET = (float)Math.PI / 2.0f;

    protected final Point2D.Float[] localPoints;
    protected final Point2D.Float[] worldspacePoints;
    private final int[] indices;

    public CollisionMesh(final Point2D.Float[] meshPoints, final int[] indices) {
        //triangles have three vertices. This means there must be at least three points to make
        //up one triangle. Additionally, there must be enough indices to form triangles. For every
        //three indices, a triangle is formed.
        if(meshPoints.length < 3 || indices.length % 3 != 0) {
            throw new IllegalArgumentException("The vertices and indices passed to a collision mesh" +
                " must form a set of triangles. (indices.length % 3 must be zero, and meshPoints.length " +
                "must be 3 or greater.");
        }


        //basic memcopy operations for points and indices
        localPoints = new Point2D.Float[meshPoints.length];
        worldspacePoints = new Point2D.Float[meshPoints.length];
        for(int i = 0; i < meshPoints.length; i++) {
            final Point2D.Float p = meshPoints[i];
            final Point2D.Float q = new Point2D.Float();
            localPoints[i] = q;
            worldspacePoints[i] = new Point2D.Float();
            q.x = p.x;
            q.y = p.y;
        }
        this.indices = Arrays.copyOf(indices, indices.length);
    }

    /**
     * Transforms the local points in this collision mesh into world space so a collision can actually
     * be tested. This method must be called at least once for a given tick before collision testing can begin.
     * @param x
     * @param y
     * @param a
     */
    public void transformToWorldSpace(final float x, final float y, final float a) {
        final float sinA = (float)StrictMath.sin(a + ANGLE_OFFSET);
        final float cosA = (float)StrictMath.cos(a + ANGLE_OFFSET);

        for(int i = 0; i < localPoints.length; i++) {
            final Point2D.Float p = localPoints[i];
            final Point2D.Float q = worldspacePoints[i];
            q.x = p.x*cosA - p.y*sinA;
            q.y = p.x*sinA + p.y*cosA;

            q.x += x;
            q.y += y;
        }
    }

    /**
     * Tests if another mesh is colliding with this one.
     * @param otherMesh
     * @return
     */
    public boolean isMeshCollidingWidth(final CollisionMesh otherMesh) {
        final Point2D.Float[] otherPoints = otherMesh.worldspacePoints;
        final int length = indices.length - 2;

        //loop through each triangle in the collision mesh
        for(int i = 0; i < length; i += 3) {
            //get the current triangle to work with
            final Point2D.Float v1 = worldspacePoints[indices[i]];
            final Point2D.Float v2 = worldspacePoints[indices[i+1]];
            final Point2D.Float v3 = worldspacePoints[indices[i+2]];

            //check if any of the other mesh's points are inside of the current triangle
            for(final Point2D.Float point: otherPoints) {
                if(pointInTriangle(point, v1, v2, v3)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns true if at least one point in this collision mesh is within a certain radius of a given point
     * @param point
     * @param radius
     * @return
     */
    public boolean pointsInRadius(final float x, final float y, final float radius) {
        for(final Point2D.Float point: worldspacePoints) {
            if(MathUtils.distance(x, y, point.x, point.y) <= radius) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests if a point "point" is inside of a triangle made up of vertices v1, v2, and v3
     * @param point
     * @param v1
     * @param v2
     * @param v3
     * @return
     */
    private boolean pointInTriangle(
        final Point2D.Float point,
        final Point2D.Float v1,
        final Point2D.Float v2,
        final Point2D.Float v3) {
        final boolean sign1 = sign(point, v1, v2);
        final boolean sign2 = sign(point, v2, v3);
        if(sign1 != sign2) {
            return false;
        }
        //sign1 == sign2
        final boolean sign3 = sign(point, v3, v1);
        return sign2 == sign3;
    }

    /**
     * Tests which side a point is on of a line formed by vertices v1 and v2.
     * @param point
     * @param v1
     * @param v2
     * @return
     */
    private boolean sign(final Point2D.Float point, final Point2D.Float v1, final Point2D.Float v2) {
        return (point.x - v2.x) * (v1.y - v2.y) - (v1.x - v2.x) * (point.y - v2.y) < 0.0f;
    }
}
