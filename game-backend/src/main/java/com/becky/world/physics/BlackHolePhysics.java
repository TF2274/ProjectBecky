package com.becky.world.physics;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.WorldEventListener;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;
import com.becky.world.entity.npc.BlackHoleNpc;
import com.becky.world.entity.npc.Npc;

import java.util.ArrayList;
import java.util.List;

public class BlackHolePhysics implements PhysicsFilter, WorldEventListener {
    private final List<Npc> npcs = new ArrayList<>();
    private final List<Player> players = new ArrayList<>();
    private static final float EFFECT_DISTANCE = 750.0f;
    private static final float EFFECT_STRENGTH = 2.0f;

    public BlackHolePhysics(final NewGameWorld gameWorld) {
        gameWorld.addWorldEventListener(this);
        final List<GameEntity> gameEntities = gameWorld.getAllGameEntities();
        for (final GameEntity entity : gameEntities) {
            if (entity instanceof Player) {
                this.players.add((Player)entity);
            } else if ((entity instanceof Npc) && !(entity instanceof BlackHoleNpc)) {
                this.npcs.add((Npc)entity);
            }
        }
    }

    @Override
    public void apply(final GameEntity gameEntity) {
        synchronized (npcs) {
            for (final Npc npc : npcs) {
                if(isLooselyClose(gameEntity, npc)) {
                    changeAccel(gameEntity, npc);
                    applyBlackHoleCollisionWithNpc(gameEntity, npc);
                }
            }
        }
        synchronized (players) {
            for (final Player player : players) {
                if(isLooselyClose(gameEntity, player)) {
                    changeAccel(gameEntity, player);
                    applyBlackHoleCollisionWithPlayer(gameEntity, player);
                }
            }
        }
    }

    private void applyBlackHoleCollisionWithNpc(final GameEntity entity, final Npc npc) {
        final float distance = MathUtils.distance(npc, entity);
        final float radiusSum = entity.getCollisionRadius() + npc.getCollisionRadius();
        final BlackHoleNpc blackHoleNpc = (BlackHoleNpc) entity;
        if (distance < radiusSum) {
            npc.setNpcHealth(npc.getNpcHealth()- blackHoleNpc.getNpcHealth());
        }
    }

    private void applyBlackHoleCollisionWithPlayer(final GameEntity entity, final Player player) {
        if(MathUtils.distance(entity, player) < entity.getCollisionRadius()) {
            final Npc npc = (BlackHoleNpc) entity;
            player.setHealth(player.getHealth() - npc.getNpcHealth(), npc.getClass().getSimpleName());
        }
    }

    private void changeAccel(final GameEntity gameEntity, final GameEntity entity) {
        final float distance = MathUtils.distance(gameEntity, entity);

        if (distance <= EFFECT_DISTANCE) {
            final float collisionAngle = MathUtils.getAngleBetweenEntities(gameEntity, entity);
            final float accelerationIncrease = EFFECT_STRENGTH * EFFECT_DISTANCE / distance;
            final float sin = (float) StrictMath.sin(collisionAngle);
            final float cos = (float) StrictMath.cos(collisionAngle);

            entity.setXAcceleration(entity.getXAcceleration() + 1000.0f * cos * accelerationIncrease);
            entity.setYAcceleration(entity.getYAcceleration() + 1000.0f * sin * accelerationIncrease);
        }
    }

    /**
     * Does a loose check to see if the game entity is within the bounds of the black hole.
     * This is a cheaper calculation than distance formula, but is only good as a primary check.
     * @param blackhole
     * @param other
     * @return
     */
    private boolean isLooselyClose(final GameEntity blackhole, final GameEntity other) {
        return Math.abs(blackhole.getXPosition() - other.getXPosition()) < EFFECT_DISTANCE &&
               Math.abs(blackhole.getYPosition() - other.getYPosition()) < EFFECT_DISTANCE;
    }

    @Override
    public void prepare() {

    }

    @Override
    public void onGameEntityRemoved(final NewGameWorld gameWorld, final GameEntity entity) {
        if (entity instanceof Player) {
            synchronized (this.players) {
                this.players.remove(entity);
            }
        } else if (entity instanceof Npc) {
            synchronized (this.npcs) {
                this.npcs.remove(entity);
            }
        }
    }

    @Override
    public void onGameEntityAdded(final NewGameWorld gameWorld, final GameEntity entity) {
        if (entity instanceof Player) {
            synchronized (this.players) {
                this.players.add((Player)entity);
            }
        } else if ((entity instanceof Npc) && !(entity instanceof BlackHoleNpc)) {
            synchronized (this.npcs) {
                this.npcs.add((Npc)entity);
            }
        }
    }
}
