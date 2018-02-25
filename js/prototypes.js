
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
