package com.becky.networking.message;

import com.becky.world.entity.GameEntity;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.swing.text.html.parser.Entity;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Represents a message about a game entity that gets sent to a client from the server.
 */
public class EntityMessage {
    //field used when message is for bullet
    private String owner;

    //field used when message is for a player OR npc
    private Integer health;

    //field used when message is for player
    private String username;
    private Integer score;

    //all messages have these fields
    private Integer state;
    private long entityId;
    private Float xPosition;
    private Float yPosition;
    private Float xVelocity;
    private Float yVelocity;
    private Float xAcceleration;
    private Float yAcceleration;
    private Float angle;
    private String type;

    //this is the "hidden" flag
    //this indicates to the game client that an entity with "entityId" id is unable to be seen by the player
    //this message was sent to. Consequently, if a message is sent with hidden=true, then the only two fields
    //that will exist in the message are "entityId" and "hidden"
    private boolean hidden;

    public String getOwner() {
        return this.owner;
    }

    public void setOwner(final String owner) {
        this.owner = owner;
    }

    public Integer getHealth() {
        return this.health;
    }

    public void setHealth(final Integer health) {
        this.health = health;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public Float getAngle() {
        return this.angle;
    }

    public void setAngle(final Float angle) {
        this.angle = angle;
    }

    public Integer getState() {
        return this.state;
    }

    public void setState(final Integer state) {
        this.state = state;
    }

    public long getEntityId() {
        return this.entityId;
    }

    public void setEntityId(final long entityId) {
        this.entityId = entityId;
    }

    public Float getXPosition() {
        return this.xPosition;
    }

    public void setXPosition(final Float p) {
        this.xPosition = p;
    }

    public Float getYPosition() {
        return this.yPosition;
    }

    public void setYPosition(final Float p) {
        this.yPosition = p;
    }

    public Float getXVelocity() {
        return this.xVelocity;
    }

    public void setXVelocity(final Float v) {
        this.xVelocity = v;
    }

    public Float getYVelocity() {
        return this.yVelocity;
    }

    public void setYVelocity(final Float v) {
        this.yVelocity = v;
    }

    public Float getXAcceleration() {
        return this.xAcceleration;
    }

    public void setXAcceleration(final Float a) {
        this.xAcceleration = a;
    }

    public Float getYAcceleration() {
        return this.yAcceleration;
    }

    public void setYAcceleration(final Float a) {
        this.yAcceleration = a;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(final Integer score) {
        this.score = score;
    }

    public String getType() {
        return this.type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public boolean isHidden() {
        return this.hidden;
    }

    public void setHidden(final boolean hidden) {
        if(this.state == GameEntity.STATE_DEAD) {
            this.hidden = false;
            return;
        }
        this.hidden = hidden;
    }

    public static String jsonSerialize(final EntityMessage... messages) {
        if(messages.length == 1) {
            return "EntityMessage:" + new JSONObject(messages[0]);
        }
        else {
            final List<EntityMessage> messagesList = new ArrayList<>();
            for(final EntityMessage message: messages) {
                if(!message.hidden) {
                    messagesList.add(message);
                }
            }
            return "EntityMessage[]:" + new JSONArray(messagesList);
        }
    }
}
