package com.becky;

import java.net.InetSocketAddress;

/**
 * The main application class of the game.
 * Created by chunsinger on 9/8/2017.
 */
public class Becky {
    public static void main(final String[] args) {
        InetSocketAddress socketAddress = new InetSocketAddress(9001);
        SimpleServer simpleServer = new SimpleServer(socketAddress);

        simpleServer.start();
    }
}
