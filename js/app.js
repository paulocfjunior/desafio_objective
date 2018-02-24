/**
 * Global Scope
 */
var CURRENT_PAGE = 1;
var HeroData = {
    results: []
};

/**
 *  Load home page when page loads first time
 */
document.addEventListener("DOMContentLoaded", function () {
    let marvelAPI = "https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&apikey=5e8ca1959f7f23db54436ae4b3661243";

    fetch(marvelAPI)
    .then(r => r.json())
    .then(results => {
        HeroData = results.data;
        get("copyright").innerHTML = results.copyright;
        trigger("hashchange");
    }).catch (e => {
        errorPage("Infelizmente, não foi possível estabelecer conexão com o servidor e não há dados disponíveis offline para exibir.");
        console.error(e);
    });
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
        '': function () {

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
            }, root);

            /**
             *  Detail
             */
            new Element({
                properties: {
                    className: "app-line"
                },
                content: new Element
            }, root);

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
                        content: buildListRows(HeroData.results)
                    }),
                ]
            }, root);

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
        '#hero': function () {

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
        '#search': function () {

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
    if (routes[request]) {
        routes[request]();
    }
    /**
     *  If the request is not registered, load error page
     */
    else {
        errorPage("A pagina solicitada não foi encontrada.");
    }
}

/**
 * Displays error page
 * @param message
 */
function errorPage(message) {
    let oldHash = window.location.hash;
    window.location.hash = "error";
    get("root").innerHTML = message + " (" + oldHash + ")";
}

function filterHero(name) {

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

function prevPage() {
    if (CURRENT_PAGE > 1) {
        CURRENT_PAGE -= 1;
    }
    return CURRENT_PAGE;
}

function nextPage() {
    let max = select(".app-pagination-page").length;
    if (CURRENT_PAGE < max) {
        CURRENT_PAGE += 1;
    }
    return CURRENT_PAGE;
}

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

function renderHeroPage(name) {
    get("root").innerHTML = "Hero " + name;
}

/**
 * Build rows for Heros based on its Objects of data
 * @param HeroDataArray {Array}
 * @returns {Array}
 */
function buildListRows(HeroDataArray) {
    let result = [];
    HeroDataArray.forEach(function (HeroData) {
        let series = [], events = [];

        if (HeroData.series.returned > 0) {
            let count = 0, max = 3;
            HeroData.series.items.forEach(function (s) {
                if (++count <= max) {
                    if (count === max) {
                        s += " - e mais " + (HeroData.series.returned - count);
                    }
                    series.push(
                        new Element({
                            type: "a",
                            content: s.name,
                            properties: {
                                href: s.resourceURI
                            }
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

        if (HeroData.events.returned > 0) {
            let count = 0, max = 3;
            HeroData.events.items.forEach(function (e) {
                if (++count <= max) {
                    if (count === max) {
                        e += " - e mais " + (HeroData.events.returned - count);
                    }
                    series.push(
                        new Element({
                            type: "a",
                            content: e.name,
                            properties: {
                                href: e.resourceURI
                            }
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

        result.push(new Element({
            properties: {
                className: "app-hero-list-row",
                id: HeroData.id
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
                                    src: (HeroData.thumbnail.path + HeroData.thumbnail.extension),
                                    alt: HeroData.name,
                                    height: "58",
                                    width: "58"
                                }
                            })
                        }),
                        new Element({
                            type: "div", // "span",
                            content: HeroData.name
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
        }));
    });
    return result;
}