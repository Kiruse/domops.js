declare type Relative = Document | HTMLElement;
export default function $(query: string): DocQuery;
export default function $(query: string, rel: Relative): DocQuery;
export default function $(query: string, rel: Relative[]): DocQuery;
declare function $(elements: HTMLElement[]): DocQuery;
declare namespace $ {
    var create: (tag: string) => DocQuery;
    var onready: (cb: () => void) => void;
    var onhash: (callback: () => void) => void;
    var hash: () => string;
    var target: () => DocQuery;
    var delay: (timeout: number) => Promise<unknown>;
}
export default $;
export declare class ArgumentError extends Error {
}
interface DOMEventHandler {
    (evt: Event): any;
}
export declare class DocQuery {
    readonly selector: string;
    readonly relative: Relative[];
    readonly elements: HTMLElement[];
    readonly length: number;
    constructor(selector: string);
    constructor(selector: string, rel: Relative);
    constructor(selector: string, rel: Relative[]);
    constructor(...elements: HTMLElement[]);
    /**
     * Descend further down the DOM of each element in the current selection filtering for children matching the given selector.
     * @see HTMLElement.querySelectorAll
     * @param selector new selector to apply
     * @returns new DocQuery containing all matching elements
     */
    query(selector: string): DocQuery;
    /**
     * Isolate a single element from the current selection.
     * @param index of the element of the current selection to isolate
     * @returns new DocQuery containing only the indexed element
     */
    at(...indices: number[]): any[] | DocQuery;
    /**
     * Isolate every nth element of the current selection in a new selection.
     * @param n distance between elements
     * @returns new DocQuery containing only every nth element
     */
    nth(n: number): DocQuery;
    attr(name: string): string[];
    attr(name: string, value: any): this;
    attr(props: Object): this;
    private _attr_get;
    private _attr_set;
    private _attr_obj;
    data(name: string): string[];
    data(name: string, value: string): this;
    data(props: Object): this;
    private _data_obj;
    text(): string[];
    text(value: string): this;
    text(cb: (el: HTMLElement, i: number, ary: HTMLElement[]) => string): this;
    html(): string[];
    html(value: string): this;
    html(cb: (el: HTMLElement, i: number, ary: HTMLElement[]) => string): this;
    value(): string[];
    value(val: string): this;
    value(cb: (el: HTMLElement, i: number, ary: HTMLElement[]) => string): this;
    style(name: string): string[];
    style(name: string, value: any): this;
    style(styles: Object): this;
    show(display?: string): this;
    hide(display?: string): this;
    /**
     * Get the absolute location on the page of each element in the current selection.
     * @returns Array of 2-tuples [[x, y]]
     */
    location(): [number, number][];
    private _elementLocation;
    /**
     * Get the absolute size of each element in the current selection.
     * @returns Array of 2-tuples [[x, y]]
     */
    size(): [number, number][];
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
    box({ absolute }?: {
        absolute?: boolean;
    }): [number, number, number, number][];
    /**
     * Get the offsets of each element relative to their individual offset parents as CSS-compatible objects array.
     *
     * Unlike {@see box}, `right` and `bottom` properties are reversed distances, i.e. distance from anchor parent's
     * right border to element's own right border respectively.
     *
     * @returns Array of CSS location objects [{top, left, right, bottom}]
     */
    cssBox(): {
        top: number;
        left: number;
        right: number;
        bottom: number;
    }[];
    private _style_get;
    private _style_set;
    private _style_obj;
    addClass(...classes: string[]): this;
    removeClass(...classes: string[]): this;
    hasClass(cls: string): boolean[];
    on(evt: string, handler: DOMEventHandler): this;
    forEach(cb: (el: HTMLElement, idx: number, ary: HTMLElement[]) => void): this;
    /**
     * Filter elements from the current selection for which the given predicate returns true.
     * @param predicate by which to filter selection.
     * @returns new selection containing filtered elements.
     */
    filter(predicate: (el: HTMLElement, idx: number, ary: HTMLElement[]) => boolean): DocQuery;
    /**
     * Transform each element in the current selection and return the new selection.
     * @param cb transformer to apply
     * @returns new selection of transformed elements
     */
    map(cb: (el: HTMLElement, idx: number, ary: HTMLElement[]) => HTMLElement): DocQuery;
    /**
     * Attach every element in the current selection to the given parent element.
     * @param parent parent element to attach to
     * @returns this selection
     */
    attachTo(parent: HTMLElement): this;
    /**
     * Attach given children to the current selection's first element.
     * @note elements can only be parented to at most one element, thus attaching to all elements in the selection is impossible.
     * @note if the selection is empty, given children will be detached from the entire document instead
     * @param children to attach
     * @return this selection
     */
    attach(...children: (HTMLElement | string)[]): this;
    /**
     * Detach the current selection from their parent elements.
     * @note The elements in this selection will be effectively removed from the DOM until reattached.
     * @see attach, attachTo
     * @returns this selection
     */
    detach(): this;
    /**
     * Gets the parent element of every element in the current selection.
     * If multiple elements share a parent, that parent is added only once.
     * @returns new selection of parent elements
     */
    parent(): DocQuery;
    /**
     * Detach all children from the elements of the current selection.
     * @returns this selection
     */
    empty(): this;
    static _query(selector: string, relative: Relative[]): HTMLElement[];
}
