// Genera un nombre de caché único automático usando la fecha de hoy
const CACHE_NAME = 'apnea-trail-' + new Date().getTime();
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Añade aquí tus archivos de lógica .js si los tienes separados, ej: './app.js'
];

// Instalación: forza al nuevo Service Worker a activarse de inmediato
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // <--- Esto mata al Service Worker viejo de inmediato
  );
});

// Activación: borra AUTOMÁTICAMENTE todas las cachés viejas anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Borra las versiones viejas sin que hagas nada
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de red: intenta buscar en internet, si falla va a la caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
