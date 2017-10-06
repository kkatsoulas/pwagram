const CACHE_STATIC = 'static-v11';
const CACHE_DYNAMIC_NAME = 'dynamic';
var STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC)
        .then(cache => {
            console.log('[Service Worker] Precaching app shell');
            cache.addAll(STATIC_FILES);
        })
    );

});

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker...', event);

    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if(key !== CACHE_STATIC && key !== CACHE_DYNAMIC_NAME){
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
    );

    //It make sure that the service worker was activated
    return self.clients.claim();
});

// self.addEventListener('fetch', event => {
//     //console.log('[Service Worker] Fetching...', event);
//     event.respondWith(
//         caches.match(event.request)
//         .then(response => {
//             if(response) return response;
//             else{
//                 return fetch(event.request)
//                     .then(res => {
//                         return caches.open(CACHE_DYNAMIC_NAME)
//                             .then(cache => {
//                                 cache.put(event.request.url, res.clone());
//                                 return res;
//                             })
//                     })
//                     .catch(e => {
//                         return caches.open(CACHE_STATIC)
//                         .then(cache => {
//                             return cache.match('/offline.html');
//                         });
//                     });
//             }
//         })    
//     );
// });



//STRATEGY: NETWORK ONLY
// self.addEventListener('fetch', event => {
//     //console.log('[Service Worker] Fetching...', event);
//     event.respondWith(fetch(event.request));
// });

//STRATEGY: NETWORK FIRST WITH CACHE FALLBACK
// self.addEventListener('fetch', event => {
//     event.respondWith(
//         fetch(event.request)
//         .catch(err => caches.match(event.request))    
//     );
// });

//STRATEGY: CACHE WITH NETWORK FALLBACK
self.addEventListener('fetch', event => {

    var url = 'https://httpbin.org/get';
    
    if(event.request.url.indexOf(url) > -1){
        event.respondWith(
            caches.open(CACHE_DYNAMIC_NAME)
            .then(cache => {
                return fetch(event.request)
                .then(response => {
                    cache.put(event.request, response.clone());
                    return res;
                })
            })   
        );
    }
    else if(new RegExp('\\b' + STATIC_FILES.join('\\b|\\b') + '\\b').test(event.request.url)){
        event.respondWith(caches.match(event.request));
    }
    else{
        event.respondWith(
        caches.match(event.request)
            .then(response => {
                if(response) return response;
                 else{
                    return fetch(event.request)
                        .then(res => {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(cache => {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                            })
                            .catch(e => {
                                return caches.open(CACHE_STATIC)
                                .then(cache => {
                                    
                                    if(event.request.url.indexOf('/help')){
                                        return cache.match('/offline.html');
                                    }

                                   
                                });
                            });
                    }
                }));   
    }
});


//STRATEGY: CACHE ONLY
// self.addEventListener('fetch', event => {
//     event.respondWith(caches.match(event.request)
//     );
// });
