/**
 *  Global Const
 */
const ELEMENT_NODE = 1;

/**
 * Init IndexedDB
 * @type {IDBFactory | *}
 */
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

/**
 * Init IDBTransaction
 * @type {IDBFactory | *}
 */
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

/**
 * Init IDBKeyRange
 * @type {IDBFactory | *}
 */
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if(!Array.prototype.indexOf) {
    /**
     * Array.indexOf function (if not defined)
     * @param what
     * @param i
     * @returns {*}
     */
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

/**
 * Remove item from array
 * @returns {Array}
 */
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


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
        return elements || [];
    }
}

/**
 * Process nodelist with a function
 * @param callback {function}
 */
NodeList.prototype.each = function (callback) {
    var list = this;
    return Array.prototype.map.call(list, function(e){
        if(e.nodeType === ELEMENT_NODE) {
            return callback(e);
        }
    });
};

/**
 * Process nodelist and remove class from all elements
 * @param c {string}
 */
NodeList.prototype.removeClass = function (c) {
    return this.each(function(e){
        if(e.nodeType === ELEMENT_NODE) {
            return e.removeClass(c);
        }
    });
};


/**
 * Remove a class from element
 * @param c
 */
HTMLElement.prototype.removeClass = function(c){
    let classes = this.className.split(" ");
    this.className = classes.remove(c).join(" ").trim();
    return this;
};

/**
 * Add a class to element
 * @param c
 */
HTMLElement.prototype.addClass = function(c){
    let classes = this.className.split(" ");
    if(!classes.includes(c)){
        classes.push(c);
        this.className= classes.join(" ").trim();
    }
    return this;
};

/**
 * Changes the content of an Element with fading effect
 * @param newContent {Array || Node || string}
 * @param [executeAfter] {function}
 */
HTMLElement.prototype.update = function(newContent, executeAfter){
    var callback = false;
    if(typeof executeAfter === 'function'){
        callback = executeAfter;
    }
    var element = this;
    this.fadeOut(function () {
        if(typeof newContent === 'string'){
            element.innerHTML = newContent;
        } else if(newContent instanceof Array){
            element.innerHTML = "";
            for (let i = 0; i < newContent.length; i++) {
                element.appendChild(newContent[i]);
            }
        } else {
            element.innerHTML = "";
            element.appendChild(newContent);
        }
        element.fadeIn(function(){
            if(callback !== false) callback(element);
        });
    });
    return this;
};

/**
 * Fade In effect
 * @param [duration] {int}
 * @param [callback] {function}
 * @returns {Promise<any>}
 */
HTMLElement.prototype.fadeIn = function(callback, duration) {
    var element = this;
    duration = duration || 200;
    return new Promise(function (resolve) {
        element.removeClass("fade-out");
        element.addClass("fade-in");
        setTimeout(function(){
            resolve((typeof callback !== 'function')? element : callback(element));
        }, duration);
    });
};

/**
 * Fade Out effect
 * @param [duration] {int}
 * @param [callback] {function}
 * @returns {Promise<any>}
 */
HTMLElement.prototype.fadeOut = function(callback, duration) {
    var element = this;
    duration = duration || 200;
    return new Promise(function (resolve) {
        element.removeClass("fade-in");
        element.addClass("fade-out");
        setTimeout(function(){
            resolve((typeof callback !== 'function')? element : callback(element));
        }, duration);
    });
};

/**
 * Get Element by its ID
 * @param id
 * @returns {HTMLElement}
 */
function get(id) {
    if(document.getElementById(id) === null){
        return document.createElement("div");
    } else {
        return document.getElementById(id);
    }
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
 * Function to update properties in an object
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
 * @param [props]    {Object}
 * @param [parent]   {HTMLElement}
 * @constructor
 */
function Element(props, parent){
    if(typeof props === 'undefined'){
        props = {};
    }
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

/**
 * Object Serialization Function
 * @param obj {Object}
 * @returns {string}
 */
function serialize(obj) {
    var str = [];
    for(var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}