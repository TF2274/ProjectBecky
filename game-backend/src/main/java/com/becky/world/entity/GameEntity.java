package com.becky.world.entity;

import com.becky.networking.message.EntityMessage;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.npc.VirusNpc;
import com.becky.world.physics.CollisionMesh;
import com.becky.world.physics.PhysicsFilter;

import java.awt.geom.Point2D;
import java.util.*;

public abstract class GameEntity {
    public static final int STATE_NEW = 1;
    public static final int STATE_UPDATE = 2;
    public static final int STATE_DEAD = 3;

    private static long entityCount = 1;
    private final long entityId;

    //parent and children
    protected NewGameWorld container;
    protected GameEntity parentEntity;
    protected List<GameEntity> childrenEntities;

    //position
    protected Point2D.Float position = new Point2D.Float();
    protected Point2D.Float velocity = new Point2D.Float();
    protected Point2D.Float acceleration = new Point2D.Float();
    protected float angles = 0.0f;
    protected float maxVelocity = Float.POSITIVE_INFINITY;
    protected float deceleration = 0.0f;

    //state
    private int state = STATE_NEW;
    private final String typeName;

    //collisions
    protected int collisionRadius;
    protected final CollisionMesh collisionMesh;
    private boolean meshTransformed = false;

    //used for physics filters
    private final List<Class<? extends PhysicsFilter>> filterApplies = new ArrayList<>();

    protected GameEntity(final NewGameWorld container) {
        this(container, null);
    }

    protected GameEntity(final NewGameWorld container, final CollisionMesh collisionMesh) {
        entityId = entityCount;
        entityCount++;
        this.container = container;
        this.typeName = this.getClass().getSimpleName();
        this.collisionMesh = collisionMesh;
    }

    public int getState() {
        if(state == STATE_NEW) {
            state = STATE_UPDATE;
            return STATE_NEW;
        }
        else {
            return state;
        }
    }

    public void setState(final int state) {
        this.state = state;
    }

    public void setCollisionRadius(final int radius) {
        this.collisionRadius = radius;
    }

    public int getCollisionRadius() {
        return this.collisionRadius;
    }

    public long getEntityId() {
        return this.entityId;
    }

    public float getXPosition() {
        return this.position.x;
    }

    public float getYPosition() {
        return this.position.y;
    }

    public void setXPosition(final float xPosition) {
        this.position.x = xPosition;
    }

    public void setYPosition(final float yPosition) {
        this.position.y = yPosition;
    }

    public float getXVelocity() {
        return this.velocity.x;
    }

    public float getYVelocity() {
        return this.velocity.y;
    }

    public void setXVelocity(final float xVelocity) {
        this.velocity.x = xVelocity;
    }

    public void setYVelocity(final float yVelocity) {
        this.velocity.y = yVelocity;
    }

    public float getXAcceleration() {
        return this.acceleration.x;
    }

    public float getYAcceleration() {
        return this.acceleration.y;
    }

    public void setXAcceleration(final float xAcceleration) {
        this.acceleration.x = xAcceleration;
    }

    public void setYAcceleration(final float yAcceleration) {
        this.acceleration.y = yAcceleration;
    }

    public void setAngles(final float angles) {
        this.angles = angles;
    }

    public float getAngles() {
        return this.angles;
    }

    public void tick(final long elapsedTime) {
        final float multiplier = elapsedTime / 1000.0f;
        meshTransformed = false;

        //apply acceleration to the entity
        if(Math.abs(acceleration.x) < 0.1) {
            if(velocity.x > 0.0f) {
                velocity.x -= deceleration * multiplier;
                if(velocity.x < 0.0f) {
                    velocity.x = 0.0f;
                }
            }
            else {
                velocity.x += deceleration * multiplier;
                if(velocity.x > 0.0f) {
                    velocity.x = 0.0f;
                }
            }
        }
        else {
            velocity.x += acceleration.x * multiplier;
        }

        if(Math.abs(acceleration.y) < 0.1) {
            if(velocity.y > 0.0f) {
                velocity.y -= deceleration * multiplier;
                if(velocity.y < 0.0f) {
                    velocity.y = 0.0f;
                }
            }
            else {
                velocity.y += deceleration * multiplier;
                if(velocity.y > 0.0f) {
                    velocity.y = 0.0f;
                }
            }
        }
        else {
            velocity.y += acceleration.y * multiplier;
        }

        //cap velocity
        capVelocity();

        //apply velocity to the position of this entity
        position.x += velocity.x * multiplier;
        position.y += velocity.y * multiplier;
    }

    public NewGameWorld getGameWorld() {
        return this.container;
    }

    public GameEntity getParent() {
        return this.parentEntity;
    }

    public Collection<GameEntity> getChildren() {
        return Collections.unmodifiableList(this.childrenEntities);
    }

    public boolean doesPhysicsApply(final Class<? extends PhysicsFilter> physics) {
        return this.state != STATE_DEAD && this.filterApplies.contains(physics);
    }

    public EntityMessage getUpdateMessage() {
        final EntityMessage message = new EntityMessage();
        message.setXPosition(getXPosition());
        message.setYPosition(getYPosition());
        message.setXVelocity(getXVelocity());
        message.setYVelocity(getYVelocity());
        message.setXAcceleration(getXAcceleration());
        message.setYAcceleration(getYAcceleration());
        message.setState(getState());
        message.setAngle(getAngles());
        message.setType(this.typeName);
        message.setEntityId(this.entityId);
        return message;
    }

    public CollisionMesh getCollisionMesh() {
        if(!meshTransformed && this.collisionMesh != null) {
            this.collisionMesh.transformToWorldSpace(this.position.x, this.position.y, this.angles);
        }
        return this.collisionMesh;
    }

    protected void addPhysicsFilter(final Class<? extends PhysicsFilter> filter) {
        filterApplies.add(filter);
    }

    protected void capVelocity() {
        if(maxVelocity == Float.POSITIVE_INFINITY) {
            return;
        }

        if(velocity.x > maxVelocity) {
            velocity.x = maxVelocity;
        }
        else if(velocity.x < -maxVelocity) {
            velocity.x = -maxVelocity;
        }

        if(velocity.y > maxVelocity) {
            velocity.y = maxVelocity;
        }
        else if(velocity.y < -maxVelocity) {
            velocity.y = -maxVelocity;
        }
    }
}
