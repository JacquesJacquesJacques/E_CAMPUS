"use strict";
exports.__esModule = true;
/**
 * Determine if an element is SVG by checking the namespace
 * Exception: the <svg> element itself should be treated like HTML
 */
var rsvg = /^http:[\w\.\/]+svg$/;
function isSVGElement(elem) {
    return rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== 'svg';
}
exports["default"] = isSVGElement;
