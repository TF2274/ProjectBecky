/**
 * This is a message that gets sent to the client from the server.
 */
class EntityMessage {
    public static STATE_NEW: number = 1;
    public static STATE_UPDATE: number = 2;
    public static STATE_DEAD: number = 3;

    //this field is populated when the message is about a player
    public username: string = null;
    public score: number = 0;

    //this field is populated when the message is about a player OR npc
    public health: number = 100;

    //this field is populated when the message is about a bullet
    public owner: string = null;

    //all message have this field
    public angle: number = 0;
    public state: number = EntityMessage.STATE_NEW;
    public entityId: number = 0;
    public XPosition: number = 0;
    public YPosition: number = 0;
    public XVelocity: number = 0;
    public YVelocity: number = 0;
    public XAcceleration: number = 0;
    public YAcceleration: number = 0;
    public type: string = null;

    public static parseObject(json: string): EntityMessage {
        let length: number = json.length;

        //"EntityMessage:" is 14 characters long
        let beginning: string = json.substr(0, Math.min(length, 14));
        if(beginning === "EntityMessage:") {
            let jsonStr: string = json.substring(14, length);
            return JSON.parse(jsonStr) as EntityMessage;
        }
        else {
            return null;
        }
    }

    public static parseArray(json: string): EntityMessage[] {
        let length: number = json.length;

        //"EntityMessage[]:" is 16 characters long
        let beginning: string = json.substr(0, Math.min(length, 16));
        if(beginning === "EntityMessage[]:") {
            let jsonStr: string = json.substring(16, length);
            return JSON.parse(jsonStr) as EntityMessage[];
        }
        else {
            return null;
        }
    }
}