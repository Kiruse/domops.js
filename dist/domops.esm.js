//////////////////////////////////////////////////////////////////////
// A minimalist's interpretation of jQuery for DOM traversal & manipulation.
// -----
// Copyright (c) Kiruse 2021. Licensed under MIT License
"use strict";
export default function $(...args) { return new DocQuery(...args); }
let docready = false;
$.create = function (tag) {
    return new DocQuery(document.createElement(tag));
};
document.addEventListener('DOMContentLoaded', () => docready = true);
$.onready = function (cb) {
    if (docready) {
        cb();
    }
    else {
        document.addEventListener('DOMContentLoaded', cb);
    }
};
export class ArgumentError extends Error {
}
export class DocQuery {
    selector;
    relative;
    elements;
    length;
    constructor(...args) {
        if (args.length === 0)
            throw new ArgumentError('no arguments passed');
        if (Array.isArray(args[0])) {
            this.relative = [];
            this.elements = args[0];
        }
        else {
            if (typeof (args[0]) === 'string') {
                this.selector = args[0];
                if (args.length < 2)
                    this.relative = [document];
                else
                    this.relative = unique(ensureArray(args[1]));
                if (!Array.isArray(this.relative))
                    this.relative = [this.relative];
                this.elements = DocQuery._query(this.selector, this.relative);
            }
            else {
                this.relative = [];
                this.elements = args;
            }
        }
        for (let i = 0; i < this.elements.length; ++i) {
            this[i] = this.elements[i];
        }
        this.length = this.elements.length;
    }
    /**
     * Descend further down the DOM of each element in the current selection filtering for children matching the given selector.
     * @see HTMLElement.querySelectorAll
     * @param selector new selector to apply
     * @returns new DocQuery containing all matching elements
     */
    query(selector) {
        return new DocQuery(selector, this.elements);
    }
    /**
     * Isolate a single element from the current selection.
     * @param index of the element of the current selection to isolate
     * @returns new DocQuery containing only the indexed element
     */
    at(...indices) {
        if (indices.length === 0)
            return [];
        return new DocQuery(...indices.map(i => this.elements[i]).filter(e => !!e));
    }
    /**
     * Isolate every nth element of the current selection in a new selection.
     * @param n distance between elements
     * @returns new DocQuery containing only every nth element
     */
    nth(n) {
        return new DocQuery(...this.elements.filter((_, i) => i % n === 0));
    }
    attr(...args) {
        if (args.length === 0)
            throw new ArgumentError('no arguments');
        if (args.length === 1) {
            if (typeof (args[0]) === 'object')
                return this._attr_obj(args[0]);
            else
                return this._attr_get(args[0]);
        }
        else {
            return this._attr_set(args[0], args[1]);
        }
    }
    _attr_get(name) {
        return this.elements.map(e => e.getAttribute(name));
    }
    _attr_set(name, value) {
        this.elements.forEach(e => e.setAttribute(name, value));
        return this;
    }
    _attr_obj(props) {
        for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
                this._attr_set(prop, props[prop]);
            }
        }
        return this;
    }
    data(...args) {
        if (args.length === 0)
            throw new ArgumentError('no arguments');
        if (args.length === 1) {
            if (typeof (args[0]) === 'object')
                return this._data_obj(args[0]);
            else
                return this._attr_get('data-' + args[0]);
        }
        else {
            return this._attr_set('data-' + args[0], args[1]);
        }
    }
    _data_obj(props) {
        for (let attr in props) {
            if (props.hasOwnProperty(attr)) {
                this._attr_set('data-' + attr, props[attr]);
            }
        }
        return this;
    }
    text(arg) {
        if (arg === undefined) {
            return this.elements.map(e => e.innerText);
        }
        if (typeof (arg) === 'function') {
            for (let i = 0; i < this.elements.length; ++i) {
                this.elements[i].innerText = arg(this.elements[i], i, this.elements);
            }
            return this;
        }
        else {
            this.elements.forEach(el => el.innerText = arg);
            return this;
        }
    }
    html(arg) {
        if (arg === undefined) {
            return this.elements.map(e => e.innerHTML);
        }
        if (typeof (arg) === 'function') {
            for (let i = 0; i < this.elements.length; ++i) {
                this.elements[i].innerHTML = arg(this.elements[i], i, this.elements);
            }
            return this;
        }
        else {
            this.elements.forEach(el => el.innerHTML = arg);
            return this;
        }
    }
    value(val) {
        if (val === undefined) {
            return this.elements.map(el => el.value);
        }
        else {
            this.elements.forEach((el, i, ary) => {
                const input = el;
                input.value = typeof (val) === 'function' ? val(el, i, ary) : val;
            });
            return this;
        }
    }
    style(...args) {
        if (args.length === 0)
            throw new ArgumentError('no arguments');
        if (args.length === 1) {
            if (typeof (args[0]) === 'object')
                return this._style_obj(args[0]);
            else
                return this._style_get(args[0]);
        }
        else {
            return this._style_set(args[0], args[1]);
        }
    }
    /**
     * Get the absolute location on the page of each element in the current selection.
     * @returns Array of 2-tuples [[x, y]]
     */
    location() {
        return this.elements.map(this._elementLocation.bind(this));
    }
    _elementLocation(el) {
        const result = [0, 0];
        while (el) {
            result[0] += el.offsetLeft;
            result[1] += el.offsetTop;
            el = el.offsetParent;
        }
        return result;
    }
    /**
     * Get the absolute size of each element in the current selection.
     * @returns Array of 2-tuples [[x, y]]
     */
    size() {
        return this.elements.map(el => [el.offsetWidth, el.offsetHeight]);
    }
    /**
     * Get the offsets of each element relative to their individual offset parents.
     * The offset parent is the first ancestor element with CSS display set to anything but 'static'. In other words,
     * it's the element considered as the anchor point by CSS.
     *
     * `right` and `bottom` are regular distances, i.e. distance from anchor parent's left border to element's right
     * border respectively.
     *
     * @returns Array of 4-tuples [[left, top, right, bottom]]
     */
    box({ absolute }) {
        return this.elements.map(el => {
            const [x, y] = absolute ? this._elementLocation(el) : [el.offsetLeft, el.offsetTop];
            const [w, h] = [el.offsetWidth, el.offsetHeight];
            return [x, y, x + w, y + h];
        });
    }
    /**
     * Get the offsets of each element relative to their individual offset parents as CSS-compatible objects array.
     *
     * Unlike {@see box}, `right` and `bottom` properties are reversed distances, i.e. distance from anchor parent's
     * right border to element's own right border respectively.
     *
     * @returns Array of CSS location objects [{top, left, right, bottom}]
     */
    cssBox() {
        return this.elements.map(el => {
            const parent = el.offsetParent ?? document.body;
            const [pw, ph] = [parent.offsetWidth, parent.offsetHeight];
            const [x, y] = [el.offsetLeft, el.offsetTop];
            const [w, h] = [el.offsetWidth, el.offsetHeight];
            return {
                top: y,
                left: x,
                right: pw - (x + w),
                bottom: ph - (y + h),
            };
        });
    }
    _style_get(name) {
        return this.elements.map(e => getComputedStyle(e)[name]);
    }
    _style_set(name, value) {
        this.elements.forEach((e) => e.style[name] = value); // for some reason TypeScript is unaware of style property
        return this;
    }
    _style_obj(props) {
        for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
                this._style_set(prop, props[prop]);
            }
        }
        return this;
    }
    addClass(...classes) {
        this.elements.forEach(e => e.classList.add(...classes));
        return this;
    }
    removeClass(...classes) {
        this.elements.forEach(e => e.classList.remove(...classes));
        return this;
    }
    hasClass(cls) {
        return this.elements.map(e => e.classList.contains(cls));
    }
    on(evt, handler) {
        const events = evt.split(/\s+/);
        for (let elem of this.elements) {
            for (let event of events) {
                elem.addEventListener(event, handler);
            }
        }
        return this;
    }
    forEach(cb) {
        this.elements.forEach(cb);
        return this;
    }
    /**
     * Transform each element in the current selection and return the new selection.
     * @param cb transformer to apply
     * @returns new selection of transformed elements
     */
    map(cb) {
        return new DocQuery(...this.elements.map(cb));
    }
    /**
     * Attach every element in the current selection to the given parent element.
     * @param parent parent element to attach to
     * @returns this selection
     */
    attachTo(parent) {
        if (parent instanceof DocQuery) {
            parent = parent[0];
        }
        this.elements.forEach(e => parent.appendChild(e));
        return this;
    }
    /**
     * Attach given children to the current selection's first element.
     * @note elements can only be parented to at most one element, thus attaching to all elements in the selection is impossible.
     * @note if the selection is empty, given children will be detached from the entire document instead
     * @param children to attach
     * @return this selection
     */
    attach(...children) {
        if (this.elements.length === 0) {
            children.forEach(child => {
                if (typeof child === 'object')
                    child.parentElement.removeChild(child);
            });
        }
        else {
            children.forEach(child => this.elements[0].appendChild(typeof child === 'string' ? document.createTextNode(child) : child));
        }
        return this;
    }
    /**
     * Detach the current selection from their parent elements.
     * @note The elements in this selection will be effectively removed from the DOM until reattached.
     * @see attach, attachTo
     * @returns this selection
     */
    detach() {
        for (let el of this.elements) {
            el.parentElement.removeChild(el);
        }
        return this;
    }
    /**
     * Gets the parent element of every element in the current selection.
     * If multiple elements share a parent, that parent is added only once.
     * @returns new selection of parent elements
     */
    parent() {
        const parents = [];
        for (let elem of this.elements) {
            if (parents.indexOf(elem.parentElement) === -1) {
                parents.push(elem.parentElement);
            }
        }
        return new DocQuery(...parents);
    }
    /**
     * Detach all children from the elements of the current selection.
     * @returns this selection
     */
    empty() {
        for (let el of this.elements) {
            for (let child of el.children) {
                el.removeChild(child);
            }
        }
        return this;
    }
    static _query(selector, relative) {
        return relative.map(r => [...r.querySelectorAll(selector)]).flat(1);
    }
}
function unique(arr) {
    for (let i = 0; i < arr.length; ++i) {
        for (let j = i + 1; j < arr.length;) {
            if (arr[i] === arr[j]) {
                arr.splice(j, 1);
                continue;
            }
            else {
                ++j;
            }
        }
    }
    return arr;
}
const ensureArray = x => Array.isArray(x) ? x : [x];
