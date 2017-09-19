/**
 * This is the class that contains info to send to the server about the state of
 * player input changing.
 */
export class InputStateChange {
    public username: string = ""; //the username
    public authenticationString: string = ""; //the authentication string that must be sent with each message
    public inputName: string = "w"; //the name of the input (w, a, s, d, space, mouse, or click)
    public flag: boolean = false; //used only if the input is a key/mouse button press
    public angle: number; //the new angle of the ship, used only when inputName == mouse.
}