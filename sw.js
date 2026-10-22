const CACHE_NAME = 'ut-tms-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Firebase, Google APIs နှင့် POST request အားလုံးကို လုံးဝ ကြားမဖြတ်ဘဲ တိုက်ရိုက်လွှတ်ပေးမည်
  if (
    req.method !== 'GET' ||
    url.origin !== self.location.origin ||
    req.url.includes('firestore') ||
    req.url.includes('googleapis') ||
    req.url.includes('firebase') ||
    req.url.includes('gstatic')
  ) {
    return;
  }

  // HTML နှင့် ပုံများကိုသာ Fetch လုပ်ပြီး၊ Offline ဖြစ်၍ Cache ထဲတွင်လည်း မရှိပါက Error မတက်စေရန် Response အလွတ်ပြန်ပေးမည်
  event.respondWith(
    fetch(req)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return res;
      })
      .catch(() => {
        return caches.match(req).then(cached => {
          return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
