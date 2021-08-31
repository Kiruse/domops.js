declare type Relative = Document | HTMLElement;
export default function $(query: string): DocQuery;
export default function $(query: string, rel: Relative): DocQuery;
export default function $(query: string, rel: Relative[]): DocQuery;
declare function $(elements: HTMLElement[]): DocQuery;
declare namespace $ {
    var create: (tag: string) => DocQuery;
    var onready: (cb: () => void) => void;
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
    attr(name: string, value: any): DocQuery;
    attr(props: Object): DocQuery;
    private _attr_get;
    private _attr_set;
    private _attr_obj;
    data(name: string): string[];
    data(name: string, value: string): DocQuery;
    data(props: Object): DocQuery;
    private _data_obj;
    text(): string[];
    text(value: string): DocQuery;
    text(cb: (el: HTMLElement, i: number, ary: HTMLElement[]) => string): DocQuery;
    html(): string[];
    html(value: string): DocQuery;
    html(cb: (el: HTMLElement, i: number, ary: HTMLElement[]) => string): DocQuery;
    style(name: string): string[];
    style(name: string, value: any): DocQuery;
    style(styles: Object): DocQuery;
    private _style_get;
    private _style_set;
    private _style_obj;
    addClass(...classes: string[]): DocQuery;
    removeClass(...classes: string[]): DocQuery;
    hasClass(cls: string): boolean[];
    on(evt: string, handler: DOMEventHandler): DocQuery;
    forEach(cb: (el: HTMLElement, idx: number, ary: HTMLElement[]) => void): DocQuery;
    /**
     * Attach every element in the current selection to the given parent element.
     * @param parent parent element to attach to
     * @returns this selection
     */
    attachTo(parent: HTMLElement): DocQuery;
    /**
     * Attach given children to the current selection's first element.
     * @note elements can only be parented to at most one element, thus attaching to all elements in the selection is impossible.
     * @note if the selection is empty, given children will be detached from the entire document instead
     * @param children to attach
     * @return this selection
     */
    attach(...children: HTMLElement[]): DocQuery;
    /**
     * Detach the current selection from their parent elements.
     * @note The elements in this selection will be effectively removed from the DOM until reattached.
     * @see attach, attachTo
     * @returns this selection
     */
    detach(): DocQuery;
    /**
     * Detach all children from the elements of the current selection.
     * @returns this selection
     */
    empty(): DocQuery;
    static _query(selector: string, relative: Relative[]): HTMLElement[];
}
