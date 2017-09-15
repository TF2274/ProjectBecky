import Set from "typescript-collections/dist/lib/Set";
import {Renderer} from "./Renderer";
import {Renderable} from "./Renderable";
import {Point} from "./Point";

/**
 * A simple 2D renderer class.
 */
export class SimpleRenderer implements Renderer {
    private elements: Set<Renderable>;
    private renderingContext: CanvasRenderingContext2D;
    private screenOrigin: Point;

    constructor(context: CanvasRenderingContext2D) {
        this.renderingContext = context;
        this.screenOrigin = new Point();
        this.elements = new Set<Renderable>();
    }

    public addRenderable(element: Renderable): void {
        this.elements.add(element);
    }

    public removeRenderable(element: Renderable): boolean {
        return this.elements.remove(element);
    }

    public updateScreenOrigin(screenOrigin: Point): void {
        this.screenOrigin = screenOrigin;
    }

    public draw(): void {
        for(let index: number = 0; index < this.elements.size(); index++) {
            this.elements[index].draw(this.renderingContext, this.screenOrigin);
        }
    }
}