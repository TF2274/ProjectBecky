package com.becky.world.entity;

import com.becky.networking.message.EntityMessage;
import com.becky.world.physics.CollisionMesh;
import com.becky.world.physics.WorldBorderCollisionDetector;

/**
 * Defines a type of bullet shot by a player
 */
public abstract class Bullet extends GameEntity {
    protected final Player owner;
    protected int damageAmount;
    protected float remainingHealth = 0.0f;

    protected Bullet(final Player owner,
                     final float xPosition,
                     final float yPosition,
                     final float xVelocity,
                     final float yVelocity,
                     final float travelDistance,
                     final int damageAmount) {
        this(owner, xPosition, yPosition, xVelocity, yVelocity, travelDistance, damageAmount, null);
    }

    protected Bullet(final Player owner,
                     final float xPosition,
                     final float yPosition,
                     final float xVelocity,
                     final float yVelocity,
                     final float travelDistance,
                     final int damageAmount,
                     final CollisionMesh collisionMesh) {
        super(owner.getGameWorld(), collisionMesh);
        super.addPhysicsFilter(WorldBorderCollisionDetector.class);
        this.owner = owner;
        position.x = xPosition;
        position.y = yPosition;
        velocity.x = xVelocity;
        velocity.y = yVelocity;
        this.damageAmount = damageAmount;
        this.remainingHealth = travelDistance;
    }

    /**
     * Gets the player that fired this bullet.
     * @return
     */
    public Player getOwner() {
        return this.owner;
    }

    /**
     * Get the amount of damage done by this bullet.
     * @return
     */
    public int getDamage() {
        return this.damageAmount;
    }

    /**
     * Sets the amount of damage done by this bullet.
     * @param damage
     */
    public void setDamage(final int damage) {
        this.damageAmount = damage;
    }

    /**
     * Gets the remaining health of this bullet.
     * @return
     */
    public float getRemainingHealth() {
        return this.remainingHealth;
    }

    @Override
    public void setXVelocity(final float xVelocity) {
        if(Math.abs(xVelocity) < 0.1f) {
            super.setState(STATE_DEAD);
        }
        super.setXVelocity(xVelocity);
    }

    @Override
    public void setYVelocity(final float yVelocity) {
        if(Math.abs(yVelocity) < 0.1f) {
            super.setState(STATE_DEAD);
        }
        super.setYVelocity(yVelocity);
    }

    @Override
    public float getXAcceleration() {
        return 0;
    }

    @Override
    public float getYAcceleration() {
        return 0;
    }

    @Override
    public void setXAcceleration(final float xAcceleration) { }

    @Override
    public void setYAcceleration(final float yAcceleration) { }

    @Override
    public void tick(final long elapsedTime) {
        final float multiplier = elapsedTime / 1000.0f;
        final float deltaX = this.velocity.x * multiplier;
        final float deltaY = this.velocity.y * multiplier;
        this.position.x += deltaX;
        this.position.y += deltaY;
        this.remainingHealth -= (deltaX + deltaY);
        if(this.remainingHealth <= 0.0f) {
            super.setState(STATE_DEAD);
        }

        if(Math.abs(this.velocity.x) < 0.1f && Math.abs(this.velocity.y) < 0.1f) {
            super.setState(STATE_DEAD);
        }
    }

    @Override
    public EntityMessage getUpdateMessage() {
        final EntityMessage message = super.getUpdateMessage();
        message.setOwner(this.owner.getPlayerUsername());
        return message;
    }
}
