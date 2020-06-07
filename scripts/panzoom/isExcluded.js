"use strict";
exports.__esModule = true;
function getClass(elem) {
    return (elem.getAttribute('class') || '').trim();
}
function hasClass(elem, className) {
    return elem.nodeType === 1 && (" " + getClass(elem) + " ").indexOf(" " + className + " ") > -1;
}
function isExcluded(elem, options) {
    for (var cur = elem; cur != null; cur = cur.parentNode) {
        if (hasClass(cur, options.excludeClass) || options.exclude.indexOf(cur) > -1) {
            return true;
        }
    }
    return false;
}
exports["default"] = isExcluded;
