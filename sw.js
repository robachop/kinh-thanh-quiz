// Build injects a complete, versioned precache: offline works on first install.
const BUILD_ID = '30297b3e4c13c337';
const ASSETS = ["./assets/index-XP2ToNS2.js","./assets/index-upGrtNut.css","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./index.html","./manifest.webmanifest"];
const PREFIX = `dtss-quizhub-${encodeURIComponent(self.registration.scope)}-`;
const CACHE = PREFIX + BUILD_ID;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  // Never delete caches owned by another app on the same origin.
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    // HTML and hashed assets come from the same installed build, including offline.
    event.respondWith(caches.open(CACHE).then(cache => cache.match(new URL('./index.html', self.registration.scope))).then(cached => cached || fetch(request)));
    return;
  }
  event.respondWith(caches.open(CACHE).then(cache => cache.match(request, { ignoreVary: true })).then(cached => cached || fetch(request)));
});
