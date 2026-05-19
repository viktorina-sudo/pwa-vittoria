const CACHE_NAME = 'vittoria-cache-v5';
const urlsToCache = [
  '/members/login',
  '/calcolatorelk',
  '/tabelamisurecalcolatore',
  '/corset'
];

// Кэшируем основные страницы при установке
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
  // Заставляем Service Worker активироваться сразу
  self.skipWaiting();
});

// Активация и очистка старого кэша
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
  // Берём под контроль все страницы сразу
  self.clients.claim();
});

// Стратегия: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если есть в кэше — возвращаем
        if (response) {
          return response;
        }
        // Если нет — загружаем из сети и сохраняем в кэш
        return fetch(event.request).then(
          (response) => {
            // Проверяем, что это валидный ответ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Клонируем ответ
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
