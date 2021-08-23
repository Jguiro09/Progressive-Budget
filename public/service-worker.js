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

self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files have been pre-cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWainting();
})