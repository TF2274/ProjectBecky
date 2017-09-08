//This is a placeholder file until the real shit gets placed here.
var Greeter = (function () {
    function Greeter(greeting) {
        this.greeting = greeting;
    }
    Greeter.prototype.greet = function () {
        return "<h1>" + this.greeting + "</h1>";
    };
    return Greeter;
})();
;
var greeter = new Greeter("Hello, World");
var data = greeter.greet();
//# sourceMappingURL=placeholder.js.map