package com.becky.world.entity;

import com.becky.networking.message.EntityMessage;
import com.becky.world.physics.WorldBorderCollisionDetector;

/**
 * Defines a type of bullet shot by a player
 */
public abstract class Bullet extends GameEntity {
    protected final Player owner;
    protected final int damageAmount;

    protected Bullet(final Player owner,
                     final float xPosition,
                     final float yPosition,
                     final float xVelocity,
                     final float yVelocity,
                     final int damageAmount) {
        super(owner.getGameWorld());
        super.addPhysicsFilter(WorldBorderCollisionDetector.class);
        this.owner = owner;
        position.x = xPosition;
        position.y = yPosition;
        velocity.x = xVelocity;
        velocity.y = yVelocity;
        this.damageAmount = damageAmount;
        super.collisionRadius = 24;
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
     * Gets the remaining health of this bullet.
     * @return
     */
    public abstract float getRemainingHealth();

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
        if(Math.abs(this.velocity.x) < 0.1f && Math.abs(this.velocity.y) < 0.1f) {
            super.setState(STATE_DEAD);
        }
    }

    @Override
    public EntityMessage getUpdateMessage() {
        final EntityMessage message = super.getUpdateMessage();
        message.setOwner(owner.getPlayerUsername());
        return message;
    }
}
