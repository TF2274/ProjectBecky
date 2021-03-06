package com.becky.world.physics;

import com.becky.world.NewGameWorld;
import com.becky.world.WorldEventListener;
import com.becky.world.entity.bullet.Bullet;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;
import com.becky.world.entity.npc.Npc;

import java.util.ArrayList;
import java.util.List;

public class DefaultBulletCollisionDetector implements PhysicsFilter, WorldEventListener {
    private final List<Npc> worldNpcs = new ArrayList<>();
    private final List<Player> worldPlayers = new ArrayList<>();

    public DefaultBulletCollisionDetector(final NewGameWorld gameWorld) {
        sortGameEntities(gameWorld.getAllGameEntities());
        gameWorld.addWorldEventListener(this);
    }

    @Override
    public void apply(final GameEntity gameEntity) {
        final Bullet bullet = (Bullet)gameEntity;

        //check collision with players
        for(final Player player: worldPlayers) {
            if(isBulletColliding(player, bullet)) {
                if(bullet.getOwner().equals(player)) {
                    continue;
                }
                //damage is how much health the bullet will remove from the entity it collided with
                //health is the amount of health the entity has remaining
                final int damage = bullet.getDamage();
                final int health = player.getHealth();
                //setting health will automatically set the player state if necessary
                player.setHealth(health - damage, bullet.getOwner().getPlayerUsername());

                //only add points if player is dead
                if(player.getState() == GameEntity.STATE_DEAD) {
                    bullet.getOwner().addScore(Math.max(500, player.getScore() / 10));
                }

                //if the bullet can cause more damage than the entity has health, then the bullet
                //damage should be reduced without destroying the bullet.
                //if the bullet damage is <= entity health, then the bullet and entity are killed
                if(damage <= health) {
                    bullet.setState(GameEntity.STATE_DEAD);
                }
                else {
                    //this means the bullet still can continue damaging things after reducing entity health
                    bullet.setDamage(damage - health);
                }
                return;
            }
        }

        //check collision with NPCs
        for(final Npc npc: worldNpcs) {
            if(isBulletColliding(npc, bullet)) {
                //damage is how much health the bullet will remove from the entity it collided with
                //health is the amount of health the entity has remaining
                final int damage = bullet.getDamage();
                final int health = npc.getNpcHealth();
                //setting health will automatically set the player state if necessary
                npc.setNpcHealth(health - damage);

                //only add points if npc is dead
                if(npc.getState() == GameEntity.STATE_DEAD) {
                    bullet.getOwner().addScore(npc.getNpcPointsValue());
                }

                //if the bullet can cause more damage than the entity has health, then the bullet
                //damage should be reduced without destroying the bullet.
                //if the bullet damage is <= entity health, then the bullet and entity are killed
                if(damage <= health) {
                    bullet.setState(GameEntity.STATE_DEAD);
                }
                else {
                    //this means the bullet still can continue damaging things after reducing entity health
                    bullet.setDamage(damage - health);
                }
                return;
            }
        }
    }

    @Override
    public void prepare() {}

    @Override
    public void onGameEntityRemoved(final NewGameWorld world, final GameEntity entity) {
        if(entity instanceof Npc) {
            this.worldNpcs.remove(entity);
        }
        else if(entity instanceof Player) {
            this.worldPlayers.remove(entity);
        }
    }

    @Override
    public void onGameEntityAdded(final NewGameWorld world, final GameEntity entity) {
        if(entity instanceof Npc) {
            this.worldNpcs.add((Npc)entity);
        }
        else if(entity instanceof Player) {
            this.worldPlayers.add((Player)entity);
        }
    }

    private boolean isBulletColliding(final GameEntity entity, final Bullet bullet) {
        final float collisionDistance = entity.getCollisionRadius() + bullet.getCollisionRadius();
        final float delta = distance(entity.getXPosition(), entity.getYPosition(), bullet.getXPosition(), bullet.getYPosition());
        if(delta <= collisionDistance) {
            //radii cross, therefore do checking with collision meshes
            final CollisionMesh bulletMesh = bullet.getCollisionMesh();
            final CollisionMesh entityMesh = entity.getCollisionMesh();
            if(bulletMesh == null) {
                if(entityMesh == null) {
                    return true;
                }
                else {
                    return entityMesh.pointsInRadius(bullet.getXPosition(), bullet.getYPosition(), bullet.getCollisionRadius());
                }
            }
            else { //bulletMesh != null
                if(entityMesh == null) {
                    return bulletMesh.pointsInRadius(entity.getXPosition(), entity.getYPosition(), entity.getCollisionRadius());
                }
                else {
                    return bulletMesh.isMeshCollidingWidth(entityMesh);
                }
            }
        }
        return false;
    }

    private float distance(final float x1, final float y1, final float x2, final float y2) {
        return (float)StrictMath.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
    }

    private void sortGameEntities(final List<GameEntity> entities) {
        for(final GameEntity entity: entities) {
            if(entity instanceof Npc) {
                worldNpcs.add((Npc)entity);
            }
            else if(entity instanceof Player) {
                worldPlayers.add((Player)entity);
            }
        }
    }
}
