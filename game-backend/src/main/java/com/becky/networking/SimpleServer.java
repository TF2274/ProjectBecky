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
            //player has requested a username change
            else if (message.startsWith(UsernameChangeRequest.class.getSimpleName())) {
                handlePlayerUsernameChangeRequest(message, webSocket);
            }
            else if(message.startsWith("PING:")) {
                if(webSocket.isOpen()){
                    webSocket.send(message);
                }
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
    }

    private Player validatePlayerCredentials(final String username, final String authToken) {
        final Player player = gameInstance.getPlayerByUsername(username);
        if(!player.getAuthenticationString().equals(authToken)) {
            throw new RuntimeException("Bad authentication string.");
        }
        return player;
    }
}
