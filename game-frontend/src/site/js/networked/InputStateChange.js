"use strict";
exports.__esModule = true;
/**
 * This is the class that contains info to send to the server about the state of
 * player input changing.
 */
var InputStateChange = (function () {
    function InputStateChange() {
        this.username = ""; //the username
        this.authenticationString = ""; //the authentication string that must be sent with each message
        this.inputName = "w"; //the name of the input (w, a, s, d, space, mouse, or click)
        this.flag = false; //used only if the input is a key/mouse button press
    }

    return InputStateChange;
}());
exports.InputStateChange = InputStateChange;
//# sourceMappingURL=InputStateChange.js.map