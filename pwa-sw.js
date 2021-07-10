const currentCacheName = 'pwa-cache-v0';
const contentToCache  = [
    '/index.html',
    '/index.css',
    '/reken-0.3.0.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil((async () => {
      const cache = await caches.open(currentCacheName);
      await cache.addAll(contentToCache);
    })());
  });

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        if (r) {
            console.log("Fetch return from cache", e.request.url)
            return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(currentCacheName);
        cache.put(e.request, response.clone());
        return response;
    })());
});

//Cleanup old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
              return (cacheName.startsWith('ftp-test-') && cacheName !== currentCacheName)
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
