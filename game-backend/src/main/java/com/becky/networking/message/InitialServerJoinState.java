package com.becky.networking.message;

import org.json.JSONObject;

public class InitialServerJoinState implements NetworkedMessage {
    private String initialUsername;
    private String authenticationString;
    private float initialLocationX;
    private float initialLocationY;
    private long playerId;


    public InitialServerJoinState() {}

    public String getInitialUsername() {
        return initialUsername;
    }

    public void setInitialUsername(final String initialUsername) {
        this.initialUsername = initialUsername;
    }

    public String getAuthenticationString() {
        return authenticationString;
    }

    public void setAuthenticationString(final String authenticationString) {
        this.authenticationString = authenticationString;
    }

    public float getInitialLocationX() {
        return initialLocationX;
    }

    public void setInitialLocationX(final float initialLocationX) {
        this.initialLocationX = initialLocationX;
    }

    public float getInitialLocationY() {
        return initialLocationY;
    }

    public void setInitialLocationY(final float initialLocationY) {
        this.initialLocationY = initialLocationY;
    }

    public void setPlayerId(final long id) {
        this.playerId = id;
    }

    public long getPlayerId() {
        return this.playerId;
    }

    @Override
    public String jsonSerialize() {
        return InitialServerJoinState.class.getSimpleName() + ":" + new JSONObject(this).toString();
    }
}
