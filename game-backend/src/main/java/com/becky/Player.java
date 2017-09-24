package com.becky;

import java.awt.*;

public class Player {
    private Point position = new Point(x_position, y_position);

    private String playerUsername;
    private int x_position;
    private int y_position;
    private float x_velocity;
    private float y_velocity;
    private float accelaration;
    private float max_velocity = 50;

    public Player(String playerUsername, Point point, float x_velocity, float y_velocity, float accelaration, float max_velocity) {
        this.playerUsername = playerUsername;
        this.position = position;
        this.x_velocity = x_velocity;
        this.y_velocity = y_velocity;
        this.accelaration = accelaration;
        this.max_velocity = max_velocity;
    }

    public String getPlayerUsername() {
        return playerUsername;
    }

    public void setPlayerUsername(String playerUsername) {
        this.playerUsername = playerUsername;
    }

    public int getX_position() {
        return x_position;
    }

    public void setX_position(int x_position) {
        this.x_position = x_position;
    }

    public int getY_position() {
        return y_position;
    }

    public void setY_position(int y_position) {
        this.y_position = y_position;
    }

    public float getX_velocity() {
        return x_velocity;
    }

    public void setX_velocity(float x_velocity) {
        this.x_velocity = x_velocity;
    }

    public float getY_velocity() {
        return y_velocity;
    }

    public void setY_velocity(float y_velocity) {
        this.y_velocity = y_velocity;
    }

    public float getAccelaration() {
        return accelaration;
    }

    public void setAccelaration(float accelaration) {
        this.accelaration = accelaration;
    }

    public float getMax_velocity() {
        return max_velocity;
    }

    public void setMax_velocity(float max_velocity) {
        this.max_velocity = max_velocity;
    }

    public void setPostion(Point position)
    {
        this.position = position;
    }

    public Point getPosition()
    {
        return position;
    }
}
