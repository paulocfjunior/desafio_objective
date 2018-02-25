/**
 * Global Scope
 */
let CURRENT_PAGE = 1;
let HERO_DATA = {};
let HERO_LIST = [];

/**
 *  Root element
 */
let root = get("root");

/**
 *  Load home page when page loads first time
 */
document.addEventListener("DOMContentLoaded", function () {
    let marvelAPI = "https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&apikey=5e8ca1959f7f23db54436ae4b3661243";

    get("loading-status").update("Obtendo dados dos heróis...");

    fetch(marvelAPI)
    .then(r => r.json())
    .then(json => {
        HERO_DATA = json;
        HERO_LIST = HERO_DATA.data["results"];
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
    const request = url.split('/')[0];

    get("loading-status").update("Organizando as informações...");

    // Hide whatever page is currently shown.
    // $('.main-content .page').removeClass('visible');

    /**
     * App Page element
     * @type {Element}
     */
    let page = new Element({
        properties: {
            id: "app"
        }
    });

    const routes = {

        /**
         * Home
         */
        '': function () {
            console.log("Main initialization...");

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
                type: "section",
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
                            title: "Digite o nome de um herói da Marvel",
                            placeholder: "ex. Warlock",
                            onkeyup: function() {
                                const search = new RegExp(this.value, "i");
                                let oldList = HERO_LIST;

                                HERO_LIST = HERO_DATA.data["results"].filter(function(hero){
                                    if(search.test(hero.name)){
                                        return hero;
                                    }
                                });

                                if(oldList !== HERO_LIST){
                                    get("hero-list").update(goPage(1, HERO_LIST));
                                }
                            }
                        }
                    }),
                ]
            }, page);

            /**
             *  Heroes List
             */
            new Element({
                type: "section",
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
                        content: goPage()
                    }),
                ]
            }, page);

            new Element({
                properties: {
                    className: "app-pagination",
                },
                type: "section",
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
                        properties: {
                            id: "pagination-list"
                        },
                        content: [
                            new Element({
                                type: "li",
                                content: 1,
                                properties: {
                                    className: "app-pagination-page",
                                    onclick: function () {
                                        goPage(1);
                                    }
                                }
                            })
                        ]
                    }),
                    new Element({
                        type: "span",
                        content: "&#9654;",
                        properties: {
                            className: "disabled",
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
                    id: "footer",
                },
                type: "footer",
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
            let idHero = url.split('#hero/')[1].trim();

            let hero = HERO_LIST.find(function (h) {
                if(parseInt(h.id) === parseInt(idHero)){
                    return h;
                }
            });

            new Element({
                type: "header",
                content: [
                    new Element({
                        content: new Element({
                            id: "detail-img",
                            type: "img",
                            properties: {
                                src: (['path', 'extension'].map(p => hero.thumbnail[p])).join(".").replace("http://", "https://"),
                                alt: hero.name,
                                height: "80",
                                width: "80"
                            }
                        })
                    }),
                    new Element({
                        id: "detail-name",
                        type: "h1",
                        content: hero.name
                    }),
                ]
            }, page);

            root.update(page);
        }
    };

    /**
     *  Load the page requested
     */
    if (routes[request]) {
        get("loading-status").addClass("hidden");
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
function setPage(p) {
    CURRENT_PAGE = p;
    let pages = select(".app-pagination-page");
    if (pages.length > 0){
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
}

document.addEventListener("list-updated", function(){
    console.log("List Update Event Handler");
    // buildPagination();
});

/**
 * Build page selectors
 * @param [targetElement] {Element}
 * @returns {Element}
 */
function buildPagination(targetElement) {
    console.log("Build pagination...");
    let list = new Element({
        type: "ul",
        properties: {
            id: "pagination-list"
        }
    });

    for (let i = 0, j = 1; i < HERO_LIST.length; i+3, j++){
        new Element({
            type: "li",
            content: j.toString(),
            properties: {
                className: "app-pagination-page",
                onclick: function () {
                    goPage(j);
                }
            }
        }, list);
    }

    console.log(list);
    if(typeof targetElement !== 'undefined'){
        console.log("List was updated");
        targetElement.update(list);
    }
    return list;
}

/**
 *
 * @param name
 */
function renderHeroPage(name) {
    get("root").innerHTML = "Hero " + name;
}

/**
 * Build rows for Heros based on its Objects of data
 * @param [page] {int}
 * @param [heroDataResults] {Array}
 * @returns {Array}
 */
function goPage(page, heroDataResults) {
    if(typeof page === 'undefined'){
        page = 1;
    }
    console.log("goPage(%s)...", page.toString());

    if(typeof heroDataResults === 'undefined') {
        heroDataResults = HERO_LIST;
    } else if(!(heroDataResults instanceof Array)){
        heroDataResults = [];
    }

    let result = heroDataResults.slice((page - 1), 3).map(function (heroData) {
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
                id: heroData.id,
                properties: {
                    onclick: function() {
                        window.location.hash = "#hero/" + heroData.id;
                    }
                }
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
                                    src: (['path', 'extension'].map(p => heroData.thumbnail[p])).join(".").replace("http://", "https://"),
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

    trigger("list-updated");
    return result;
}