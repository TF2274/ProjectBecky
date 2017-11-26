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
    private final List<BlackHoleNpc> blackHoles = new ArrayList<>();
    private static final float EFFECT_DISTANCE = 750.0f;

    public BlackHolePhysics(final NewGameWorld gameWorld) {
        gameWorld.addWorldEventListener(this);
        final List<GameEntity> gameEntities = gameWorld.getAllGameEntities();
        for (final GameEntity entity : gameEntities) {
            if (entity instanceof BlackHoleNpc) {
                this.blackHoles.remove(entity);
            } else if (entity instanceof Player) {
                this.players.remove((entity));
            } else if (entity instanceof Npc) {
                this.npcs.remove((entity));

            }
        }
    }

    @Override
    public void apply(final GameEntity gameEntity) {
        if (!(gameEntity instanceof BlackHoleNpc)) {
            return;
        }
        for (final Npc npc : npcs) {
            changeAccel(gameEntity, npc);
            applyBlackHoleCollisionWithNpc(gameEntity, npc);
        }
        for (final Player player : players) {
            changeAccel(gameEntity, player);
            applyBlackHoleCollisionWithPlayer(gameEntity, player);
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

        if (distance <= 500.0f) {
            final float collisionAngle = MathUtils.getAngleBetweenEntities(gameEntity, entity);
            final float accelerationIncrease = EFFECT_DISTANCE / distance;
            final float sin = (float) StrictMath.sin(collisionAngle);
            final float cos = (float) StrictMath.cos(collisionAngle);

            entity.setXAcceleration(entity.getXAcceleration() + 1000.0f * cos * accelerationIncrease);
            entity.setYAcceleration(entity.getYAcceleration() + 1000.0f * sin * accelerationIncrease);
        }
    }

    @Override
    public void prepare() {

    }

    @Override
    public void onGameEntityRemoved(final NewGameWorld gameWorld, final GameEntity entity) {
        if (entity instanceof BlackHoleNpc) {
            this.blackHoles.remove(entity);
        } else if (entity instanceof Player) {
            this.players.remove((entity));
        } else if (entity instanceof Npc) {
            this.npcs.remove((entity));
        }
    }

    @Override
    public void onGameEntityAdded(final NewGameWorld gameWorld, final GameEntity entity) {
        if (entity instanceof BlackHoleNpc) {
            this.blackHoles.add((BlackHoleNpc) entity);
        } else if (entity instanceof Player) {
            this.players.add((Player) entity);
        } else if (entity instanceof Npc) {
            this.npcs.add((Npc) entity);
        }
    }
}
