package com.becky.world.entity.npc;

import com.becky.util.MathUtils;
import com.becky.world.NewGameWorld;
import com.becky.world.WorldEventListener;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;

import java.awt.geom.Point2D;
import java.util.Collection;
import java.util.List;

public class InfectedNpc extends Npc implements WorldEventListener {
    private static final float MAX_VIEW_DISTANCE = 550.0f;
    private static final float ACCELERATION = Player.ACCELERATION;

    private Player trackedPlayer;

    public InfectedNpc(final NewGameWorld world, final Player trackedPlayer) {
        super(world);
        this.trackedPlayer = trackedPlayer;
        super.maxVelocity = Player.MAX_VELOCITY / 3.0f;
        super.collisionRadius = 16;
        super.npcHealth = 15;
        super.pointsValue = 25;
        super.deceleration = ACCELERATION;
        world.addWorldEventListener(this);
    }

    @Override
    public void tick(final long elapsedTime) {
        if(trackedPlayer == null) {
            trackedPlayer = findClosestPlayer();
        }

        if(trackedPlayer != null) {
            final float deltaX = this.trackedPlayer.getXPosition() - super.position.x;
            final float deltaY = this.trackedPlayer.getYPosition() - super.position.y;
            final float angle = (float)StrictMath.atan2(deltaY, deltaX);

            super.acceleration.x = ACCELERATION * (float)StrictMath.cos(angle);
            super.acceleration.y = ACCELERATION * (float)StrictMath.sin(angle);
        }
        else {
            super.acceleration.x = 0.0f;
            super.acceleration.y = 0.0f;
            super.velocity.x = 0.0f;
            super.velocity.y = 0.0f;
        }

        super.tick(elapsedTime);
    }

    @Override
    public void onGameEntityRemoved(final NewGameWorld gameWorld, final GameEntity entity) {
        if(this.trackedPlayer != null && this.trackedPlayer.equals(entity)) {
            this.trackedPlayer = null;
        }
    }

    @Override
    public void onGameEntityAdded(final NewGameWorld gameWorld, final GameEntity entity) {}

    @Override
    public void setNpcHealth(final int health) {
        if(health <= 0) {
            this.onHealthZero();
        }
        super.setNpcHealth(health);
    }

    private Player findClosestPlayer() {
        final Collection<Player> players = super.getGameWorld().getAllPlayers();
        float distance = Float.MAX_VALUE;
        Player closestPlayer = null;
        for(final Player player: players) {
            final float currentDistance = MathUtils.distance(player.getXPosition(), player.getYPosition(), super.getXPosition(), super.getYPosition());
            if(currentDistance < distance && currentDistance < InfectedNpc.MAX_VIEW_DISTANCE) {
                distance = currentDistance;
                if(player.getConnection().isOpen() && player.getHealth() > 0) {
                    closestPlayer = player;
                }
            }
        }
        return closestPlayer;
    }

    private void onHealthZero() {
        //remove self from world listeners
        super.getGameWorld().removeWorldEventListener(this);

        //spawn two VirusNpc instances
        final NewGameWorld gameWorld = super.getGameWorld();
        final VirusNpc virus1 = new VirusNpc(gameWorld);
        virus1.setXPosition(super.position.x);
        virus1.setYPosition(super.position.y);
        gameWorld.addGameEntity(virus1);

        //the game world itself will recognize the new NPCs on the next call to transmit network messages
        //since the default npc state is NEW. This way clients will be alerted to the new NPCs being spawned.
    }

    /**
     * Every 30 seconds, these spawn rules choose up to 10 players and surrounds each of them with
     * an ambush of multiple infected NPCs surrounding them.
     */
    public static class InfectedNpcSpawnRules extends SpawnRules {
        //how many npc instances to ambush players with at once
        private static final int NUM_AMBUSH_NPCS = 6;
        private static final int MAX_POPULATION = 100;

        /**
         * The constructor of your spawn rules class may not have any parameters
         * The class will be completely ignored if no constructor with zero parameters
         * is found.
         */
        public InfectedNpcSpawnRules() {
            super(InfectedNpc.class);
            super.setSpawnInterval(90000); //90 second spawn interval

            //low max population so spawning only happens when most npcs are dead
            super.setMaxPopulation(25);
        }

        //called automatically when the population gets low enough
        @Override
        public void spawn(final NewGameWorld gameWorld) {
            //only spawn if players are online
            final List<Player> players = gameWorld.getAllPlayers();
            if(players.isEmpty()) {
                return;
            }

            //surround up to 10 players with NPCs
            final int numRandomPlayers = Math.min(10, players.size());
            for(int i = 0; i < numRandomPlayers; i++) {
                //pick a player at random
                final Player chosenPlayer = players.get((int)(Math.random() * players.size()));
                players.remove(chosenPlayer);

                //spawn 10 InfectedNpc entities around
                for(int j = 0; j < NUM_AMBUSH_NPCS; j++) {
                    final float angle = j * (float)Math.PI/(NUM_AMBUSH_NPCS/2.0f);
                    final float x = 512 * (float)StrictMath.cos(angle) + chosenPlayer.getXPosition();
                    final float y = 512 * (float)StrictMath.sin(angle) + chosenPlayer.getYPosition();
                    final InfectedNpc npc = new InfectedNpc(gameWorld, chosenPlayer);
                    npc.setXPosition(x);
                    npc.setYPosition(y);
                    gameWorld.addGameEntity(npc);
                }
            }

            //spawn the remainder of the NPCs
            final int remaining = MAX_POPULATION - super.getCurrentPopulation();
            final float width = gameWorld.getWorldWidth();
            final float height = gameWorld.getWorldHeight();
            for(int i = 0; i < remaining; i++) {
                final Point2D.Float pos = MathUtils.createRandomPointInBounds(0, 0, width, height);
                final InfectedNpc npc = new InfectedNpc(gameWorld, null);
                npc.setXPosition(pos.x);
                npc.setYPosition(pos.y);
                gameWorld.addGameEntity(npc);
            }
        }
    }
}
