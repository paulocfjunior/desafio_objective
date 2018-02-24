/**
 * Global Scope
 */
var CURRENT_PAGE = 1;
var HERO_DATA = {};
var HERO_LIST = [];

/**
 *  Load home page when page loads first time
 */
document.addEventListener("DOMContentLoaded", function () {
    let marvelAPI = "https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&apikey=5e8ca1959f7f23db54436ae4b3661243";

    // get("loading-status").update("Obtendo dados dos heróis...");

    fetch(marvelAPI)
    .then(r => r.json())
    .then(json => {
        console.log(json);
        HERO_DATA = json;
        HERO_LIST = buildListRows(HERO_DATA.data["results"]);
    }).catch (e => {
        errorPage("Infelizmente, não foi possível estabelecer conexão com o servidor e não há dados disponíveis offline para exibir.");
        console.error(e);
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

    // get("loading-status").update("Organizando as informações...");

    // Hide whatever page is currently shown.
    // $('.main-content .page').removeClass('visible');

    var routes = {

        /**
         * Home
         */
        '': function () {

            /**
             *  Root element
             */
            let root = get("root");
            let page = new Element;
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
                        content: "Busca Marvel",
                        properties: {
                            className: "app-title"
                        }
                    }),
                    new Element({
                        type: "h2",
                        content: "Teste front-end",
                        properties: {
                            className: "app-subtitle"
                        }
                    }),
                    new Element({
                        type: "h3",
                        content: "Paulo Cézar Francisco Júnior",
                        properties: {
                            className: "app-developer"
                        }
                    })
                ]
            }, page);

            /**
             *  Detail
             */
            new Element({
                properties: {
                    className: "app-line"
                },
                content: new Element
            }, page);

            /**
             *  Search box
             */
            new Element({
                properties: {
                    id: "search-container",
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
                            placeholder: "e.g. Iron Man",
                            onkeypress: function() {
                                const search = new RegExp(this.value, "i");

                                HERO_LIST = HERO_DATA.data["results"].map(function(hero){
                                    if(search.test(hero.name)){
                                        return hero;
                                    }
                                });
                                get("hero-list").update(buildListRows(HERO_LIST));
                            }
                        }
                    }),
                ]
            }, page);

            /**
             *  Heroes List
             */
            new Element({
                properties: {
                    className: "app-hero-list",
                },
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
                            id: "hero-list",
                            className: "app-hero-list-rows",
                        },
                        content: [] // HERO_LIST
                    }),
                ]
            }, page);

            new Element({
                properties: {
                    className: "app-pagination",
                },
                type: "div",
                content: [
                    new Element({
                        type: "span",
                        content: "&#9664;",
                        properties: {
                            className: "disabled",
                            id: "app-pagination-prev",
                            onclick: function () {
                                goPage(prevPage());
                            }
                        }
                    }),
                    new Element({
                        type: "ul",
                        content: [
                            new Element({
                                type: "li",
                                content: "1",
                                properties: {
                                    className: "app-pagination-page active",
                                    onclick: function () {
                                        goPage(1);
                                    }
                                }
                            }),
                            new Element({
                                type: "li",
                                content: "2",
                                properties: {
                                    className: "app-pagination-page",
                                    onclick: function () {
                                        goPage(2);
                                    }
                                }
                            }),
                            new Element({
                                type: "li",
                                content: "3",
                                properties: {
                                    className: "app-pagination-page",
                                    onclick: function () {
                                        goPage(3);
                                    }
                                }
                            }),
                            new Element({
                                type: "li",
                                content: "4",
                                properties: {
                                    className: "app-pagination-page",
                                    onclick: function () {
                                        goPage(4);
                                    }
                                }
                            })
                        ]
                    }),
                    new Element({
                        type: "span",
                        content: "&#9654;",
                        properties: {
                            id: "app-pagination-next",
                            onclick: function () {
                                goPage(nextPage());
                            }
                        }
                    }),
                ]
            }, page);

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
                        content: HERO_DATA.copyright
                })
                ]
            }, page);

            root.update(page);
        },

        /**
         * Detail page
         */
        '#hero': function () {

            /**
             * Get the hero name
             * @type {string}
             */
            var hero = url.split('#hero/')[1].trim();

            renderHeroPage(hero);
        }
    };

    /**
     *  Load the page requested
     */
    if (routes[request]) {
        // get("loading-status").addClass("hidden");
        routes[request]();
    }
    /**
     *  If the request is not registered, load main page
     */
    else {
        window.location.hash = "";
    }
}

/**
 * Displays error page
 * @param message
 */
function errorPage(message) {
    get("root").innerHTML = message + " (" + window.location.hash + ")";
}

function filterHero() {
    //
}

document.addEventListener("keydown", function(ev){
    let e = ev.keyCode || window.event.keyCode;
    if (parseInt(e) === 37) {
        goPage(prevPage());
    }
    if (parseInt(e) === 39) {
        goPage(nextPage());
    }
});

/**
 *
 * @returns {number}
 */
function prevPage() {
    if (CURRENT_PAGE > 1) {
        CURRENT_PAGE -= 1;
    }
    return CURRENT_PAGE;
}

/**
 *
 * @returns {number}
 */
function nextPage() {
    let max = select(".app-pagination-page").length;
    if (CURRENT_PAGE < max) {
        CURRENT_PAGE += 1;
    }
    return CURRENT_PAGE;
}

/**
 *
 * @param p
 */
function goPage(p) {
    CURRENT_PAGE = p;
    let pages = select(".app-pagination-page");
    pages.removeClass("active")[(p - 1)].addClass("active");

    if(CURRENT_PAGE === 1) {
        get("app-pagination-prev").addClass("disabled");
    } else {
        get("app-pagination-prev").removeClass("disabled");
    }
    if(CURRENT_PAGE === pages.length) {
        get("app-pagination-next").addClass("disabled");
    } else {
        get("app-pagination-next").removeClass("disabled");
    }
}

/**
 *
 * @param name
 */
function renderHeroPage(name) {
    // get("root").innerHTML = "Hero " + name;
}

/**
 * Build rows for Heros based on its Objects of data
 * @param heroDataResults {Array}
 * @returns {Array}
 */
function buildListRows(heroDataResults) {
    return heroDataResults.map(function (heroData) {
        let series = [], events = [];

        if (heroData.series.returned > 0) {
            let count = 0, max = 3;
            heroData.series.items.forEach(function (s) {
                if (++count <= max) {
                    if (count === max) {
                        s += " - e mais " + (heroData.series.returned - count);
                    }
                    series.push(
                        new Element({
                            content: s.name,
                        })
                    );
                } else {
                    return false;
                }
            });
        } else {
            series = new Element({
                content: "Não foram encontradas séries com este personagem."
            })
        }

        if (heroData.events.returned > 0) {
            let count = 0, max = 3;
            heroData.events.items.forEach(function (e) {
                if (++count <= max) {
                    if (count === max) {
                        e += " - e mais " + (heroData.events.returned - count);
                    }
                    events.push(
                        new Element({
                            content: e.name,
                        })
                    );
                } else {
                    return false;
                }
            });
        } else {
            events = new Element({
                content: "Não foram encontrados eventos com este personagem."
            })
        }

        return new Element({
            properties: {
                className: "app-hero-list-row",
                id: heroData.id
            },
            content: [
                /**
                 * First Column
                 */
                new Element({
                    content: [
                        new Element({
                            content: new Element({
                                type: "img",
                                properties: {
                                    src: (['path', 'extension'].map(p => heroData.thumbnail[p])).join("."),
                                    alt: heroData.name,
                                    height: "58",
                                    width: "58"
                                }
                            })
                        }),
                        new Element({
                            type: "div",
                            content: heroData.name
                        })
                    ]
                }),
                /**
                 * Series Column
                 */
                new Element({
                    content: series
                }),
                /**
                 * Events Column
                 */
                new Element({
                    content: events
                })
            ]
        });
    });
}