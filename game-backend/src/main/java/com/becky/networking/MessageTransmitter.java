package com.becky.networking;

import com.becky.world.entity.Player;
import org.java_websocket.WebSocket;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Message transmitter designed to transmit messages to players.
 * Created by Clayton on 10/10/2017.
 */
public class MessageTransmitter {
    private final ExecutorService threadPool = Executors.newFixedThreadPool(25);

    public void transmitMessage(final Player client, final String message) {
        threadPool.submit(() -> {
            if(client.getConnection().isOpen()) {
                client.getConnection().send(message);
            }
        });
    }

    public void transmitPingToClients(final List<Player> players) {
        for(final Player player: players) {
            threadPool.submit(() -> {
                final WebSocket connection = player.getConnection();
                if(!connection.isOpen()) {
                    return;
                }
                final long timestamp = System.currentTimeMillis();
                final String message = "SPING" + timestamp;
                player.setLastPingTimestamp(timestamp);
                connection.send(message);
            });
        }
    }
}
