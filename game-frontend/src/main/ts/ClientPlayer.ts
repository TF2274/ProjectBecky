/// <reference path='Player.ts'/>
/// <reference path='Updateable.ts'/>

/**
 * Represents the current player. The avatar being controlled by the user.
 * See OpponentPlayer for the other players.
 */
class ClientPlayer implements Player, Updateable {
    private acceleration: number = 5;
    private max_velocity: number = 25;

    private position: Point;
    private angle: number; //radian angle player is aiming towards
    private moveUp: boolean;
    private moveDown: boolean;
    private moveLeft: boolean;
    private moveRight: boolean;
    private velocity: Point;

    constructor(x: number = 0, y: number = 0, angle: number = 0) {
        this.position = new Point(x, y);
        this.angle = angle;
        this.velocity = new Point(0, 0);
    }

    public getXPosition(): number {
        return this.position.getX();
    }

    public getYPosition(): number {
        return this.position.getY();
    }

    public setPosition(x: number, y: number): void {
        this.position = new Point(x, y);
    }

    public getAngle(): number {
        return this.angle;
    }

    public setAngle(angle: number): void {
        this.angle = angle;
    }

    public aimAtMouse(mouseX: number, mouseY: number): void {
        //TODO: Aim player towards mouse (phase 2)
    }

    public setMovementKeysPressed(up: boolean, down: boolean, left: boolean, right: boolean) {
        this.moveUp = up;
        this.moveDown = down;
        this.moveLeft = left;
        this.moveRight = right;
    }

    public draw(context: CanvasRenderingContext2D): void {
        //TODO: Draw player
    }

    public update(elapsedTime: number): void {
        let fracSecond: number = elapsedTime / 1000.0;

        this.updateVelocity(fracSecond);
        this.capVelocity();
        this.updatePosition(fracSecond);
        this.handleBorderCollision();
    }

    private updateVelocity(fracSecond: number): void {
        //calculate partial second acceleration
        let accel:number = this.acceleration * fracSecond;

        //update velocity
        if(this.moveUp) {
            this.velocity.addY(-accel);
        }
        else if(this.moveDown) {
            this.velocity.addY(accel);
        }
        else {
            if(this.velocity.getY() < 0) {
                this.velocity.addY(this.acceleration);
            }
            else if(this.velocity.getY() > 0) {
                this.velocity.addY(-this.acceleration);
            }
        }
        if(this.moveLeft) {
            this.velocity.addX(-accel);
        }
        else if(this.moveRight) {
            this.velocity.addX(accel);
        }
        else {
            if(this.velocity.getX() < 0) {
                this.velocity.addX(this.acceleration);
            }
            else if(this.velocity.getX() > 0) {
                this.velocity.addX(-this.acceleration);
            }
        }
    }

    private capVelocity(): void {
        //cap velocity
        if(this.velocity.getX() > this.max_velocity) {
            this.velocity.setX(this.max_velocity);
        }
        else if(this.velocity.getX() < -this.max_velocity) {
            this.velocity.setX(-this.max_velocity);
        }
        if(this.velocity.getY() > this.max_velocity) {
            this.velocity.setY(this.max_velocity);
        }
        else if(this.velocity.getY() < -this.max_velocity) {
            this.velocity.setY(-this.max_velocity);
        }
    }

    private updatePosition(fracSecond: number): void {
        //update position
        this.position.addX(this.velocity.getX() * fracSecond);
        this.position.addY(this.velocity.getY() * fracSecond);
    }

    private handleBorderCollision(): void {
        //TODO: Handle collisions with the world border (blocked phase 1)
    }
}