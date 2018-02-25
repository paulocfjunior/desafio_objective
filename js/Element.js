/**
 * Generic and recursive element builder
 * Author: Paulo Cézar Francisco Júnior
 *
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