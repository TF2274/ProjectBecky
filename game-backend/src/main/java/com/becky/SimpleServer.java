package com.becky;

import com.becky.networked.InputStateChange;
import com.becky.networked.ServerUsernameRequestStatus;
import com.becky.networked.UsernameChangeRequest;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONObject;

import java.net.InetSocketAddress;

public class SimpleServer extends WebSocketServer {
    private final Becky gameInstance;

    public SimpleServer(final InetSocketAddress addr, final Becky gameInstance){
        super(addr);
        this.gameInstance = gameInstance;
    }

    @Override
    public void onError(final WebSocket webSocket, final Exception e) {
        System.out.println("It done fucked up. Here's your info:" + e.toString());
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
            gameInstance.removePlayerByUsername(player.getPlayerUsername());
            System.out.println("Player " + player.getPlayerUsername() + " disconnected. Reason: " + s);
        }
    }

    @Override
    public void onOpen(final WebSocket webSocket, final ClientHandshake clientHandshake) {
        final InetSocketAddress remoteAddress = webSocket.getRemoteSocketAddress();
        final String ip = remoteAddress.getHostName();
        final int port = remoteAddress.getPort();
        System.out.println(String.format("Connection received from: %s:%d", ip, port));
    }

    @Override
    public void onMessage(final WebSocket webSocket, final String message) {
        final JSONObject serializedMessage = new JSONObject(message);
        //is this a username change request
        if(serializedMessage.has("oldUsername")) {
            final UsernameChangeRequest request = deserializeUsernameChangeRequest(serializedMessage);
            final Player player = gameInstance.getPlayerByUsername(request.getOldUsername());
            if(!player.getAuthenticationString().equals(request.getAuthenticationString())) {
                return; //bad authentication string
            }
            final ServerUsernameRequestStatus status = new ServerUsernameRequestStatus();
            if(gameInstance.getPlayerByUsername(request.getNewUsername()) == null) {
                gameInstance.removePlayerByUsername(request.getOldUsername());
                player.setPlayerUsername(request.getNewUsername());
                gameInstance.addPlayer(player);
                status.setStatus("success");
                status.setStatus(request.getNewUsername());
            }
            else {
                status.setStatus("failed");
                status.setMessage("Username already exists.");
            }
            final JSONObject statusJson = new JSONObject(status);
            webSocket.send(statusJson.toString());
        }
        else {
            final InputStateChange stateChange = deserializeInputStateChangge(serializedMessage);
            final Player player = gameInstance.getPlayerByUsername(stateChange.getUsername());
            if(player == null || !player.getAuthenticationString().equals(stateChange.getAuthenticationString())) {
                return; //bad username or bad authentication string
            }

            //update player state based on input
            updatePlayerState(player, stateChange);
        }
    }

    private UsernameChangeRequest deserializeUsernameChangeRequest(final JSONObject json) {
        final UsernameChangeRequest request = new UsernameChangeRequest();
        request.setOldUsername(json.getString("oldUsername"));
        request.setNewUsername(json.getString("newUsername"));
        request.setAuthenticationString(json.getString("authenticationString"));
        return request;
    }

    private InputStateChange deserializeInputStateChangge(final JSONObject json) {
        final InputStateChange stateChange = new InputStateChange();
        stateChange.setUsername(json.getString("username"));
        stateChange.setAuthenticationString(json.getString("authenticationString"));
        stateChange.setInputName(json.getString("inputName"));

        //TODO: PHASE 2
        //stateChange.setFlag(json.getBoolean("flag"));
        //stateChange.setAngle((float)json.getDouble("angle"));
        return stateChange;
    }

    private void updatePlayerState(final Player player, final InputStateChange stateChange) {
        final String inputKey = stateChange.getInputName();
        if("w".equals(inputKey)) {
            player.setY_acceleration(-Player.ACCELERATION);
        }
        else if("s".equals(inputKey)) {
            player.setY_acceleration(Player.ACCELERATION);
        }
        if("a".equals(inputKey)) {
            player.setX_acceleration(-Player.ACCELERATION);
        }
        else if("d".equals(inputKey)) {
            player.setX_acceleration(Player.ACCELERATION);
        }

        //TODO: In phase 2 update player angles and whether or not player is shooting
    }
}
