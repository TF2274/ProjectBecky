package com.becky.networked;
import com.becky.Player;
import org.json.JSONArray;
import org.json.JSONObject;

import java.awt.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

public class ServerPlayerUpdate
{
    private int posX;
    private int posY;
    private Point position;
    private ArrayList <Player> listOfPlayers;
    private JSONObject playerJSONObject;
    private JSONArray playerJSONArray;

    //TODO: Phase 2 uncomment the following fields
    //private accelX: number;
    //private accelY: number;
    //private velX: number;
    //private velY: number;


    public ArrayList<Player> addPlayer(Player player)
    {
        listOfPlayers = new ArrayList<Player>();
        listOfPlayers.add(player);

        return listOfPlayers;
    }

    //TODO: Phase 2 uncomment the following methods
    //public getVelocity(): Point {
    //    return new Point(this.velX, this.velY);
    //}

    //public getAcceleration(): Point {
    //    return new Point(this.accelX, this.accelY);
    //}

    public String writeToJson(ArrayList<Player> listOfPlayers)
    {
        playerJSONObject = new JSONObject();
        playerJSONObject.put("Name", "Becky Players");
        playerJSONArray = new JSONArray();

        for(Player player : listOfPlayers)
        {
            posX = player.getPosition().x;
            posY = player.getPosition().y;
            playerJSONObject.put("Username", player.getPlayerUsername());
            playerJSONArray.put(posX);
            playerJSONArray.put(posY);
            playerJSONObject.put("position", playerJSONArray);
        }

        return playerJSONObject.toString();
    }
}
