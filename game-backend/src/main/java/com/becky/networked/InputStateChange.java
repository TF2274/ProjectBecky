package com.becky.networked;

public class InputStateChange
{
    private String username;
    private String authenticationString;
    private String inputName;
    private boolean flag;
    private float angle;

    public String getUsername() {
        return username;
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public String getAuthenticationString() {
        return authenticationString;
    }

    public void setAuthenticationString(final String authenticationString) {
        this.authenticationString = authenticationString;
    }

    public String getInputName() {
        return inputName;
    }

    public void setInputName(final String inputName) {
        this.inputName = inputName;
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(final boolean flag) {
        this.flag = flag;
    }

    public float getAngle() {
        return angle;
    }

    public void setAngle(final float angle) {
        this.angle = angle;
    }
}
