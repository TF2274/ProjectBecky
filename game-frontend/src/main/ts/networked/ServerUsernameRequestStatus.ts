/**
 * A status sent from the server to indicate if a username change request was successful
 */
class ServerUsernameRequestStatus {
    private status: string;
    private message: string;

    public getStatus(): string {
        return this.status;
    }

    public getMessage(): string {
        return this.message;
    }
}