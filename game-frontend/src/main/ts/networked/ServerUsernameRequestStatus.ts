export class ServerUsernameRequestStatus {
    private status: string;
    private message: string;

    public getStatus(): string {
        return this.status;
    }

    public getMessage(): string {
        return this.message;
    }
}