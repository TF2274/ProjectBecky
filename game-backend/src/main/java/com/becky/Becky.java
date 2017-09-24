package com.becky;

import com.sun.tools.internal.xjc.reader.xmlschema.bindinfo.BIConversion;

import java.awt.image.BufferStrategy;
import java.net.InetSocketAddress;

/**
 * The main application class of the game.
 * Created by chunsinger on 9/8/2017.
 */
public class Becky implements Runnable {

    private boolean running = false;
    private Thread thread;
    public final static int WIDTH = 640, HEIGHT = WIDTH / 12 * 9;

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
        Player player = new Player();
        running = true;
    }

    private void tick()
    {

    }

    // if elapsedTime < 50
    //  thread.sleep(47 - elapsedTime);
    public void run()
    {
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



}
