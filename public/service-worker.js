const FILES_TO_CACHE = [
    "/",
    "index.html",
    "styles.css",
    "index.js",
    "db.js",
    "manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

const CACHE_NAME = 'precache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files have been pre-cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
        .then(self.skipWaiting())
    );
})

self.addEventListener("activate", function(e) {
    const currentCaches = [CACHE_NAME, DATA_CACHE_NAME]
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
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
    if (
        e.request.method !== "GET" ||
        !e.request.url.startsWith(self.location.origin)
    ) {
        e.respondWith(fetch(e.request));
        return;
    }

    if (e.request.url.includes("/api/transaction")) {

        e.respondWith(
            caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(e.request)
                    .then(response => {
                        cache.put(e.request, response.clone());
                        return response;
                    })
                    .catch(() => caches.match(e.request));
            })
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(e.request).then(response => {
                    return cache.put(e.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
})
