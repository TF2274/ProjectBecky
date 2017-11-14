package com.becky.world;

import com.becky.networking.MessageTransmitter;
import com.becky.networking.PlayerMessagingUtility;
import com.becky.networking.message.HighscoreInfo;
import com.becky.world.entity.GameEntity;
import com.becky.world.entity.Player;
import com.becky.world.entity.npc.NpcSpawner;
import com.becky.world.entity.npc.SpawnRules;
import com.becky.world.physics.BulletCollisionDetector;
import com.becky.world.physics.NpcCollisionDetector;
import com.becky.world.physics.PhysicsFilter;
import com.becky.world.physics.PlayerCollisionDetector;
import com.becky.world.physics.WorldBorderCollisionDetector;
import org.java_websocket.WebSocket;
import org.reflections.Reflections;

import java.awt.geom.Point2D;
import java.lang.reflect.Constructor;
import java.util.*;

public class NewGameWorld implements Runnable {
    private static final int MAX_TPS = 20;
    private static final long TIME_PER_TICK = (long) (1000.0f / MAX_TPS);

    private final HashMap<String, Player> players = new HashMap<>();
    private final HashMap<String, Player> deadPlayers = new HashMap<>();
    private final List<GameEntity> gameEntities = new ArrayList<>();
    private final List<PhysicsFilter> physicsFilters = new ArrayList<>();
    private final MessageTransmitter messageTransmitter = new MessageTransmitter();
    private final List<WorldEventListener> worldEventListeners = new ArrayList<>();
    private final NpcSpawner spawner = new NpcSpawner(this);
    private final Point2D.Float worldDimension = new Point2D.Float(8000.0f, 8000.0f);
    private final PlayerMessagingUtility playerMessagingUtility = new PlayerMessagingUtility(messageTransmitter);

    public NewGameWorld() {
        physicsFilters.add(new BulletCollisionDetector(this));
        physicsFilters.add(new WorldBorderCollisionDetector(worldDimension.x, worldDimension.y));
        physicsFilters.add(new PlayerCollisionDetector(this));
        physicsFilters.add(new NpcCollisionDetector(this));
        initNpcTypes();
    }

    public void start() {
        final Thread thread = new Thread(this);
        thread.start();
    }

    @Override
    public void run() {
        long frameStart = System.currentTimeMillis();
        long frameEnd = frameStart;
        long elapsedTime;
        long frameNumber = 0;

        while(true) {
            frameNumber++;
            elapsedTime = frameEnd - frameStart;
            frameStart = System.currentTimeMillis();

            //for thread safety get a copy of the game entities list
            final List<GameEntity> entities = this.getAllGameEntities();

            //update game entities
            tick(entities, elapsedTime);
            //apply relevant physics to entities
            applyPhysics(entities);
            //transmit entity details every other frame (saves bandwidth and client cpu cycles)
            transmit(entities);
            //spawn npcs as necessary
            spawner.executeSpawnRules();
            //remove dead entities
            removeDeadEntities();

            if(frameNumber % 300 == 0) {//every 300 frames (15 seconds)
                this.transmitHighscores();
            }
            //see if we need to sleep
            //sleep if necessary
            frameEnd = System.currentTimeMillis();
            elapsedTime = frameEnd - frameStart;
            if(elapsedTime < TIME_PER_TICK - 2) {
                try {
                    Thread.sleep(TIME_PER_TICK - elapsedTime - 2);
                } catch(final InterruptedException ignored) {}
            }
            frameEnd = System.currentTimeMillis();
        }
    }

    private void tick(final List<GameEntity> entities, final long elapsedTime) {
        for(final GameEntity entity: entities) {
            entity.tick(elapsedTime);
        }
    }

    private void applyPhysics(final List<GameEntity> entities) {
        for(final PhysicsFilter filter: physicsFilters) {
            filter.prepare();
            for(final GameEntity entity: entities) {
                if(entity.doesPhysicsApply(filter.getClass())) {
                    filter.apply(entity);
                }
            }
        }
    }

    private void transmit(final List<GameEntity> entities) {
        playerMessagingUtility.prepareMessages(entities);
        final List<Player> allPlayers = getAllPlayers();
        playerMessagingUtility.transmitMessages(allPlayers);
    }

    private void removeDeadEntities() {
        final List<GameEntity> allEntities = getAllGameEntities();
        final List<Player> allPlayers = getAllPlayers();
        for(final GameEntity entity: allEntities) {
            if(entity.getState() == GameEntity.STATE_DEAD) {
                removeGameEntity(entity);
            }
        }
        for(final Player player: allPlayers) {
            if(player.getState() == GameEntity.STATE_DEAD) {
                synchronized (this.players) {
                    this.players.remove(player.getPlayerUsername());
                }
                synchronized (this.deadPlayers) {
                    this.deadPlayers.put(player.getPlayerUsername(), player);
                }
            }
        }
    }

    private void transmitHighscores() {
        final List<Player> allPlayers = this.getAllPlayers();
        final HighscoreInfo highscoreInfo = this.buildHighscoreList(allPlayers);
        final String json = highscoreInfo.jsonSerialize();
        for(final Player p: allPlayers) {
            this.messageTransmitter.transmitMessage(p, json);
        }
    }

    private HighscoreInfo buildHighscoreList(final List<Player> allPlayers) {
        Player[] ordered = new Player[allPlayers.size()];
        ordered = allPlayers.toArray(ordered);

        final int length = ordered.length < 10 ? ordered.length : 10;
        for(int i = 0; i < 10 && i < length; i++) {
            int currentScore = ordered[i].getScore();
            for(int j = i+1; j < ordered.length; j++) {
                if(ordered[j].getScore() > currentScore) {
                    final Player temp = ordered[j];
                    ordered[j] = ordered[i];
                    ordered[i] = temp;
                    currentScore = temp.getScore();
                }
            }
        }


        final String[] playerNames = new String[length];
        final int[] scores = new int[length];
        for(int i = 0; i < length; i++) {
            playerNames[i] = ordered[i].getPlayerUsername();
            scores[i] = ordered[i].getScore();
        }
        final HighscoreInfo highscoreInfo = new HighscoreInfo();
        highscoreInfo.setPlayers(playerNames);
        highscoreInfo.setScores(scores);
        return highscoreInfo;
    }

    private void initNpcTypes() {
        final Reflections reflections = new Reflections(this.getClass().getPackage().getName());
        final Set<Class<? extends SpawnRules>> npcSpawnRulesClasses = reflections.getSubTypesOf(SpawnRules.class);
        for(final Class<? extends SpawnRules> npcSpawnRulesClass: npcSpawnRulesClasses) {
            try {
                final Constructor<? extends SpawnRules> constructor = npcSpawnRulesClass.getConstructor();
                this.spawner.addNpcSpawnRules(constructor.newInstance());
            } catch (final NoSuchMethodException e) {
                System.out.println("The NPC spawn rules class \"" + npcSpawnRulesClass.getSimpleName()
                    + "\" does not have a valid constructor. Did you make " +
                    "sure to include a parameter-less constructor?");
            } catch (final Exception ex) {
                System.out.println("Failed to instantiate NPC spawn rules class \"" +
                    npcSpawnRulesClass.getSimpleName() + "\" due to the following exception:");
                ex.printStackTrace();
            }
        }
    }

    public void addPlayer(final Player player) {
        synchronized (this.players) {
            players.put(player.getPlayerUsername(), player);
        }

        this.addGameEntity(player);
        this.transmitHighscores();
    }

    public void addGameEntity(final GameEntity entity) {
        synchronized (this.gameEntities) {
            gameEntities.add(entity);
        }

        synchronized (this.worldEventListeners) {
            for(final WorldEventListener listener: worldEventListeners) {
                listener.onGameEntityAdded(this, entity);
            }
        }
    }

    public void removeGameEntity(final GameEntity entity) {
        synchronized (this.gameEntities) {
            if(!gameEntities.remove(entity)) {
                return;
            }
        }

        synchronized (this.worldEventListeners) {
            for(final WorldEventListener listener: worldEventListeners) {
                listener.onGameEntityRemoved(this, entity);
            }
        }
    }

    public List<GameEntity> getAllGameEntities() {
        synchronized (this.gameEntities) {
            return new ArrayList<>(gameEntities);
        }
    }

    public List<Player> getAllPlayers() {
        synchronized (this.players) {
            return new ArrayList<>(players.values());
        }
    }

    public Player getPlayerByUsername(final String username) {
        return players.get(username.intern());
    }

    public Player getPlayerByConnection(final WebSocket connection) {
        synchronized (this.players) {
            for(final Player player: players.values()) {
                if(player.getConnection().equals(connection)) {
                    return player;
                }
            }
        }

        synchronized (this.deadPlayers) {
            for(final Player player: deadPlayers.values()) {
                if(player.getConnection().equals(connection)) {
                    return player;
                }
            }
        }

        return null;
    }

    public void removePlayerByUsername(final String username) {
        final String internUsername = username.intern();
        Player player;

        synchronized (this.players) {
            player = players.remove(internUsername);
        }

        if(player == null) {
            synchronized (this.deadPlayers) {
                player = deadPlayers.remove(internUsername);
            }
        }

        this.removeGameEntity(player);
        this.transmitHighscores();
    }

    public MessageTransmitter getMessageTransmitter() {
        return this.messageTransmitter;
    }

    public void addWorldEventListener(final WorldEventListener listener) {
        synchronized (this.worldEventListeners) {
            worldEventListeners.add(listener);
        }
    }

    public void removeWorldEventListener(final WorldEventListener listener) {
        synchronized (this.worldEventListeners) {
            worldEventListeners.remove(listener);
        }
    }

    public float getWorldWidth() {
        return this.worldDimension.x;
    }

    public float getWorldHeight() {
        return this.worldDimension.y;
    }
}
