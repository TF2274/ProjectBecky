import {Point} from "../Point";
/**
 * This contains the initial state of a player upon joining the server.
 * This includes the initially assigned username, authentication string, and position
 */
export class InitialServerJoinState {
    public initialUsername: string;
    public authenticationString: string;
    public initialLocationX: number;
    public initialLocationY: number;
}