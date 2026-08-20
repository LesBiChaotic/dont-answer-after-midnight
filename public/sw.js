const CACHE_NAME = 'afterhours-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline shell');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLEAR_RUNTIME_CACHE') {
    event.waitUntil(caches.delete(CACHE_NAME));
  }
});

self.addEventListener('fetch', (event) => {
  // Only handle http/https requests
  if (!event.request.url.startsWith('http')) return;

  // Navigations must prefer the network. Serving stale index.html can point at
  // hashed JavaScript files removed by a newer GitHub Pages deployment,
  // resulting in a completely blank application shell.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse?.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('./index.html', networkResponse.clone());
              cache.put('./', networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          return (await caches.match('./index.html'))
            || (await caches.match('./'))
            || new Response('AFTERHOURS is offline.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
        })
    );
    return;
  }

  // Stable same-origin assets remain cache-first with background refresh.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response('AFTERHOURS is offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        });

      return cachedResponse || fetchPromise;
    })
  );
});
