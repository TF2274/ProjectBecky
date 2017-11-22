///<reference path="./collections/Point.ts"/>

/**
 * This interface represents any object that can be rendered.
 */
interface Renderable {
    /**
     * Draws this renderable to the canvas using the provided rendering context.
     * @param context The rendering context to perform drawing operations
     * @param screenOrigin The world-space position of the top left corner of the screen.
     */
    draw(context: CanvasRenderingContext2D, screenOrigin: Point): void;

    /**
     * Draws this renderable to the canvas using the provided rendering context.
     * @param glContext
     */
    //This is not being implemented, but is commented out in case it is implemented in the future.
    //glDraw(glContext: WebGLRenderingContext): void;
}

/**
 * This class is a drawing class. It has four purposes:
 * 1) Accepts a list of points to draw
 * 2) Rotates those points by a specified number of degrees around the origin point (0, 0)
 * 3) Translates those points by a specified amount
 * 4) Draw those points by either filling in a polygon of those points or by connecting the points via drawn lines
 * Basically this class helps with converting 2D points from object space into screen space.
 */
class VectorDrawInstance {
    private points: Point[] = null;
    private numPoints: number = 0;

    constructor() {}

    /**
     * Sets the points in local space. This should be called first on every draw call.
     * Local space is the space local to the object. This means the origin is (0,0), and all
     * points are around the origin. The origin is also the physical origin of the object itself and
     * is what the points will rotate around.
     * @param {Point[]} points
     */
    public setLocalSpacePoints(points: Point[]): void {
        this.points = points;
        this.numPoints = points.length;
    }

    /**
     * Converts the points from local space into world space. World space is the location in the entire game world
     * where the points are located. These points can be on camera or off camera.
     * @param {number} xPosition
     * @param {number} yPosition
     * @param {number} angle
     */
    public translateToWorldSpace(xPosition: number, yPosition: number, angle: number): void {
        this.rotate(angle);
        this.translate(xPosition, yPosition);
    }

    /**
     * Converts the points from world space to screen space. Screen space is the actual coordinates/pixels on the screen.
     * World space coordinates, once converted to screen space, can be drawn directly to the screen.
     * @param {number} screenOriginX
     * @param {number} screenOriginY
     */
    public translateToScreenSpace(screenOriginX: number, screenOriginY: number): void {
        this.translate(-screenOriginX, -screenOriginY);
    }

    /**
     * Uses the given context to draw a line between the selected lines.
     * The points are indicated by indices. For example, if this utility contains 10 points indexed [0...9],
     * and if indices=[0, 1, 2, 3, 4], then a line will be drawn from the point at index 0 to the point at index 1,
     * to the point at index 2, then to 3, and finally to the point at index 4. Drawing will then stop.
     * If closePathBeforeDraw is true, then context.closePath() will be called before context.stroke().
     * Otherwise context.stroke() will be called before context.closePath().
     *
     * NOTE: If indices.length < 2 then nothing will happen because two points are needed to draw a line.
     * Additionally, all of the context properties such as color must be set beforehand.
     * @param {CanvasRenderingContext2D} context
     * @param {number} indices
     * @param {boolean} closePathBeforeDraw
     */
    public line(context: CanvasRenderingContext2D, indices: number[], closePathBeforeDraw: boolean): void {
        if(indices.length < 2) {
            return;
        }

        context.beginPath();
        let p: Point = this.points[indices[0]];
        context.moveTo(p.getX(), p.getY());
        for(let i = 1; i < indices.length; i++) {
            p = this.points[indices[i]];
            context.lineTo(p.getX(), p.getY());
        }

        if(closePathBeforeDraw) {
            context.closePath();
            context.stroke();
        }
        else {
            context.stroke();
            context.closePath();
        }
    }

    /**
     * See the documentation for the line() method. This method works like the line method, except instead of
     * drawing lines, it draws a polygon in which all of the points located at the provided indices are vertices
     * of that polygon.
     *
     * NOTE: If indices.length < 3 then nothing will happen because a polygon requires a minimum of 3 points.
     * Additionally, all of the context properties such as color must be set beforehand.
     * @param {CanvasRenderingContext2D} context
     * @param {number[]} indices
     */
    public fill(context: CanvasRenderingContext2D, indices: number[]): void {
        if(indices.length < 3) {
            return;
        }

        context.beginPath();
        let p: Point = this.points[indices[0]];
        context.moveTo(p.getX(), p.getY());
        for(let i = 1; i < indices.length; i++) {
            p = this.points[indices[i]];
            context.lineTo(p.getX(), p.getY());
        }
        context.closePath();
        context.fill();
    }

    /**
     * Gets the points in their current state.
     * For example, if the local points have been translated to screen space, then the points
     * will be the screen space points.
     * @returns {Point[]}
     */
    public getPoints(): Point[] {
        return this.points;
    }

    private translate(x: number, y: number): void {
        for(let i = 0; i < this.numPoints; i++) {
            let p: Point = this.points[i];
            p.addX(x);
            p.addY(y);
        }
    }

    private rotate(a: number): void {
        let sinAngle: number = Math.sin(a + Math.PI/2.0);
        let cosAngle: number = Math.cos(a + Math.PI/2.0);

        //rotate all of the points around the origin
        //It is assumed the points have not been transformed
        for (let i = 0; i < this.points.length; i++) {
            let p: Point = this.points[i];
            let x: number = p.getX();
            let y: number = p.getY();
            p.setX(x*cosAngle - y*sinAngle);
            p.setY(x*sinAngle + y*cosAngle);
        }
    }
}