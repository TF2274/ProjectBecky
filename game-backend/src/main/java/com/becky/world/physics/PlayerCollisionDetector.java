package com.becky.world.physics;

import com.becky.world.NewGameWorld;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;

import java.util.ArrayList;
import java.util.List;

public class PlayerCollisionDetector implements PhysicsFilter {
    private final NewGameWorld gameWorld;
    private final List<Player> worldPlayer = new ArrayList<>();

    public PlayerCollisionDetector(final NewGameWorld gameWorld) {
        this.gameWorld = gameWorld;
    }

    @Override
    public void apply(final GameEntity gameEntity) {
        if(!gameEntity.doesPhysicsApply(PlayerCollisionDetector.class)) {
            return;
        }

        //Check if any bullets are colliding with the player and handle that
        //the main game loop will handle transmitting status changes
        if(gameEntity instanceof Player) {
            final Player player = (Player)gameEntity;
            boolean colliding = false;
            for(int i = 0; i < worldPlayer.size(); i++) {
                final Player player1 = worldPlayer.get(i);
                if(player1.equals(player)) {
                    continue;
                }
                if(isPlayerColliding(player, player1)) {
                    colliding = true;

                    //get angles
                    final float angle = getAngleBetweenPlayers(player, player1);
                    final float angle1 = getAngleBetweenPlayers(player1, player);

                    //set velocity of players
                    player.setXVelocity(player.getXVelocity() + 300.0f * (float)StrictMath.cos(angle));
                    player.setYVelocity(player.getYVelocity() + 300.0f * (float)StrictMath.sin(angle));
                    player1.setXVelocity(player1.getXVelocity() + 300.0f * (float)StrictMath.cos(angle1));
                    player1.setYVelocity(player1.getYVelocity() + 300.0f * (float)StrictMath.sin(angle1));

                    //set player positions so they are just barely apart from each other
                    player.setXPosition(player1.getXPosition()
                            + (player1.getCollisionRadius() + player.getCollisionRadius())
                            * (float)StrictMath.cos(angle));
                    player.setYPosition(player1.getYPosition()
                            + (player1.getCollisionRadius() + player.getCollisionRadius())
                            * (float)StrictMath.sin(angle));
                }
            }

            if(colliding) {
                worldPlayer.remove(player);
            }
        }
    }

    @Override
    public void prepare() {
        worldPlayer.clear();
        final List<GameEntity> entities = gameWorld.getAllGameEntities();
        for(final GameEntity entity: entities) {
            if(entity instanceof Player) {
                worldPlayer.add((Player)entity);
            }
        }
    }

    private boolean isPlayerColliding(final Player player, final Player player2) {
        final float delta = distance(player.getXPosition(), player.getYPosition(), player2.getXPosition(), player2.getYPosition());
        final float collisionDistance = player.getCollisionRadius() + player2.getCollisionRadius();
        return delta <= collisionDistance;
    }

    private float distance(final float x1, final float y1, final float x2, final float y2) {
        return (float)StrictMath.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
    }

    private float getAngleBetweenPlayers(final Player player, final Player otherPlayer) {
        final float deltaX = player.getXPosition() - otherPlayer.getXPosition();
        final float deltaY = player.getYPosition() - otherPlayer.getYPosition();
        return (float)StrictMath.atan2(deltaY, deltaX);
    }
}
