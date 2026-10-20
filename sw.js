const CACHE_NAME = 'ut-tms-v2';
const ASSETS = ['login.html', 'portal.html', 'index.html', 'transaction.html', 'dashboard.html', 'exam.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});