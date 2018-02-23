/**
 * Select elements based on selector
 * @param selector {string}
 * @returns        {Node | NodeList | null}
 */
function select(selector) {
    var elements = document.querySelectorAll(selector);
    if(elements.length === 1) {
        return elements[0];
    } else {
        return elements;
    }
}

/**
 * Get Element by its ID
 * @param id
 * @returns {HTMLElement | null}
 */
function get(id) {
    return document.getElementById(id);
}

/**
 * Trigger an event on an element
 * @param event     {string}
 * @param [element] {HTMLElement | Node}
 */
function trigger(event, element) {
    if (typeof element === "undefined"){
        element = document;
    }
    var e;

    if (document.createEvent) {
        e = document.createEvent("HTMLEvents");
        e.initEvent(event, true, true);
    } else {
        e = document.createEventObject();
        e.eventType = event;
    }

    e.eventName = event;

    if (document.createEvent) {
        element.dispatchEvent(e);
    } else {
        element.fireEvent("on" + e.eventType, e);
    }
}

/**
 * Function to update some properties in an object
 * @param source {Object}
 * @param target {Object}
 */
function update(source, target) {
    Object.keys(target).forEach(function (k) {
        if (typeof target[k] === 'object') {
            source[k] = source[k] || {};
            update(source[k], target[k]);
        } else {
            source[k] = target[k];
        }
    });
}

/**
 * Generic and recursive element builder
 * @param props    {Object}
 * @param [parent] {HTMLElement}
 * @constructor
 */
function Element(props, parent){
    this.type       = props.type        || "div";
    this.content    = props.content     || "";
    this.properties = props.properties  || null;

    var element = document.createElement(this.type);

    if(this.properties !== null){
        update(element, this.properties);
    }

    if(typeof this.content === "string"){
        element.innerHTML = this.content;
    } else if(this.content instanceof Array) {
        this.content.forEach(function(subElement){
            element.appendChild(subElement);
        });
    } else if(!(this.content instanceof Node || this.content instanceof HTMLElement)) {
        element.appendChild(new Element(this.content, element));
    } else if(typeof this.content !== "undefined") {
        element.appendChild(this.content);
    }

    if(typeof parent !== "undefined"){
        parent.appendChild(element);
    }
    return element;
}
