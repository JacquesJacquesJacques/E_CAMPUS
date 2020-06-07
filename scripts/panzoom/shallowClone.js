"use strict";
exports.__esModule = true;
function shallowClone(obj) {
    var clone = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = obj[key];
        }
    }
    return clone;
}
exports["default"] = shallowClone;
