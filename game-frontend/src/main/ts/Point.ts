/**
 * This class represents a simple x,y location
 */
export class Point {
    private x: number;
    private y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public addX(x: number): void {
        this.x += x;
    }

    public addY(y: number): void {
        this.y += y;
    }
}