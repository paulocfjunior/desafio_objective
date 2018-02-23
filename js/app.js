
/**
 *  Load home page when page loads first time
 */
document.addEventListener("DOMContentLoaded", function(){
    let marvelAPI = "https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&apikey=5e8ca1959f7f23db54436ae4b3661243";

    request(marvelAPI).then(function(response){
        caches.open("heroes")
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

            /**
             *  Root element
             */
            var root = get("root");
            /**
             *  Page Header
             */
            new Element({
                type: "header",
                properties: {
                    className: "app-header"
                },
                content: [
                    new Element({
                        type: "h1",
                        content: "APPLICATION",
                        properties: {
                            className: "app-title"
                        }
                    }),
                    new Element({
                        type: "h2",
                        content: "DETAIL",
                        properties: {
                            className: "app-subtitle"
                        }
                    }),
                    new Element({
                        properties: {
                            className: "app-spacer"
                        }
                    }),
                    new Element({
                        type: "h3",
                        content: "Paulo Cézar",
                        properties: {
                            className: "app-developer"
                        }
                    })
                ]
            }, root);

            /**
             *  Search box
             */
            new Element({
                properties: {
                    id: "searchbox",
                    placeholder: "Pesquisar"
                },
                content: [
                    new Element({
                        type: "label",
                        content: "Nome do Personagem",
                        properties: {
                            htmlFor: "search-box",
                            className: "app-search-label"
                        }
                    }),
                    new Element({
                        type: "input",
                        properties: {
                            id: "search-box",
                            className: "app-search-box",
                            placeholder: "e.g. Iron Man"
                        }
                    }),
                ]
            }, root);

            /**
             *  Heroes List
             */
            new Element({
                properties: {
                    className: "app-hero-list",
                },
                type: "div",
                content: [
                    new Element({
                        properties: {
                            className: "app-hero-list-header",
                        },
                        content: [
                            new Element({
                                content: "Personagem"
                            }),
                            new Element({
                                content: "Séries"
                            }),
                            new Element({
                                content: "Eventos"
                            })
                        ]
                    }),
                    new Element({
                        properties: {
                            className: "app-hero-list-rows",
                        },
                        content: [
                            new Element({
                                properties: {
                                    className: "app-hero-list-row",
                                },
                                content: [
                                    /**
                                     * First Column
                                     */
                                    new Element({
                                        content: [
                                            new Element({
                                                type: "img",
                                                properties: {
                                                    src: "test",
                                                    alt: "Test",
                                                    style: {
                                                        height: "58px",
                                                        width: "58px"
                                                    }
                                                }
                                            }),
                                            new Element({
                                                type: "span",
                                                content: "Iron Man"
                                            })
                                        ]
                                    }),
                                    /**
                                     * Series Column
                                     */
                                    new Element({
                                        content: [
                                            new Element({
                                                content: "Serie 1"
                                            }),
                                            new Element({
                                                content: "Serie 2"
                                            }),
                                            new Element({
                                                content: "Serie 3"
                                            })
                                        ]
                                    }),
                                    /**
                                     * Events Column
                                     */
                                    new Element({
                                        content: [
                                            new Element({
                                                content: "Evento 1"
                                            }),
                                            new Element({
                                                content: "Evento 2"
                                            }),
                                            new Element({
                                                content: "Evento 3"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                ]
            }, root);

            new Element({
                properties: {
                    className: "app-pagination",
                },
                type: "div",
                content: []
            }, root);

            new Element({
                properties: {
                    className: "app-footer",
                },
                type: "div",
                content: [
                    new Element({
                        type: "span",
                        properties: {
                            id: "copyright"
                        },
                        content: "Copyright Marvel 2018"
                    })
                ]
            }, root);
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
