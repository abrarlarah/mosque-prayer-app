// Minimal PWA Service Worker for Salah Times
const CACHE_NAME = 'salah-times-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Purge any stale caches immediately
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // NEVER cache API requests or dynamic queries - always bypass cache
  if (url.pathname.startsWith('/api/') || url.searchParams.has('_t')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }

  // Network-first strategy for static assets
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
