package com.becky;

import java.awt.*;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * The main application class of the game.
 * Created by chunsinger on 9/8/2017.
 */
public class Becky implements Runnable {

    private boolean running = false;
    private Thread thread;
    public final static int WIDTH = 640, HEIGHT = WIDTH / 12 * 9;
    private HashMap<String, Player> players;

    public Becky() {
        new Window(WIDTH, HEIGHT, "Project Becky", this);
    }

    public static void main(final String[] args) {
        InetSocketAddress socketAddress = new InetSocketAddress(9001);
        SimpleServer simpleServer = new SimpleServer(socketAddress);

        simpleServer.start();
        new Becky();
    }

    public void start() {
        thread = new Thread(this);
        thread.start();
        addPlayer();
        running = true;
    }

    private void tick() {

    }

    // if elapsedTime < 50
    //  thread.sleep(47 - elapsedTime);
    public void run() {
        long lastTime = System.currentTimeMillis();
        double amountOfTicks = 20.0;
        double ns = 1000000000 / amountOfTicks;
        double delta = 0;
        long timer = System.currentTimeMillis();
        int frames = 0;

        long
        while(running)
        {
            //TODO: Change to ms instead of nano
            long now = System.currentTimeMillis();
            delta += (now - lastTime) / ns;
            lastTime = now;
            while (delta >= 1){
                tick();
                delta--;
            }
            frames++;

            if (System.currentTimeMillis() - timer > 10000)
            {
                timer += 10000;
                //TODO: Logging
                //System.out.println("FPS: " + frames);
                frames = 0;
            }
        }
    }

    public String addPlayer(){
        int username = (int) Math.random()*10000;
        String uN = Integer.toString(username);
        Point point = new Point((int) Math.random()*50, (int)Math.random()*50)
        Player player = new Player(uN, point, (float)Math.random()*100, (float)Math.random()*100, (float)Math.random()*100, (float)Math.random()*2);
        players.put(uN, player);
        return
    }

    public Player getPlayerUsername(String userName) {
        return players.get(userName);
    }

    public void removePlayer(String userName){

    }
}
