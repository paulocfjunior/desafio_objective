
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