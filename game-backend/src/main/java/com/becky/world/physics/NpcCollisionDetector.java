package com.becky.world.physics;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.WorldEventListener;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;
import com.becky.world.entity.npc.Npc;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

public class NpcCollisionDetector implements PhysicsFilter, WorldEventListener {
    private final List<Npc> npcs = new ArrayList<>();
    private final List<Player> players = new ArrayList<>();

    public NpcCollisionDetector(final NewGameWorld gameWorld) {
        gameWorld.addWorldEventListener(this);
    }

    @Override
    public void apply(final GameEntity gameEntity) {
        if(!(gameEntity instanceof Npc)) {
            return;
        }
        final Npc npc = (Npc)gameEntity;
        applyNpcCollisionWithNpc(npc);
        applyNpcCollisionWithPlayer(npc);
    }

    private void applyNpcCollisionWithNpc(final Npc npc) {
        for(final Npc entity: npcs) {
            final float distance = MathUtils.distance(npc, entity);
            final float radiusSum = npc.getCollisionRadius() + entity.getCollisionRadius();

            if(!npc.equals(entity) && distance < radiusSum) {
                final float collisionAngle = MathUtils.getAngleBetweenEntities(npc, entity);
                final float halfDelta = (radiusSum - distance)/2.0f;
                final float sin = (float)StrictMath.sin(collisionAngle);
                final float cos = (float)StrictMath.cos(collisionAngle);

                npc.setXPosition(npc.getXPosition() + cos*halfDelta);
                npc.setYPosition(npc.getYPosition() + sin*halfDelta);
                entity.setXPosition(entity.getXPosition() - cos*halfDelta);
                entity.setYPosition(entity.getYPosition() - sin*halfDelta);

                final float xV = npc.getXVelocity()/2;
                final float yV = npc.getYVelocity()/2;
                npc.setXVelocity(-xV);
                npc.setYVelocity(-yV);
                entity.setXVelocity(entity.getXVelocity() + xV);
                entity.setYVelocity(entity.getYVelocity() + yV);
            }
        }
    }

    private void applyNpcCollisionWithPlayer(final Npc npc) {
        for(final Player player: players) {
            if(MathUtils.distance(npc, player) > npc.getCollisionRadius() + player.getCollisionRadius()) {
                continue;
            }
            final float collisionAngle = MathUtils.getAngleBetweenEntities(player, npc);
            player.setXVelocity(player.getXVelocity() + 300.0f * (float)StrictMath.cos(collisionAngle));
            player.setYVelocity(player.getYVelocity() + 300.0f * (float)StrictMath.sin(collisionAngle));
            player.setHealth(player.getHealth() - npc.getNpcHealth(), npc.getClass().getSimpleName());
            npc.setNpcHealth(0);
            npc.setNpcState(Npc.NPC_STATE_DEAD);
        }
    }

    @Override
    public void prepare() {

    }

    @Override
    public void onGameEntityRemoved(final NewGameWorld world, final GameEntity entity) {
        if(entity instanceof Npc) {
            this.npcs.remove(entity);
        }
        else if(entity instanceof Player) {
            this.players.remove(entity);
        }
    }

    @Override
    public void onGameEntityAdded(final NewGameWorld world, final GameEntity entity) {
        if(entity instanceof Npc) {
            this.npcs.add((Npc)entity);
        }
        else if(entity instanceof Player) {
            this.players.add((Player)entity);
        }
    }
}
