// Service Worker para RIB — Informe Biológico de Alimentos
const CACHE_NAME = 'rib-v1';
const ASSETS = [
  '/rib/',
  '/rib/index.html',
  '/rib/icon-192.png',
  '/rib/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js'
];

// Instalación: guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activación: elimina cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: sirve desde caché si está disponible, si no va a la red
self.addEventListener('fetch', event => {
  // Las llamadas a la API de Open Food Facts siempre van a la red
  if (event.request.url.includes('openfoodfacts.org')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
