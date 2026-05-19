const CACHE_NAME = 'vittoria-cache-v4';
const urlsToCache = [
  '/members/login',
  '/calcolatorelk',
  '/tabelamisurecalcolatore',
  '/corset'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});