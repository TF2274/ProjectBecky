package com.becky.networked;

public class ServerUsernameRequestStatus {
    private String status;
    private String message;

    public void setStatus(final String status) {
        this.status = status;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public String getStatus() {
        return this.status;
    }

    public String getMessage() {
        return this.message;
    }
}
