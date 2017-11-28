package com.becky.networking;

import com.becky.util.MathUtils;
import com.becky.util.StringUtils;
import com.becky.networking.message.ClientInputStateUpdate;
import com.becky.networking.message.InitialServerJoinState;
import com.becky.networking.message.ServerUsernameRequestStatus;
import com.becky.networking.message.UsernameChangeRequest;
import com.becky.world.NewGameWorld;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.awt.geom.Point2D;
import java.net.InetSocketAddress;

public class SimpleServer extends WebSocketServer {
    private final NewGameWorld gameInstance;

    public SimpleServer(final InetSocketAddress addr, final NewGameWorld gameInstance){
        super(addr);
        this.gameInstance = gameInstance;
    }

    @Override
    public void onError(final WebSocket webSocket, final Exception e) {
        System.out.println("It done fucked up. Here's your info:" + e.toString());

        final Player player = gameInstance.getPlayerByConnection(webSocket);
        if(player != null) {
            gameInstance.removePlayerByUsername(player.getPlayerUsername());
        }
    }

    @Override
    public void onStart() {
        System.out.println("Yay it started..... \nHopefully you have no errors......\nHave fun....");
    }

    @Override
    public void onClose(final WebSocket webSocket, final int i, final String s, final boolean val) {
        final Player player = gameInstance.getPlayerByConnection(webSocket);
        if(player == null) {
            System.out.println("Unknown player disconnected. Reason: " + s);
        }
        else {
            //this will make the game engine automatically tell everyone the player left as well as
            //remove the player from the entity list.
            gameInstance.removePlayerByUsername(player.getPlayerUsername());
            System.out.println("Player " + player.getPlayerUsername() + " disconnected. Reason: " + s);
        }
    }

    @Override
    public void onOpen(final WebSocket webSocket, final ClientHandshake clientHandshake) {
        //Get player connection info
        final InetSocketAddress remoteAddress = webSocket.getRemoteSocketAddress();
        final String ip = remoteAddress.getHostName();
        final int port = remoteAddress.getPort();
        System.out.println(String.format("Connection received from: %s:%d", ip, port));

        //Create and add the player to the game
        String username = StringUtils.generateRandomUsername();
        while(gameInstance.getPlayerByUsername(username) != null) {
            //make sure the username is unique
            username = StringUtils.generateRandomUsername();
        }
        final String auth = StringUtils.generateUniqueAuthenticationString();
        final Player player = new Player(gameInstance, username, auth, webSocket);
        final Point2D.Float randomPosition = MathUtils.createRandomPointInBounds(
            0, 0, gameInstance.getWorldWidth(), gameInstance.getWorldHeight());
        player.setXPosition(randomPosition.x);
        player.setYPosition(randomPosition.y);
        gameInstance.addPlayer(player);

        //Setup the initial join state of the player
        final InitialServerJoinState initialJoinState = new InitialServerJoinState();
        initialJoinState.setAuthenticationString(auth);
        initialJoinState.setInitialUsername(username);
        initialJoinState.setInitialLocationX(player.getXPosition());
        initialJoinState.setInitialLocationY(player.getYPosition());
        initialJoinState.setPlayerId(player.getEntityId());

        //json serialize and transmit the initial join state to the client
        gameInstance.getMessageTransmitter().transmitMessage(player, initialJoinState.jsonSerialize());
        System.out.println("On open finished...");
    }

    @Override
    public void onMessage(final WebSocket webSocket, final String message) {
        try {
            //Player input state has changed
            if (message.startsWith(ClientInputStateUpdate.class.getSimpleName())) {
                handlePlayerInputStateMessage(message);
            }
            //Client is sending a ping request to the server
            else if(message.startsWith("PING:")) {
                if(webSocket.isOpen()){
                    webSocket.send(message);
                }
            }
            //Client is replying to the server with a ping response
            else if(message.startsWith("SPING")) {
                final long timestamp = Long.parseLong(message.substring(5));
                final Player player = gameInstance.getPlayerByConnection(webSocket);
                //check to make sure the message was not modified
                //The transmitter sets the timestamp automatically.
                if(player.getLastPingTimestamp() == timestamp) {
                    final long currentTime = System.currentTimeMillis();
                    //currentTime - timestamp is the time it took for the server to send the client the ping and then
                    //for the ping to make it here and for this line of code to execute.
                    //This is roughly equal to the message transmit time.
                    //Dividing by two is close to the time it takes for the message to travel 1 direction.
                    final long latency = (currentTime - timestamp) / 2;
                    player.setLatency(latency);
                }
                else {
                    System.out.println("Client has responded with invalid ping response. Potential tampering? Player: " + player.getPlayerUsername());
                }
            }
            //player has requested a username change
            else if (message.startsWith(UsernameChangeRequest.class.getSimpleName())) {
                handlePlayerUsernameChangeRequest(message, webSocket);
            }
        } catch(final RuntimeException ex) {
            System.out.println("OnMessage Error: " + ex.getMessage());
        }
    }

    private void handlePlayerUsernameChangeRequest(final String message, final WebSocket webSocket) {
        final UsernameChangeRequest request = new UsernameChangeRequest(message);
        final ServerUsernameRequestStatus status = new ServerUsernameRequestStatus();

        try {
            final Player player = validatePlayerCredentials(request.getOldUsername(), request.getAuthenticationString());
            if(player.isUsernameFinal()) {
                status.setStatus("failed");
                status.setMessage("You already set your username.");
            }
            else if(gameInstance.getPlayerByUsername(request.getNewUsername()) == null) {
                gameInstance.removePlayerByUsername(request.getOldUsername());
                player.setPlayerUsername(request.getNewUsername());
                player.setUsernameFinal();
                gameInstance.addPlayer(player);
                status.setStatus("success");
                status.setMessage(request.getNewUsername());
            }
            else {
                status.setStatus("failed");
                status.setMessage("Username already exists.");
            }
        }
        catch(final RuntimeException ex) {
            status.setStatus("failed");
            status.setMessage(ex.getMessage());
        }
        webSocket.send(status.jsonSerialize());
    }

    private void handlePlayerInputStateMessage(final String message) {
        final ClientInputStateUpdate update = new ClientInputStateUpdate(message);
        final Player p = gameInstance.getPlayerByUsername(update.getUsername());
        if(p == null) {
            return;
        }
        if(!p.getAuthenticationString().equals(update.getAuthString())) {
            throw new RuntimeException("Bad authentication string.");
        }
        updatePlayerState(p, update);
    }

    private void updatePlayerState(final Player player, final ClientInputStateUpdate stateChange) {
        //rewind the player by their latency (since the message we received was sent by the player "latency"
        //millis ago, it means we need to rewind the player to the point in time the user actually performed
        //an action before applying the changes). After applying the changes, the player can be "fast-forwarded"
        //by "latency" millis. This will simulate the server applying the player control changes at the exact time.
        player.tick(-player.getLatency());

        player.setXAcceleration(0.0f);
        player.setYAcceleration(0.0f);
        if(stateChange.isMovingUp()) {
            player.setYAcceleration(-Player.ACCELERATION);
        }
        if(stateChange.isMovingDown()) {
            player.setYAcceleration(player.getYAcceleration() + Player.ACCELERATION);
        }
        if(stateChange.isMovingLeft()) {
            player.setXAcceleration(-Player.ACCELERATION);
        }
        if(stateChange.isMovingRight()) {
            player.setXAcceleration(player.getXAcceleration() + Player.ACCELERATION);
        }

        player.setFiringWeapon(stateChange.isShooting());
        player.setAngles(stateChange.getAngle());

        //player state has been changed. Now fast forward the player by latency millis
        player.tick(player.getLatency());
    }

    private Player validatePlayerCredentials(final String username, final String authToken) {
        final Player player = gameInstance.getPlayerByUsername(username);
        if(!player.getAuthenticationString().equals(authToken)) {
            throw new RuntimeException("Bad authentication string.");
        }
        return player;
    }
}
