/**
 * A simple set class
 */
class Set<T> {
    private length: number = -1;
    private elements: T[] = [];

    public add(element: T): void {
        length++;
        this.elements.push(element);
    }

    public remove(element: T): boolean {
        for(let i: number = 0; i < this.length; i++) {
            if(this.elements[i] == element) {
                length--;
                this.elements.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    public size(): number {
        return this.length;
    }
}