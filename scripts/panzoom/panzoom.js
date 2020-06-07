"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
/**
 * Panzoom for panning and zooming elements using CSS transforms
 * https://github.com/timmywil/panzoom
 *
 * Copyright Timmy Willison and other contributors
 * Released under the MIT license
 * https://github.com/timmywil/panzoom/blob/master/MIT-License.txt
 *
 */
require("./polyfills");
var pointers_1 = require("./pointers");
var events_1 = require("./events");
var css_1 = require("./css");
var isAttached_1 = require("./isAttached");
var isExcluded_1 = require("./isExcluded");
var isSVGElement_1 = require("./isSVGElement");
var shallowClone_1 = require("./shallowClone");
var defaultOptions = {
    animate: false,
    canvas: false,
    cursor: 'move',
    disablePan: false,
    disableZoom: false,
    disableXAxis: false,
    disableYAxis: false,
    duration: 200,
    easing: 'ease-in-out',
    exclude: [],
    excludeClass: 'panzoom-exclude',
    handleStartEvent: function (e) {
        e.preventDefault();
        e.stopPropagation();
    },
    maxScale: 4,
    minScale: 0.125,
    overflow: 'hidden',
    panOnlyWhenZoomed: false,
    relative: false,
    setTransform: css_1.setTransform,
    startX: 0,
    startY: 0,
    startScale: 1,
    step: 0.3
};
function Panzoom(elem, options) {
    if (!elem) {
        throw new Error('Panzoom requires an element as an argument');
    }
    if (elem.nodeType !== 1) {
        throw new Error('Panzoom requires an element with a nodeType of 1');
    }
    if (!isAttached_1["default"](elem)) {
        throw new Error('Panzoom should be called on elements that have been attached to the DOM');
    }
    options = __assign(__assign({}, defaultOptions), options);
    var isSVG = isSVGElement_1["default"](elem);
    // Set overflow on the parent
    var parent = elem.parentNode;
    parent.style.overflow = options.overflow;
    parent.style.userSelect = 'none';
    // This is important for mobile to
    // prevent scrolling while panning
    parent.style.touchAction = 'none';
    (options.canvas ? parent : elem).style.cursor = options.cursor;
    elem.style.userSelect = 'none';
    elem.style.touchAction = 'none';
    // The default for HTML is '50% 50%'
    // The default for SVG is '0 0'
    // SVG can't be changed in IE
    css_1.setStyle(elem, 'transformOrigin', typeof options.origin === 'string' ? options.origin : isSVG ? '0 0' : '50% 50%');
    function setOptions(opts) {
        if (opts === void 0) { opts = {}; }
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                options[key] = opts[key];
            }
        }
        // Handle option side-effects
        if (opts.hasOwnProperty('cursor')) {
            elem.style.cursor = opts.cursor;
        }
        if (opts.hasOwnProperty('overflow')) {
            parent.style.overflow = opts.overflow;
        }
        if (opts.hasOwnProperty('minScale') ||
            opts.hasOwnProperty('maxScale') ||
            opts.hasOwnProperty('contain')) {
            setMinMax();
        }
        if (opts.hasOwnProperty('disablePan')) {
            if (opts.disablePan) {
                destroy();
            }
            else {
                bind();
            }
        }
    }
    var x = 0;
    var y = 0;
    var scale = 1;
    var isPanning = false;
    zoom(options.startScale, { animate: false });
    // Wait for scale to update
    // for accurate dimensions
    // to constrain initial values
    setTimeout(function () {
        setMinMax();
        pan(options.startX, options.startY, { animate: false });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function trigger(eventName, detail, opts) {
        if (opts.silent) {
            return;
        }
        var event = new CustomEvent(eventName, { detail: detail });
        elem.dispatchEvent(event);
    }
    function setTransformWithEvent(eventName, opts) {
        var value = { x: x, y: y, scale: scale, isSVG: isSVG };
        requestAnimationFrame(function () {
            if (typeof opts.animate === 'boolean') {
                if (opts.animate) {
                    css_1.setTransition(elem, opts);
                }
                else {
                    css_1.setStyle(elem, 'transition', 'none');
                }
            }
            opts.setTransform(elem, value, opts);
        });
        trigger(eventName, value, opts);
        trigger('panzoomchange', value, opts);
        return value;
    }
    function setMinMax() {
        if (options.contain) {
            var dims = css_1.getDimensions(elem);
            var parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right;
            var parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom;
            var elemWidth = dims.elem.width / scale;
            var elemHeight = dims.elem.height / scale;
            var elemScaledWidth = parentWidth / elemWidth;
            var elemScaledHeight = parentHeight / elemHeight;
            if (options.contain === 'inside') {
                options.maxScale = Math.min(elemScaledWidth, elemScaledHeight);
            }
            else if (options.contain === 'outside') {
                options.minScale = Math.max(elemScaledWidth, elemScaledHeight);
            }
        }
    }
    function constrainXY(toX, toY, toScale, panOptions) {
        var opts = __assign(__assign({}, options), panOptions);
        var result = { x: x, y: y, opts: opts };
        if (!opts.force && (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))) {
            return result;
        }
        toX = parseFloat(toX);
        toY = parseFloat(toY);
        if (!opts.disableXAxis) {
            result.x = (opts.relative ? x : 0) + toX;
        }
        if (!opts.disableYAxis) {
            result.y = (opts.relative ? y : 0) + toY;
        }
        if (opts.contain === 'inside') {
            var dims = css_1.getDimensions(elem);
            result.x = Math.max(-dims.elem.margin.left - dims.parent.padding.left, Math.min(dims.parent.width -
                dims.elem.width / toScale -
                dims.parent.padding.left -
                dims.elem.margin.left -
                dims.parent.border.left -
                dims.parent.border.right, result.x));
            result.y = Math.max(-dims.elem.margin.top - dims.parent.padding.top, Math.min(dims.parent.height -
                dims.elem.height / toScale -
                dims.parent.padding.top -
                dims.elem.margin.top -
                dims.parent.border.top -
                dims.parent.border.bottom, result.y));
        }
        else if (opts.contain === 'outside') {
            var dims = css_1.getDimensions(elem);
            var realWidth = dims.elem.width / scale;
            var realHeight = dims.elem.height / scale;
            var scaledWidth = realWidth * toScale;
            var scaledHeight = realHeight * toScale;
            var diffHorizontal = (scaledWidth - realWidth) / 2;
            var diffVertical = (scaledHeight - realHeight) / 2;
            var minX = (-(scaledWidth - dims.parent.width) -
                dims.parent.padding.left -
                dims.parent.border.left -
                dims.parent.border.right +
                diffHorizontal) /
                toScale;
            var maxX = (diffHorizontal - dims.parent.padding.left) / toScale;
            result.x = Math.max(Math.min(result.x, maxX), minX);
            var minY = (-(scaledHeight - dims.parent.height) -
                dims.parent.padding.top -
                dims.parent.border.top -
                dims.parent.border.bottom +
                diffVertical) /
                toScale;
            var maxY = (diffVertical - dims.parent.padding.top) / toScale;
            result.y = Math.max(Math.min(result.y, maxY), minY);
        }
        return result;
    }
    function constrainScale(toScale, zoomOptions) {
        var opts = __assign(__assign({}, options), zoomOptions);
        var result = { scale: scale, opts: opts };
        if (!opts.force && opts.disableZoom) {
            return result;
        }
        result.scale = Math.min(Math.max(toScale, opts.minScale), opts.maxScale);
        return result;
    }
    function pan(toX, toY, panOptions) {
        var result = constrainXY(toX, toY, scale, panOptions);
        var opts = result.opts;
        x = result.x;
        y = result.y;
        return setTransformWithEvent('panzoompan', opts);
    }
    function zoom(toScale, zoomOptions) {
        var result = constrainScale(toScale, zoomOptions);
        var opts = result.opts;
        if (!opts.force && opts.disableZoom) {
            return;
        }
        toScale = result.scale;
        var toX = x;
        var toY = y;
        if (opts.focal) {
            // The difference between the point after the scale and the point before the scale
            // plus the current translation after the scale
            // neutralized to no scale (as the transform scale will apply to the translation)
            var focal = opts.focal;
            toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale;
            toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale;
        }
        var panResult = constrainXY(toX, toY, toScale, { relative: false, force: true });
        x = panResult.x;
        y = panResult.y;
        scale = toScale;
        return setTransformWithEvent('panzoomzoom', opts);
    }
    function zoomInOut(isIn, zoomOptions) {
        var opts = __assign(__assign(__assign({}, options), { animate: true }), zoomOptions);
        return zoom(scale * Math.exp((isIn ? 1 : -1) * opts.step), opts);
    }
    function zoomIn(zoomOptions) {
        return zoomInOut(true, zoomOptions);
    }
    function zoomOut(zoomOptions) {
        return zoomInOut(false, zoomOptions);
    }
    function zoomToPoint(toScale, point, zoomOptions) {
        var dims = css_1.getDimensions(elem);
        // Instead of thinking of operating on the panzoom element,
        // think of operating on the area inside the panzoom
        // element's parent
        // Subtract padding and border
        var effectiveArea = {
            width: dims.parent.width -
                dims.parent.padding.left -
                dims.parent.padding.right -
                dims.parent.border.left -
                dims.parent.border.right,
            height: dims.parent.height -
                dims.parent.padding.top -
                dims.parent.padding.bottom -
                dims.parent.border.top -
                dims.parent.border.bottom
        };
        // Adjust the clientX/clientY to ignore the area
        // outside the effective area
        var clientX = point.clientX -
            dims.parent.left -
            dims.parent.padding.left -
            dims.parent.border.left -
            dims.elem.margin.left;
        var clientY = point.clientY -
            dims.parent.top -
            dims.parent.padding.top -
            dims.parent.border.top -
            dims.elem.margin.top;
        // Adjust the clientX/clientY for HTML elements,
        // because they have a transform-origin of 50% 50%
        if (!isSVG) {
            clientX -= dims.elem.width / scale / 2;
            clientY -= dims.elem.height / scale / 2;
        }
        // Convert the mouse point from it's position over the
        // effective area before the scale to the position
        // over the effective area after the scale.
        var focal = {
            x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),
            y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)
        };
        return zoom(toScale, __assign(__assign({ animate: false }, zoomOptions), { focal: focal }));
    }
    function zoomWithWheel(event, zoomOptions) {
        // Need to prevent the default here
        // or it conflicts with regular page scroll
        event.preventDefault();
        var opts = __assign(__assign({}, options), zoomOptions);
        // Normalize to deltaX in case shift modifier is used on Mac
        var delta = event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
        var wheel = delta < 0 ? 1 : -1;
        var toScale = constrainScale(scale * Math.exp((wheel * opts.step) / 3), opts).scale;
        return zoomToPoint(toScale, event, opts);
    }
    function reset(resetOptions) {
        var opts = __assign(__assign(__assign({}, options), { animate: true, force: true }), resetOptions);
        scale = constrainScale(opts.startScale, opts).scale;
        var panResult = constrainXY(opts.startX, opts.startY, scale, opts);
        x = panResult.x;
        y = panResult.y;
        return setTransformWithEvent('panzoomreset', opts);
    }
    var origX;
    var origY;
    var startClientX;
    var startClientY;
    var startScale;
    var startDistance;
    var pointers = [];
    function handleDown(event) {
        // Don't handle this event if the target is excluded
        if (isExcluded_1["default"](event.target, options)) {
            return;
        }
        pointers_1.addPointer(pointers, event);
        isPanning = true;
        options.handleStartEvent(event);
        origX = x;
        origY = y;
        trigger('panzoomstart', { x: x, y: y, scale: scale }, options);
        // This works whether there are multiple
        // pointers or not
        var point = pointers_1.getMiddle(pointers);
        startClientX = point.clientX;
        startClientY = point.clientY;
        startScale = scale;
        startDistance = pointers_1.getDistance(pointers);
    }
    function move(event) {
        if (!isPanning ||
            origX === undefined ||
            origY === undefined ||
            startClientX === undefined ||
            startClientY === undefined) {
            return;
        }
        pointers_1.addPointer(pointers, event);
        var current = pointers_1.getMiddle(pointers);
        if (pointers.length > 1) {
            // Use the distance between the first 2 pointers
            // to determine the current scale
            var diff = pointers_1.getDistance(pointers) - startDistance;
            var toScale = constrainScale((diff * options.step) / 80 + startScale).scale;
            zoomToPoint(toScale, current);
        }
        pan(origX + (current.clientX - startClientX) / scale, origY + (current.clientY - startClientY) / scale, {
            animate: false
        });
    }
    function handleUp(event) {
        // Don't call panzoomend when panning with 2 touches
        // until both touches end
        if (pointers.length === 1) {
            trigger('panzoomend', { x: x, y: y, scale: scale }, options);
        }
        // Note: don't remove all pointers
        // Can restart without having to reinitiate all of them
        // Remove the pointer regardless of the isPanning state
        pointers_1.removePointer(pointers, event);
        if (!isPanning) {
            return;
        }
        isPanning = false;
        origX = origY = startClientX = startClientY = undefined;
    }
    function bind() {
        events_1.onPointer('down', options.canvas ? parent : elem, handleDown);
        events_1.onPointer('move', document, move, { passive: true });
        events_1.onPointer('up', document, handleUp, { passive: true });
    }
    function destroy() {
        events_1.destroyPointer('down', options.canvas ? parent : elem, handleDown);
        events_1.destroyPointer('move', document, move);
        events_1.destroyPointer('up', document, handleUp);
    }
    if (!options.disablePan) {
        bind();
    }
    return {
        destroy: destroy,
        eventNames: events_1.eventNames,
        getPan: function () { return ({ x: x, y: y }); },
        getScale: function () { return scale; },
        getOptions: function () { return shallowClone_1["default"](options); },
        pan: pan,
        reset: reset,
        setOptions: setOptions,
        setStyle: function (name, value) { return css_1.setStyle(elem, name, value); },
        zoom: zoom,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        zoomToPoint: zoomToPoint,
        zoomWithWheel: zoomWithWheel
    };
}
Panzoom.defaultOptions = defaultOptions;
exports["default"] = Panzoom;

const panzoom = Panzoom (svg);
