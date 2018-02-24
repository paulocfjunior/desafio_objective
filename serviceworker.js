/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

var CACHE_VERSION = 10;
var CURRENT_CACHES = {
    heroes: 'heroes-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
    var urlsToPrefetch = [
        'index.html',
        'js/util.js',
        'js/app.js',
        'css/all/app.css',
        'css/mobile/app.css',
        'css/desktop/app.css',
        'css/tablet/app.css',
        'https://gateway.marvel.com:443/v1/public/characters?orderBy=name%2Cmodified&limit=3&apikey=5e8ca1959f7f23db54436ae4b3661243'
    ];

    console.log('Instalando Service Worker');

    event.waitUntil(
        caches.open(CURRENT_CACHES.heroes).then(function(cache) {
            var now = Date.now();

            var cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
                var url = new URL(urlToPrefetch, location.href);
                url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

                var request = new Request(url, {mode: 'no-cors'});
                return fetch(request).then(function(response) {
                    if (response.status >= 400) {
                        throw new Error('request for ' + urlToPrefetch + ' failed with status ' + response.statusText);
                    }
                    return cache.put(urlToPrefetch, response);
                }).catch(function(error) {
                    console.error('Falha no cache de ' + urlToPrefetch + ' devido ao erro ' + error);
                });
            });

            return Promise.all(cachePromises).then(function() {
                // console.log('Pre-fetching complete.');
            });
        }).catch(function(error) {
            console.error('Pré-carregamento falhou: %s', error);
        })
    );
});


self.addEventListener('activate', function (event) {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(CURRENT_CACHES.heroes).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                // Fetch from cache first
                if (response) {
                    return response;
                }

                // If not available, fetch from network
                return fetch(event.request.clone()).then(function (response) {
                    if (response.status < 400) {
                        // Save response on cache
                        cache.put(event.request, response.clone());
                    } else {
                        console.log('Não foi possível salvar em cache a requisição: %s', event.request.url);
                    }
                    return response;
                });
            }).catch(function (error) {
                console.error('Não foi possível obter o conteúdo via cache nem via internet: %O', error);
                throw error;
            });
        })
    );
});
