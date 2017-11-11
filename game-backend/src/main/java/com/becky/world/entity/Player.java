package com.becky.world.entity;

import com.becky.world.NewGameWorld;
import com.becky.world.physics.BulletCollisionDetector;
import com.becky.world.physics.PhysicsFilter;
import com.becky.world.physics.PlayerCollisionDetector;
import com.becky.world.physics.WorldBorderCollisionDetector;
import com.becky.world.weapon.DefaultGun;
import com.becky.world.weapon.Gun;
import org.java_websocket.WebSocket;
import java.util.ArrayList;
import java.util.List;

public class Player extends GameEntity {
    public static final float MAX_VELOCITY = 450.0f;
    public static final float ACCELERATION = 1800.0f;

    //player metadata
    private String playerUsername;
    private final WebSocket connection;
    private final String authenticationString;
    private boolean usernameFinal = false;

    //player descriptors
    private int health = 100;
    private int score = 0;

    //player state information
    private Gun playerGun = new DefaultGun(this);
    private boolean firingWeapon = false;

    //player update information
    private boolean playerHealthUpdated = false;
    private boolean playerScoreUpdated = false;
    private String healthAffectedBy = "";

    public Player(final NewGameWorld gameWorld, final String playerUsername, final String authenticationString, final WebSocket connection) {
        super(gameWorld);
        super.addPhysicsFilter(WorldBorderCollisionDetector.class);
        super.addPhysicsFilter(BulletCollisionDetector.class);
        super.addPhysicsFilter(PlayerCollisionDetector.class);
        this.playerUsername = playerUsername;
        this.connection = connection;
        this.authenticationString = authenticationString;
        this.collisionRadius = 32;
        super.maxVelocity = MAX_VELOCITY;
        super.deceleration = ACCELERATION;
    }

    public String getAuthenticationString() {
        return this.authenticationString;
    }

    public String getPlayerUsername() {
        return playerUsername;
    }

    public WebSocket getConnection() {
        return this.connection;
    }

    public void setPlayerUsername(final String playerUsername) {
        this.playerUsername = playerUsername;
    }

    public int getHealth() {
        return this.health;
    }

    public void setHealth(final int health, final String attackerUsername) {
        this.health = Math.max(health, 0);
        this.healthAffectedBy = attackerUsername == null ? "" : attackerUsername;
        this.playerHealthUpdated = true;
    }

    public void setUsernameFinal() {
        this.usernameFinal = true;
    }

    public boolean isUsernameFinal() {
        return this.usernameFinal;
    }

    public Gun getGun() {
        return this.playerGun;
    }

    public void setGun(final Gun gun) {
        this.playerGun = gun;
    }

    public void setFiringWeapon(final boolean firing) {
        this.firingWeapon = firing;
    }

    public int getScore() {
        return this.score;
    }

    public void addScore(final int amt) {
        this.score += amt;
        this.playerScoreUpdated = true;
    }

    public void resetStatusUpdateFlags() {
        this.playerScoreUpdated = false;
        this.playerHealthUpdated = false;
        this.healthAffectedBy = "";
    }

    public boolean isPlayerHealthUpdated() {
        return this.playerHealthUpdated;
    }

    public String getHealthAffectedBy() {
        return this.healthAffectedBy;
    }

    public boolean isPlayerScoreUpdated() {
        return this.playerScoreUpdated;
    }

    @Override
    public void tick(final long elapsedTime) {
        tickShooting();
        super.tick(elapsedTime);
    }

    private void tickShooting() {
        if(firingWeapon) {
            playerGun.fire();
        }
    }
}
