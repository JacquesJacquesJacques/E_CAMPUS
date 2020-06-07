"use strict";
exports.__esModule = true;
exports.destroyPointer = exports.onPointer = exports.eventNames = void 0;
var events;
exports.eventNames = events;
if (typeof window.PointerEvent === 'function') {
    exports.eventNames = events = {
        down: 'pointerdown',
        move: 'pointermove',
        up: 'pointerup pointerleave pointercancel'
    };
}
else if (typeof window.TouchEvent === 'function') {
    exports.eventNames = events = {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend touchcancel'
    };
}
else {
    exports.eventNames = events = {
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup mouseleave'
    };
}
function onPointer(event, elem, handler, eventOpts) {
    events[event].split(' ').forEach(function (name) {
        ;
        elem.addEventListener(name, handler, eventOpts);
    });
}
exports.onPointer = onPointer;
function destroyPointer(event, elem, handler) {
    events[event].split(' ').forEach(function (name) {
        ;
        elem.removeEventListener(name, handler);
    });
}
exports.destroyPointer = destroyPointer;
