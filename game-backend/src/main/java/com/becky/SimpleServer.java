package com.becky;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONObject;

import java.net.InetSocketAddress;

public class SimpleServer extends WebSocketServer {
    public SimpleServer(InetSocketAddress addr){
        super(addr);
    }

    @Override
    public void onError(WebSocket webSocket, Exception e) {
        System.out.println("It done fucked up. Here's your info:" + e.toString());
    }

    @Override
    public void onStart() {
        System.out.println("Yay it started..... \nHopefully you have no errors......\nHave fun....");
    }

    @Override
    public void onClose(WebSocket webSocket, int i, String s, boolean b) {
        JSONObject jsonObject = new JSONObject(s);
        String username
    }

    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {

    }

    @Override
    public void onMessage(WebSocket webSocket, String s) {

    }
}
