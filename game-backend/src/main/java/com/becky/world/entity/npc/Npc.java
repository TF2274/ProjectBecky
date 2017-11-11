package com.becky.world.entity.npc;

import com.becky.world.NewGameWorld;
import com.becky.world.entity.GameEntity;
import com.becky.world.physics.BulletCollisionDetector;
import com.becky.world.physics.NpcCollisionDetector;
import com.becky.world.physics.WorldBorderCollisionDetector;

public abstract class Npc extends GameEntity {
    public static final int NPC_STATE_NEW = 111;
    public static final int NPC_STATE_UPDATE = 112;
    public static final int NPC_STATE_DEAD = 113;

    private int npcState = NPC_STATE_NEW;
    protected int npcHealth;
    protected int pointsValue = 0;

    protected Npc(final NewGameWorld gameWorld) {
        super(gameWorld);
        super.addPhysicsFilter(WorldBorderCollisionDetector.class);
        super.addPhysicsFilter(NpcCollisionDetector.class);
        super.addPhysicsFilter(BulletCollisionDetector.class);
    }

    public int getNpcState() {
        if(npcState == NPC_STATE_NEW) {
            npcState = NPC_STATE_UPDATE;
            return NPC_STATE_NEW;
        }

        return npcState;
    }

    public void setNpcState(final int npcState) {
        this.npcState = npcState;
    }

    public int getNpcHealth() {
        return this.npcHealth;
    }

    public void setNpcHealth(final int health) {
        this.npcHealth = health;
        if(this.npcHealth < 0) {
            this.npcHealth = 0;
            this.npcState = NPC_STATE_DEAD;
        }
    }

    public void setNpcPointsValue(final int value) {
        this.pointsValue = value;
    }

    public int getNpcPointsValue() {
        return this.pointsValue;
    }
}
