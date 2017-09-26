package com.becky.networked;

public class InitialServerJoinState {
    private String initialUsername;
    private String authenticationString;
    private int initialLocationX;
    private int initialLocationY;

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

    public int getInitialLocationX() {
        return initialLocationX;
    }

    public void setInitialLocationX(final int initialLocationX) {
        this.initialLocationX = initialLocationX;
    }

    public int getInitialLocationY() {
        return initialLocationY;
    }

    public void setInitialLocationY(final int initialLocationY) {
        this.initialLocationY = initialLocationY;
    }
}
