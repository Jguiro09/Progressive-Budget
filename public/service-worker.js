const FILES_TO_CACHE = [
    '/',
    '/db.js',
    '/index.html',
    '/index.js',
    '/styles.css',
    '/manifest.webmanifest'
];

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(PRECACHE).then(cache => {
            console.log('Your files have been pre-cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
        .then(self.skipWaiting())
    );
})

self.addEventListener("activate", function(e) {
    const currentCaches = [PRECACHE, RUNTIME]
    e.waitUntil(
        caches.keys().then(keyList => {
            return keyList.filter((key) => !currentCaches.includes(key));
        })
        .then((cachesToDelete) => {
            return Promise.all(
                cachesToDelete.map((cacheToDelete) => {
                    return caches.delete(cacheToDelete);
                })
            );
        })
        .then(() => self.clients.claim())
    );
})

self.addEventListener('fetch', function(e) {
    if(e.request.url.startsWith(self.location.origin)) {
        e.respondWith(
            caches.match(e.request).then((cachedResponse) => {
                if(cachedResponse){
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then((cache) => {
                    return fetch(e.request).then((response) => {
                        return cache.put(e.request, response.clone()).then(()=> {
                            return response;
                        })
                    })
                })
            })
        );
    }
})
