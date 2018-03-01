
/**
 *  Load home page when page loads first time
 */
document.addEventListener("DOMContentLoaded", function () {
    // let marvelAPI = "https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&limit=36&apikey=5e8ca1959f7f23db54436ae4b3661243";
    let marvelAPI = "https://gateway.marvel.com:443/v1/public/characters?orderBy=-modified&limit=40&apikey=5e8ca1959f7f23db54436ae4b3661243\n";

    get("loading-status").update("Obtendo dados dos heróis...");

    fetch(marvelAPI)
        .then(r => r.json())
        .then(function(json){
            HERO_DATA = json;
            HERO_LIST = HERO_DATA.data["results"];
            trigger("hashchange");
        }).catch (e => {
        console.error(e);
        // errorPage("Infelizmente, não foi possível estabelecer conexão com o servidor e não há dados disponíveis offline para exibir.");
    });
});

/**
 *  On url hash changed, render the page requested
 */
window.addEventListener("hashchange", function () {
    render(decodeURI(window.location.hash));
});

/**
 *  Control of pagination with arrows left & right
 */
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
 * Rebuild pagination on 'list-update' event
 */
document.addEventListener("list-updated", function(){
    buildPagination();
});