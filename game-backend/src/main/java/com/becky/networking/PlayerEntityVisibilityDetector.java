package com.becky.networking;

import com.becky.networking.message.EntityMessage;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;

public class PlayerEntityVisibilityDetector {
    //This is the value of the largest collision radius of an entity.
    //If an entity with a larger radius gets added then this value should be increased
    private static final int LARGEST_RADIUS = 64;
    private static final int MAX_X_DISTANCE = 960 + LARGEST_RADIUS;
    private static final int MAX_Y_DISTANCE = 540 + LARGEST_RADIUS;

    /**
     * Takes in a player object and an array of EntityMessage objects and sets the hidden flag on each
     * of the messages based on if the entity is within the viewport of the player.
     * This reduces bandwidth by reducing the number of bytes sent to the player, but also
     * prevents cheating as no info will be sent to players on entities that can't be seen by the player.
     * @param player
     * @param messages
     * @return
     */
    public static EntityMessage[] flagHiddenEntityMessages(final Player player, final EntityMessage[] messages) {
        final float maxX = player.getXPosition() + MAX_X_DISTANCE;
        final float minX = player.getXPosition() - MAX_X_DISTANCE;
        final float maxY = player.getYPosition() + MAX_Y_DISTANCE;
        final float minY = player.getYPosition() - MAX_Y_DISTANCE;

        for(final EntityMessage message: messages) {
            final float x = message.getXPosition();
            final float y = message.getYPosition();
            message.setHidden(x < minX || x > maxX || y < minY || y > maxY);
        }

        return messages;
    }
}
