package com.becky.networking;

import com.becky.networking.message.EntityMessage;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;

import java.util.Collection;

/**
 * Class with static messages to convert entities into messages.
 */
public class PlayerMessagingUtility {
    private final MessageTransmitter transmitter;
    private EntityMessage[] messages = null;

    public PlayerMessagingUtility(final MessageTransmitter transmitter) {
        this.transmitter = transmitter;
    }

    /**
     * Resets the message stack and creates EntityMessage instances from the provided
     * GameEntity instances.
     * @param entities
     */
    public void prepareMessages(final Collection<GameEntity> entities) {
        messages = new EntityMessage[entities.size()];

        int index = 0;
        for(final GameEntity entity: entities) {
            messages[index] = entity.getUpdateMessage();
            index++;
        }
    }

    /**
     * Transmits the messages prepared by prepareMessages to each of the players in
     * the provided collection of players.
     * This will also filter through the messages to set the hidden flag to true or false.
     * @param destinations
     */
    public void transmitMessages(final Collection<Player> destinations) {
        for(final Player player: destinations) {
            PlayerEntityVisibilityDetector.flagHiddenEntityMessages(player, messages);
            final String json = EntityMessage.jsonSerialize(messages);
            transmitter.transmitMessage(player, json);
        }
    }
}
