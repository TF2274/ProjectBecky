package com.becky.world.entity;

public class DefaultBullet extends Bullet {
    private static final float TRAVEL_DISTANCE = 800.0f;
    private static final int DAMAGE_FACTOR = 5;

    private float remainingHealth = TRAVEL_DISTANCE;

    public DefaultBullet(final Player owner,
                         final float xPosition,
                         final float yPosition,
                         final float xVelocity,
                         final float yVelocity) {
        super(owner, xPosition, yPosition, xVelocity, yVelocity, DAMAGE_FACTOR);
    }

    @Override
    public float getRemainingHealth() {
        return this.remainingHealth;
    }

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

        super.tick(elapsedTime);
    }
}
