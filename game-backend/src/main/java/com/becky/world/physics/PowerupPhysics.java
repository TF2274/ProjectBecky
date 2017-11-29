package com.becky.world.physics;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.WorldEventListener;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;
import com.becky.world.entity.bullet.Bullet;
import com.becky.world.entity.npc.Npc;
import com.becky.world.entity.powerup.Powerup;

import java.util.ArrayList;
import java.util.List;

public class PowerupPhysics implements PhysicsFilter, WorldEventListener {
    private final List<Player> players = new ArrayList<>();
    private final List<Bullet> bullets = new ArrayList<>();
    private final List<Npc> npcs = new ArrayList<>();

    public PowerupPhysics(final NewGameWorld gameWorld) {
        gameWorld.addWorldEventListener(this);
        final List<GameEntity> gameEntities = gameWorld.getAllGameEntities();

        for (final GameEntity entity : gameEntities) {
            if (entity instanceof Player) {
                this.players.add((Player) entity);
            } else if (entity instanceof Bullet) {
                this.bullets.add((Bullet) entity);
            } else if (entity instanceof Npc) {
                this.npcs.add((Npc) entity);
            }
        }
    }

    @Override
    public void apply(final GameEntity entity) {
        if(!(entity instanceof Powerup)){
            return;
        }
        for(final Npc npc : npcs){
            applyPowerupCollisionWithNpc(entity, npc);
        }

//        for(final Bullet bullet : bullets){
//            applyPowerupCollisionWithBullet(entity, bullet);
//        }

        for(final Player player : players){
            applyPowerupCollisionWithPlayer(entity, player);
        }
    }



    private void applyPowerupCollisionWithBullet(final GameEntity entity, final Bullet bullet){
        final float distance = MathUtils.distance(bullet, entity);
        final float radiusSum = bullet.getCollisionRadius() + entity.getCollisionRadius();
        if(distance < radiusSum) {
            final Powerup powerup = (Powerup) entity;
            powerup.onDeath(bullet.getOwner());
            powerup.setPowerupHealth(0);
            bullet.setState(GameEntity.STATE_DEAD);
        }
    }

    private void applyPowerupCollisionWithPlayer(final GameEntity entity, final Player player){
        final float distance = MathUtils.distance(player, entity);
        final float radiusSum = player.getCollisionRadius() + entity.getCollisionRadius();
        if(distance < radiusSum) {
            final Powerup powerup = (Powerup) entity;
            powerup.onDeath(player);
            powerup.setPowerupHealth(0);
        }
    }

    private void applyPowerupCollisionWithNpc(final GameEntity powerup, final Npc npc){
        final float distance = MathUtils.distance(npc, powerup);
        final float radiusSum = npc.getCollisionRadius() + powerup.getCollisionRadius();

        if(distance < radiusSum) {
            final float collisionAngle = MathUtils.getAngleBetweenEntities(npc, powerup);
            final float halfDelta = (radiusSum - distance)/2.0f;
            final float sin = (float)StrictMath.sin(collisionAngle);
            final float cos = (float)StrictMath.cos(collisionAngle);

            npc.setXPosition(npc.getXPosition() + cos*halfDelta);
            npc.setYPosition(npc.getYPosition() + sin*halfDelta);

            final float xV = npc.getXVelocity()/2;
            final float yV = npc.getYVelocity()/2;
            npc.setXVelocity(-xV);
            npc.setYVelocity(-yV);
        }
    }

    @Override
    public void prepare() {

    }

    @Override
    public void onGameEntityRemoved(final NewGameWorld gameWorld, final GameEntity entity) {
        if (entity instanceof Player) {
            this.players.remove(entity);
        } else if (entity instanceof Bullet) {
            this.bullets.remove(entity);
        } else if (entity instanceof Npc) {
            this.npcs.remove(entity);
        }
    }

    @Override
    public void onGameEntityAdded(final NewGameWorld gameWorld, final GameEntity entity) {
        if (entity instanceof Player) {
            this.players.add((Player) entity);
        } else if (entity instanceof Bullet) {
            this.bullets.add((Bullet) entity);
        } else if (entity instanceof Npc) {
            this.npcs.add((Npc) entity);
        }
    }
}
