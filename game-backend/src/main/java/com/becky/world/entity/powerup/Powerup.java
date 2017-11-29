package com.becky.world.entity.powerup;

import com.becky.networking.message.EntityMessage;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;

public abstract class Powerup extends GameEntity{
    protected int powerupHealth;
    protected int pointsValue = 0;

    protected Powerup(final NewGameWorld gameWorld){
        super(gameWorld);
    }

    public int getPowerupHealth() {
        return this.powerupHealth;
    }

    public void setPowerupHealth(int powerupHealth) {
        this.powerupHealth = powerupHealth;
        if(this.powerupHealth <= 0){
            this.powerupHealth = 0;
            super.setState(STATE_DEAD);
        }
    }

    public int getPointsValue() {
        return pointsValue;
    }

    public void setPointsValue(int pointsValue) {
        this.pointsValue = pointsValue;
    }

    @Override
    public EntityMessage getUpdateMessage() {
        final EntityMessage message = super.getUpdateMessage();
        message.setHealth(powerupHealth);
        return message;
    }

    /**
     * This is what will when the player picks up or shoots the Powerup.
     *
     * Any logic is allowed. any whatsoever
     *
     * @param player What will happen to the player when the powerup is picked up
     */
    public abstract void onDeath(Player player);

}
