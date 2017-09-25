package com.becky.networked;

public class UsernameChangeRequest {
    private String oldUsername;
    private String newUsername;
    private String authenticationString;

    public String getOldUsername() {
        return oldUsername;
    }

    public void setOldUsername(final String oldUsername) {
        this.oldUsername = oldUsername;
    }

    public String getNewUsername() {
        return newUsername;
    }

    public void setNewUsername(final String newUsername) {
        this.newUsername = newUsername;
    }

    public String getAuthenticationString() {
        return authenticationString;
    }

    public void setAuthenticationString(final String authenticationString) {
        this.authenticationString = authenticationString;
    }
}
