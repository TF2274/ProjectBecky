package com.becky.world.entity;

import com.becky.world.NewGameWorld;

import java.util.ArrayList;
import java.util.List;

/**
 * The NPC spawner is responsible for literally spawning NPCs. It follows the rules provided to it.
 * Created by Clayton on 10/11/2017.
 */
public class EntitySpawner {
    private final NewGameWorld gameWorld;
    private final List<SpawnRules> entitySpawns = new ArrayList<>();

    public EntitySpawner(final NewGameWorld gameWorld) {
        this.gameWorld = gameWorld;
    }

    /**
     * Determines which NPCs can be spawned and spawns them.
     */
    public void executeSpawnRules() {
        //The current time. More efficient that repeatedly calling System.currentTimeMillis()
        final long time = System.currentTimeMillis();

        //Get a list of SpawnRules instances which are eligible.
        //They are eligible if enough time has passed and NPC population for those rules are under the limit.
        for (final SpawnRules rule : entitySpawns) {
            if (rule.getNextIntervalTime() < time && rule.getCurrentPopulation() < rule.getMaxPopulation()) {
                rule.spawn(gameWorld);
                rule.resetNextIntervalTime();
            }
        }
    }

    public void addEntitySpawnRules(final SpawnRules rules) {
        this.entitySpawns.add(rules);
        this.gameWorld.addWorldEventListener(rules);
    }

    public void removeNpcSpawnRules(final SpawnRules rules) {
        this.entitySpawns.remove(rules);
        this.gameWorld.removeWorldEventListener(rules);
    }
}
