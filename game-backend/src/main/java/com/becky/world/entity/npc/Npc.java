package com.becky.world.entity.npc;

import com.becky.networking.message.EntityMessage;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.GameEntity;

public abstract class Npc extends GameEntity {
    protected int npcHealth;
    protected int pointsValue = 0;

    protected Npc(final NewGameWorld gameWorld) {
        super(gameWorld);
    }

    public int getNpcHealth() {
        return this.npcHealth;
    }

    public void setNpcHealth(final int health) {
        this.npcHealth = health;
        if(this.npcHealth <= 0) {
            this.npcHealth = 0;
            super.setState(STATE_DEAD);
        }
    }

    public void setNpcPointsValue(final int value) {
        this.pointsValue = value;
    }

    public int getNpcPointsValue() {
        return this.pointsValue;
    }

    @Override
    public EntityMessage getUpdateMessage() {
        final EntityMessage message = super.getUpdateMessage();
        message.setHealth(npcHealth);
        return message;
    }
}
