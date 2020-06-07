"use strict";
/**
 * Utilites for working with multiple pointer events
 */
exports.__esModule = true;
exports.getDistance = exports.getMiddle = exports.removePointer = exports.addPointer = void 0;
function findEventIndex(pointers, event) {
    var i = pointers.length;
    while (i--) {
        if (pointers[i].pointerId === event.pointerId) {
            return i;
        }
    }
    return -1;
}
function addPointer(pointers, event) {
    var i;
    // Add touches if applicable
    if (event.touches) {
        i = 0;
        for (var _i = 0, _a = event.touches; _i < _a.length; _i++) {
            var touch = _a[_i];
            touch.pointerId = i++;
            addPointer(pointers, touch);
        }
        return;
    }
    i = findEventIndex(pointers, event);
    // Update if already present
    if (i > -1) {
        pointers.splice(i, 1);
    }
    pointers.push(event);
}
exports.addPointer = addPointer;
function removePointer(pointers, event) {
    // Add touches if applicable
    if (event.touches) {
        // Remove all touches
        while (pointers.length) {
            pointers.pop();
        }
        return;
    }
    var i = findEventIndex(pointers, event);
    if (i > -1) {
        pointers.splice(i, 1);
    }
}
exports.removePointer = removePointer;
/**
 * Calculates a center point between
 * the given pointer events, for panning
 * with multiple pointers.
 */
function getMiddle(pointers) {
    // Copy to avoid changing by reference
    pointers = pointers.slice(0);
    var event1 = pointers.pop();
    var event2;
    while ((event2 = pointers.pop())) {
        event1 = {
            clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,
            clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY
        };
    }
    return event1;
}
exports.getMiddle = getMiddle;
/**
 * Calculates the distance between two points
 * for pinch zooming.
 * Limits to the first 2
 */
function getDistance(pointers) {
    if (pointers.length < 2) {
        return 0;
    }
    var event1 = pointers[0];
    var event2 = pointers[1];
    return Math.sqrt(Math.pow(Math.abs(event2.clientX - event1.clientX), 2) +
        Math.pow(Math.abs(event2.clientY - event1.clientY), 2));
}
exports.getDistance = getDistance;
