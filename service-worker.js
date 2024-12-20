const CACHE_NAME = 'instagram-following-feed-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/pwa-styles.css',
    '/pwa-app.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Service Worker installatie
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activeer en verwijder oude caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Network-first strategie voor requests
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone de response voor de cache
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // Als offline, probeer uit cache te halen
                return caches.match(event.request);
            })
    );
}); 