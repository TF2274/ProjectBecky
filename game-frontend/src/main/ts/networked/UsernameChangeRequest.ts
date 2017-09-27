/**
 * This networked class is transmitted to the server to request a username change
 */
class UsernameChangeRequest {
    public oldUsername: string;
    public newUsername: string;
    public authenticationString: string;
}