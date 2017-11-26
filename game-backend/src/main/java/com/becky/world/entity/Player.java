package com.becky.world.entity;

import com.becky.networking.message.EntityMessage;
import com.becky.world.NewGameWorld;
import com.becky.world.physics.CollisionMesh;
import com.becky.world.physics.PlayerCollisionDetector;
import com.becky.world.physics.WorldBorderCollisionDetector;
import com.becky.world.weapon.DefaultGun;
import com.becky.world.weapon.Gun;
import com.becky.world.weapon.RailGun;
import org.java_websocket.WebSocket;

import java.awt.geom.Point2D;

public class Player extends GameEntity {
    public static final float MAX_VELOCITY = 450.0f;
    public static final float ACCELERATION = 1800.0f;

    //player metadata
    private String playerUsername;
    private final WebSocket connection;
    private final String authenticationString;
    private boolean usernameFinal = false;
    private final PlayerCollisionMesh playerCollisionMesh;

    //player descriptors
    private int health = 100;
    private int score = 0;

    //player state information
    private Gun playerGun = new RailGun(this);
    private boolean firingWeapon = false;

    //player update information
    private boolean playerHealthUpdated = false;
    private boolean playerScoreUpdated = false;
    private String healthAffectedBy = "";

    public Player(final NewGameWorld gameWorld, final String playerUsername, final String authenticationString, final WebSocket connection) {
        super(gameWorld, new PlayerCollisionMesh());
        super.addPhysicsFilter(WorldBorderCollisionDetector.class);
        super.addPhysicsFilter(PlayerCollisionDetector.class);
        this.playerUsername = playerUsername;
        this.connection = connection;
        this.authenticationString = authenticationString;
        this.collisionRadius = 32;
        this.playerCollisionMesh = (PlayerCollisionMesh)super.collisionMesh;
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
    public EntityMessage getUpdateMessage() {
        final EntityMessage message = super.getUpdateMessage();
        message.setUsername(playerUsername);
        if(this.health == 0) {
            message.setUsername(this.healthAffectedBy);
        }
        message.setHealth(health);
        message.setScore(score);
        return message;
    }

    @Override
    public void tick(final long elapsedTime) {
        tickShooting();
        super.tick(elapsedTime);
        this.playerCollisionMesh.speedAdjust(super.getXVelocity(), super.getYVelocity());
    }

    private void tickShooting() {
        if(firingWeapon) {
            playerGun.fire();
        }
    }

    /**
     * This is a collision mesh class which accounts for the legs of the player ship moving
     * inwards based on the ship's speed
     */
    private static class PlayerCollisionMesh extends CollisionMesh {
        private static final Point2D.Float[] COLLISION_MESH = new Point2D.Float[] {
            new Point2D.Float(0.0f, -32.0f),
            new Point2D.Float(32.0f, 32.0f),
            new Point2D.Float(0.0f, 14.0f),
            new Point2D.Float(-32.0f, 32.0f),
        };
        private static final int[] COLLISION_INDICES = new int[] { 0, 2, 3, 0, 1, 2 };
        private static final float LEG_ELONGATE_RATIO = 5.0f / Player.MAX_VELOCITY;

        private PlayerCollisionMesh() {
            super(COLLISION_MESH, COLLISION_INDICES);
        }

        /**
         * Moves the local points for the leg tips inwards based on player speed.
         * @param vX
         * @param vY
         */
        public void speedAdjust(final float vX, final float vY) {
            final Point2D.Float rightLegTip = super.localPoints[1];
            final Point2D.Float leftLegTip = super.localPoints[3];
            final float legElongateAmount = LEG_ELONGATE_RATIO * (Math.abs(vX) + Math.abs(vY));

            rightLegTip.x -= legElongateAmount;
            rightLegTip.y += legElongateAmount;
            leftLegTip.x += legElongateAmount;
            leftLegTip.y += legElongateAmount;
        }
    }
}
