/**
 *  On url hash changed, render the page requested
 */
window.addEventListener("hashchange", function () {
    render(decodeURI(window.location.hash));
});

/**
 *  Load home page when page loads first time
 */
document.addEventListener("DOMContentLoaded", function(){
    trigger("hashchange");
});

/**
 * Render the page requested
 * @param url
 */
function render(url) {

    /**
     * Get request keyword from url
     * @type {string}
     */
    var request = url.split('/')[0];

    // Hide whatever page is currently shown.
    // $('.main-content .page').removeClass('visible');

    var routes = {

        /**
         * Home
         */
        '': function() {
            new Element({
                content:  [
                    new Element({
                        type: "h1",
                        content: "Marvel Heroes!!!"
                    }),

                    new Element({
                        type: "input",
                        properties: {
                            id: "searchbox",
                            placeholder: "Pesquisar"
                        }
                    })
                ]
            }, get("root"));
        },

        /**
         * Detail page
         */
        '#hero': function() {

            /**
             * Get the hero name
             * @type {string}
             */
            var hero = url.split('#hero/')[1].trim();

            renderHeroPage(hero);
        },

        /**
         * Search heroes by name
         */
        '#search': function() {

            /**
             * Get the search string
             * @type {string}
             */
            var heroName = url.split('#search/')[1].trim();

            filterHero(heroName);
        }
    };

    /**
     *  Load the page requested
     */
    if(routes[request]){
        routes[request]();
    }
    /**
     *  If the request is not registered, load error page
     */
    else {
        badRequest();
    }
}

/**
 * Displays error page
 */
function badRequest(){
    window.location.hash = "error";
    get("root").innerHTML = "Sorry, the page that you've requested not exists.";
}

function filterHero(name) {

}

function renderHeroPage(name) {
    get("root").innerHTML = "Hero " + name;
}
