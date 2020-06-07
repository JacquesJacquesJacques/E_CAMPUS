"use strict";
exports.__esModule = true;
/**
 * Determine if an element is attached to the DOM
 * Panzoom requires this so events work properly
 */
function isAttached(elem) {
    var doc = elem.ownerDocument;
    var parent = elem.parentNode;
    return (doc &&
        parent &&
        doc.nodeType === 9 &&
        parent.nodeType === 1 &&
        doc.documentElement.contains(parent));
}
exports["default"] = isAttached;
