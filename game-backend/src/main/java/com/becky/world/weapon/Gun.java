package com.becky.world.weapon;

import com.becky.world.entity.Player;

/**
 * A gun fires bullets by creating them. Is simple.
 */
public abstract class Gun {
    protected final long timePerFire;
    protected final Player weilder;
    private long lastFireTime = System.currentTimeMillis();
    private long nextFireTime = lastFireTime;

    protected Gun(final int rateOfFire, final Player weilder) {
        this.timePerFire = Math.round(1000.0 / rateOfFire);
        this.weilder = weilder;
    }

    /**
     * Gets the player this gun belongs to
     * @return
     */
    public Player getWeilder() {
        return this.weilder;
    }

    /**
     * Indicates if enough time has passed to fire again.
     * @return
     */
    protected boolean readyToFire() {
        return System.currentTimeMillis() >= nextFireTime;
    }

    /**
     * Instructs the gun to fire. This means adding one or more rounds to the list of bullets owned
     * by the player.
     */
    public void fire() {
        lastFireTime = System.currentTimeMillis();
        nextFireTime = lastFireTime + timePerFire;
    }
}
