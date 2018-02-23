
/**
 *  Load home page when page loads first time
 */
document.addEventListener("DOMContentLoaded", function(){
    let marvelAPI = "https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&apikey=5e8ca1959f7f23db54436ae4b3661243";

    request(marvelAPI).then(function(response){
        console.log(response);
    }, function(error){
        console.error(error);
    });

    trigger("hashchange");
});

/**
 *  On url hash changed, render the page requested
 */
window.addEventListener("hashchange", function () {
    render(decodeURI(window.location.hash));
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

            // https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&limit=3&apikey=5e8ca1959f7f23db54436ae4b3661243
            // https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&offset=3&apikey=5e8ca1959f7f23db54436ae4b3661243

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
