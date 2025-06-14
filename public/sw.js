const CACHE_NAME = 'daily-tracker-v1';
const urlsToCache = [
  '/DailyTracker/',
  '/DailyTracker/index.html',
  '/DailyTracker/vite.svg',
  '/DailyTracker/icon-192.png',
  '/DailyTracker/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache the essential files, but don't fail if some assets aren't available yet
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(() => console.log(`Failed to cache: ${url}`)))
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        // For assets, try to fetch and cache dynamically
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response since it can only be consumed once
          const responseClone = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          
          return response;
        });
      })
  );
});

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