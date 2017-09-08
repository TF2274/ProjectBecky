//This is a placeholder file until the real shit gets placed here.

class Greeter {
    constructor(public greeting: string) {}

    greet() {
        return "<h1>" + this.greeting + "</h1>";
    }
};

var greeter = new Greeter("Hello, World");
var data = greeter.greet();