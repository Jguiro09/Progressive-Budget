const FILES_TO_CACHE = [
    '/',
    '/db.js',
    '/index.html',
    '/index.js',
    '/styles.css',
    '/manifest.json'
];

const CACHE_NAME = 'static-cache-v3';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files have been pre-cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWainting();
})

self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("removing old", key)
                        return caches.delete(key);
                    }
                })
            )
        })
    );

    self.clients.claim();
})