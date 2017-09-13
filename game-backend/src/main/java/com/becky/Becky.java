package com.becky;

import java.net.ServerSocket;
import java.net.Socket;

/**
 * The main application class of the game.
 * Created by chunsinger on 9/8/2017.
 */
public class Becky {
    public static void main(final String[] args) {
        try {
            //Creates the Server socket on port 9001
            ServerSocket server;
            try {
                server = new ServerSocket(9001);

                System.out.println("Server has started. Port is " + server.getLocalPort() +
                        ". Waiting for a connection");
            }catch (Exception e){
                System.out.println(e.toString());
            }

            //Listens for a client
            try {
                Socket client = server.accept();

                System.out.println("A client has connected: \n" +
                    client.toString());
            }catch (Exception e){
                System.out.println(e.toString());
            }

        }catch (Exception e){
            System.out.println(e.toString());
        }
    }
}
